"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { MdSend } from "react-icons/md";

const API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000/api/chat/";

type Msg = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function Chatbot() {
  const [active, setActive] = useState(false);
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Build the string format expected by your FastAPI backend
  const historyForBackend = useMemo(() => {
    if (!history.length) return "";
    // Convert our Msg[] to the "[USER] ... [/USER]\n[BOT] ... [/BOT]" format
    return history
      .map((m) =>
        m.role === "user"
          ? `[USER] ${m.content} [/USER]`
          : m.role === "assistant"
          ? `[BOT] ${m.content} [/BOT]`
          : ""
      )
      .filter(Boolean)
      .join("\n");
  }, [history]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    setInput("");

    // Add user message optimistically
    setHistory((h) => [...h, { role: "user", content: text }]);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system:
            " You are a helpful assistant. Keep replies concise and friendly.",
          history: historyForBackend,
          user: text,
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${body}`);
      }

      const data = (await res.json()) as { reply: string };
      setHistory((h) => [...h, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      // Add a visible assistant error bubble
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content: "(Sorry, I couldn’t reply. Please try again.)",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div
        onClick={() => setActive(true)}
        className=" flex  items-center justify-center rounded-full text-white w-[52px] h-[52px] bg-[#4490CC]"
      >
        <IoIosChatbubbles size={30} />
      </div>

      <div
        className={`w-[270px] h-[413px] mr-[30px] mb-[60px]  scale-125 rounded-[20px] bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900 ${
          active === true ? "" : "hidden"
        }`}
      >
        {/* Content */}
        <div className="">
          {/* Chat window */}
          <section className="p-4">
            <button
              onClick={() => setActive(false)}
              className="absolute top-2 right-4 text-black font-[1000]"
            >
              ✕
            </button>
            <div className="h-[320px] overflow-y-auto mt-4 pr-1 space-y-4">
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] w-full rounded-2xl p-2 m-2 shadow-sm border text-[12px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "bg-[#E5E5E5] " : "bg-[#BBDAF3] "
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl shadow-sm border p-2 m-2 w-full bg-white text-slate-500 border-slate-200 text-sm">
                    typing…
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            {/* Composer */}
            <form onSubmit={sendMessage} className="mt-4 flex items-center ">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-xl border border-slate-300 text-[12px] p-3 focus:outline-none "
              />
              <div className="fixed right-2">
                <button
                  disabled={loading || !input.trim()}
                  className="w-[52px] h-[52px] flex items-center justify-center  rounded-full bg-[#4490CC] text-white  active:scale-[.99]"
                >
                  <MdSend size={30} />
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
