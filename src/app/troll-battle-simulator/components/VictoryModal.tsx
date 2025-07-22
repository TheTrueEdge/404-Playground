// components/troll-battle-simulator/VictoryPopup.tsx

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";

interface VictoryPopupProps {
  title?: string;
  message?: string;
  className?: string;
  triggerText?: string;
  onNextBattle?: () => void;
}

export function VictoryPopup({
  title = "Victory!",
  message = "You have bested the troll. Well done!",
  className = "",
  triggerText = "Show Victory",
  onNextBattle,
}: VictoryPopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{triggerText}</Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-md text-center p-6 rounded-2xl shadow-xl ${className}`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground">{message}</p>
          {onNextBattle && (
            <Button onClick={onNextBattle} variant="secondary">
              Continue to Next Battle
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
