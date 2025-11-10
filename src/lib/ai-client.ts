export type AiMode = "platform" | "course";

export type AiResult = {
  ok: boolean;
  reply: string;
  raw?: any;
};

export async function callAssistant(
  message: string,
  mode: AiMode = "platform",
  courseContext?: string
): Promise<AiResult> {
  const text = message.trim();
  if (!text) {
    return {
      ok: false,
      reply: "الرجاء كتابة سؤالك أولاً.",
    };
  }

  try {
    const res = await fetch("/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        mode,
        courseContext,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("AI error response:", data);

      const msg =
        data?.message ||
        data?.error ||
        "واجهنا مشكلة أثناء الاتصال بالمساعد الذكي، تأكد من إعداد مفتاح الـ API أو حاول لاحقاً.";

      return { ok: false, reply: msg, raw: data };
    }

    return {
      ok: true,
      reply: (data.reply as string) || "لم أستطع توليد إجابة الآن.",
      raw: data,
    };
  } catch (e) {
    console.error("AI fetch error:", e);
    return {
      ok: false,
      reply:
        "تعذر الاتصال بالخادم حالياً. تأكد أن السيرفر شغال (npm run dev) ثم حاول مرة أخرى.",
      raw: e,
    };
  }
}
