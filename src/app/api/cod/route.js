
import axios from "axios";
import { getServerSession } from "next-auth/next"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { COD_ORDER, codPayload, token } = req.body;

  try {
    // Send the request to create a COD order on the server side
    const response = await axios.post(
      COD_ORDER,
      codPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response was successful
    if (response.data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: response.data.error });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return res.status(500).json({ success: false, error: "Server error during checkout." });
  }
}
