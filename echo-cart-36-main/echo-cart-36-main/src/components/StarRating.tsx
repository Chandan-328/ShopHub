import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div 
        className="flex items-center"
        onMouseLeave={() => setHoverRating(0)}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const filled = starValue <= Math.round(displayRating);

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              disabled={!interactive}
              className={cn(
                "transition-all duration-150",
                interactive && "cursor-pointer hover:scale-110",
                !interactive && "cursor-default pointer-events-none"
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && rating > 0 && (
        <span className="text-sm text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;

