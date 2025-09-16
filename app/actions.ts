"use server"

interface BrevoContact {
  email: string
  attributes: {
    SMS?: string
    WHATSAPP?: string
  }
  listIds: number[]
}

export async function createBrevoContact(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const phoneNumber = formData.get("phoneNumber") as string
  const optIn = formData.get("optIn") === "true"
  const brevoListId = formData.get("brevoListId") as string

  try {
    const brevoApiKey = process.env.BREVO_API_KEY

    if (!brevoApiKey) {
      throw new Error("Brevo API key is not configured.")
    }

    if (!email || !phoneNumber || !optIn || !brevoListId) {
      return { success: false, message: "Missing required fields. Please fill out the form completely." }
    }

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "api-key": brevoApiKey,
    }

    console.log(`Processing signup for email: ${email}`)

    // Step 1: Check if contact exists by email
    const checkResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: "GET",
      headers,
    })

    if (checkResponse.ok) {
      // Contact EXISTS - Add to list workflow
      console.log(`Contact exists: ${email}. Adding to list ${brevoListId}`)

      const existingContact = await checkResponse.json()

      // Add to list
      const addToListResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/${brevoListId}/contacts/add`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          emails: [email],
        }),
      })

      if (addToListResponse.ok) {
        console.log(`Successfully added ${email} to list ${brevoListId}`)

        // Update contact attributes if phone number is different
        const currentSMS = existingContact.attributes?.SMS
        if (currentSMS !== phoneNumber) {
          console.log(`Updating phone number for ${email}`)
          const updateResponse = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
              attributes: {
                SMS: phoneNumber,
                WHATSAPP: phoneNumber,
              },
            }),
          })

          if (!updateResponse.ok) {
            const updateError = await updateResponse.json()
            console.log(`Phone update failed for ${email}:`, updateError.message)
            // Continue anyway - list addition was successful
          }
        }

        return {
          success: true,
          message: "Successfully signed up! You're already registered and have been added to this event.",
          redirect: true,
        }
      } else {
        const addToListError = await addToListResponse.json()
        console.log(`Add to list error for ${email}:`, addToListError)

        // Handle "already in list" case
        if (
          addToListError.message?.includes("already in the list") ||
          addToListError.message?.includes("already exists")
        ) {
          console.log(`${email} already in list ${brevoListId}`)
          return {
            success: true,
            message: "You're already signed up for this event! We'll send you updates soon.",
            redirect: true,
          }
        }

        console.error("Failed to add contact to list:", addToListError)
        return { success: false, message: "Unable to complete signup. Please try again or contact support." }
      }
    } else if (checkResponse.status === 404) {
      // Contact DOES NOT EXIST - Create new contact workflow
      console.log(`Contact does not exist: ${email}. Creating new contact`)

      const contactData = {
        email: email,
        attributes: {
          SMS: phoneNumber,
          WHATSAPP: phoneNumber,
        },
        listIds: [Number(brevoListId)],
      }

      const createResponse = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers,
        body: JSON.stringify(contactData),
      })

      if (createResponse.ok) {
        console.log(`Successfully created new contact: ${email}`)
        return { success: true, message: "Successfully signed up! Welcome to our events.", redirect: true }
      } else {
        const createError = await createResponse.json()
        console.error("Failed to create contact:", createError)

        // Handle SMS conflict during creation
        if (createError.message?.includes("SMS is already associated")) {
          console.log(`SMS conflict for ${email}, creating without SMS`)

          // Try creating without SMS
          const contactDataWithoutSMS = {
            email: email,
            listIds: [Number(brevoListId)],
          }

          const createWithoutSMSResponse = await fetch("https://api.brevo.com/v3/contacts", {
            method: "POST",
            headers,
            body: JSON.stringify(contactDataWithoutSMS),
          })

          if (createWithoutSMSResponse.ok) {
            console.log(`Successfully created contact without SMS: ${email}`)
            return {
              success: true,
              message: "Successfully signed up! (Note: Phone number is associated with another account)",
              redirect: true,
            }
          }
        }

        return {
          success: false,
          message: "Unable to create your account. Please check your details or contact support.",
        }
      }
    } else {
      // Unexpected error during contact check
      const checkError = await checkResponse.json()
      console.error("Unexpected error checking contact:", checkError)
      return { success: false, message: "Unable to verify your account status. Please try again." }
    }
  } catch (error) {
    console.error("Error processing Brevo contact:", error)
    return { success: false, message: "Connection error. Please check your internet and try again." }
  }
}
