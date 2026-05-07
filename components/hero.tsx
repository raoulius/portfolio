'use client'
import React from "react";
import Button from "@mui/material/Button";

export default function Hero() {
    return (
        <div className="relative flex flex-col w-full h-100 bg-transparent justify-center rounded-md">
            <div className="flex flex-col w-full text-center justify-center">
                <h1
                    className="flex-1 text-center text-gray-200 text-3xl py-5"
                    style={{ textShadow: '0 0 40px rgba(0,0,0,1), 0 0 80px rgba(0,0,0,0.9)' }}
                >
                    Rajendra Aurelius Ritmanto
                </h1>
                <h2
                    className="flex-2 text-center text-gray-200 text-5xl py-5"
                    style={{ textShadow: '0 0 60px rgba(0,0,0,1), 0 0 120px rgba(0,0,0,0.9)' }}
                >
                    Software Engineer | Computer Engineering Graduate
                </h2>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Button color="secondary" variant="contained">CV</Button>
                </a>
            </div>
        </div>
    )
}