import { useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  MapPin,
  House,
  Lightning,
  ShieldCheck,
  Funnel,
  SealCheck,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import {
  L,
  type Lang,
  type Filters,
  CITIES,
  PROPERTY_TYPES,
  POWER_OPTIONS,
  NEIGHBORHOODS,
  formatNaira,
} from "@/data";

interface HeroProps {
  lang: Lang;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onVerify: () => void;
  resultCount: number;
}

const STATS = [
  { en: "₦0 lost to scams", pidgin: "₦0 go for scam", icon: ShieldCheck },
  { en: "100% Escrow protected", pidgin: "100% Escrow guard am", icon: SealCheck },
  { en: "2,400+ verified landlords", pidgin: "2,400+ verified landlords", icon: MapPin },
  { en: "NIN & BVN checked", pidgin: "We check NIN & BVN", icon: Lightning },
];

export default function HeroAndFilters({
  lang,
  filters,
  setFilters,
  onVerify,
  resultCount,
}: HeroProps) {
  const [showMore, setShowMore] = useState(false);

  const upd = (patch: Partial<Filters>) => setFilters({ ...filters, ...patch });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-[#0b3b2e] text-white">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-32 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
            <Sparkle className="h-3.5 w-3.5" weight="fill" />
            {L(lang, "No long talk. Pay with Escrow, collect key.", "No long talk. Put money for escrow, collect key.")}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            {L(
              lang,
              "Rent in Nigeria without fear of",
              "Rent for Nigeria without fear of"
            )}{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {L(lang, "advance-fee scams.", "advance-fee scam.")}
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-emerald-100/90">
            {L(
              lang,
              "Every landlord is NIN & BVN verified, every property document is vetted, and your yearly rent stays in escrow until you confirm check-in.",
              "Every landlord na NIN & BVN verified, every property paper dem vet, and your rent dey stay for escrow till you confirm say you don enter."
            )}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onVerify}
              className="group inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-emerald-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-[0.98]"
            >
              <ShieldCheck className="h-5 w-5" weight="fill" />
              {L(lang, "Verify your identity", "Verify yourself now")}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
            <div className="text-sm text-emerald-100/80">
              {resultCount}{" "}
              {L(lang, "verified listings ready", "verified houses ready for you")}
            </div>
          </div>
        </motion.div>

        {/* Stats strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.en}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur"
              >
                <Icon className="h-5 w-5 shrink-0 text-amber-300" weight="fill" />
                <span className="text-xs font-semibold leading-tight text-emerald-50">
                  {L(lang, s.en, s.pidgin)}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Filter card */}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="rounded-2xl border border-white/10 bg-white p-4 text-emerald-950 shadow-2xl sm:p-5">
          {/* Search + neighborhood chips */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3">
              <MagnifyingGlass className="h-5 w-5 text-emerald-700" />
              <input
                value={filters.query}
                onChange={(e) => upd({ query: e.target.value })}
                placeholder={L(lang, "Search area, type, keyword…", "Search area, type, word…")}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-emerald-900/40"
              />
            </div>
            <button
              onClick={() => setShowMore((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-900/15 px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 lg:w-auto"
            >
              <Funnel className="h-4 w-4" weight="fill" />
              {L(lang, "Filters", "Filters")}
            </button>
          </div>

          {/* Quick chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => upd({ city: "All" })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filters.city === "All"
                  ? "bg-emerald-800 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {L(lang, "All areas", "All areas")}
            </button>
            {NEIGHBORHOODS.map((n) => {
              const cityKey = CITIES.find((c) => n.toLowerCase().includes(c.split(" ")[0].toLowerCase())) || n;
              const active = filters.city === cityKey;
              return (
                <button
                  key={n}
                  onClick={() => upd({ city: active ? "All" : cityKey })}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    active
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </div>

          {/* Expanded filters */}
          {showMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 grid grid-cols-1 gap-4 border-t border-emerald-900/10 pt-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              <Field label={L(lang, "City", "City")} icon={MapPin}>
                <select
                  value={filters.city}
                  onChange={(e) => upd({ city: e.target.value })}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="All">{L(lang, "All cities", "All cities")}</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={L(lang, "Property type", "Type of house")} icon={House}>
                <select
                  value={filters.type}
                  onChange={(e) => upd({ type: e.target.value })}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="All">{L(lang, "All types", "All types")}</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={L(lang, "Power supply", "Light situation")} icon={Lightning}>
                <select
                  value={filters.power}
                  onChange={(e) => upd({ power: e.target.value })}
                  className="w-full bg-transparent text-sm outline-none"
                >
                  <option value="All">{L(lang, "Any power", "Any light")}</option>
                  {POWER_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-900/60">
                  {L(lang, "Yearly budget", "Yearly money")}
                </p>
                <div className="rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3 py-2">
                  <input
                    type="range"
                    min={0}
                    max={25000000}
                    step={500000}
                    value={filters.maxPrice}
                    onChange={(e) => upd({ maxPrice: Number(e.target.value) })}
                    className="w-full accent-emerald-700"
                  />
                  <div className="flex justify-between text-[11px] font-semibold text-emerald-800">
                    <span>{formatNaira(filters.minPrice)}</span>
                    <span>{formatNaira(filters.maxPrice)}/yr</span>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <input
                  type="checkbox"
                  checked={filters.directOnly}
                  onChange={(e) => upd({ directOnly: e.target.checked })}
                  className="h-4 w-4 accent-emerald-700"
                />
                {L(lang, "Direct from landlord", "Landlord hand")}
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-900">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={(e) => upd({ verifiedOnly: e.target.checked })}
                  className="h-4 w-4 accent-emerald-700"
                />
                {L(lang, "Verified listings only", "Only verified houses")}
              </label>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-emerald-900/60">
        <Icon className="h-3.5 w-3.5" weight="fill" />
        {label}
      </p>
      <div className="rounded-xl border border-emerald-900/15 bg-emerald-50/40 px-3 py-2.5">
        {children}
      </div>
    </div>
  );
}
