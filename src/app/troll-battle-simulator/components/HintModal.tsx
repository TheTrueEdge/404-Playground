import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface HintModalProps {
  hints: string[];
  title: string;
  triggerText?: string;
  className?: string;
  contentClassName?: string;
  hintButtonClassName?: string;
  hintBoxClassName?: string;
  
}

export function HintModal({
  hints,
  title,
  triggerText = "💡 Hint",
  className = "",
  contentClassName = "",
  hintBoxClassName = "",
  hintButtonClassName = "",
}: HintModalProps) {
  const [revealed, setRevealed] = useState<boolean[]>(Array(hints.length).fill(false));
  const buttonRef = useRef<HTMLButtonElement>(null);

  const revealHint = (index: number) => {
    setRevealed((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const handleDialogChange = (open: boolean) => {
    if (!open && buttonRef.current) {
      buttonRef.current.blur();
    }
  };

  return (
    <Dialog onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button 
           className={`${className} focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0`}
          ref={buttonRef}
        >
          {triggerText}</Button>
      </DialogTrigger>
      <DialogContent className={`max-w-xl ${contentClassName}`}>
        <DialogTitle className="text-2xl font-bold mb-2 text-center">{title}</DialogTitle>
        <div className="space-y-4">
          {hints.map((hint, index) => (
            <div key={index} className={`flex justify-center text-center ${hintBoxClassName}`}>
              {revealed[index] ? (
                <p>{hint}</p>
              ) : (
                <Button
                  className={`whitespace-nowrap ${hintButtonClassName}`}
                  onClick={() => revealHint(index)}
                >
                  Reveal Hint {index + 1}
                </Button>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
