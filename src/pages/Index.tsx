import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FileUpload from "@/components/FileUpload";
import { processDocument, Flashcard } from "@/services/documentProcessor";

/**
 * Home page component of the application
 * Handles file upload and displays main features
 */
const Index = () => {
  // State for tracking the uploaded file
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // State for tracking file processing status
  const [isProcessing, setIsProcessing] = useState(false);
  
  // State for tracking processing progress
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handles file upload process
   * @param file - The file uploaded by the user
   */
  const handleFileUpload = async (file: File) => {
    try {
      console.log('Starting file upload process for:', file.name);
      setUploadedFile(file);
      setIsProcessing(true);
      setProcessingProgress(0);

      console.log('Processing document...');
      const flashcards = await processDocument(file);
      console.log('Document processed successfully. Generated flashcards:', flashcards.length);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      console.log('Navigating to flashcards view...');
      navigate("/flashcards", { 
        state: { 
          fileName: file.name,
          flashcards 
        } 
      });
    } catch (error) {
      console.error('Error processing document:', error);
      // Show error message to user
      alert(`Error processing document: ${error.message}`);
      setIsProcessing(false);
      setUploadedFile(null);
    }
  };

  return (
    // Main container with gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header section with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        {/* Overlay for depth effect */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-4 py-12 text-center">
          {/* App icon container */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
          {/* App title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            SnapRead
          </h1>
          {/* App description */}
          <p className="text-lg text-blue-100 max-w-md mx-auto leading-relaxed">
            Transform your documents into beautiful, swipeable flashcards
          </p>
        </div>
      </div>

      {/* Main content section */}
      <div className="px-4 py-8 max-w-lg mx-auto">
        {/* Show upload section if no file is uploaded and not processing */}
        {!uploadedFile && !isProcessing && (
          <>
            {/* File upload card */}
            <Card className="mb-8 border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {/* Upload icon */}
                  <div className="inline-flex p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl mb-4">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>
                  {/* Upload section title */}
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Upload Your Document
                  </h2>
                  {/* Supported file types */}
                  <p className="text-gray-600 text-sm">
                    Support for PDF and Word documents
                  </p>
                </div>
                
                {/* File upload component */}
                <FileUpload onFileUpload={handleFileUpload} />
              </CardContent>
            </Card>

            {/* Features section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Why SnapRead?
              </h3>
              
              {/* Feature cards grid */}
              <div className="grid gap-4">
                {/* Smart Extraction feature card */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Smart Extraction</h4>
                      <p className="text-sm text-purple-100">
                        AI-powered content parsing
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mobile Optimized feature card */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Mobile Optimized</h4>
                      <p className="text-sm text-blue-100">
                        Swipe-friendly interface
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Beautiful Design feature card */}
                <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Beautiful Design</h4>
                      <p className="text-sm text-indigo-100">
                        Gorgeous, distraction-free cards
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Processing state UI */}
        {isProcessing && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              {/* Loading spinner */}
              <div className="animate-spin w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"></div>
              {/* Processing message */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Creating Your Flashcards
              </h3>
              <p className="text-gray-600">
                Processing {uploadedFile?.name}...
              </p>
              {/* Progress bar */}
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
