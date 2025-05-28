import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CardActions from "@/components/CardActions";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, ChevronDown, ChevronUp, ExternalLink, MessageSquare } from "lucide-react";

/**
 * Interface defining the structure of a flashcard
 */
interface Flashcard {
  id: number;              // Unique identifier for the card
  headline: string;        // Main title of the card
  content: string;         // Main content of the card
  category?: string;       // Optional category for organization
  sourceOffset?: number;   // Optional reference to source document
  deeperContent?: string;  // Optional additional content for deeper learning
}

/**
 * Props interface for the FlashcardStack component
 */
interface FlashcardStackProps {
  cards: Flashcard[];                    // Array of flashcards to display
  currentIndex: number;                  // Index of the current card
  onCardView: (cardId: number) => void;  // Callback when a card is viewed
  viewedCards: Set<number>;              // Set of viewed card IDs
  bookmarkedCards: Set<number>;          // Set of bookmarked card IDs
  onBookmarkToggle: (cardId: number) => void;  // Callback for bookmark toggle
  onDiveDeeper: (cardId: number) => void;      // Callback for diving deeper
  onJumpToSource: (cardId: number) => void;    // Callback for jumping to source
  onAskAI: (cardId: number, question: string) => void;  // Callback for AI questions
  isDarkMode: boolean;                   // Dark mode state
  isLargeText: boolean;                  // Text size state
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
  const [expandedContent, setExpandedContent] = useState<Set<number>>(new Set());
  const [aiQuestion, setAiQuestion] = useState("");

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

  /**
   * Toggles the expanded state of a card's content
   * @param cardId - ID of the card to toggle
   */
  const toggleExpand = (cardId: number) => {
    setExpandedContent(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  /**
   * Handles AI question submission
   * @param cardId - ID of the card being questioned
   */
  const handleAskAI = (cardId: number) => {
    if (aiQuestion.trim()) {
      onAskAI(cardId, aiQuestion);
      setAiQuestion("");
    }
  };

  if (!currentCard) return null;

  const textSizeClass = isLargeText ? 'text-lg' : 'text-base';
  const headlineSizeClass = isLargeText ? 'text-xl' : 'text-lg';

  // Truncate content to prevent scrollbars - limit to approximately 8-10 lines
  const maxContentLength = isLargeText ? 400 : 500;
  const truncatedContent = currentCard.content.length > maxContentLength 
    ? currentCard.content.substring(0, maxContentLength) + "..."
    : currentCard.content;

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
            <div className="flex justify-end items-start mb-4">
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
            
            {/* Content - fixed height with no scroll */}
            <div className="flex-1 mb-4">
              <p className={cn(
                "leading-relaxed",
                textSizeClass,
                isDarkMode ? "text-gray-200" : "text-gray-700"
              )}>
                {truncatedContent}
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
