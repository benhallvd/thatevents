import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/90s-concert-bg.png"
          alt="90s Event Concert Background"
          fill
          className="object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 md:p-8 space-y-6">
            <div className="w-full mb-6 flex justify-center">
              <Image
                src="/images/90s-event-new-bg.png"
                alt="That 90's Event Logo"
                width={300}
                height={150}
                className="w-full max-w-xs h-auto object-cover rounded-xl"
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
              <p className="text-gray-300">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
            </div>

            <Link href="/">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md text-sm uppercase tracking-wide h-12">
                Back to Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
