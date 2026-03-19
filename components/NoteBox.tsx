import { Info } from "lucide-react";

interface NoteBoxProps {
  children: string;
}

export default function NoteBox({ children }: NoteBoxProps) {
  return (
    <div className="flex items-start gap-3 bg-primary/5 border-l-2 border-primary rounded-r-lg p-4">
      <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
      <p className="text-sm text-text-primary">{children}</p>
    </div>
  );
}
