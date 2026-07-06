import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { imageBase64 } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image in detail and return ONLY a valid JSON object with no extra text or markdown:
{
  "title": "short 4-6 word title of the image",
  "description": "Write 3-4 detailed sentences describing everything visible in the image including colors, objects, background, lighting, mood, and style. Be thorough and descriptive.",
  "category": "what type of image this is (e.g. Product Photography, Nature, Portrait, Architecture, etc.)",
  "dominantColors": ["color1", "color2", "color3"],
  "labels": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "possibleMisuse": true or false,
  "misuseReason": "if possibleMisuse is true explain why, otherwise empty string",
  "usageRisk": "Low or Medium or High",
  "detectedText": "any text visible in image or None detected"
}`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  });

  const data = await res.json();
  const raw = data.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse AI response" },
      { status: 500 }
    );
  }
}