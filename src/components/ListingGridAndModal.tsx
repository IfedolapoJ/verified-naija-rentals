import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Bed,
  Bathtub,
  Lightning,
  SealCheck,
  ShieldCheck,
  Star,
  Flag,
  ChatCircle,
  Lock,
  X,
  Check,
  Building,
  Users,
  IdentificationCard,
} from "@phosphor-icons/react";
import {
  L,
  formatNaira,
  priceBreakdown,
  LANDLORDS,
  type Lang,
  type PropertyListing,
  type Review,
} from "@/data";

interface GridProps {
  lang: Lang;
  listings: PropertyListing[];
  selected: PropertyListing | null;
  setSelected: (p: PropertyListing | null) => void;
  onBookEscrow: (p: PropertyListing) => void;
  onOpenChat: (p: PropertyListing) => void;
  reviews: Review[];
}

export default function ListingGridAndModal({
  lang,
  listings,
  selected,
  setSelected,
  onBookEscrow,
  onOpenChat,
  reviews,
}: GridProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-emerald-950">
            {L(lang, "Verified Listings", "Verified Houses")}
          </h2>
          <p className="text-sm text-emerald-900/60">
            {listings.length}{" "}
            {L(lang, "properties · escrow-ready", "houses · escrow ready")}
          </p>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-emerald-900/20 bg-white py-16 text-center">
          <Flag className="h-8 w-8 text-emerald-900/30" />
          <p className="mt-3 font-semibold text-emerald-950">
            {L(lang, "No listings match your filters", "No house match your filters")}
          </p>
          <p className="text-sm text-emerald-900/50">
            {L(lang, "Try widening the budget or area.", "Try widen budget or area small.")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((p, i) => (
            <ListingCard key={p.id} lang={lang} p={p} i={i} onOpen={() => setSelected(p)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <DetailModal
            lang={lang}
            p={selected}
            reviews={reviews.filter((r) => r.listingId === selected.id)}
            onClose={() => setSelected(null)}
            onBookEscrow={() => {
              onBookEscrow(selected);
            }}
            onOpenChat={() => {
              onOpenChat(selected);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ListingCard({
  lang,
  p,
  i,
  onOpen,
}: {
  lang: Lang;
  p: PropertyListing;
  i: number;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 3) * 0.06, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={onOpen}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm transition hover:shadow-xl hover:shadow-emerald-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={p.images[0]}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.verified && (
            <Badge tone="emerald" icon={SealCheck}>
              {L(lang, "Verified", "Verified")}
            </Badge>
          )}
          {p.directFromLandlord && (
            <Badge tone="amber" icon={Building}>
              {L(lang, "Direct", "Landlord hand")}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-3 left-3 rounded-lg bg-emerald-950/80 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
          {formatNaira(p.pricePerYear)}
          <span className="text-[11px] font-medium text-emerald-100/70">
            /{L(lang, "yr", "yr")}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 font-bold text-emerald-950">{p.title}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-900/60">
          <MapPin className="h-3.5 w-3.5" weight="fill" />
          {p.area}, {p.city} · {p.state}
        </p>
        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-emerald-900/70">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4 text-emerald-700" weight="fill" /> {p.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bathtub className="h-4 w-4 text-emerald-700" weight="fill" /> {p.baths}
          </span>
          <span className="flex items-center gap-1">
            <Lightning className="h-4 w-4 text-amber-500" weight="fill" /> {p.power}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-emerald-900/10 pt-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-900">
            <Star className="h-3.5 w-3.5 text-amber-500" weight="fill" />
            {p.rating} <span className="text-emerald-900/40">({p.reviewCount})</span>
          </span>
          {p.geotagged && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <MapPin className="h-3 w-3" weight="fill" />
              {L(lang, "Geo-tagged", "Geo tagged")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DetailModal({
  lang,
  p,
  reviews,
  onClose,
  onBookEscrow,
  onOpenChat,
}: {
  lang: Lang;
  p: PropertyListing;
  reviews: Review[];
  onClose: () => void;
  onBookEscrow: () => void;
  onOpenChat: () => void;
}) {
  const [img, setImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const ll = LANDLORDS[p.landlordId];
  const bd = priceBreakdown(p);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-emerald-950/60 backdrop-blur-sm sm:items-center sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-[#FAFAF9] shadow-2xl sm:rounded-2xl"
      >
        {/* Gallery */}
        <div className="relative shrink-0">
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img
              src={p.images[img]}
              alt={p.title}
              onClick={() => setLightbox(true)}
              className="h-full w-full cursor-zoom-in object-cover"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-emerald-950/60 text-white backdrop-blur transition hover:bg-emerald-950/80"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            {p.images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setImg(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === img ? "w-6 bg-amber-400" : "w-3 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-extrabold text-emerald-950">{p.title}</h3>
              <p className="flex items-center gap-1 text-sm text-emerald-900/60">
                <MapPin className="h-4 w-4" weight="fill" />
                {p.area}, {p.city} · {p.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-emerald-800">
                {formatNaira(p.pricePerYear)}
              </p>
              <p className="text-xs text-emerald-900/50">
                {L(lang, "per year (standard)", "for one year (standard)")}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone="emerald" icon={SealCheck}>{L(lang, "Title vetted", "Paper don vet")}</Badge>
            <Badge tone="amber" icon={ShieldCheck}>{L(lang, "Escrow protected", "Escrow go guard am")}</Badge>
            <Badge tone="slate" icon={Lightning}>{p.power}</Badge>
            <Badge tone="slate" icon={Bed}>{p.beds} {L(lang, "beds", "bed")}</Badge>
            <Badge tone="slate" icon={Bathtub}>{p.baths} {L(lang, "baths", "bath")}</Badge>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-emerald-900/80">{p.description}</p>

          {/* Landlord trust */}
          <div className="mt-5 rounded-2xl border border-emerald-900/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-800">
                  {ll.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="font-bold text-emerald-950">{ll.name}</p>
                  <p className="text-xs text-emerald-900/60">
                    {ll.role} · {L(lang, "Member since", "Dey since")} {ll.memberSince}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold text-emerald-800">{ll.trustScore}</p>
                <p className="text-[10px] font-bold uppercase text-emerald-900/50">
                  {L(lang, "Trust score", "Trust score")}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <VerifyChip ok={ll.ninVerified} label="NIN" icon={IdentificationCard} />
              <VerifyChip ok={ll.bvnVerified} label="BVN" icon={IdentificationCard} />
              <VerifyChip ok={ll.selfieVerified} label={L(lang, "Selfie", "Selfie")} icon={Users} />
              <VerifyChip ok={ll.docsVerified} label={L(lang, "Docs", "Docs")} icon={SealCheck} />
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-emerald-900/60">
              <span>
                {L(lang, "Listings", "Houses")}: <b className="text-emerald-800">{ll.listingsCount}</b>
              </span>
              <span>
                {L(lang, "Response rate", "E dey reply")}: <b className="text-emerald-800">{ll.responseRate}%</b>
              </span>
              <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-700">
                Tier-{ll.tier} {L(lang, "Verified", "Verified")}
              </span>
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="mt-4 rounded-2xl border border-emerald-900/10 bg-white p-4">
            <p className="mb-2 text-sm font-bold text-emerald-950">
              {L(lang, "Naira payment breakdown", "How you go pay (Naira)")}
            </p>
            <div className="space-y-1.5 text-sm">
              <Row label={L(lang, "Yearly rent", "Rent for year")} value={formatNaira(bd.rent)} />
              <Row label={L(lang, "Caution deposit", "Caution money")} value={formatNaira(bd.caution)} />
              <Row label={L(lang, "Agency fee", "Agency money")} value={formatNaira(bd.agency)} />
              <Row label={L(lang, "Legal fee", "Legal money")} value={formatNaira(bd.legal)} />
              <Row label={L(lang, "Service charge", "Service charge")} value={formatNaira(bd.service)} />
              <div className="mt-2 flex justify-between border-t border-emerald-900/10 pt-2 font-bold text-emerald-900">
                <span>{L(lang, "Total payable (escrow)", "Total (go escrow)")}</span>
                <span>{formatNaira(bd.total)}</span>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-emerald-950">
                {L(lang, "Verified reviews", "Verified reviews")}
              </p>
              <div className="space-y-2">
                {reviews.slice(0, 3).map((r) => (
                  <div key={r.id} className="rounded-xl bg-white p-3 ring-1 ring-emerald-900/10">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
                      {r.author}
                      <span className="flex gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-amber-500" weight="fill" />
                        ))}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-emerald-900/70">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setReportOpen((v) => !v)}
            className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700"
          >
            <Flag className="h-4 w-4" weight="fill" />
            {L(lang, "Report / flag this listing", "Flag this house")}
          </button>
          <AnimatePresence>
            {reportOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                  {reportSent ? (
                    <p className="flex items-center gap-2 text-sm font-semibold text-red-700">
                      <Check className="h-4 w-4" weight="bold" />
                      {L(lang, "Report submitted. Our trust team will review within 24h.", "We don collect am. Trust team go check within 24h.")}
                    </p>
                  ) : (
                    <>
                      <p className="mb-2 text-xs font-medium text-red-700">
                        {L(lang, "Reason for report:", "Why you dey flag:")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          L(lang, "Fake listing", "Fake house"),
                          L(lang, "Asked for advance payment", "E dey ask advance money"),
                          L(lang, "Double-letting", "Dem dey let am to two people"),
                          L(lang, "No authority to let", "No right to let am"),
                        ].map((r) => (
                          <button
                            key={r}
                            onClick={() => setReportSent(true)}
                            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200 transition hover:bg-red-100"
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer CTAs */}
        <div className="flex shrink-0 gap-3 border-t border-emerald-900/10 bg-white px-5 py-3">
          <button
            onClick={onOpenChat}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-800 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
          >
            <ChatCircle className="h-5 w-5" weight="fill" />
            {L(lang, "Chat (masked)", "Chat (e go hide number)")}
          </button>
          <button
            onClick={onBookEscrow}
            className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:from-emerald-800 active:scale-[0.99]"
          >
            <Lock className="h-5 w-5" weight="fill" />
            {L(lang, "Book with Escrow", "Pay with Escrow")}
          </button>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(false);
            }}
          >
            <img src={p.images[img]} alt="" className="max-h-[85vh] max-w-full rounded-lg" />
            <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white">
              <X className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-emerald-900/70">
      <span>{label}</span>
      <span className="font-semibold text-emerald-900">{value}</span>
    </div>
  );
}

function VerifyChip({ ok, label, icon: Icon }: { ok: boolean; label: string; icon: any }) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold ${
        ok ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-400"
      }`}
    >
      <Icon className="h-4 w-4" weight="fill" />
      {label}
      {ok ? <Check className="h-3.5 w-3.5" weight="bold" /> : <X className="h-3.5 w-3.5" />}
    </div>
  );
}

function Badge({
  tone,
  icon: Icon,
  children,
}: {
  tone: "emerald" | "amber" | "slate";
  icon: any;
  children: React.ReactNode;
}) {
  const tones = {
    emerald: "bg-emerald-600/90 text-white",
    amber: "bg-amber-500/90 text-white",
    slate: "bg-emerald-950/70 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur ${tones[tone]}`}>
      <Icon className="h-3 w-3" weight="fill" />
      {children}
    </span>
  );
}
