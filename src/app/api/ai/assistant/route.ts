// src/app/api/ai/assistant/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // تأكيد التشغيل على Node.js

export async function POST(req: Request) {
  try {
    // ✅ 1) تأكد إن المتغيّر موجود
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY is missing on the server");
      return NextResponse.json(
        {
          error: "OPENAI_API_KEY is missing on the server",
        },
        { status: 500 }
      );
    }

    // ✅ 2) أنشئ الـ client هنا (داخل الدالة، مو برا)
    const client = new OpenAI({ apiKey });

    // ✅ 3) اقرأ الـ body الجاي من الواجهة
    const body = await req.json();

    // نتوقع شكل مثل: { messages: [...] }
    const messages = body?.messages;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ No messages provided to AI");
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    // ✅ 4) نرسل الطلب إلى OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      temperature: 0.3,
    });

    const reply =
      completion.choices[0]?.message?.content?.toString() ||
      "لم أستطع توليد إجابة.";

    // ✅ 5) نرجّع الرد للفرونت
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("AI assistant error:", err);
    return NextResponse.json(
      {
        error: "AI error",
        detail: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
