import { cn } from "@/lib/utils";
import { FaRegClipboard } from "react-icons/fa";
import React, { useState } from 'react'
import { socialMedia } from "@/data";
    
export function DotBackgroundDemo() {

    const [copied, setCopied] = useState(false)
    const emailAddress = "rritmanto@gmail.com" // Change this to your actual email

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(emailAddress)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    
  return (
    <div className="relative flex h-[30rem] md:h-[40rem] lg:h-[50rem] w-full items-center justify-center bg-white dark:bg-black px-4">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <div className="flex flex-col items-center text-center">
                    <h1 className="relative z-20 text-white py-4 md:py-8 text-3xl md:text-6xl lg:text-7xl font-bold">
                        Let's team up!
                    </h1>
                    <p className="text-center text-lg md:text-2xl lg:text-3xl text-white mb-4 px-4" >
                        Send me a message here.
                    </p>
                    
                    {/* Clickable email text */}
                    <button 
                        onClick={copyToClipboard}
                        className="relative flex items-center gap-1 md:gap-2 text-white hover:text-gray-300 transition-colors duration-200 font-medium mb-2 cursor-pointer text-lg md:text-4xl lg:text-6xl px-2"
                    >
                        <span className="break-all">{emailAddress}</span>
                        <FaRegClipboard className="w-4 h-4 md:w-8 md:h-8 lg:w-10 lg:h-10 flex-shrink-0" />
                        {copied && (
                            <span className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs md:text-sm">
                                Copied!
                            </span>
                        )}
                    </button>

                    {/* Social media icons */}
                    <div className="flex items-center gap-4 md:gap-6 mt-8 md:mt-12">
                        {socialMedia.map((profile) => (
                            <a 
                                key={profile.id} 
                                href={profile.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:opacity-75 transition-opacity duration-200"
                            >
                                <img 
                                    src={profile.img} 
                                    alt={profile.id}
                                    width={24} 
                                    height={24} 
                                    className="filter invert brightness-0 contrast-100 w-6 h-6 md:w-8 md:h-8"
                                />
                            </a>
                        ))}
                    </div>
                </div>
    </div>
  );
}
