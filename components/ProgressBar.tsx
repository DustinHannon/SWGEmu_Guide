"use client";

interface ProgressRingProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressRing({ currentStep, totalSteps }: ProgressRingProps) {
  const progress = (currentStep + 1) / totalSteps;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="progress-ring-container">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r={radius} className="progress-ring-bg" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          className="progress-ring-fill"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-orbitron text-sm text-text-primary font-bold leading-none">
          {currentStep + 1}
        </span>
        <span className="text-[8px] text-text-muted leading-none mt-0.5">
          of {totalSteps}
        </span>
      </div>
    </div>
  );
}

interface ProgressLineProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressLine({ currentStep, totalSteps }: ProgressLineProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="progress-line">
      <div className="progress-line-fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
