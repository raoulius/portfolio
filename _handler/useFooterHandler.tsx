'use client'
import { useState } from 'react'

export default function useFooterHandler() {
    const [copyToClipboard, setCopyToClipboard] = useState(false)
    const emailAddress = "rritmanto@gmail.com"

    const copyEmailToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(emailAddress)
            setCopyToClipboard(true)
            setTimeout(() => setCopyToClipboard(false), 2000)
        } catch (error) {
            console.error('Failed to copy:',error)
        }
    }

    return {
        copyEmailToClipboard,
        copyToClipboard,
        emailAddress,
    }
}