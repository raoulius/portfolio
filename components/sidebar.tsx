"use client";

import Image from "next/image";
import useLayoutHandler from "../_handler/useLayoutHandler";
import MukaRajendra from "../public/selfie rajendra.jpeg";
import github from "../public/github-logo.png";
import linkedin from "../public/linkedin.png";
import emailIcon from "../public/normalIcons/mail.svg";
import resumeIcon from "../public/normalIcons/file-plus.svg";
import { Contrast, LockKeyhole, NotebookPen } from "lucide-react";
import Link from "next/link";

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  } catch {}
}

export function Sidebar() {
  const { copied, handleEmailClick } = useLayoutHandler();

  return (
    <aside className="flex flex-col bg-background border-b p-4 md:border-b-0 md:border-r md:w-64 md:fixed md:inset-y-0 md:left-0 md:overflow-y-auto">
      <nav className="flex flex-col gap-2">
        <Link
          href="/"
          className="flex items-center gap-4 md:flex-col md:items-stretch md:gap-2"
        >
          <Image
            src={MukaRajendra}
            alt="Muka gw"
            priority
            width={500}
            height={300}
            className="size-20 shrink-0 rounded-full object-cover md:size-auto md:w-full md:rounded-xl"
          />
          <div>
            <h2 className="font-bold">Rajendra Aurelius Ritmanto</h2>
            <h2 className="font-bold md:mb-4">Software Engineer</h2>
          </div>
        </Link>
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:flex-col">
          <div className="flex items-center gap-2">
            <Image
              src={github}
              alt="github logo"
              priority
              width={20}
              className="dark:invert"
            />
            <a
              href="https://github.com/raoulius"
              className="hover:text-blue-500"
            >
              Github
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Image src={linkedin} alt="linkedin logo" priority width={20} />
            <a
              href="https://www.linkedin.com/in/rajendra-aurelius-3406a1217/"
              className="hover:text-blue-500"
            >
              LinkedIn
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={resumeIcon}
              alt="resume icon"
              priority
              width={20}
              className="dark:invert"
            />
            <a href="/resume" target="_blank" className="hover:text-blue-500">
              Resume
            </a>
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleEmailClick}
          >
            <Image
              src={emailIcon}
              alt="email icon"
              priority
              width={20}
              className="dark:invert"
            />
            <span className="group-hover:text-blue-500">
              {copied ? "Copied!" : "rritmanto@gmail.com"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NotebookPen size={20} aria-hidden />
            <Link href="/blog" className="hover:text-blue-500">
              Blogs
            </Link>
          </div>
          <button
            type="button"
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="w-fit cursor-pointer hover:text-blue-500"
          >
            <Contrast size={20} />
          </button>
        </div>
      </nav>
      {/* pinned to the bottom of the full-height sidebar on desktop */}
      <Link
        href="/admin"
        aria-label="Admin"
        title="Admin"
        className="mt-4 w-fit hover:text-blue-500 md:mt-auto md:pt-4"
      >
        <LockKeyhole size={20} aria-hidden />
      </Link>
    </aside>
  );
}
