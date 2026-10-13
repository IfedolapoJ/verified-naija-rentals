import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  PenNib,
  Check,
  X,
  Bank,
  SealCheck,
  ArrowRight,
  FileText,
  Fingerprint,
} from "@phosphor-icons/react";
import {
  L,
  uid,
  formatNaira,
  priceBreakdown,
  makeEscrowSteps,
  TENANCY_CLAUSES,
  type Lang,
  type PropertyListing,
  type EscrowStep,
} from "@/data";

interface EscrowProps {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  listing: PropertyListing | null;
  onComplete: (title: string, amount: number) => void;
}

const OTP = "4029";

export default function EscrowAndAgreementModal({
  lang,
  open,
  onClose,
  listing,
  onComplete,
}: EscrowProps) {
  const [phase, setPhase] = useState<"terms" | "vault" | "checkin" | "done">("terms");
  const [steps, setSteps] = useState<EscrowStep[]>(makeEscrowSteps());
  const [signed, setSigned] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const bd = listing ? priceBreakdown(listing) : null;

  useEffect(() => {
    if (open) {
      setPhase("terms");
      setSteps(makeEscrowSteps());
      setSigned(false);
      setOtp("");
      setOtpErr(false);
    }
  }, [open]);

  // Signature pad
  useEffect(() => {
    if (!open || phase !== "terms") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#064e3b";
  }, [open, phase]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    const { x, y } = pos(e);
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const { x, y } = pos(e);
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setSigned(true);
  };
  const end = () => {
    drawing.current = false;
  };
  const clearSig = () => {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (c && ctx) ctx.clearRect(0, 0, c.width, c.height);
    setSigned(false);
  };

  const advanceStep = (key: string) => {
    setSteps((s) => s.map((st) => (st.key === key ? { ...st, done: true } : st)));
  };

  const fundVault = () => {
    advanceStep("funded");
    setPhase("vault");
    setTimeout(() => advanceStep("accepted"), 1200);
  };

  const goCheckin = () => {
    advanceStep("checkin");
    setPhase("checkin");
  };

  const submitOtp = () => {
    if (otp.trim() === OTP) {
      advanceStep("confirm");
      advanceStep("released");
      setPhase("done");
      if (listing) onComplete(listing.title, bd?.total ?? 0);
    } else {
      setOtpErr(true);
      setTimeout(() => setOtpErr(false), 1500);
    }
  };

  return (
    <AnimatePresence>
      {open && listing && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-[#FAFAF9] shadow-2xl"
          >
            {/* Header */}
            <div className="relative shrink-0 bg-gradient-to-r from-emerald-800 to-emerald-950 px-5 py-4 text-white">
              <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-300" weight="fill" />
                <p className="text-sm font-bold">
                  {L(lang, "Escrow Vault & Tenancy Agreement", "Escrow & Tenancy Agreement")}
                </p>
              </div>
              <p className="mt-1 text-xs text-emerald-100/80">{listing.title}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {phase === "done" ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
                    <SealCheck className="h-11 w-11 text-emerald-600" weight="fill" />
                  </motion.div>
                  <h3 className="mt-4 text-xl font-extrabold text-emerald-950">
                    {L(lang, "Rent released to landlord", "We don release rent give landlord")}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-900/60">
                    {L(lang, "Check-in confirmed. Your payment was only released after you collected the keys.", "You confirm check-in. Na after you collect key dem release the money.")}
                  </p>
                  <div className="mx-auto mt-4 max-w-xs rounded-xl border border-emerald-900/10 bg-white p-4 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-900/60">{L(lang, "Amount released", "Money released")}</span>
                      <span className="font-bold text-emerald-800">{formatNaira(bd?.total ?? 0)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-emerald-900/60">{L(lang, "Transaction ID", "Transaction ID")}</span>
                      <span className="font-mono text-xs text-emerald-800">#{uid()}</span>
                    </div>
                  </div>
                  <button onClick={onClose} className="mt-6 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white transition hover:bg-emerald-900">
                    {L(lang, "Done", "Finish")}
                  </button>
                </motion.div>
              ) : (
                <>
                  {/* Stepper */}
                  <div className="mb-5 space-y-2">
                    {steps.map((s, i) => (
                      <div key={s.key} className="flex items-center gap-3">
                        <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-700"}`}>
                          {s.done ? <Check className="h-4 w-4" weight="bold" /> : i + 1}
                        </div>
                        <span className={`text-sm font-medium ${s.done ? "text-emerald-900" : "text-emerald-900/50"}`}>
                          {L(lang, s.en, s.pidgin)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {phase === "terms" && (
                    <div>
                      <div className="mb-4 rounded-xl border border-emerald-900/10 bg-white p-4">
                        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-950">
                          <FileText className="h-4 w-4 text-emerald-700" weight="fill" />
                          {L(lang, "Tenancy Agreement (Nigerian standard)", "Tenancy Agreement (Nigeria standard)")}
                        </p>
                        <div className="space-y-2">
                          {TENANCY_CLAUSES.map((c, i) => (
                            <p key={i} className="text-xs leading-relaxed text-emerald-900/70">
                              <span className="font-bold text-emerald-700">{i + 1}.</span>{" "}
                              {L(lang, c.en, c.pidgin)}
                            </p>
                          ))}
                        </div>
                      </div>

                      {bd && (
                        <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm">
                          <div className="flex justify-between font-bold text-emerald-900">
                            <span>{L(lang, "Total to lock in escrow", "Total go enter escrow")}</span>
                            <span>{formatNaira(bd.total)}</span>
                          </div>
                        </div>
                      )}

                      {/* Signature */}
                      <div className="rounded-xl border border-emerald-900/15 bg-white p-3">
                        <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-900/60">
                          <PenNib className="h-4 w-4" weight="fill" />
                          {L(lang, "Sign to accept", "Sign make you accept")}
                        </p>
                        <canvas
                          ref={canvasRef}
                          width={520}
                          height={140}
                          onPointerDown={start}
                          onPointerMove={move}
                          onPointerUp={end}
                          onPointerLeave={end}
                          className="h-32 w-full touch-none rounded-lg border border-dashed border-emerald-900/20 bg-emerald-50/30"
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <button onClick={clearSig} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
                            {L(lang, "Clear signature", "Wipe am")}
                          </button>
                          <span className="text-[11px] text-emerald-900/50">{new Date().toLocaleDateString("en-NG")}</span>
                        </div>
                      </div>

                      <button
                        onClick={fundVault}
                        disabled={!signed}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:from-emerald-800 disabled:opacity-40"
                      >
                        <Lock className="h-5 w-5" weight="fill" />
                        {L(lang, "Lock funds in escrow", "Lock money inside escrow")}
                        <ArrowRight className="h-4 w-4" weight="bold" />
                      </button>
                    </div>
                  )}

                  {phase === "vault" && (
                    <div className="text-center">
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-emerald-100">
                        <Bank className="h-12 w-12 text-emerald-700" weight="fill" />
                      </motion.div>
                      <p className="mt-3 text-sm font-bold text-emerald-950">
                        {steps.find((s) => s.key === "accepted")?.done
                          ? L(lang, "Landlord accepted the terms", "Landlord don accept terms")
                          : L(lang, "Funds locked in secure vault", "Money don lock inside vault")}
                      </p>
                      <p className="mx-auto mt-1 max-w-sm text-xs text-emerald-900/60">
                        {L(lang, "Your money is held by Naija Rentals, not the landlord. It is only released after you confirm check-in.", "Your money dey for Naija Rentals, no be landlord hand. Na after you confirm check-in dem go release am.")}
                      </p>
                      <button
                        onClick={goCheckin}
                        disabled={!steps.find((s) => s.key === "accepted")?.done}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-50"
                      >
                        <ShieldCheck className="h-5 w-5" weight="fill" />
                        {L(lang, "I have checked in & collected keys", "I don enter, collect key")}
                      </button>
                    </div>
                  )}

                  {phase === "checkin" && (
                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <Fingerprint className="h-5 w-5 text-emerald-700" weight="fill" />
                        <p className="text-sm font-bold text-emerald-950">
                          {L(lang, "Confirm check-in with OTP", "Confirm check-in with OTP")}
                        </p>
                      </div>
                      <p className="mb-3 text-xs text-emerald-900/60">
                        {L(lang, "We sent a 4-digit code to your verified phone. Enter it to release the escrowed rent.", "We send 4-digit code to your phone. Enter am make we release the rent.")}
                      </p>
                      <div className={`flex justify-center gap-2 ${otpErr ? "animate-pulse" : ""}`}>
                        <input
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          inputMode="numeric"
                          placeholder="••••"
                          className={`w-32 rounded-xl border-2 bg-white px-4 py-3 text-center font-mono text-xl tracking-widest outline-none ${otpErr ? "border-red-400" : "border-emerald-900/15 focus:border-emerald-600"}`}
                        />
                      </div>
                      {otpErr && (
                        <p className="mt-2 text-center text-xs font-semibold text-red-600">
                          {L(lang, "Wrong code. Demo OTP is 4029.", "Code no correct. Demo OTP na 4029.")}
                        </p>
                      )}
                      <button
                        onClick={submitOtp}
                        disabled={otp.length < 4}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 py-3 text-sm font-bold text-white transition hover:from-emerald-800 disabled:opacity-40"
                      >
                        <Check className="h-5 w-5" weight="bold" />
                        {L(lang, "Confirm & release rent", "Confirm, release rent")}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
