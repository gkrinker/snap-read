import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Check, ChevronLeft, ChevronRight } from "lucide-react";
import FlashcardStack from "@/components/FlashcardStack";
import ProgressBar from "@/components/ProgressBar";
import SettingsDrawer from "@/components/SettingsDrawer";

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
 * Flashcard viewer component
 * Displays and manages the flashcard learning experience
 */
const FlashcardViewer = () => {
  // Get location and navigation utilities
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get filename from navigation state or use default
  const fileName = location.state?.fileName || "Document";
  
  // Mock flashcards data (in production, this would come from an API)
  const [allCards] = useState<Flashcard[]>([
    {
      id: 1,
      headline: "Cardiovascular System Overview",
      content: "The cardiovascular system serves as the body's transportation network, continuously circulating blood to deliver essential nutrients and oxygen to every cell while removing waste products like carbon dioxide. This intricate system consists of the heart as a central pump, blood vessels as pathways, and blood as the transport medium, working together to maintain cellular function and overall health.",
      category: "Biology",
      sourceOffset: 0,
      deeperContent: "The cardiovascular system is divided into two main circuits: the pulmonary circulation, which carries blood between the heart and lungs for gas exchange, and the systemic circulation, which supplies blood to all other body tissues. The heart's four chambers work in coordination, with the right side pumping deoxygenated blood to the lungs and the left side pumping oxygenated blood to the body."
    },
    {
      id: 2,
      headline: "Photosynthesis Process",
      content: "Photosynthesis represents one of nature's most crucial processes, enabling green plants and certain organisms to harness sunlight energy for synthesizing glucose from carbon dioxide and water. This remarkable biochemical transformation not only sustains plant life but also produces oxygen as a byproduct, making it fundamental to life on Earth and the foundation of most food chains.",
      category: "Biology",
      sourceOffset: 1,
      deeperContent: "The process occurs in two main stages: the light-dependent reactions in the thylakoids, where solar energy is captured and converted to chemical energy (ATP and NADPH), and the light-independent reactions (Calvin cycle) in the stroma, where carbon dioxide is fixed into glucose using the energy from the first stage."
    },
    {
      id: 3,
      headline: "Compound Interest Formula",
      content: "The compound interest formula A = P(1 + r/n)^(nt) represents the mathematical foundation for understanding exponential financial growth. Here, A equals the final amount, P represents the principal investment, r denotes the annual interest rate, n indicates compounding frequency per year, and t signifies time in years. This formula demonstrates how money grows exponentially rather than linearly when interest compounds.",
      category: "Mathematics",
      sourceOffset: 2,
      deeperContent: "Understanding compound interest is crucial for financial literacy. The key insight is that as interest is added to the principal, subsequent interest calculations are based on the new, larger amount. This creates exponential growth, which is why Einstein allegedly called compound interest 'the eighth wonder of the world' and why starting to invest early can have such dramatic long-term effects."
    },
    {
      id: 4,
      headline: "Rock Classification System",
      content: "Geologists classify rocks into three fundamental categories based on their formation processes. Igneous rocks form when molten magma or lava cools and solidifies, creating structures ranging from granite to basalt. Sedimentary rocks develop through the compression and cementation of accumulated sediments over time. Metamorphic rocks result from existing rocks being transformed by intense heat and pressure while remaining solid.",
      category: "Geology",
      sourceOffset: 3,
      deeperContent: "The rock cycle illustrates how these three types can transform into one another over geological time. For example, sedimentary limestone can become metamorphic marble under heat and pressure, which can then melt to form igneous rock. This cycle has been operating for billions of years, constantly recycling Earth's crustal materials."
    },
    {
      id: 5,
      headline: "Supply and Demand Economics",
      content: "Supply and demand forms the cornerstone of market economics, establishing a fundamental relationship that determines pricing in free markets. When consumer demand exceeds available supply, prices naturally rise as buyers compete for limited goods. Conversely, when supply surpasses demand, prices typically fall as sellers compete to attract buyers. This dynamic equilibrium continuously adjusts to reflect changing market conditions and consumer preferences.",
      category: "Economics",
      sourceOffset: 4,
      deeperContent: "The supply and demand model assumes rational actors and perfect information, though real markets often deviate from these ideals. Factors like consumer psychology, market manipulation, government intervention, and external shocks can disrupt the theoretical balance. Understanding these limitations is crucial for applying economic principles to real-world situations."
    }
  ]);

  // Settings state management
  const [cardCount, setCardCount] = useState(20);        // Number of cards to display
  const [isDarkMode, setIsDarkMode] = useState(false);   // Dark mode toggle
  const [isLargeText, setIsLargeText] = useState(false); // Text size toggle
  const [autoAdvance, setAutoAdvance] = useState(0);     // Auto-advance timing

  // State for managing displayed cards
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  
  // Effect to handle card chunking based on card count setting
  useEffect(() => {
    // Simulate chunking based on card count
    const chunkedCards = allCards.slice(0, Math.min(cardCount / 4, allCards.length));
    setFlashcards(chunkedCards);
  }, [cardCount, allCards]);

  // Navigation and progress state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<Set<number>>(new Set());
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<number>>(new Set());
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set());

  // Auto-advance effect
  useEffect(() => {
    if (autoAdvance === 0) return;
    
    const timer = setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    }, autoAdvance * 1000);

    return () => clearTimeout(timer);
  }, [currentIndex, autoAdvance, flashcards.length]);

  /**
   * Handles when a card is viewed
   * @param cardId - ID of the viewed card
   */
  const handleCardView = (cardId: number) => {
    setViewedCards(prev => new Set([...prev, cardId]));
  };

  /**
   * Toggles bookmark status for a card
   * @param cardId - ID of the card to bookmark/unbookmark
   */
  const handleBookmarkToggle = (cardId: number) => {
    setBookmarkedCards(prev => {
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
   * Handles diving deeper into card content
   * @param cardId - ID of the card to explore
   */
  const handleDiveDeeper = (cardId: number) => {
    console.log(`Diving deeper into card ${cardId}`);
  };

  /**
   * Handles jumping to source document
   * @param cardId - ID of the card to reference
   */
  const handleJumpToSource = (cardId: number) => {
    const card = flashcards.find(c => c.id === cardId);
    if (card?.sourceOffset !== undefined) {
      console.log(`Jumping to source offset ${card.sourceOffset} for card ${cardId}`);
    }
  };

  /**
   * Handles AI question answering
   * @param cardId - ID of the card being questioned
   * @param question - The question to ask
   */
  const handleAskAI = (cardId: number, question: string) => {
    console.log(`AI question for card ${cardId}: ${question}`);
  };

  /**
   * Resets the current learning session
   */
  const resetSession = () => {
    setCurrentIndex(0);
    setAnsweredCards(new Set());
    setViewedCards(new Set());
  };

  /**
   * Navigates to the previous card
   */
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  /**
   * Navigates to the next card
   */
  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  // Calculate session completion status
  const isSessionComplete = viewedCards.size === flashcards.length;
  const currentCard = flashcards[currentIndex];

  // Truncate filename for mobile display
  const truncatedFileName = fileName.length > 20 ? fileName.substring(0, 20) + "..." : fileName;

  return (
    // Main container with conditional dark mode
    <div className={`min-h-screen font-lexend ${isDarkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'}`}>
      {/* Header with navigation and controls */}
      <div className={`${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-sm border-b shadow-sm sticky top-0 z-10`}>
        <div className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'} flex-shrink-0`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {/* Document title */}
          <div className="text-center flex-1 mx-4 min-w-0">
            <h1 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} truncate`}>
              {truncatedFileName}
            </h1>
          </div>
          
          {/* Settings and reset controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <SettingsDrawer
              cardCount={cardCount}
              onCardCountChange={setCardCount}
              isDarkMode={isDarkMode}
              onDarkModeToggle={() => setIsDarkMode(!isDarkMode)}
              isLargeText={isLargeText}
              onLargeTextToggle={() => setIsLargeText(!isLargeText)}
              autoAdvance={autoAdvance}
              onAutoAdvanceChange={setAutoAdvance}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSession}
              className={`${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar
          current={currentIndex + 1}
          total={flashcards.length}
          answered={viewedCards.size}
          readingTime={currentCard ? Math.ceil(currentCard.content.split(' ').length / 200) : 0}
        />
      </div>

      {/* Main content area */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        {!isSessionComplete ? (
          <>
            {/* Flashcard stack component */}
            <FlashcardStack
              cards={flashcards}
              currentIndex={currentIndex}
              onCardView={handleCardView}
              viewedCards={viewedCards}
              bookmarkedCards={bookmarkedCards}
              onBookmarkToggle={handleBookmarkToggle}
              onDiveDeeper={handleDiveDeeper}
              onJumpToSource={handleJumpToSource}
              onAskAI={handleAskAI}
              isDarkMode={isDarkMode}
              isLargeText={isLargeText}
            />
            
            {/* Navigation controls */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`${isDarkMode ? 'bg-gray-800/80 text-gray-300 border-gray-600' : 'bg-white/80'} backdrop-blur-sm`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentIndex === flashcards.length - 1}
                className={`${isDarkMode ? 'bg-gray-800/80 text-gray-300 border-gray-600' : 'bg-white/80'} backdrop-blur-sm`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          // Session completion view
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Session Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                You've reviewed all {flashcards.length} flashcards
              </p>
              <Button
                onClick={resetSession}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              >
                Start New Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FlashcardViewer;
