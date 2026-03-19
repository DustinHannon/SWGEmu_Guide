"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PHASES, STEPS } from "@/data/steps";
import {
  Monitor,
  Download,
  Database,
  Settings,
  Play,
  RefreshCw,
  ChevronDown,
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
}

export default function TableOfContents({
  currentStep,
  visitedSteps,
  onStepSelect,
}: TableOfContentsProps) {
  const [expandedPhases, setExpandedPhases] = useState<number[]>(
    () => {
      const currentPhase = STEPS[currentStep]?.phase ?? 1;
      return [currentPhase];
    }
  );

  const togglePhase = (phase: number) => {
    setExpandedPhases((prev) =>
      prev.includes(phase)
        ? prev.filter((p) => p !== phase)
        : [...prev, phase]
    );
  };

  return (
    <nav className="flex flex-col h-full overflow-y-auto scrollbar-glass py-4">
      <div className="px-4 mb-6">
        <h1 className="font-orbitron text-sm text-primary tracking-wider">
          SWGEmu Guide
        </h1>
        <p className="text-[10px] text-text-muted mt-1 font-orbitron tracking-wider">
          SERVER SETUP WIZARD
        </p>
      </div>

      <div className="flex-1 space-y-1">
        {PHASES.map((phase) => {
          const Icon = PHASE_ICONS[phase.icon] || Monitor;
          const isExpanded = expandedPhases.includes(phase.number);
          const phaseSteps = STEPS.filter((s) => s.phase === phase.number);
          const phaseComplete = phaseSteps.every((s) =>
            visitedSteps.includes(STEPS.indexOf(s))
          );

          return (
            <div key={phase.number}>
              <button
                onClick={() => togglePhase(phase.number)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-2 text-left transition-colors",
                  "hover:bg-white/5",
                  isExpanded ? "text-secondary" : "text-text-secondary"
                )}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-orbitron text-[11px] tracking-wide flex-1">
                  <span className="text-text-muted mr-1">{">_"}</span>
                  {phase.title}
                </span>
                {phaseComplete && (
                  <Check className="w-3 h-3 text-success shrink-0" />
                )}
                <ChevronDown
                  className={cn(
                    "w-3 h-3 shrink-0 transition-transform duration-200",
                    isExpanded ? "rotate-0" : "-rotate-90"
                  )}
                />
              </button>

              {isExpanded && (
                <div className="ml-4 border-l border-glass-border">
                  {phaseSteps.map((step) => {
                    const stepIndex = STEPS.indexOf(step);
                    const isActive = stepIndex === currentStep;
                    const isVisited = visitedSteps.includes(stepIndex);

                    return (
                      <button
                        key={step.id}
                        onClick={() => onStepSelect(stepIndex)}
                        className={cn(
                          "w-full flex items-center gap-2 pl-4 pr-3 py-1.5 text-left text-xs transition-all",
                          "hover:bg-white/5",
                          isActive && "bg-primary/10 border-l-2 border-primary -ml-px",
                          !isActive && "border-l-2 border-transparent -ml-px"
                        )}
                      >
                        {isVisited && !isActive ? (
                          <Check className="w-3 h-3 text-success shrink-0" />
                        ) : (
                          <span
                            className={cn(
                              "w-3 text-center font-orbitron text-[10px] shrink-0",
                              isActive
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
                            isActive
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
      </div>
    </nav>
  );
}
