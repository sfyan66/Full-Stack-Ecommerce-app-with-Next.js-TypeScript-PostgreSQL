/*const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

async function generateAccessToken() {
  const { PAYPAL_APP_SECRET, PAYPAL_CLIENT_ID } = process.env;
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString(
    "base64"
  );

  const respons = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const jsonData = await handleResponse(respons);
  return jsonData.access_token;
}

async function handleResponse(respons: Response) {
  if (respons.ok) {
    return respons.json();
  } else {
    const errorMessage = await respons.text();
    throw new Error(errorMessage);
  }
}

export { generateAccessToken };*/
