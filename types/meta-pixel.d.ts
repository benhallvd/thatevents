declare global {
  interface Window {
    fbq: (action: string, event: string, data?: Record<string, any>) => void
  }
}

export {}
