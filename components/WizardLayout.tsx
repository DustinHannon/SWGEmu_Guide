"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { STEPS } from "@/data/steps";
import { useWizardProgress } from "@/hooks/useWizardProgress";
import { ProgressRing, ProgressLine } from "./ProgressBar";
import TableOfContents from "./TableOfContents";
import StepContent from "./StepContent";
import StepNavigation from "./StepNavigation";

export default function WizardLayout() {
  const {
    currentStep,
    setCurrentStep,
    visitedSteps,
    resetProgress,
    mounted,
  } = useWizardProgress();

  const [direction, setDirection] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalSteps = STEPS.length;

  const navigateTo = useCallback(
    (stepIndex: number, isJump = false) => {
      if (stepIndex < 0 || stepIndex >= totalSteps) return;
      setDirection(isJump ? 0 : stepIndex > currentStep ? 1 : -1);
      setCurrentStep(stepIndex);

      const step = STEPS[stepIndex];
      if (step) {
        window.history.replaceState(null, "", `#${step.id}`);
      }

      if (cardRef.current) {
        cardRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentStep, setCurrentStep, totalSteps]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
          if (currentStep < totalSteps - 1) navigateTo(currentStep + 1);
          break;
        case "ArrowLeft":
          if (currentStep > 0) navigateTo(currentStep - 1);
          break;
        case "Escape":
          setTocOpen((prev) => !prev);
          break;
        case "Home":
          e.preventDefault();
          navigateTo(0, true);
          break;
        case "End":
          e.preventDefault();
          navigateTo(totalSteps - 1, true);
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, totalSteps, navigateTo]);

  // Read hash on mount
  useEffect(() => {
    if (!mounted) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      const index = STEPS.findIndex((s) => s.id === hash);
      if (index >= 0) {
        setDirection(0);
        setCurrentStep(index);
      }
    }
  }, [mounted, setCurrentStep]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-orbitron text-primary text-sm animate-pulse">
          Loading guide...
        </div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : dir < 0 ? -40 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : dir < 0 ? 40 : 0,
      opacity: 0,
    }),
  };

  return (
    <div className="relative z-10">
      {/* TOC Toggle Button */}
      <button
        onClick={() => setTocOpen(true)}
        className="toc-toggle"
        aria-label="Open navigation"
      >
        <Menu className="w-4 h-4" />
        <span>Steps</span>
      </button>

      {/* Progress Ring */}
      <ProgressRing currentStep={currentStep} totalSteps={totalSteps} />

      {/* Progress Line */}
      <ProgressLine currentStep={currentStep} totalSteps={totalSteps} />

      {/* Floating TOC */}
      <TableOfContents
        currentStep={currentStep}
        visitedSteps={visitedSteps}
        onStepSelect={(index) => navigateTo(index, true)}
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        onReset={resetProgress}
      />

      {/* Centered Stage */}
      <div className="stage-container">
        <div ref={cardRef} className="stage-card corner-brackets">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {currentStepData && (
                <StepContent
                  step={currentStepData}
                  totalSteps={totalSteps}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <StepNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrev={() => navigateTo(currentStep - 1)}
            onNext={() => currentStep === totalSteps - 1 ? navigateTo(0, true) : navigateTo(currentStep + 1)}
          />
        </div>
      </div>
    </div>
  );
}
