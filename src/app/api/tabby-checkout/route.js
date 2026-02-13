import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const payload = await req.json(); // your checkoutPayload

    const response = await axios.post(
      "https://api.tabby.ai/api/v2/checkout",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_SECRET_TABBY_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({
  success: true,
  data: response.data
});
  } catch (error) {

  return NextResponse.json(
    {
      success: false,
      error: error.response?.data || error.message
    },
    { status: 500 }
  );
}

}

