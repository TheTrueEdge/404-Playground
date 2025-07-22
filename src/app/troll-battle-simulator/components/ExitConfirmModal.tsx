// components/ExitConfirmModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExitConfirmModalProps {
  onConfirm: () => void;
  triggerText?: string;
  title?: string;
  message?: string;
  className?: string;
  contentClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export function ExitConfirmModal({
  onConfirm,
  triggerText = "🏠 Exit",
  title = "🏠 Exit",
  message = "Are you sure you want to leave? Your progress will be lost.",
  className = "",
  contentClassName = "",
  confirmButtonClassName = "",
  cancelButtonClassName = "",
}: ExitConfirmModalProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className={`max-w-xl ${contentClassName}`}>
        <DialogTitle className="text-2xl font-bold mb-2 text-center">{title}</DialogTitle>
        <p className="mb-4 text-lg">{message}</p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            className={`w-40 ${cancelButtonClassName}`}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className={`w-40 ${confirmButtonClassName}`}
            onClick={handleConfirm}
          >
            Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
