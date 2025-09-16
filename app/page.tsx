import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  try {
    const supabase = await createClient()
    const currentDate = new Date().toISOString()
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .gte("event_date", currentDate)
      .order("event_date", { ascending: true })

    if (error) {
      console.error("Supabase query error:", error)
      return (
        <div className="min-h-screen relative">
          {/* Blurred Background using the 90s logo - Much darker and more subtle */}
          <div className="fixed left-[-5vw] top-[-5vh] w-[110vw] h-[110dvh] bg-[url('/images/90s-logo-bg.png')] bg-cover bg-center bg-no-repeat blur-[80px] opacity-10 z-[-1]"></div>

          {/* Dark overlay to make it even more subtle */}
          <div className="fixed inset-0 bg-black/30 z-[-1]"></div>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-center bg-black/80 backdrop-blur-sm rounded-lg p-8">
              <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
              <p>We're preparing something amazing for you!</p>
            </div>
          </div>
        </div>
      )
    }

    if (!events || events.length === 0) {
      return (
        <div className="min-h-screen relative">
          {/* Blurred Background using the 90s logo - Much darker and more subtle */}
          <div className="fixed left-[-5vw] top-[-5vh] w-[110vw] h-[110dvh] bg-[url('/images/90s-logo-bg.png')] bg-cover bg-center bg-no-repeat blur-[80px] opacity-10 z-[-1]"></div>

          {/* Dark overlay to make it even more subtle */}
          <div className="fixed inset-0 bg-black/60 z-[-1]"></div>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-center bg-black/80 backdrop-blur-sm rounded-lg p-8">
              <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
              <p>New events will be announced soon!</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen relative">
        {/* Blurred Background using the 90s logo - Much darker and more subtle */}
        <div className="fixed left-[-5vw] top-[-5vh] w-[110vw] h-[110dvh] bg-[url('/images/90s-logo-bg.png')] bg-cover bg-center bg-no-repeat blur-[40px] opacity-90 z-[-1]"></div>

        {/* Dark overlay to make it even more subtle */}
        <div className="fixed inset-0 bg-black/75 z-[-1]"></div>

        {/* Main Content */}
        <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-purple-800/20 to-pink-800/0">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl md:text-4xl font-bold text-white">Events</h1>
            </div>

            {/* Events List */}
            <div className="max-w-6xl mx-auto space-y-3 md:space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-black/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8"
                >
                  {/* Event Image - height fit content */}
                  <div className="relative w-full md:w-48 lg:w-56 h-auto flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden">
                    <Image
                      src={event.logo_image_url || "/images/90s-event-new-bg.png"}
                      alt={`${event.title} Logo`}
                      width={400}
                      height={200}
                      className="object-cover w-full h-auto"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs md:text-sm text-purple-200 mb-1">
                      {new Date(event.event_date)
                        .toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                        })
                        .toUpperCase()}
                    </div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 line-clamp-2">
                      {event.title}
                    </h2>
                    <p className="text-purple-200 text-xs md:text-sm uppercase tracking-wide">{event.location}</p>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0 w-full md:w-auto">
                    <Link href={event.external_link ? event.external_link : `/${event.slug}`}>
                      <Button
                        size="lg"
                        className="w-full md:w-auto bg-white hover:bg-gray-100 text-black font-bold px-6 md:px-8 py-2 md:py-3 rounded-full text-xs md:text-sm uppercase tracking-wide min-w-[120px] md:min-w-[140px]"
                      >
                        {event.button_text}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Homepage error:", error)
    return (
      <div className="min-h-screen relative">
        {/* Blurred Background using the 90s logo - Much darker and more subtle */}
        <div className="fixed left-[-5vw] top-[-5vh] w-[110vw] h-[110dvh] bg-[url('/images/90s-logo-bg.png')] bg-cover bg-center bg-no-repeat blur-[80px] opacity-10 z-[-1]"></div>

        {/* Dark overlay to make it even more subtle */}
        <div className="fixed inset-0 bg-black/60 z-[-1]"></div>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-center bg-black/80 backdrop-blur-sm rounded-lg p-8">
            <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
            <p>We're preparing something amazing for you!</p>
          </div>
        </div>
      </div>
    )
  }
}
