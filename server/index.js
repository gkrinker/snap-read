import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage });

// --- Assistants API PDF-to-Flashcards Endpoint ---
app.post('/api/flashcards-from-pdf', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    // 1. Upload PDF to OpenAI
    const fileStream = fs.createReadStream(req.file.path);
    const openaiFile = await openai.files.create({
      file: fileStream,
      purpose: 'assistants',
    });
    // 2. Create a thread
    const thread = await openai.beta.threads.create();
    // 3. Send a message to the thread with the file attached
    const userMessage = `
Carefully read the entire attached PDF document. Generate a comprehensive set of flashcards that cover all major sections, key points, and important details throughout the document—not just the introduction or summary.

Follow these standards:
- Generate exactly 10 flashcards, dividing the document as evenly as possible by topic and content. If there are fewer than 10 major sections, split larger sections into multiple cards to reach 10.
- Chunk content by semantic boundaries (headings, sentences), targeting 100–150 words per card.
- Each flashcard should focus on a single idea or concept ("one idea, zero clutter").
- Use clear, student-friendly, and concise language.
- For each card, generate a headline (≤ 60 characters) using the first heading or a concise summary.
- Avoid redundancy or overlap between cards.
- If a section has deeper context, include it in the deeperContent field.
- Include a category (if possible) and a sourceOffset (e.g., page number or section index).
- Format the output as a JSON array, where each card has: headline (string), content (string), and optionally category (string), sourceOffset (number), and deeperContent (string).
- Distribute flashcards across the full document, representing every major section and topic.
- Return only the JSON array of flashcards.
`;
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userMessage,
      attachments: [
        {
          file_id: openaiFile.id,
          tools: [{ type: 'file_search' }]
        }
      ]
    });
    // 4. Create a run with GPT-4o
    const assistant = await openai.beta.assistants.create({
      name: 'Flashcard Generator',
      instructions:
        'You are an expert at creating educational flashcards. When given a document, return a JSON array of flashcards, each with headline, content, and (optionally) category, sourceOffset, and deeperContent. Only return the JSON array.',
      model: 'gpt-4o',
      tools: [{ type: 'file_search' }],
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });
    // 5. Poll for completion
    let runStatus = run.status;
    let runResult = run;
    let attempts = 0;
    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < 30) {
      await new Promise((r) => setTimeout(r, 2000));
      runResult = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      runStatus = runResult.status;
      attempts++;
    }
    if (runStatus !== 'completed') {
      return res.status(500).json({ error: 'Assistant did not complete in time.' });
    }
    // 6. Get the assistant's message
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMsg = messages.data.find((m) => m.role === 'assistant');
    const content = lastMsg?.content?.[0]?.text?.value || '';
    // Try to extract JSON array from the response
    const match = content.match(/\[.*\]/s);
    const flashcards = match ? JSON.parse(match[0]) : [];
    // 7. Clean up: delete uploaded file
    fs.unlink(req.file.path, () => {});
    res.json({ flashcards });
  } catch (err) {
    console.error(err);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 