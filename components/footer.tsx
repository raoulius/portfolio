import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import useFooterHandler from "@/_handler/useFooterHandler";

export default function Footer() {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center">
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />

      <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center">
        <div>
            <h1 className="relative z-20 text-neutral-500 py-4 md:py-8 text-3xl md:text-6xl lg:text-7xl font-bold">
                Let&apos;s team up!
            </h1>
            <p className="text-center text-lg md:text-2xl lg:text-3xl text-neutral-500 mb-4 px-4" >
                Chat with me here.
            </p>
            <button
                onClick={}>

            </button>
        </div>
      </div>
    </div>
  );
}
