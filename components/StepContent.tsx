"use client";

import type { StepData } from "@/data/steps";
import CodeBlock from "./CodeBlock";
import WarningBox from "./WarningBox";
import NoteBox from "./NoteBox";
import TipBox from "./TipBox";

interface StepContentProps {
  step: StepData;
  totalSteps: number;
}

export default function StepContent({ step, totalSteps }: StepContentProps) {
  const stepLabel = `[${String(step.stepNumber).padStart(2, "0")}/${String(totalSteps).padStart(2, "0")}]`;

  return (
    <div className="glass-card corner-brackets rounded-xl p-6 sm:p-8 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-orbitron text-sm text-primary tracking-wider">
            {stepLabel}
          </span>
          <span className="px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-orbitron tracking-wide">
            {step.phaseTitle}
          </span>
        </div>
        <h2 className="font-orbitron text-2xl text-text-primary">{step.title}</h2>
      </div>

      <div className="text-text-secondary leading-relaxed">
        {step.description.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))}
      </div>

      {step.warnings && step.warnings.length > 0 && (
        <div className="space-y-4">
          {step.warnings.map((warning, i) => (
            <WarningBox key={i}>{warning}</WarningBox>
          ))}
        </div>
      )}

      {step.commands && step.commands.length > 0 && (
        <div className="space-y-4">
          {step.commands.map((cmd, i) => (
            <CodeBlock
              key={i}
              command={cmd.command}
              label={cmd.label}
              language={cmd.language}
            />
          ))}
        </div>
      )}

      {step.notes && step.notes.length > 0 && (
        <div className="space-y-4">
          {step.notes.map((note, i) => (
            <NoteBox key={i}>{note}</NoteBox>
          ))}
        </div>
      )}

      {step.tips && step.tips.length > 0 && (
        <div className="space-y-4">
          {step.tips.map((tip, i) => (
            <TipBox key={i}>{tip}</TipBox>
          ))}
        </div>
      )}
    </div>
  );
}
