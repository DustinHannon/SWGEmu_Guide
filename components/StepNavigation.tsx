"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function StepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
}: StepNavigationProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const nextLabel = isFirst ? "Get Started" : isLast ? "Finish" : "Next";

  return (
    <div className="flex justify-between items-center pt-6 mt-6 border-t border-white/5">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-orbitron transition-all",
          isFirst
            ? "opacity-20 cursor-not-allowed text-text-muted"
            : "text-text-secondary hover:text-primary hover:bg-white/5"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <button
        onClick={onNext}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-orbitron text-primary hover:bg-primary/10 transition-all border border-primary/20 hover:border-primary/40"
      >
        {nextLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
