"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "swgemu-guide-progress";

interface WizardProgress {
  currentStep: number;
  visitedSteps: number[];
}

function loadProgress(): WizardProgress {
  if (typeof window === "undefined") {
    return { currentStep: 0, visitedSteps: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { currentStep: 0, visitedSteps: [] };
}

function saveProgress(progress: WizardProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage errors
  }
}

export function useWizardProgress() {
  const [currentStep, setCurrentStepState] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const progress = loadProgress();
    setCurrentStepState(progress.currentStep);
    setVisitedSteps(progress.visitedSteps);
    setMounted(true);
  }, []);

  const setCurrentStep = useCallback(
    (step: number) => {
      setCurrentStepState(step);
      setVisitedSteps((prev) => {
        const updated = prev.includes(step) ? prev : [...prev, step];
        saveProgress({ currentStep: step, visitedSteps: updated });
        return updated;
      });
    },
    []
  );

  const markVisited = useCallback((step: number) => {
    setVisitedSteps((prev) => {
      if (prev.includes(step)) return prev;
      const updated = [...prev, step];
      saveProgress({
        currentStep: step,
        visitedSteps: updated,
      });
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setCurrentStepState(0);
    setVisitedSteps([]);
    saveProgress({ currentStep: 0, visitedSteps: [] });
  }, []);

  return {
    currentStep,
    setCurrentStep,
    visitedSteps,
    markVisited,
    resetProgress,
    mounted,
  };
}
