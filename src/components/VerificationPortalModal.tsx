import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IdentificationCard,
  Fingerprint,
  Camera,
  UploadSimple,
  SealCheck,
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  FileText,
  Sparkle,
} from "@phosphor-icons/react";
import { L, type Lang } from "@/data";

interface VerifyProps {
  lang: Lang;
  open: boolean;
  onClose: () => void;
  onVerified: (tier: number) => void;
}

type Role = "renter" | "landlord";

export default function VerificationPortalModal({
  lang,
  open,
  onClose,
  onVerified,
}: VerifyProps) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>("renter");
  const [idType, setIdType] = useState<"NIN" | "BVN">("NIN");
  const [idNumber, setIdNumber] = useState("");
  const [checking, setChecking] = useState(false);
  const [idOk, setIdOk] = useState(false);
  const [selfieOk, setSelfieOk] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(0);
    setIdOk(false);
    setSelfieOk(false);
    setDocs([]);
    setDone(false);
    setIdNumber("");
    setCapturing(false);
    setChecking(false);
  };

  const tier = role === "landlord" ? 3 : 2;

  const runIdCheck = () => {
    if (idNumber.replace(/\D/g, "").length < 8) return;
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setIdOk(true);
    }, 1300);
  };

  const runSelfie = () => {
    setCapturing(true);
    setTimeout(() => {
      setCapturing(false);
      setSelfieOk(true);
    }, 1600);
  };

  const addDoc = (name: string) => {
    if (!docs.includes(name)) setDocs((d) => [...d, name]);
  };

  const canNext =
    (step === 0 && role && true) || (step === 1 && idOk) || (step === 2 && selfieOk) || (step === 3 && (role === "renter" || docs.length > 0));

  const finish = () => {
    setDone(true);
    onVerified(tier);
  };

  const steps = [
    { en: "Who are you?", pidgin: "Who be you?" },
    { en: "NIN / BVN check", pidgin: "Check NIN / BVN" },
    { en: "Live selfie", pidgin: "Take selfie now" },
    { en: "Documents", pidgin: "Upload papers" },
  ];

  return (
    <AnimatePresence>
      {open && (
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
            className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-[#FAFAF9] shadow-2xl"
          >
            {/* Header */}
            <div className="relative shrink-0 bg-gradient-to-r from-emerald-800 to-emerald-950 px-5 py-4 text-white">
              <button onClick={onClose} className="absolute right-3 top-3 rounded-full p-1 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-300" weight="fill" />
                <p className="text-sm font-bold">
                  {L(lang, "Identity & Verification Portal", "Identity & Verification")}
                </p>
              </div>
              {!done && (
                <div className="mt-3 flex items-center gap-1.5">
                  {steps.map((s, i) => (
                    <div key={s.en} className="flex flex-1 flex-col gap-1">
                      <div
                        className={`h-1.5 rounded-full transition-all ${
                          i <= step ? "bg-amber-400" : "bg-white/20"
                        }`}
                      />
                      <span className="text-[9px] font-medium text-emerald-100/70">
                        {L(lang, s.en, s.pidgin)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {done ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100"
                  >
                    <SealCheck className="h-11 w-11 text-emerald-600" weight="fill" />
                  </motion.div>
                  <h3 className="mt-4 text-xl font-extrabold text-emerald-950">
                    {L(lang, "You're verified!", "You don verify!") }
                  </h3>
                  <p className="mt-1 text-sm text-emerald-900/60">
                    {L(
                      lang,
                      "Your public trust badge is now live on all interactions.",
                      "Your trust badge dey show for everybody now."
                    )}
                  </p>
                  <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-emerald-900 px-4 py-2 text-sm font-bold text-amber-200 shadow-lg">
                    <Sparkle className="h-4 w-4" weight="fill" />
                    Tier-{tier} {role === "landlord" ? L(lang, "Verified Landlord", "Verified Landlord") : L(lang, "Verified Renter", "Verified Renter")}
                  </div>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white transition hover:bg-emerald-900"
                  >
                    {L(lang, "Done", "Finish")}
                  </button>
                </motion.div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 0 && (
                      <div>
                        <p className="mb-3 text-sm font-bold text-emerald-950">
                          {L(lang, "Select your role", "Choose wetin you be")}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          {(["renter", "landlord"] as Role[]).map((r) => (
                            <button
                              key={r}
                              onClick={() => setRole(r)}
                              className={`rounded-xl border-2 p-4 text-left transition ${
                                role === r
                                  ? "border-emerald-700 bg-emerald-50"
                                  : "border-emerald-900/10 bg-white hover:border-emerald-300"
                              }`}
                            >
                              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
                                {r === "renter" ? <IdentificationCard className="h-5 w-5" weight="fill" /> : <FileText className="h-5 w-5" weight="fill" />}
                              </div>
                              <p className="mt-2 font-bold capitalize text-emerald-950">
                                {r === "renter"
                                  ? L(lang, "I'm renting", "I wan rent")
                                  : L(lang, "I'm a landlord", "I be landlord")}
                              </p>
                              <p className="text-xs text-emerald-900/60">
                                {L(lang, r === "renter" ? "Find a safe home" : "List & let property", r === "renter" ? "Find safe house" : "Post your house")}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <Fingerprint className="h-5 w-5 text-emerald-700" weight="fill" />
                          <p className="text-sm font-bold text-emerald-950">
                            {L(lang, "Enter your NIN or BVN", "Enter your NIN or BVN")}
                          </p>
                        </div>
                        <div className="mb-3 inline-flex rounded-lg bg-emerald-100 p-1">
                          {(["NIN", "BVN"] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setIdType(t)}
                              className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
                                idType === t ? "bg-white text-emerald-800 shadow-sm" : "text-emerald-700/60"
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        <input
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          inputMode="numeric"
                          placeholder={`Enter 11-digit ${idType}`}
                          className="w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <button
                          onClick={runIdCheck}
                          disabled={checking || idOk}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60"
                        >
                          {checking ? (
                            <>
                              <motion.span
                                className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                              />
                              {L(lang, "Biometric lookup…", "We dey check biometrics…")}
                            </>
                          ) : idOk ? (
                            <>
                              <Check className="h-4 w-4" weight="bold" />
                              {L(lang, `${idType} verified`, `${idType} don verify`)}
                            </>
                          ) : (
                            L(lang, "Run verification", "Check am now")
                          )}
                        </button>
                        {idOk && (
                          <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <SealCheck className="h-4 w-4" weight="fill" />
                            {L(lang, "Identity matches NIMC records.", "Identity match NIMC record.")}
                          </p>
                        )}
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <Camera className="h-5 w-5 text-emerald-700" weight="fill" />
                          <p className="text-sm font-bold text-emerald-950">
                            {L(lang, "Live selfie & liveness check", "Take selfie now (liveness)")}
                          </p>
                        </div>
                        <div className="relative mx-auto grid h-52 w-52 place-items-center overflow-hidden rounded-2xl bg-emerald-950">
                          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #34d399 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                          {capturing && (
                            <motion.div
                              className="absolute left-0 right-0 h-1 bg-amber-400 shadow-[0_0_12px_#fbbf24]"
                              animate={{ top: ["8%", "88%", "8%"] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          )}
                          <div className={`grid h-32 w-32 place-items-center rounded-full border-4 ${selfieOk ? "border-emerald-400 bg-emerald-400/20" : "border-white/30 bg-white/5"}`}>
                            {selfieOk ? (
                              <Check className="h-12 w-12 text-emerald-300" weight="bold" />
                            ) : (
                              <Camera className="h-10 w-10 text-white/40" />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={runSelfie}
                          disabled={capturing || selfieOk}
                          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 py-3 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:opacity-60"
                        >
                          {capturing
                            ? L(lang, "Detecting liveness…", "E dey check say na you…")
                            : selfieOk
                            ? L(lang, "Liveness confirmed", "E confirm say na you")
                            : L(lang, "Capture selfie", "Snap selfie")}
                        </button>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <UploadSimple className="h-5 w-5 text-emerald-700" weight="fill" />
                          <p className="text-sm font-bold text-emerald-950">
                            {role === "landlord"
                              ? L(lang, "Upload authority-to-let documents", "Upload your house papers")
                              : L(lang, "Optional: proof of address", "Optional: address paper")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {[
                            "Certificate of Occupancy (C of O)",
                            "Deed of Assignment",
                            "Governor's Consent",
                            "Utility Bill (last 3 months)",
                          ].map((d) => (
                            <button
                              key={d}
                              onClick={() => addDoc(d)}
                              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                                docs.includes(d)
                                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                                  : "border-emerald-900/10 bg-white text-emerald-900 hover:border-emerald-300"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <FileText className="h-4 w-4" weight="fill" />
                                {d}
                              </span>
                              {docs.includes(d) ? (
                                <Check className="h-5 w-5 text-emerald-600" weight="bold" />
                              ) : (
                                <UploadSimple className="h-5 w-5 text-emerald-400" />
                              )}
                            </button>
                          ))}
                        </div>
                        {role === "renter" && (
                          <p className="mt-3 text-xs text-emerald-900/50">
                            {L(lang, "You can skip this step as a renter.", "You fit skip this as renter.")}
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Footer nav */}
            {!done && (
              <div className="flex shrink-0 gap-3 border-t border-emerald-900/10 bg-white px-5 py-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-xl border border-emerald-900/15 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                  >
                    {L(lang, "Back", "Go back")}
                  </button>
                )}
                <button
                  onClick={() => (step === 3 ? finish() : setStep((s) => s + 1))}
                  disabled={!canNext}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 py-2.5 text-sm font-bold text-white transition hover:from-emerald-800 disabled:opacity-40"
                >
                  {step === 3 ? L(lang, "Complete verification", "Finish verification") : L(lang, "Continue", "Continue")}
                  <ArrowRight className="h-4 w-4" weight="bold" />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}