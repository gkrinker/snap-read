
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import FlashcardStack from "@/components/FlashcardStack";
import ProgressBar from "@/components/ProgressBar";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category?: string;
}

const FlashcardViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location.state?.fileName || "Document";
  
  // Mock flashcards data
  const [flashcards] = useState<Flashcard[]>([
    {
      id: 1,
      front: "What is the primary function of the cardiovascular system?",
      back: "The cardiovascular system's primary function is to transport blood, nutrients, oxygen, carbon dioxide, and hormones throughout the body.",
      category: "Biology"
    },
    {
      id: 2,
      front: "Define photosynthesis",
      back: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize nutrients from carbon dioxide and water.",
      category: "Biology"
    },
    {
      id: 3,
      front: "What is the formula for calculating compound interest?",
      back: "A = P(1 + r/n)^(nt), where A is the final amount, P is principal, r is annual interest rate, n is number of times interest compounds per year, and t is time in years.",
      category: "Mathematics"
    },
    {
      id: 4,
      front: "What are the three main types of rock?",
      back: "The three main types of rock are: Igneous (formed from cooled magma), Sedimentary (formed from compressed sediments), and Metamorphic (formed from transformed existing rocks).",
      category: "Geology"
    },
    {
      id: 5,
      front: "Explain the concept of supply and demand",
      back: "Supply and demand is an economic model that determines prices in a market. When demand exceeds supply, prices tend to rise. When supply exceeds demand, prices tend to fall.",
      category: "Economics"
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState<Set<number>>(new Set());

  const handleCardAnswer = (cardId: number, isCorrect: boolean) => {
    setAnsweredCards(prev => new Set([...prev, cardId]));
    if (isCorrect) {
      setCorrectAnswers(prev => new Set([...prev, cardId]));
    }
    
    // Move to next card after a short delay
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 500);
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setAnsweredCards(new Set());
    setCorrectAnswers(new Set());
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const isSessionComplete = answeredCards.size === flashcards.length;
  const accuracy = answeredCards.size > 0 ? (correctAnswers.size / answeredCards.size) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="font-semibold text-gray-800 truncate">
              {fileName}
            </h1>
            <p className="text-xs text-gray-500">
              {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSession}
            className="text-gray-600 hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        
        <ProgressBar
          current={currentIndex + 1}
          total={flashcards.length}
          answered={answeredCards.size}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {!isSessionComplete ? (
          <>
            <FlashcardStack
              cards={flashcards}
              currentIndex={currentIndex}
              onCardAnswer={handleCardAnswer}
              answeredCards={answeredCards}
            />
            
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="bg-white/80 backdrop-blur-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                {answeredCards.size} answered
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex === flashcards.length - 1}
                className="bg-white/80 backdrop-blur-sm"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          /* Session Complete */
          <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Session Complete!
              </h2>
              <p className="text-gray-600">
                Great job studying your flashcards
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {correctAnswers.size}
                  </p>
                  <p className="text-sm text-gray-600">Correct</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {accuracy.toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={resetSession}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Study Again
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Upload New Document
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlashcardViewer;
