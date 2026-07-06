import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  const formData = new URLSearchParams();
  formData.append("image", imageBase64);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return NextResponse.json({ url: data.data.url });
}