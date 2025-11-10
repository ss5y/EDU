"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function AiPlatformHelper() {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: isAr
        ? "مرحباً 👋 أنا المساعد الذكي لمنصّة EDU Smart.\nاسألني عن المنصّة، لوحة الطالب أو المعلم، أو كيف تبدأ أول كورس."
        : "Hi 👋 I'm the smart assistant for EDU Smart.\nAsk me about the platform, how to use the student/teacher dashboards, or how to start your first course.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setError(null);

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: isAr
                ? "أنت مساعد ذكي لمنصّة تعليمية جامعية اسمها EDU Smart. تشرح المنصّة، لوحة الطالب، لوحة المعلّم، والخصائص مثل الكورسات، التقدّم، الذكاء الاصطناعي في الكورسات، بطريقة بسيطة ومختصرة، وباللغة العربية الفصحى مع لهجة عُمانية خفيفة إن أمكن."
                : "You are a helpful AI assistant for a university learning platform called EDU Smart. Explain the platform, student dashboard, teacher dashboard, and features like courses, progress tracking, and AI-based learning in a simple, friendly way.",
            },
            ...newMessages,
          ],
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("AI error:", data);
        throw new Error(data?.error || "AI error");
      }

      const data = await res.json();
      const replyText: string =
        data?.reply ||
        (isAr
          ? "حدث خطأ غير متوقع، حاول مرة أخرى بعد قليل."
          : "Unexpected error, please try again.");

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: replyText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI error:", err);
      setError(
        isAr
          ? "تعذر الاتصال بالمساعد الذكي، تأكد من إعدادات API أو حاول لاحقاً."
          : "Failed to reach the AI assistant. Check API settings or try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  return (
    <>
      {/* 🔘 زر عائم في أسفل اليمين */}
      <button
        type="button"
        onClick={toggleOpen}
        className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:shadow-xl ${
          isAr ? "rtl" : ""
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* 🪟 صندوق الدردشة – ثابت في أسفل اليمين بدون أنيميشن */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-full max-w-md">
          <Card className="shadow-2xl border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {isAr ? "المساعد الذكي لـ EDU Smart" : "EDU Smart Assistant"}
                  </CardTitle>
                  <p className="text-[11px] text-muted-foreground">
                    {isAr
                      ? "اسأل عن المنصّة، لوحة الطالب أو المعلّم، أو طريقة استخدام الكورسات."
                      : "Ask about the platform, student/teacher dashboards, or how to use courses."}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleOpen}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* 👇 الرسائل */}
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border bg-muted/40 p-2 text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      m.role === "user"
                        ? isAr
                          ? "justify-start"
                          : "justify-end"
                        : isAr
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`whitespace-pre-wrap rounded-lg px-3 py-2 ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-background border text-foreground"
                      } max-w-[90%]`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div
                    className={`flex ${
                      isAr ? "justify-end" : "justify-start"
                    } text-xs text-muted-foreground`}
                  >
                    <div className="flex items-center gap-2 rounded-lg bg-background px-3 py-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>{isAr ? "يجري التفكير..." : "Thinking..."}</span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-[11px] text-destructive whitespace-pre-wrap">
                  {error}
                </p>
              )}

              {/* ✏️ الإدخال */}
              <div className="flex items-end gap-2">
                <Textarea
                  className="min-h-[50px] text-xs"
                  placeholder={
                    isAr
                      ? "مثال: كيف أستخدم لوحة الطالب؟ أو: ما هي مميزات منصة EDU Smart؟"
                      : "Example: How do I use the student dashboard? Or: What are EDU Smart features?"
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  size="icon"
                  disabled={!input.trim() || isSending}
                  onClick={handleSend}
                  className="mb-1 h-9 w-9"
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
