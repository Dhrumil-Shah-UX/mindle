"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { HowToPlayHelp } from "@/components/game/HowToPlayHelp";

export function LandingActions() {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <LinkButton href="/play" fullWidth className="py-4 text-base sm:w-auto sm:min-w-[160px]">
        Play
      </LinkButton>
      <HowToPlayHelp
        open={showTutorial}
        onOpen={() => setShowTutorial(true)}
        onClose={() => setShowTutorial(false)}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
