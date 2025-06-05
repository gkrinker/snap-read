import type { VercelRequest, VercelResponse } from '@vercel/node';
import formidable from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';

// Helper to parse form data
function parseForm(req: VercelRequest): Promise<{ file: formidable.File }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      if (!files.file) return reject(new Error('No file uploaded'));
      resolve({ file: files.file as formidable.File });
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { file } = await parseForm(req);
    const dataBuffer = fs.readFileSync(file.filepath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    // Simple flashcard chunking (split by paragraphs)
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const flashcards = paragraphs.map((content, idx) => ({
      id: idx + 1,
      headline: content.split(/[.!?]/)[0].slice(0, 60),
      content,
      sourceOffset: idx
    }));

    res.status(200).json({ flashcards });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process PDF' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 