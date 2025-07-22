"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface IntroPopupProps {
  title: string;
  description: string;
  imageSrc?: string;
  emoji?: string;
  onStart: () => void;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function IntroPopup({
  title,
  description,
  imageSrc,
  emoji,
  onStart,
  titleClassName = "",
  descriptionClassName = "",
}: IntroPopupProps) {
  const [open, setOpen] = useState(true);

  const handleStart = () => {
    setOpen(false);
    onStart();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className={`
          bg-[#f7f1c8] border border-[#e5d88b] text-[#1e1e1e] rounded-xl shadow-lg
          mx-auto my-6
          max-w-[90vw] sm:max-w-[600px]
          p-6 sm:p-8
          flex flex-col items-center
          overflow-auto
          `}
        style={{ maxHeight: '90vh' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center text-center space-y-4 w-full"
          style={{ flexGrow: 1 }}
        >
          <DialogTitle
            className={`select-none ${titleClassName}`}
            style={{
              fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', // scales between 24px and 40px based on viewport width
              marginBottom: 0,
              lineHeight: 1.2,
              overflowWrap: 'break-word',
            }}
          >
            {title}
          </DialogTitle>
          <p
            className={descriptionClassName}
            style={{
              fontSize: 'clamp(0.875rem, 3vw, 1.25rem)', // scales between 14px and 20px
              marginTop: 0,
              padding: '0 1rem',
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>

          {emoji ? (
            <div className="text-[5rem] sm:text-[6rem] select-none my-4">{emoji}</div>
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              width={150}
              height={150}
              className="mx-auto my-4"
              priority
            />
          ) : null}

          <Button
            onClick={handleStart}
            className="w-36 h-16 bg-[#5c4a1a] hover:bg-[#766338] text-[#dcd6b8] rounded text-lg font-bold shadow transition-colors mt-auto"
          >
            ⚔️ Battle!
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
