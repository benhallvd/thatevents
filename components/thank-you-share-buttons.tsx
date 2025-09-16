"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram } from "lucide-react"
import type { Event } from "@/lib/supabase/types"

interface ThankYouShareButtonsProps {
  event: Event
  signupUrl: string
  shareText: string
}

export default function ThankYouShareButtons({ event, signupUrl, shareText }: ThankYouShareButtonsProps) {
  return (
    <>
      {/* Social Media Buttons */}
      {(event.facebook_url || event.instagram_url) && (
        <div className="pt-2">
          <div className="flex gap-3">
            {event.facebook_url && (
              <Link href={event.facebook_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-md text-xs uppercase tracking-wide h-12 flex items-center justify-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
              </Link>
            )}
            {event.instagram_url && (
              <Link href={event.instagram_url} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 px-4 rounded-md text-xs uppercase tracking-wide h-12 flex items-center justify-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
