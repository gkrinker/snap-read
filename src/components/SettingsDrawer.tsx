
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings, Moon, Sun, Type } from "lucide-react";

interface SettingsDrawerProps {
  cardCount: number;
  onCardCountChange: (count: number) => void;
  isDarkMode: boolean;
  onDarkModeToggle: () => void;
  isLargeText: boolean;
  onLargeTextToggle: () => void;
  autoAdvance: number;
  onAutoAdvanceChange: (seconds: number) => void;
}

const SettingsDrawer = ({
  cardCount,
  onCardCountChange,
  isDarkMode,
  onDarkModeToggle,
  isLargeText,
  onLargeTextToggle,
  autoAdvance,
  onAutoAdvanceChange
}: SettingsDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
          <Settings className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[400px]">
        <SheetHeader>
          <SheetTitle className="font-lexend">Reading Settings</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 pt-6">
          {/* Card Count Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Cards per deck
              </label>
              <span className="text-sm text-gray-500">{cardCount} cards</span>
            </div>
            <Slider
              value={[cardCount]}
              onValueChange={([value]) => onCardCountChange(value)}
              min={5}
              max={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              ≈ {Math.round((cardCount * 8) / 60)} min total read time
            </p>
          </div>

          {/* Large Text Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Type className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Large Text (+2px)
              </label>
            </div>
            <Switch
              checked={isLargeText}
              onCheckedChange={onLargeTextToggle}
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-gray-600" />
              ) : (
                <Sun className="w-4 h-4 text-gray-600" />
              )}
              <label className="text-sm font-medium text-gray-700">
                Dark Mode
              </label>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={onDarkModeToggle}
            />
          </div>

          {/* Auto Advance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Auto-advance
              </label>
              <span className="text-sm text-gray-500">
                {autoAdvance === 0 ? "Off" : `${autoAdvance}s`}
              </span>
            </div>
            <Slider
              value={[autoAdvance]}
              onValueChange={([value]) => onAutoAdvanceChange(value)}
              min={0}
              max={10}
              step={5}
              className="w-full"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsDrawer;
