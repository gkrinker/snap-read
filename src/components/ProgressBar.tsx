
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  answered: number;
}

const ProgressBar = ({ current, total, answered }: ProgressBarProps) => {
  const progressPercentage = (current / total) * 100;
  const answeredPercentage = (answered / total) * 100;

  return (
    <div className="px-4 pb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span>Progress</span>
        <span>{answered} / {total} answered</span>
      </div>
      
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        {/* Answered progress (green) */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-300 ease-out"
          style={{ width: `${answeredPercentage}%` }}
        />
        
        {/* Current position indicator */}
        <div
          className="absolute top-0 h-full w-1 bg-white shadow-sm transition-all duration-300 ease-out"
          style={{ left: `${progressPercentage}%` }}
        />
        
        {/* Overall progress track */}
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-300 to-purple-300 opacity-30 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
