const sendToEmail = args[0];
const inviteAcceptLink = args[1];

if (!secrets.courierApiKey) return Functions.encodeString("inviteLink");

if (!sendToEmail) {
  throw new Error("No email provided.");
}

if (!inviteLink) {
  throw new Error("No invite link provided.");
}

// Generates a random string of a given length
// Reference: https://stackoverflow.com/a/1349426/12027569
function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const inviteLink = generateRandomString(10);

await sendEmail(sendToEmail, `${inviteAcceptLink}&link=${inviteLink}`);

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding

return Functions.encodeString(inviteLink);

// ====================
// Helper Functions
// ====================

async function sendEmail(email, inviteLink) {
  if (!secrets.courierApiKey) {
    return;
  }

  // Structure for POSTING email data to Courier.
  const emailData = {
    message: {
      to: { email },
      content: {
        title: "Welcome to DSLA",
        body: "Click on the link below to get started. \n\n {{inviteLink}}",
      },
      data: { inviteLink },
    },
  };

  // Build the config object to pass to makeHttpRequest().

  let courierResponse;
  try {
    console.log("\nSending email...");
    courierResponse = await Functions.makeHttpRequest({
      url: "https://api.courier.com/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + secrets.courierApiKey,
      },
      data: emailData,
    });

    if (courierResponse.error) {
      throw new Error(
        "Courier API responded with error: " +
          JSON.stringify(courierResponse.response.data.errors[0])
      );
    }
  } catch (error) {
    console.log("\nFailed when sending email.");
    throw error;
  }

  console.log("\nSent email...");
}
