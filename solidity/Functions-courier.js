const crypto = require("crypto");

const sendToEmail = args[0];
const inviteAccepLinkPrefix = args[1];
const timestamp = args[2];

if (!sendToEmail) {
  throw new Error("No email provided.");
}

if (!inviteAccepLinkPrefix) {
  throw new Error("No invite link provided.");
}

const encryptedInvite = generateEncryptedString(
  `${generateStringUsingTs(timestamp)}/${sendToEmail}/${secrets.secretKey}`
);
const inviteHash = generateHash(encryptedInvite);

if (secrets.courierApiKey) {
  const inviteLink = `${inviteAccepLinkPrefix}&code=${encryptedInvite}`;
  await sendEmail(sendToEmail, inviteLink);
}

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding
return Functions.encodeString(inviteHash);

// ====================
// Helper Functions
// ====================

// Function to generate encrypted string using nodejs crypto
// Reference: https://stackoverflow.com/a/67824801/12027569
function generateEncryptedString(data) {
  // crypto module

  const algorithm = "aes-256-cbc";

  // generate 16 bytes of random data
  const initVector = Buffer.alloc(16, 0);

  // secret key generate 32 bytes of random data
  const Securitykey = Buffer.alloc(32, 0);

  // the cipher function
  const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);

  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(data, "utf-8", "hex");

  encryptedData += cipher.final("hex");
  return encryptedData;
}

// Function to generate hash using nodejs crypto
function generateHash(data) {
  return crypto.createHash("ripemd160").update(data).digest("base64");
}

function generateStringUsingTs(timestamp) {
  const ts = String(timestamp);
  let out = "";
  for (let i = 0; i < ts.length; i += 2) {
    out += Number(ts.substring(i, 2)).toString(36);
  }
  return out;
}

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
