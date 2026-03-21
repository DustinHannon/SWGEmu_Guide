"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHASES, STEPS } from "@/data/steps";
import {
  Monitor,
  Download,
  Database,
  Settings,
  Play,
  RefreshCw,
  X,
  RotateCcw,
  Check,
} from "lucide-react";

const PHASE_ICONS: Record<string, React.ElementType> = {
  Monitor,
  Download,
  Database,
  Settings,
  Play,
  RefreshCw,
};

interface TableOfContentsProps {
  currentStep: number;
  visitedSteps: number[];
  onStepSelect: (stepIndex: number) => void;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export default function TableOfContents({
  currentStep,
  visitedSteps,
  onStepSelect,
  isOpen,
  onClose,
  onReset,
}: TableOfContentsProps) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const getPhaseProgress = (phaseNumber: number) => {
    const phaseSteps = STEPS.filter((s) => s.phase === phaseNumber);
    const visited = phaseSteps.filter((s) =>
      visitedSteps.includes(STEPS.indexOf(s))
    ).length;
    return { visited, total: phaseSteps.length };
  };

  const currentPhase = STEPS[currentStep]?.phase ?? 1;
  const [expandedPhases, setExpandedPhases] = useState<number[]>([currentPhase]);

  // Keep current phase expanded when it changes
  useEffect(() => {
    setExpandedPhases((prev) =>
      prev.includes(currentPhase) ? prev : [...prev, currentPhase]
    );
  }, [currentPhase]);

  const togglePhase = (phaseNumber: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseNumber)
        ? prev.filter((p) => p !== phaseNumber)
        : [...prev, phaseNumber]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="toc-backdrop"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -340, opacity: 0 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className="toc-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border">
              <h2 className="font-orbitron text-sm text-text-primary tracking-wider">
                Navigation
              </h2>
              <button
                onClick={onClose}
                className="text-text-muted hover:text-primary transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Overall progress */}
            <div className="px-5 py-3 border-b border-glass-border/50">
              <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
                <span>Overall Progress</span>
                <span className="text-primary">
                  {visitedSteps.length} of {STEPS.length} visited
                </span>
              </div>
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(visitedSteps.length / STEPS.length) * 100}%`,
                    background: "linear-gradient(90deg, #00e5ff, #a78bfa)",
                  }}
                />
              </div>
            </div>

            {/* Phase list */}
            <nav className="flex-1 overflow-y-auto scrollbar-glass py-2">
              {PHASES.map((phase) => {
                const Icon = PHASE_ICONS[phase.icon] || Monitor;
                const { visited, total } = getPhaseProgress(phase.number);
                const isComplete = visited === total;
                const isActive = currentPhase === phase.number;
                const phaseSteps = STEPS.filter(
                  (s) => s.phase === phase.number
                );

                return (
                  <div key={phase.number} className="mb-1">
                    {/* Phase header */}
                    <button
                      onClick={() => togglePhase(phase.number)}
                      className="w-full flex items-center gap-2 px-5 py-2 hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="text-xs">
                        {isComplete ? (
                          <span className="text-success">✓</span>
                        ) : isActive ? (
                          <span className="text-primary">◉</span>
                        ) : (
                          <span className="text-text-muted">○</span>
                        )}
                      </span>
                      <Icon
                        className={cn(
                          "w-3.5 h-3.5 shrink-0",
                          isComplete
                            ? "text-success"
                            : isActive
                              ? "text-primary"
                              : "text-text-muted"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium flex-1",
                          isComplete
                            ? "text-success"
                            : isActive
                              ? "text-text-primary"
                              : "text-text-muted"
                        )}
                      >
                        {phase.title}
                      </span>
                      <span
                        className={cn(
                          "phase-badge",
                          isComplete
                            ? "phase-badge-complete"
                            : isActive
                              ? "phase-badge-active"
                              : "phase-badge-pending"
                        )}
                      >
                        {visited}/{total}
                      </span>
                    </button>

                    {/* Steps (show when phase is expanded) */}
                    {expandedPhases.includes(phase.number) && (
                      <div className="ml-5 pl-4 border-l border-glass-border/50 mb-2">
                        {phaseSteps.map((step) => {
                          const stepIndex = STEPS.indexOf(step);
                          const isCurrent = stepIndex === currentStep;
                          const isVisited = visitedSteps.includes(stepIndex);

                          return (
                            <button
                              key={step.id}
                              onClick={() => {
                                onStepSelect(stepIndex);
                                onClose();
                              }}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-all rounded-md",
                                "hover:bg-white/5",
                                isCurrent &&
                                  "bg-primary/8 border-l-2 border-primary -ml-px text-primary"
                              )}
                            >
                              {isVisited && !isCurrent ? (
                                <Check className="w-3 h-3 text-text-muted shrink-0" />
                              ) : (
                                <span
                                  className={cn(
                                    "w-3 text-center font-orbitron text-[10px] shrink-0",
                                    isCurrent
                                      ? "text-primary"
                                      : "text-text-muted"
                                  )}
                                >
                                  {step.stepNumber}
                                </span>
                              )}
                              <span
                                className={cn(
                                  "truncate",
                                  isCurrent
                                    ? "text-primary font-medium"
                                    : isVisited
                                      ? "text-text-secondary"
                                      : "text-text-muted"
                                )}
                              >
                                {step.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-glass-border">
              <button
                onClick={() => {
                  onReset();
                  onClose();
                }}
                className="flex items-center justify-center gap-2 w-full text-[10px] font-orbitron text-text-muted hover:text-danger transition-colors tracking-wider py-1"
              >
                <RotateCcw className="w-3 h-3" />
                RESET PROGRESS
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
