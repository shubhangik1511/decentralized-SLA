const slaAddress = args[0];
const firstResponseTimeInHours = args[1];
const zendeskSubdomain = args[2];

// The source code MUST return a Buffer or the request will return an error message
// Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
// - Functions.encodeUint256
// - Functions.encodeInt256
// - Functions.encodeString
// Or return a custom Buffer for a custom byte encoding

const zendeskTicketsAPI = `https://${zendeskSubdomain}.zendesk.com/api/v2/tickets.json`;

const output = await checkTickets(zendeskTicketsAPI, slaAddress);

return Functions.encodeString("" + output);

// ====================
// Helper Functions
// ====================

async function checkTickets(api, slaAddress) {
  try {
    console.log("\nChecking for new tickets...");
    const apiCheckResponse = await Functions.makeHttpRequest({
      url: api,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(secrets.zendeskApiKey).toString("base64"),
      },
    });
    console.log("\napiCheckResponse: ", apiCheckResponse);
    if (!apiCheckResponse) {
      throw new Error("API did not respond.");
    }
    if (apiCheckResponse.error) {
      throw new Error(
        "API responded with error: " + JSON.stringify(apiCheckResponse.error)
      );
    }

    const { data } = apiCheckResponse;

    for (const ticket of data.tickets) {
      const { id, subject, description, status, created_at } = ticket;
      if (description.includes(`@sla:${slaAddress}`)) {
        const createdAtDate = new Date(created_at);
        console.log(
          `\nTicket ${id} - ${subject} - ${description} - ${status} - ${createdAtDate}`
        );
        const hoursSinceCreation = Math.abs(
          (new Date().getTime() - createdAtDate.getTime()) / 36e5
        );

        console.log(
          `\nTicket ${id} was created ${hoursSinceCreation} hours ago`
        );
        console.log(hoursSinceCreation, firstResponseTimeInHours);
        if (
          status === "open" &&
          hoursSinceCreation > parseFloat(firstResponseTimeInHours)
        ) {
          console.log(`\nTicket ${id} has breached SLA`);
          return id;
        }
      }
      return "NA";
    }
  } catch (error) {
    console.log("\nError when tickets: ", error);
    return "NA";
  }
}
