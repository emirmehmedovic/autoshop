"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CopyNameButtonProps {
  name: string
}

export function CopyNameButton({ name }: CopyNameButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(name)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex-shrink-0 p-1 rounded transition ${
        copied
          ? "text-green-500 bg-green-50"
          : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
      }`}
      title={copied ? "Kopirano!" : "Kopiraj naziv"}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  )
}
