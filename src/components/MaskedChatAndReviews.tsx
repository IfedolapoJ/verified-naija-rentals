import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatCircle,
  Lock,
  ShieldWarning,
  Star,
  X,
  ArrowRight,
  Check,
  SealCheck,
} from "@phosphor-icons/react";
import {
  L,
  uid,
  type Lang,
  type PropertyListing,
  type ChatMessage,
  type Review,
  QUICK_PROMPTS,
  LANDLORD_REPLIES,
  MASK_WARNING,
} from "@/data";

interface ChatProps {
  lang: Lang;
  chatOpen: boolean;
  setChatOpen: (v: boolean) => void;
  reviewsOpen: boolean;
  setReviewsOpen: (v: boolean) => void;
  listing: PropertyListing | null;
  reviews: Review[];
  onAddReview: (r: Review) => void;
}

const now = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

export default function MaskedChatAndReviews({
  lang,
  chatOpen,
  setChatOpen,
  reviewsOpen,
  setReviewsOpen,
  listing,
  reviews,
  onAddReview,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          from: "landlord",
          text: L(
            lang,
            "Hello! Thanks for your interest. Ask me anything, all chats here are masked & safe.",
            "How far! Thank you for interest. Ask me anything, all chat here na masked & safe."
          ),
          time: now(),
        },
      ]);
    }
  }, [chatOpen, messages.length, lang]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const masked = /\+?\d[\d\s-]{7,}/.test(clean) || /@/.test(clean);
    const safeText = masked
      ? L(lang, "[contact info masked for safety]", "[dem hide contact for safety]")
      : clean;
    setMessages((m) => [
      ...m,
      { id: uid(), from: "tenant", text: safeText, time: now(), masked },
    ]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      const reply =
        LANDLORD_REPLIES[Math.floor(Math.random() * LANDLORD_REPLIES.length)];
      setMessages((m) => [
        ...m,
        { id: uid(), from: "landlord", text: L(lang, reply.en, reply.pidgin), time: now() },
      ]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {/* ===== Masked Chat ===== */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-[#FAFAF9] shadow-2xl sm:h-[600px] sm:rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <ChatCircle className="h-5 w-5 text-amber-300" weight="fill" />
                  <div>
                    <p className="text-sm font-bold">
                      {listing ? listing.title : L(lang, "Landlord Chat", "Chat with Landlord")}
                    </p>
                    <p className="text-[11px] text-emerald-100/80">
                      {L(lang, "Masked & secure conversation", "E hide phone, e dey safe")}
                    </p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 text-[11px] font-medium text-amber-900">
                <ShieldWarning className="h-4 w-4 shrink-0 text-amber-600" weight="fill" />
                {L(lang, MASK_WARNING.en, MASK_WARNING.pidgin)}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.from === "tenant" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                        m.from === "tenant"
                          ? m.masked
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : "bg-emerald-700 text-white"
                          : "bg-white text-emerald-950 ring-1 ring-emerald-900/10"
                      }`}
                    >
                      <p>{m.text}</p>
                      <p
                        className={`mt-1 text-[10px] ${
                          m.from === "tenant" ? "text-emerald-100/70" : "text-emerald-900/40"
                        }`}
                      >
                        {m.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl bg-white px-3 py-2 ring-1 ring-emerald-900/10">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-1.5 w-1.5 rounded-full bg-emerald-700"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="border-t border-emerald-900/10 bg-white px-3 py-2">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((q) => (
                    <button
                      key={q.en}
                      onClick={() => send(L(lang, q.en, q.pidgin))}
                      className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-100"
                    >
                      {L(lang, q.en, q.pidgin)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(draft)}
                    placeholder={L(lang, "Type a message…", "Write message…")}
                    className="flex-1 rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    onClick={() => send(draft)}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-800 text-white transition hover:bg-emerald-900 active:scale-95"
                  >
                    <ArrowRight className="h-5 w-5" weight="bold" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Reviews ===== */}
      <AnimatePresence>
        {reviewsOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewsOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FAFAF9] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-900/10 bg-gradient-to-r from-emerald-800 to-emerald-900 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-300" weight="fill" />
                  <p className="text-sm font-bold">
                    {L(lang, "Two-way Verified Reviews", "Verified Reviews (2-way)")}
                  </p>
                </div>
                <button onClick={() => setReviewsOpen(false)} className="rounded-full p-1 hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {reviews.length === 0 && (
                  <p className="py-8 text-center text-sm text-emerald-900/50">
                    {L(lang, "No reviews yet.", "No review yet.")}
                  </p>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-xl border border-emerald-900/10 bg-white p-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          {r.author.slice(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-emerald-950">{r.author}</p>
                          <p className="text-[11px] text-emerald-900/50">{r.date}</p>
                        </div>
                      </div>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <SealCheck className="h-3 w-3" weight="fill" />
                          {L(lang, "Verified tenancy", "Real tenancy")}
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? "text-amber-500" : "text-emerald-900/15"}`}
                          weight="fill"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-emerald-900/80">{r.text}</p>
                  </div>
                ))}
              </div>

              <ReviewForm lang={lang} onSubmit={(r) => { onAddReview(r); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ReviewForm({ lang, onSubmit }: { lang: Lang; onSubmit: (r: Review) => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSubmit({
      id: uid(),
      author: author.trim() || L(lang, "Anonymous Renter", "Anonymous Renter"),
      rating,
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
      verified: true,
      listingId: "self",
    });
    setText("");
    setAuthor("");
    setRating(5);
  };

  return (
    <div className="border-t border-emerald-900/10 bg-white px-4 py-3">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-900/60">
        {L(lang, "Leave a verified review", "Drop your review")}
      </p>
      <div className="mb-2 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => setRating(i + 1)}>
            <Star
              className={`h-6 w-6 transition ${i < rating ? "text-amber-500" : "text-emerald-900/15"}`}
              weight="fill"
            />
          </button>
        ))}
      </div>
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder={L(lang, "Your name", "Your name")}
        className="mb-2 w-full rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder={L(lang, "How was your escrow-protected tenancy?", "How the escrow tenancy wend?")}
        className="mb-2 w-full resize-none rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <button
        onClick={submit}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900 active:scale-[0.99]"
      >
        <Check className="h-4 w-4" weight="bold" />
        {L(lang, "Submit review", "Send review")}
      </button>
    </div>
  );
}
