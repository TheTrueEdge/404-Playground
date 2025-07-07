import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PoetryPage() {
  return (
    <div className="min-h-screen p-6">
      <Link href="/">
        <Button className="mb-6">
          ← Back Home
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-4">🧠 AI Poetry Lab</h1>
      <p className="text-muted-foreground">Here’s where your AI haikus will go!</p>
    </div>
  );
}