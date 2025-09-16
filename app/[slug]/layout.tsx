import type React from "react"
import Script from "next/script"
import { createClient } from "@/lib/supabase/server"

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const supabase = await createClient()
  const { data: event, error } = await supabase.from("events").select("meta_pixel_id").eq("slug", params.slug).single()

  // Fallback pixel ID for Guildford
  let pixelId = "1911163093064112"

  if (event && !error) {
    pixelId = event.meta_pixel_id
  }

  return (
    <>
      <Script id="meta-pixel-dynamic" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
          
          fbq('set', 'autoConfig', false, '${pixelId}');
          fbq('dataProcessingOptions', []);
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      {children}
    </>
  )
}
