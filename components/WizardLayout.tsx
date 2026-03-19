"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, RotateCcw } from "lucide-react";
import { STEPS } from "@/data/steps";
import { useWizardProgress } from "@/hooks/useWizardProgress";
import ProgressBar from "./ProgressBar";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSteps = STEPS.length;

  const navigateTo = useCallback(
    (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= totalSteps) return;
      setDirection(stepIndex > currentStep ? 1 : -1);
      setCurrentStep(stepIndex);
      setMobileMenuOpen(false);

      // Update URL hash
      const step = STEPS[stepIndex];
      if (step) {
        window.history.replaceState(null, "", `#${step.id}`);
      }

      // Scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [currentStep, setCurrentStep, totalSteps]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && currentStep < totalSteps - 1) {
        navigateTo(currentStep + 1);
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        navigateTo(currentStep - 1);
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

  // Don't render until client-side hydration is complete
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
      x: dir > 0 ? 100 : dir < 0 ? -100 : 0,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : dir < 0 ? 100 : 0,
      opacity: 0,
    }),
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Progress Bar */}
      <div className="sticky top-0 z-50">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[280px] shrink-0 glass-panel border-r border-glass-border sticky top-[52px] h-[calc(100vh-52px)] overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <TableOfContents
                currentStep={currentStep}
                visitedSteps={visitedSteps}
                onStepSelect={navigateTo}
              />
            </div>
            <div className="px-4 py-3 border-t border-glass-border">
              <button
                onClick={resetProgress}
                className="flex items-center gap-2 text-[10px] font-orbitron text-text-muted hover:text-warning transition-colors tracking-wider"
              >
                <RotateCcw className="w-3 h-3" />
                RESET PROGRESS
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed bottom-6 left-6 z-40 glass-button p-3 rounded-full animate-pulse-glow"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="lg:hidden fixed inset-y-0 left-0 w-[280px] glass-panel z-50 border-r border-glass-border"
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
                    <span className="font-orbitron text-xs text-primary">
                      Navigation
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 hover:text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <TableOfContents
                      currentStep={currentStep}
                      visitedSteps={visitedSteps}
                      onStepSelect={navigateTo}
                    />
                  </div>
                  <div className="px-4 py-3 border-t border-glass-border">
                    <button
                      onClick={() => {
                        resetProgress();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-[10px] font-orbitron text-text-muted hover:text-warning transition-colors tracking-wider"
                    >
                      <RotateCcw className="w-3 h-3" />
                      RESET PROGRESS
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main
          ref={contentRef}
          className="flex-1 min-w-0 h-[calc(100vh-52px)] overflow-y-auto scrollbar-glass"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {currentStepData && (
                  <StepContent
                    step={currentStepData}
                    totalSteps={totalSteps}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8">
              <StepNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrev={() => navigateTo(currentStep - 1)}
                onNext={() => navigateTo(currentStep + 1)}
              />
            </div>

            <footer className="mt-12 mb-8 text-center">
              <p className="font-orbitron text-[10px] text-text-muted tracking-widest">
                SWGEMU SERVER SETUP GUIDE
              </p>
              <p className="text-[10px] text-text-muted/50 mt-1">
                Use arrow keys or buttons to navigate
              </p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
