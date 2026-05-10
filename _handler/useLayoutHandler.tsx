'use client'
import { useState } from 'react'

export default function useLayoutHandler() {
    const [copied, setCopied] = useState(false);

    const handleEmailClick = async () => {
        try {
            await navigator.clipboard.writeText('rritmanto@gmail.com');
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return {
        handleEmailClick,
        setCopied,
        copied,
    }
}