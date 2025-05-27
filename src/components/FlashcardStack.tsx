
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CardActions from "@/components/CardActions";

interface Flashcard {
  id: number;
  headline: string;
  content: string;
  category?: string;
  sourceOffset?: number;
  deeperContent?: string;
}

interface FlashcardStackProps {
  cards: Flashcard[];
  currentIndex: number;
  onCardView: (cardId: number) => void;
  viewedCards: Set<number>;
  bookmarkedCards: Set<number>;
  onBookmarkToggle: (cardId: number) => void;
  onDiveDeeper: (cardId: number) => void;
  onJumpToSource: (cardId: number) => void;
  onAskAI: (cardId: number, question: string) => void;
  isDarkMode: boolean;
  isLargeText: boolean;
}

const FlashcardStack = ({ 
  cards, 
  currentIndex, 
  onCardView, 
  viewedCards, 
  bookmarkedCards,
  onBookmarkToggle,
  onDiveDeeper,
  onJumpToSource,
  onAskAI,
  isDarkMode,
  isLargeText
}: FlashcardStackProps) => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const currentCard = cards[currentIndex];
  const isViewed = viewedCards.has(currentCard?.id);
  const isBookmarked = bookmarkedCards.has(currentCard?.id);

  // Mark card as viewed when it becomes visible
  useEffect(() => {
    if (currentCard && !isViewed) {
      onCardView(currentCard.id);
    }
  }, [currentCard, isViewed, onCardView]);

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

    // Only process horizontal swipes if they're more significant than vertical
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      if (isLeftSwipe) {
        // Swipe left to go to next card
        console.log('Next card swipe');
      } else if (isRightSwipe) {
        // Swipe right to go to previous card
        console.log('Previous card swipe');
      }
    }
  };

  if (!currentCard) return null;

  const textSizeClass = isLargeText ? 'text-lg' : 'text-base';
  const headlineSizeClass = isLargeText ? 'text-xl' : 'text-lg';

  return (
    <div className="relative">
      {/* Main Card */}
      <div
        className="relative h-96"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card className={cn(
          "w-full h-full border-0 shadow-2xl transition-all duration-200",
          isDarkMode 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100" 
            : "bg-gradient-to-br from-white to-blue-50",
          isViewed && "opacity-95"
        )}>
          <CardContent className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
              {currentCard.category && (
                <span className={cn(
                  "px-3 py-1 text-xs font-medium rounded-full",
                  isDarkMode
                    ? "bg-purple-900/50 text-purple-300"
                    : "bg-purple-100 text-purple-700"
                )}>
                  {currentCard.category}
                </span>
              )}
              <div className={cn(
                "text-xs opacity-60",
                isDarkMode ? "text-gray-400" : "text-gray-500"
              )}>
                Swipe to navigate
              </div>
            </div>
            
            {/* Headline */}
            <h2 className={cn(
              "font-semibold mb-4 leading-tight",
              headlineSizeClass,
              isDarkMode ? "text-gray-100" : "text-gray-800"
            )}>
              {currentCard.headline}
            </h2>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <p className={cn(
                "leading-reading",
                textSizeClass,
                isDarkMode ? "text-gray-200" : "text-gray-700"
              )}>
                {currentCard.content}
              </p>
            </div>
            
            {/* Card Actions */}
            <CardActions
              cardId={currentCard.id}
              isBookmarked={isBookmarked}
              onBookmarkToggle={onBookmarkToggle}
              onDiveDeeper={onDiveDeeper}
              onJumpToSource={onJumpToSource}
              onAskAI={onAskAI}
              deeperContent={currentCard.deeperContent}
            />
            
            <div className={cn(
              "text-center text-xs mt-3 opacity-60",
              isDarkMode ? "text-gray-400" : "text-gray-500"
            )}>
              ≈ {Math.ceil(currentCard.content.split(' ').length / 200)} min read
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Cards Preview */}
      {currentIndex < cards.length - 1 && (
        <div className="absolute top-2 left-2 right-2 h-96 -z-10">
          <Card className={cn(
            "w-full h-full border-0 shadow-lg transform rotate-1 scale-95",
            isDarkMode ? "bg-gray-800/60" : "bg-white/60"
          )} />
        </div>
      )}
      
      {currentIndex < cards.length - 2 && (
        <div className="absolute top-4 left-4 right-4 h-96 -z-20">
          <Card className={cn(
            "w-full h-full border-0 shadow-md transform -rotate-1 scale-90",
            isDarkMode ? "bg-gray-800/40" : "bg-white/40"
          )} />
        </div>
      )}
    </div>
  );
};

export default FlashcardStack;
