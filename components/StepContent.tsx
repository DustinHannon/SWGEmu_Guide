"use client";

import { motion } from "framer-motion";
import type { StepData } from "@/data/steps";
import CodeBlock from "./CodeBlock";
import WarningBox from "./WarningBox";
import NoteBox from "./NoteBox";
import TipBox from "./TipBox";

interface StepContentProps {
  step: StepData;
  totalSteps: number;
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function StepContent({ step, totalSteps }: StepContentProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
      }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={staggerItem} className="space-y-2">
        <p className="font-orbitron text-[11px] text-secondary tracking-[0.15em] uppercase">
          Phase {step.phase} · {step.phaseTitle}
        </p>
        <h2 className="font-orbitron text-2xl sm:text-3xl text-text-primary leading-tight">
          {step.title}
        </h2>
      </motion.div>

      {/* Description */}
      <motion.div variants={staggerItem} className="text-text-secondary text-base leading-relaxed">
        {step.description.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            {line}
          </p>
        ))}
      </motion.div>

      {/* Warnings */}
      {step.warnings && step.warnings.length > 0 && (
        <motion.div variants={staggerItem} className="space-y-3">
          {step.warnings.map((warning, i) => (
            <WarningBox key={i}>{warning}</WarningBox>
          ))}
        </motion.div>
      )}

      {/* Commands */}
      {step.commands && step.commands.length > 0 && (
        <motion.div variants={staggerItem} className="space-y-4">
          {step.commands.map((cmd, i) => (
            <CodeBlock
              key={i}
              command={cmd.command}
              label={cmd.label}
              language={cmd.language}
            />
          ))}
        </motion.div>
      )}

      {/* Notes */}
      {step.notes && step.notes.length > 0 && (
        <motion.div variants={staggerItem} className="space-y-3">
          {step.notes.map((note, i) => (
            <NoteBox key={i}>{note}</NoteBox>
          ))}
        </motion.div>
      )}

      {/* Tips */}
      {step.tips && step.tips.length > 0 && (
        <motion.div variants={staggerItem} className="space-y-3">
          {step.tips.map((tip, i) => (
            <TipBox key={i}>{tip}</TipBox>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
