"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

type AiLearningWidgetProps = {
  courseTitle?: string;
  lessonTitle?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function AiLearningWidget({ courseTitle, lessonTitle }: AiLearningWidgetProps) {
  const { language } = useLanguage();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAr = language === "ar";

  const baseContext = `
أنت مساعد تعليمي ذكي داخل منصة جامعية اسمها EDU Smart.
المطلوب أن تشرح للطالب بلغة بسيطة وواضحة، مع أمثلة إن أمكن.
اسم الكورس: ${courseTitle || "كورس جامعي"}
${lessonTitle ? `اسم الدرس: ${lessonTitle}` : ""}
اللغة الأساسية للإجابة: ${isAr ? "العربية" : "English"}.
لا تذكر أنك نموذج لغة أو ذكاء اصطناعي؛ تصرّف كمساعد تعليمي داخل المنصة.
`.trim();

  async function callAssistant(message: string, extraSystemContext?: string) {
    setError(null);
    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          context: extraSystemContext
            ? baseContext + "\n\n" + extraSystemContext
            : baseContext,
        }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      return (data.answer as string) ?? "لم أستطع توليد إجابة الآن.";
    } catch (err) {
      console.error(err);
      setError(isAr ? "حدث خطأ أثناء التواصل مع المساعد." : "Error talking to assistant.");
      return null;
    }
  }

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    const userMessage: ChatMessage = { role: "user", content: question.trim() };
    setMessages((prev) => [...prev, userMessage]);

    const extraContext = isAr
      ? "أجب عن السؤال التالي اعتماداً على فهمك لمحتوى هذا الكورس، واشرح بشكل تدريجي وواضح."
      : "Answer the question as a helpful tutor for this course.";

    const answer = await callAssistant(question.trim(), extraContext);

    if (answer) {
      const assistantMessage: ChatMessage = { role: "assistant", content: answer };
      setMessages((prev) => [...prev, assistantMessage]);
      setQuestion("");
    }

    setIsAsking(false);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);

    const summaryPrompt = isAr
      ? `
ألخص لي الدرس التالي بشكل نقاط واضحة:
- اسم الكورس: ${courseTitle || "غير مذكور"}
- اسم الدرس: ${lessonTitle || "غير محدد"}

أريد:
1) ملخص عام للدرس (3–6 جمل).
2) 3 نقاط رئيسية يتذكرها الطالب.
3) 2 سؤال للمراجعة الذاتية بدون إجابات.
`
      : `
Summarize this lesson for a student:
- Course: ${courseTitle || "N/A"}
- Lesson: ${lessonTitle || "N/A"}

Provide:
1) Short overview (3–6 sentences).
2) 3 key points to remember.
3) 2 self-assessment questions (without answers).
`;

    const answer = await callAssistant(summaryPrompt);

    if (answer) {
      setSummary(answer);
    }

    setIsSummarizing(false);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            {isAr ? "الذكاء التعليمي للمادة" : "AI Learning Assistant"}
          </CardTitle>
          <CardDescription className="text-xs">
            {isAr
              ? "اسأل عن محتوى الكورس أو اطلب ملخصاً للدرس الحالي."
              : "Ask about the course content or request a lesson summary."}
          </CardDescription>
        </div>
        {lessonTitle && (
          <Badge variant="outline" className="mt-2 text-[10px] sm:mt-0">
            {isAr ? "الدرس المحدد:" : "Current lesson:"} {lessonTitle}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* زر تلخيص الدرس */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleSummarize}
            disabled={isSummarizing}
          >
            {isSummarizing && <Loader2 className="ms-1 h-4 w-4 animate-spin" />}
            {!isSummarizing && <Sparkles className="ms-1 h-4 w-4" />}
            {isAr ? "تلخيص الدرس الحالي" : "Summarize this lesson"}
          </Button>
          <span className="text-[11px] text-muted-foreground">
            {isAr
              ? "اختر درس من فوق ثم اطلب تلخيصه."
              : "Select a lesson above then summarize it."}
          </span>
        </div>

        {/* عرض الملخص لو موجود */}
        {summary && (
          <div className="rounded-md border bg-muted/40 p-3 text-xs whitespace-pre-wrap">
            {summary}
          </div>
        )}

        {/* صندوق المحادثة */}
        <div className="space-y-2">
          <label className="text-xs font-semibold flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {isAr ? "اسأل المساعد عن هذا الكورس" : "Ask the assistant about this course"}
          </label>
          <Textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              isAr
                ? "مثال: اشرح لي هذا الدرس بلغة بسيطة…"
                : "Example: Explain this lesson in simple terms..."
            }
          />
          <div className="flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleAsk}
              disabled={isAsking || !question.trim()}
            >
              {isAsking && <Loader2 className="ms-1 h-4 w-4 animate-spin" />}
              {!isAsking && <MessageCircle className="ms-1 h-4 w-4" />}
              {isAr ? "إرسال السؤال" : "Ask"}
            </Button>
          </div>
        </div>

        {/* سجل المحادثة */}
        {messages.length > 0 && (
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-md border p-2 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user"
                    ? "ms-auto max-w-[80%] rounded-md bg-primary/10 px-2 py-1"
                    : "me-auto max-w-[80%] rounded-md bg-muted px-2 py-1"
                }
              >
                <div className="mb-0.5 text-[10px] font-semibold text-muted-foreground">
                  {m.role === "user"
                    ? isAr ? "أنت" : "You"
                    : isAr ? "المساعد" : "Assistant"}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-[11px] text-destructive mt-1">
            {error}
          </p>
        )}
      </CardContent>

      <CardFooter className="text-[10px] text-muted-foreground">
        {isAr
          ? "المساعد يستخدم الذكاء الاصطناعي لمساعدتك، فتأكد دائماً من مراجعة ملاحظاتك ومحاضراتك."
          : "The assistant uses AI to help you; always double-check with your own notes."}
      </CardFooter>
    </Card>
  );
}
