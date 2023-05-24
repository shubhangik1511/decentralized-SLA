// This example shows how to make a fetch Artist monthly listener counts and trigger an email if
// the artist is due a payment for every additional 1000 streams.

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
const sendToEmail = args[0]
const inviteLink = args[1]

if (!sendToEmail) {
  throw new Error("No email provided.")
}
if (!inviteLink) {
  throw new Error("No invite link provided.")
}

await sendEmail(sendToEmail, inviteLink)

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding

return Buffer.from("1")

// ====================
// Helper Functions
// ====================

async function sendEmail(email, inviteLink) {
  if (!secrets.courierApiKey) {
    return
  }

  // Structure for POSTING email data to Sendgrid.
  // Reference: https://docs.sendgrid.com/api-reference/mail-send/mail-send
  const emailData = {
    message: {
      to: { email },
      content: {
        title: "Welcome to DSLA",
        body: "Click on the link below to get started. \n\n {{inviteLink}}",
      },
      data: { inviteLink },
    },
  }

  // Build the config object to pass to makeHttpRequest().

  let courierResponse
  try {
    console.log("\nSending email...")
    courierResponse = await Functions.makeHttpRequest({
      url: "https://api.courier.com/send",
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + secrets.courierApiKey },
      data: emailData,
    })

    if (courierResponse.error) {
      throw new Error("Courier API responded with error: " + JSON.stringify(courierResponse.response.data.errors[0]))
    }
  } catch (error) {
    console.log("\nFailed when sending email.")
    throw error
  }

  console.log("\nSent email...")
}
