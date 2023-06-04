const apiToCheck = args[0];
const method = args[1];
const path = args[2];
const expectedValue = args[3];

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding

const output = await checkIfApiIsUp(apiToCheck, method);

return Functions.encodeString("" + output);

// ====================
// Helper Functions
// ====================

function getValueFromObject(obj, path) {
  const keys = path.split(".");
  let currentObject = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!currentObject[keys[i]]) {
      return undefined;
    }
    currentObject = currentObject[keys[i]];
  }
  return currentObject;
}

async function checkIfApiIsUp(url, method) {
  try {
    console.log("\nChecking if api is up...");
    const apiCheckResponse = await Functions.makeHttpRequest({ url, method });

    const data = apiCheckResponse.data;

    if (apiCheckResponse.error) {
      throw new Error(
        "API responded with error: " + JSON.stringify(apiCheckResponse.error)
      );
    }
    return getValueFromObject(data, path) === expectedValue ? 1 : 0;
  } catch (error) {
    console.log("\nError when checking if api is up: ", error);
    console.log("\nFailed when sending email.");
    return 0;
  }
}
