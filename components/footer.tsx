'use client'
import React from "react";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import useFooterHandler from "@/_handler/useFooterHandler";

export default function Footer() {
    const {
        copyEmailToClipboard,
    } = useFooterHandler()
  return (
    <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center">

      <div className="relative z-10 flex w-full flex-col items-center justify-between space-y-6 px-8 py-16 text-center">
        <div>
            <h1 className="relative z-20 text-gray-300 py-4 md:py-8 text-3xl md:text-6xl lg:text-7xl ">
                Let&apos;s team up!
            </h1>
            <p className="text-center text-lg md:text-2xl lg:text-3xl text-gray-300 mb-4 px-4" >
                Chat with me here.
            </p>
            <button
                onClick={copyEmailToClipboard}
                className="relative flex items-center text-gray-100 hover:text-gray-300 transition-colors duration-200 font-medium mb-2 cursor-pointer text-lg md:text-4xl lg:text-6xl px-2"
            >
                rritmanto@gmail.com
            </button>
        </div>
      </div>
    </div>
  );
}
