"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
}: ProgressBarProps) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const label = `[${String(currentStep + 1).padStart(2, "0")}/${String(totalSteps).padStart(2, "0")}]`;

  return (
    <div className="glass border-b border-glass-border px-4 py-2 flex items-center gap-4 z-50">
      <span className="font-orbitron text-xs text-primary tracking-wider shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, #00e5ff 0%, #a78bfa 100%)",
          }}
        >
          <div className="w-full h-full animate-shimmer" />
        </div>
      </div>
      <span className="font-orbitron text-[10px] text-text-muted tracking-wider shrink-0">
        {Math.round(progress)}%
      </span>
    </div>
  );
}
