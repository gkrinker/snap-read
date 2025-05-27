
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category?: string;
}

interface FlashcardStackProps {
  cards: Flashcard[];
  currentIndex: number;
  onCardAnswer: (cardId: number, isCorrect: boolean) => void;
  answeredCards: Set<number>;
}

const FlashcardStack = ({ cards, currentIndex, onCardAnswer, answeredCards }: FlashcardStackProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const currentCard = cards[currentIndex];
  const isAnswered = answeredCards.has(currentCard?.id);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!isAnswered && currentCard) {
      onCardAnswer(currentCard.id, isCorrect);
      setIsFlipped(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    // Only process horizontal swipes if they're more significant than vertical
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isFlipped && !isAnswered) {
        if (isLeftSwipe) {
          handleAnswer(false); // Swipe left = incorrect
        } else if (isRightSwipe) {
          handleAnswer(true); // Swipe right = correct
        }
      }
    } else if (!isFlipped && isUpSwipe) {
      // Swipe up to flip card
      handleFlip();
    }
  };

  if (!currentCard) return null;

  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="relative h-96 perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d cursor-pointer",
            isFlipped && "rotate-y-180"
          )}
          onClick={handleFlip}
        >
          {/* Front of Card */}
          <Card className={cn(
            "absolute inset-0 backface-hidden border-0 shadow-2xl",
            "bg-gradient-to-br from-white to-blue-50",
            isAnswered && "opacity-75"
          )}>
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                {currentCard.category && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    {currentCard.category}
                  </span>
                )}
                <div className="flex items-center text-gray-400">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-xs">Tap to flip</span>
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-lg font-medium text-gray-800 leading-relaxed">
                  {currentCard.front}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Swipe up or tap to reveal answer
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Back of Card */}
          <Card className={cn(
            "absolute inset-0 backface-hidden rotate-y-180 border-0 shadow-2xl",
            "bg-gradient-to-br from-white to-green-50",
            isAnswered && "opacity-75"
          )}>
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center text-green-600">
                  <EyeOff className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Answer</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-base text-gray-700 leading-relaxed">
                  {currentCard.back}
                </p>
              </div>
              
              {!isAnswered && (
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-3">
                    Swipe right (✓) or left (✗) to answer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Answer Buttons */}
      {isFlipped && !isAnswered && (
        <div className="flex gap-4 mt-6">
          <Button
            onClick={() => handleAnswer(false)}
            variant="outline"
            className="flex-1 py-6 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <X className="w-5 h-5 mr-2" />
            Incorrect
          </Button>
          <Button
            onClick={() => handleAnswer(true)}
            className="flex-1 py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Check className="w-5 h-5 mr-2" />
            Correct
          </Button>
        </div>
      )}

      {/* Next Cards Preview */}
      {currentIndex < cards.length - 1 && (
        <div className="absolute top-2 left-2 right-2 h-96 -z-10">
          <Card className="w-full h-full bg-white/60 border-0 shadow-lg transform rotate-1 scale-95" />
        </div>
      )}
      
      {currentIndex < cards.length - 2 && (
        <div className="absolute top-4 left-4 right-4 h-96 -z-20">
          <Card className="w-full h-full bg-white/40 border-0 shadow-md transform -rotate-1 scale-90" />
        </div>
      )}
    </div>
  );
};

export default FlashcardStack;
