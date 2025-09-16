import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import ThankYouShareButtons from "@/components/thank-you-share-buttons" // Import the new client component

export default async function ThankYouPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { data: event, error } = await supabase.from("events").select("*").eq("slug", params.slug).single()

  if (error || !event) {
    console.error("Supabase error:", error)
    notFound()
  }

  // Create the signup page URL for sharing
  const signupUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com"}/${event.slug}`
  const shareText = `Check out ${event.title}! ${event.description}`

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={event.background_image_url || "/placeholder.svg"}
          alt={`${event.title} Background`}
          fill
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxOAPwCdABmX/9k="
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Thank You Container */}
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 md:p-8 space-y-6 text-center">
            {/* Logo Image */}
            <div className="w-full mb-6 flex justify-center">
              <div className="w-full max-w-sm">
                <Image
                  src={event.logo_image_url || "/placeholder.svg"}
                  alt={`${event.title} Logo`}
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover rounded-xl"
                  priority
                />
              </div>
            </div>

            {/* Thank You Message */}
            <div className="space-y-4">
              <h1 className="md:text-2xl text-white font-extrabold text-2xl">Thank You!</h1>
              <p className="text-gray-300 leading-relaxed md:text-sm text-base">{event.thankyou_description}</p>
            </div>

            {/* Share Buttons (Client Component) */}
            <ThankYouShareButtons event={event} signupUrl={signupUrl} shareText={shareText} />
          </div>
        </div>
      </div>
    </div>
  )
}
