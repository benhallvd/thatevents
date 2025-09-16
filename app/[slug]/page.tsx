import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EventSignupForm from "@/components/event-signup-form"

export default async function EventPage({ params }: { params: { slug: string } }) {
  try {
    const supabase = await createClient()
    const { data: event, error } = await supabase.from("events").select("*").eq("slug", params.slug).single()

    if (error) {
      console.error("Supabase error for slug:", params.slug, error)
      notFound()
    }

    if (!event) {
      console.error("No event found for slug:", params.slug)
      notFound()
    }

    return <EventSignupForm event={event} />
  } catch (error) {
    console.error("EventPage error:", error)
    notFound()
  }
}
