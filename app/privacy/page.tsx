import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail } from "lucide-react"

export default function PrivacyPage() {
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
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>

          {/* Privacy Content */}
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 md:p-8 space-y-6">
            {/* Marketing Communications */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Marketing Communications</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                By signing up, you agree to receive marketing communications from Epic Bars and Clubs Ltd via email, SMS,
                and WhatsApp. These communications may include event announcements, ticket information, exclusive
                offers, and relevant updates.
              </p>
            </section>

            {/* Data Processing */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Data Processing</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We take your privacy seriously. Your personal data (including your name, email address, and phone
                number, if provided) will be processed securely and will only be used for the purposes of direct
                marketing by Epic Bars and Clubs Ltd.
              </p>
            </section>

            {/* Third Party Sharing */}
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-white">Third Party Sharing</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We do not share your personal information with third parties for their own marketing purposes. You can
                opt out at any time by clicking the unsubscribe link in our emails or replying with STOP to our
                SMS/WhatsApp messages.
              </p>
            </section>

            {/* Contact Information */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-white">Contact Us</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                If you have any questions about how your data is used, please contact us at:
              </p>

              <div className="bg-white/10 rounded-lg p-4 space-y-2">
                <div className="text-white font-medium">Epic Bars and Clubs</div>
                <div className="text-gray-300 text-sm">EPIC BARS AND CLUBS LTD</div>
                <div className="text-gray-300 text-sm">
                  11 Bath Mews
                  <br />
                  Bath Parade
                  <br />
                  Cheltenham
                  <br />
                  GL53 7HL
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:privacy@epicbarsandclubs.com" className="hover:underline">
                    privacy@epicbarsandclubs.com
                  </a>
                </div>
              </div>
            </section>

            {/* Back Button */}
            <div className="pt-4">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-md text-sm uppercase tracking-wide h-12">
                  Back to Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
