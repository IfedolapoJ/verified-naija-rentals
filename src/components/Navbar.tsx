import { motion } from "framer-motion";
import {
  ShieldCheck,
  SealCheck,
  Globe,
  Plus,
  Wallet,
  ChatCircle,
  Star,
  Lock,
} from "@phosphor-icons/react";
import { L, type Lang } from "@/data";

interface NavbarProps {
  lang: Lang;
  setLang: (l: Lang) => void;
  verifiedTier: number;
  onVerify: () => void;
  onPost: () => void;
  escrowActive: boolean;
  onOpenEscrow: () => void;
  onOpenChat: () => void;
  onOpenReviews: () => void;
}

export default function Navbar({
  lang,
  setLang,
  verifiedTier,
  onVerify,
  onPost,
  escrowActive,
  onOpenEscrow,
  onOpenChat,
  onOpenReviews,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-900/10 bg-[#FAFAF9]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-amber-300" weight="fill" />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-tight text-emerald-950">
              Naija Rentals
            </p>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              <SealCheck className="h-3 w-3" weight="fill" />
              {L(lang, "Verified Marketplace", "Verified Marketplace")}
            </p>
          </div>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language toggle */}
          <div className="flex items-center rounded-full border border-emerald-900/10 bg-white p-0.5 text-[11px] font-bold">
            <button
              onClick={() => setLang("en")}
              className={`rounded-full px-2.5 py-1 transition ${
                lang === "en"
                  ? "bg-emerald-800 text-white"
                  : "text-emerald-800/60 hover:text-emerald-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("pidgin")}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 transition ${
                lang === "pidgin"
                  ? "bg-amber-500 text-white"
                  : "text-emerald-800/60 hover:text-emerald-800"
              }`}
            >
              <Globe className="h-3 w-3" />
              PIDGIN
            </button>
          </div>

          {/* Verification status */}
          <button
            onClick={onVerify}
            className="hidden items-center gap-1.5 rounded-full border border-emerald-900/10 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 transition hover:border-emerald-700 sm:flex"
          >
            <SealCheck
              className={`h-4 w-4 ${verifiedTier >= 3 ? "text-emerald-600" : "text-amber-500"}`}
              weight="fill"
            />
            {verifiedTier >= 3
              ? L(lang, "Tier-3 Verified", "Tier-3 Don Verify")
              : L(lang, "Get Verified", "Make We Verify You")}
          </button>

          {/* Icon actions */}
          <button
            onClick={onOpenChat}
            title={L(lang, "Messages", "Chat")}
            className="grid h-9 w-9 place-items-center rounded-full border border-emerald-900/10 bg-white text-emerald-800 transition hover:border-emerald-700"
          >
            <ChatCircle className="h-4 w-4" weight="fill" />
          </button>
          <button
            onClick={onOpenReviews}
            title={L(lang, "Reviews", "Reviews")}
            className="hidden h-9 w-9 place-items-center rounded-full border border-emerald-900/10 bg-white text-emerald-800 transition hover:border-emerald-700 sm:grid"
          >
            <Star className="h-4 w-4" weight="fill" />
          </button>

          {escrowActive && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onOpenEscrow}
              className="flex items-center gap-1.5 rounded-full bg-emerald-900 px-3 py-1.5 text-xs font-semibold text-amber-200 shadow-sm"
            >
              <Lock className="h-3.5 w-3.5" weight="fill" />
              {L(lang, "Escrow Active", "Escrow dey On")}
            </motion.button>
          )}

          {/* Post property */}
          <button
            onClick={onPost}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:from-emerald-800 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" weight="bold" />
            <span className="hidden sm:inline">
              {L(lang, "Post Property", "Post House")}
            </span>
            <Wallet className="h-4 w-4 sm:hidden" weight="fill" />
          </button>
        </div>
      </div>
    </header>
  );
}
