import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";


interface EndBattlePopupProps {
  open: boolean;
  didWin: boolean | null;
  message: string;
  onClose: () => void;
  onRetry: () => void;
  onReturnHome: () => void;
  onNextBattle?: () => void;
  retryButtonClass?: string;
  nextButtonClass?: string;
  returnButtonClass?: string;
}

export function EndBattlePopup({
  open,
  didWin,
  message,
  onClose,
  onRetry,
  onReturnHome,
  onNextBattle,
  retryButtonClass = "bg-green-700 hover:bg-green-600 text-white",
  nextButtonClass = "bg-blue-700 hover:bg-blue-600 text-white",
  returnButtonClass = "bg-red-700 hover:bg-red-600 text-white",
}: EndBattlePopupProps) {

  const [width, height] = useWindowSize();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-md bg-[#f7f1c8] border border-[#e5d88b] rounded-xl shadow-lg text-center"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {didWin && (
          <Confetti
            numberOfPieces={200}
            recycle={false}
            width={width}
            height={height}
          />
        )}
        <DialogTitle className="text-3xl font-bold mb-2 text-red-900">
          {didWin ? "🎉 Victory!" : "☠️ Defeat!"}
        </DialogTitle>
        {didWin && (
          <div className="text-6xl mb-2">🏆</div>
        )}
        <p className="mb-6 text-lg">{message}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          {didWin ? (
            <>
              <Button
                onClick={onNextBattle}
                className={nextButtonClass || "bg-blue-700 hover:bg-blue-600 text-white px-6 py-3 rounded font-semibold"}
              >
                ⚔️ Next Battle
              </Button>
              <Button
                onClick={onReturnHome}
                className={returnButtonClass || "bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold"}
              >
                🏠 Return Home
              </Button>
            </>
          ) : (
            <>
            <Button
              onClick={onRetry}
              className={retryButtonClass || "bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold"}
            >
              ⚔️ Retry
            </Button>
            <Button
              onClick={onReturnHome}
              className={returnButtonClass || "bg-red-700 hover:bg-red-600 text-white px-6 py-3 rounded font-semibold"}
            >
              🏠 Return Home
            </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
