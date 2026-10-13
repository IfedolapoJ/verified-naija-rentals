import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { ShieldCheck, Lock, ArrowRight } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import HeroAndFilters from "@/components/HeroAndFilters";
import ListingGridAndModal from "@/components/ListingGridAndModal";
import EscrowAndAgreementModal from "@/components/EscrowAndAgreementModal";
import VerificationPortalModal from "@/components/VerificationPortalModal";
import MaskedChatAndReviews from "@/components/MaskedChatAndReviews";
import {
  L,
  uid,
  LISTINGS,
  SEED_REVIEWS,
  DEFAULT_FILTERS,
  formatNaira,
  type Lang,
  type Filters,
  type PropertyListing,
  type Review,
} from "@/data";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const [selected, setSelected] = useState<PropertyListing | null>(null);
  const [escrowListing, setEscrowListing] = useState<PropertyListing | null>(null);
  const [escrowOpen, setEscrowOpen] = useState(false);

  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifiedTier, setVerifiedTier] = useState(0);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatListing, setChatListing] = useState<PropertyListing | null>(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);

  const [escrowActive, setEscrowActive] = useState(false);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return LISTINGS.filter((p) => {
      if (q && ![p.title, p.area, p.city, p.type, p.state].some((f) => f.toLowerCase().includes(q)))
        return false;
      if (filters.city !== "All" && p.city !== filters.city) return false;
      if (filters.type !== "All" && p.type !== filters.type) return false;
      if (filters.power !== "All" && p.power !== filters.power) return false;
      if (p.pricePerYear > filters.maxPrice) return false;
      if (filters.directOnly && !p.directFromLandlord) return false;
      if (filters.verifiedOnly && !p.verified) return false;
      return true;
    });
  }, [filters]);

  const openVerify = () => setVerifyOpen(true);

  const handlePost = () => {
    if (verifiedTier < 2) {
      toast.info(L(lang, "Verify your identity to post a property", "Verify yourself first make you fit post house"));
      setVerifyOpen(true);
    } else {
      toast.success(L(lang, "Listing draft opened in your dashboard", "We don open listing draft for your dashboard"));
    }
  };

  const handleBookEscrow = (p: PropertyListing) => {
    setSelected(null);
    setEscrowListing(p);
    setEscrowOpen(true);
  };

  const handleOpenChat = (p: PropertyListing) => {
    setSelected(null);
    setChatListing(p);
    setChatOpen(true);
  };

  const handleEscrowComplete = (title: string, amount: number) => {
    setEscrowActive(true);
    toast.success(
      L(
        lang,
        `Escrow released for "${title}" — ${formatNaira(amount)} paid safely`,
        `We don release escrow for "${title}" — you pay ${formatNaira(amount)} without wahala`
      )
    );
  };

  const handleVerified = (tier: number) => {
    setVerifiedTier(tier);
    toast.success(
      L(lang, `You are now Tier-${tier} verified!`, `You don become Tier-${tier} verified!`)
    );
  };

  const addReview = (r: Review) => {
    setReviews((prev) => [{ ...r, id: uid() }, ...prev]);
    toast.success(L(lang, "Review published", "Review don show"));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-emerald-950 antialiased">
      <Toaster richColors position="top-center" />

      <Navbar
        lang={lang}
        setLang={setLang}
        verifiedTier={verifiedTier}
        onVerify={openVerify}
        onPost={handlePost}
        escrowActive={escrowActive}
        onOpenEscrow={() => {
          if (escrowListing) {
            setEscrowOpen(true);
          } else {
            toast.info(L(lang, "No active escrow transaction", "No escrow dey on right now"));
          }
        }}
        onOpenChat={() => {
          setChatListing(null);
          setChatOpen(true);
        }}
        onOpenReviews={() => setReviewsOpen(true)}
      />

      <HeroAndFilters
        lang={lang}
        filters={filters}
        setFilters={setFilters}
        onVerify={openVerify}
        resultCount={filtered.length}
      />

      <ListingGridAndModal
        lang={lang}
        listings={filtered}
        selected={selected}
        setSelected={setSelected}
        onBookEscrow={handleBookEscrow}
        onOpenChat={handleOpenChat}
        reviews={reviews}
      />

      {/* Trust band */}
      <section className="border-y border-emerald-900/10 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              en: "Identity-verified landlords",
              pidgin: "Verified landlords, NIN & BVN checked",
              den: "Every landlord passes NIN/BVN biometric checks and a live selfie liveness test before listing.",
              dpidgin: "Every landlord must pass NIN/BVN check and live selfie before e fit post house.",
            },
            {
              icon: Lock,
              en: "Escrow-held rent",
              pidgin: "Dem dey keep your rent for escrow",
              den: "Your yearly rent, caution and fees stay in a secure vault. The landlord is paid only after you confirm check-in.",
              dpidgin: "Your rent, caution and fees dey stay inside secure vault. Na after you confirm check-in dem go pay landlord.",
            },
            {
              icon: ArrowRight,
              en: "Masked in-app chat",
              pidgin: "Chat wey hide your number",
              den: "Talk to landlords without exposing your phone or email. Any advance-fee demand is auto-flagged.",
              dpidgin: "Chat with landlords without make you give your phone or email. If anybody dey ask advance money, we go flag am.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.en} className="rounded-2xl border border-emerald-900/10 bg-emerald-50/30 p-5">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900">
                  <Icon className="h-6 w-6 text-amber-300" weight="fill" />
                </div>
                <h3 className="mt-3 font-bold text-emerald-950">{L(lang, f.en, f.pidgin)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-emerald-900/60">{L(lang, f.den, f.dpidgin)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-100/70">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-800">
                <ShieldCheck className="h-5 w-5 text-amber-300" weight="fill" />
              </div>
              <div>
                <p className="font-extrabold text-white">Naija Rentals</p>
                <p className="text-xs">{L(lang, "Verified. Escrow-protected. Scam-free.", "Verified. Escrow guard am. No scam.")}</p>
              </div>
            </div>
            <p className="text-xs">
              {L(lang, "© 2025 Verified Naija Rentals. Prices in Naira (₦), yearly.", "© 2025 Verified Naija Rentals. Money na Naira (₦), for one year.")}
            </p>
          </div>
        </div>
      </footer>

      <EscrowAndAgreementModal
        lang={lang}
        open={escrowOpen}
        onClose={() => setEscrowOpen(false)}
        listing={escrowListing}
        onComplete={handleEscrowComplete}
      />

      <VerificationPortalModal
        lang={lang}
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onVerified={handleVerified}
      />

      <MaskedChatAndReviews
        lang={lang}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        reviewsOpen={reviewsOpen}
        setReviewsOpen={setReviewsOpen}
        listing={chatListing}
        reviews={reviews}
        onAddReview={addReview}
      />
    </div>
  );
}
