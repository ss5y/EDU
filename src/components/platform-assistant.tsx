"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type ChatMessage = {
  from: "user" | "ai";
  text: string;
};

export function PlatformAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          context: "platform", // مساعد للمنصة بشكل عام
        }),
      });

      const data = await res.json();
      const reply =
        data.reply ||
        "لم أستطع فهم سؤالك بشكل كامل، حاول صياغته بطريقة أخرى.";

      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: "حدث خطأ أثناء الاتصال بالمساعد، حاول لاحقاً.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر عائم أسفل يمين */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* صندوق الشات */}
      {open && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[90vw]">
          <Card className="shadow-xl">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">
                مساعد EDU Smart 🤖
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-56 overflow-auto rounded border p-2 text-xs space-y-2 bg-muted/30">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground">
                    اسألني عن استخدام المنصة، التسجيل، الكورسات، أو أي سؤال
                    عام عن EDU Smart.
                  </p>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`max-w-[90%] rounded px-2 py-1 ${
                        m.from === "user"
                          ? "ml-auto bg-primary text-primary-foreground"
                          : "mr-auto bg-muted"
                      }`}
                    >
                      {m.text}
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <Textarea
                  className="text-xs"
                  rows={2}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب سؤالك هنا..."
                />
              </div>
              <Button
                className="w-full"
                size="sm"
                onClick={sendMessage}
                disabled={loading}
              >
                <Send className="ml-1 h-4 w-4" />
                {loading ? "جارٍ الإرسال..." : "إرسال"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
