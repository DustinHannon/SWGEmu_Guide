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
    <div className="flex justify-between items-center px-2 py-4">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={cn(
          "glass-button corner-brackets rounded-lg flex items-center gap-2 px-5 py-2.5 font-orbitron text-sm transition-opacity",
          isFirst ? "opacity-30 cursor-not-allowed" : "hover:text-primary"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      <button
        onClick={onNext}
        className="glass-button corner-brackets rounded-lg flex items-center gap-2 px-5 py-2.5 font-orbitron text-sm hover:text-primary transition-colors"
      >
        {nextLabel}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
