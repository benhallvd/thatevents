// Utility function to hash data for Meta Pixel
export async function hashData(data: string): Promise<string> {
  if (typeof window === "undefined") return ""

  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data.toLowerCase().trim())
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

// Format phone number for Meta (remove spaces, dashes, etc.)
export function formatPhoneForMeta(phone: string): string {
  return phone.replace(/\D/g, "")
}
