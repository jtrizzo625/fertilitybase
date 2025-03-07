import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Google Form ID from the provided URL
    const formId = "1IAR-Ei7kVy2cLSTRUGzWzGtm2rTHV0rd0mJsh0vL-vI"
    const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`

    // Create form data for submission
    // Note: You'll need to replace 'entry.123456789' with the actual entry ID from your form
    // To find this, inspect the form HTML or check the network tab when submitting the form manually
    const formData = new URLSearchParams()
    formData.append("entry.123456789", email) // Replace with actual entry ID

    // Submit to Google Form
    const response = await fetch(googleFormUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      // This might still face CORS issues with Google Forms
      mode: "no-cors",
    })

    // Log the submission for debugging
    console.log(`Submitted email: ${email} to Google Form`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting to Google Form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}

