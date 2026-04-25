import React, { useState, useEffect, useMemo } from "react";
import { Plane, UtensilsCrossed, ShoppingCart, Fuel, Sparkles, Calendar, TrendingUp, AlertCircle, Check, X, ChevronRight, CreditCard, Award, Clock, Target, Compass, Flame, BookOpen, Map, Lightbulb } from "lucide-react";
import { LangContext, useLang, T, RULES_I18N, SCORE_FACTORS_I18N, SCORE_MILESTONES_I18N, STARTER_CARDS_I18N, CREDIT_TIMELINE_I18N, PLAYS_I18N, CARD_GUIDES_I18N } from "./i18n";

// ========== STATIC DATA ==========
const CARDS = [
  {
    id: "csp",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    bonus: 75000,
    bonusUnit: "UR points",
    minSpend: 5000,
    spendWindow: 3,
    bonusValueUSD: 1500,
    rules: ["5/24"],
    categories: { dining: 3, travel: 2, groceries: 3, streaming: 3, gas: 1, other: 1 },
    pointType: "Chase UR",
    tier: "mid",
    tagline: "The gateway drug to travel hacking",
    color: "#1a4480",
    sweetSpot: "Hyatt 1.7¢/pt redemptions",
  },
  {
    id: "csr",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    network: "Visa",
    annualFee: 795,
    bonus: 125000,
    bonusUnit: "UR points",
    minSpend: 6000,
    spendWindow: 3,
    bonusValueUSD: 2500,
    rules: ["5/24"],
    categories: { dining: 3, travel: 8, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Chase UR",
    tier: "premium",
    tagline: "Lounges, credits, and the velvet rope",
    color: "#1a2e4a",
    sweetSpot: "$300 travel credit + Priority Pass",
  },
  {
    id: "ink",
    name: "Ink Business Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    bonus: 100000,
    bonusUnit: "UR points",
    minSpend: 8000,
    spendWindow: 3,
    bonusValueUSD: 2000,
    rules: ["business — does NOT count toward 5/24"],
    categories: { dining: 1, travel: 3, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Chase UR",
    tier: "business",
    tagline: "The 5/24 loophole every churner loves",
    color: "#2d5a3d",
    sweetSpot: "3x on shipping, internet, advertising",
  },
  {
    id: "amex-plat",
    name: "Amex Platinum",
    issuer: "American Express",
    network: "Amex",
    annualFee: 895,
    bonus: 175000,
    bonusUnit: "MR points",
    minSpend: 12000,
    spendWindow: 6,
    bonusValueUSD: 3500,
    rules: ["1 per lifetime", "Amex 1/5/24"],
    categories: { dining: 1, travel: 5, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Amex MR",
    tier: "premium",
    tagline: "A coupon book disguised as a metal card",
    color: "#5a4a2d",
    sweetSpot: "$200 airline + $200 hotel + $300 dining credits",
  },
  {
    id: "amex-gold",
    name: "Amex Gold",
    issuer: "American Express",
    network: "Amex",
    annualFee: 325,
    bonus: 100000,
    bonusUnit: "MR points",
    minSpend: 6000,
    spendWindow: 6,
    bonusValueUSD: 2000,
    rules: ["1 per lifetime", "Amex 1/5/24"],
    categories: { dining: 4, travel: 1, groceries: 4, streaming: 1, gas: 1, other: 1 },
    pointType: "Amex MR",
    tier: "mid",
    tagline: "The foodie's secret weapon",
    color: "#8a6f3a",
    sweetSpot: "4x at restaurants worldwide & US supermarkets",
  },
  {
    id: "amex-biz-plat",
    name: "Amex Business Platinum",
    issuer: "American Express",
    network: "Amex",
    annualFee: 695,
    bonus: 300000,
    bonusUnit: "MR points",
    minSpend: 20000,
    spendWindow: 3,
    bonusValueUSD: 6000,
    rules: ["1 per lifetime", "Amex 1/5/24"],
    categories: { dining: 1, travel: 5, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Amex MR",
    tier: "business",
    tagline: "The biggest legal heist in points",
    color: "#3a3a2d",
    sweetSpot: "Up to 300k MR — highest public offer ever",
  },
  {
    id: "venture-x",
    name: "Capital One Venture X",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 395,
    bonus: 75000,
    bonusUnit: "miles",
    minSpend: 4000,
    spendWindow: 3,
    bonusValueUSD: 1500,
    rules: ["sensitive to inquiries"],
    categories: { dining: 2, travel: 5, groceries: 2, streaming: 2, gas: 2, other: 2 },
    pointType: "C1 Miles",
    tier: "premium",
    tagline: "The premium card with sane math",
    color: "#3d2d4a",
    sweetSpot: "$300 travel credit + 10k anniversary miles",
  },
  {
    id: "marriott-bonvoy",
    name: "Marriott Bonvoy Boundless",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    bonus: 150000,
    bonusUnit: "Bonvoy points (3 Free Night Awards)",
    minSpend: 3000,
    spendWindow: 3,
    bonusValueUSD: 900,
    rules: ["5/24"],
    categories: { dining: 2, travel: 6, groceries: 2, streaming: 2, gas: 2, other: 2 },
    pointType: "Marriott",
    tier: "hotel",
    tagline: "Free night certs that pay rent",
    color: "#4a2d2d",
    sweetSpot: "3 Free Night Awards (up to 50k pts each) + $100 airline credit/yr",
  },
  {
    id: "hilton-aspire",
    name: "Hilton Honors Aspire",
    issuer: "American Express",
    network: "Amex",
    annualFee: 550,
    bonus: 150000,
    bonusUnit: "Hilton points",
    minSpend: 4000,
    spendWindow: 3,
    bonusValueUSD: 900,
    rules: ["1 per lifetime"],
    categories: { dining: 7, travel: 7, groceries: 3, streaming: 3, gas: 3, other: 3 },
    pointType: "Hilton",
    tier: "hotel",
    tagline: "Diamond status without sleeping in hotels",
    color: "#3a4a5a",
    sweetSpot: "Free weekend night + Diamond status (elevated 175k offers rotate back)",
  },
  {
    id: "citi-strata",
    name: "Citi Strata Premier",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 95,
    bonus: 75000,
    bonusUnit: "ThankYou points",
    minSpend: 4000,
    spendWindow: 3,
    bonusValueUSD: 1300,
    rules: ["48-month rule per family"],
    categories: { dining: 3, travel: 3, groceries: 3, streaming: 1, gas: 3, other: 1 },
    pointType: "Citi TYP",
    tier: "mid",
    tagline: "Underrated transfer partners (Choice 2x)",
    color: "#2d4a4a",
    sweetSpot: "10x on hotels via Citi Travel",
  },
  {
    id: "alaska-summit",
    name: "Alaska Atmos Rewards Summit",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 395,
    bonus: 100000,
    bonusUnit: "Alaska miles + 25k Global Companion Award",
    minSpend: 6500,
    spendWindow: 3,
    bonusValueUSD: 2250,
    rules: ["BoA 2/3/4 informal rule"],
    categories: { dining: 2, travel: 5, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Alaska",
    tier: "premium",
    tagline: "JAL First Class for 70k miles each way",
    color: "#1a3a4a",
    sweetSpot: "100k miles + 25k Global Companion Award + Oneworld redemptions",
  },
  {
    id: "bilt",
    name: "Bilt Blue",
    issuer: "Wells Fargo",
    network: "Mastercard",
    annualFee: 0,
    bonus: 0,
    bonusUnit: "n/a",
    minSpend: 0,
    spendWindow: 0,
    bonusValueUSD: 0,
    rules: ["no SUB — use 5 txns/mo to earn points", "Obsidian ($95) & Palladium ($495) tiers also available"],
    categories: { dining: 3, travel: 2, groceries: 1, streaming: 1, gas: 1, other: 1 },
    pointType: "Bilt",
    tier: "no-fee",
    tagline: "The only card that turns rent into miles",
    color: "#1a1a1a",
    sweetSpot: "1x on rent (no fee), Rent Day 2x bonuses · Palladium: 50k bonus + $300 Bilt Cash",
  },
];

const POINT_VALUES = {
  "Chase UR": 0.02,
  "Amex MR": 0.02,
  "C1 Miles": 0.02,
  "Citi TYP": 0.0175,
  "Marriott": 0.008,
  "Hilton": 0.006,
  "Alaska": 0.018,
  "Bilt": 0.02,
};

const CATEGORY_META = {
  dining: { icon: UtensilsCrossed },
  travel: { icon: Plane },
  groceries: { icon: ShoppingCart },
  streaming: { icon: Sparkles },
  gas: { icon: Fuel },
  other: { icon: CreditCard },
};

// ========== UTILS ==========
const fmt = (n) => new Intl.NumberFormat("en-US").format(Math.round(n));
const fmtUSD = (n) => `$${fmt(n)}`;

const useLocal = (key, initial) => {
  const [v, setV] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
};

const daysBetween = (a, b) => Math.ceil((new Date(b) - new Date(a)) / 86400000);

// ========== COMPONENTS ==========

function LangToggle({ lang, setLang }) {
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ko" : "en")}
      className="flex items-center gap-1 px-2.5 py-1 border border-stone-700 hover:border-amber-400 text-[11px] uppercase tracking-widest transition-all"
    >
      <span className={lang === "en" ? "text-amber-200" : "text-stone-600"}>EN</span>
      <span className="text-stone-700 mx-0.5">|</span>
      <span className={lang === "ko" ? "text-amber-200" : "text-stone-600"}>한</span>
    </button>
  );
}

function Header({ tab, setTab, lang, setLang }) {
  const d = T[lang].nav;
  const tabs = [
    { id: "discover", label: d.discover, icon: Compass },
    { id: "guide", label: d.guide, icon: Map },
    { id: "tracker", label: d.tracker, icon: Calendar },
    { id: "rules", label: d.rules, icon: BookOpen },
    { id: "value", label: d.value, icon: TrendingUp },
  ];
  return (
    <header className="border-b border-stone-800/60 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-serif italic text-amber-200 tracking-tight">Points</span>
            <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">Atlas · Vol I</span>
          </div>
          <LangToggle lang={lang} setLang={setLang} />
        </div>
        <nav className="flex gap-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 sm:px-4 py-2 text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                  active
                    ? "text-amber-200 border-b border-amber-300"
                    : "text-stone-500 hover:text-stone-300 border-b border-transparent"
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function HeroQuote() {
  const lang = useLang();
  const h = T[lang].hero;
  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-4">{h.eyebrow}</p>
          <h1 className="font-serif text-5xl md:text-7xl text-stone-100 leading-[0.95] tracking-tight">
            {h.line1a} <em className="text-amber-200">{h.line1em}</em> —
            <br />
            {h.line2a} <span className="underline decoration-amber-400/40 decoration-2 underline-offset-8">{h.line2city}</span> {h.line2b}
          </h1>
        </div>
        <div className="md:col-span-4 border-l border-stone-800 pl-6">
          <p className="text-stone-400 text-sm leading-relaxed font-light">{h.body}</p>
          <p className="text-xs text-stone-600 mt-3 italic">{h.updated}</p>
        </div>
      </div>
    </div>
  );
}

function Discover({ openCard }) {
  const lang = useLang();
  const [spend, setSpend] = useState({ dining: 800, travel: 400, groceries: 600, streaming: 50, gas: 200, other: 1500 });
  const [maxFee, setMaxFee] = useState(800);
  const [rule524, setRule524] = useState(false);
  const [pointPref, setPointPref] = useState("any");
  const [sort, setSort] = useState("score");

  const scored = useMemo(() => {
    const d = T[lang].discover;
    return CARDS.map((c) => {
      const monthlyPoints = Object.entries(spend).reduce((acc, [cat, amt]) => {
        return acc + amt * (c.categories[cat] || 1);
      }, 0);
      const annualPoints = monthlyPoints * 12;
      const ptVal = POINT_VALUES[c.pointType] || 0.015;
      const annualValue = annualPoints * ptVal - c.annualFee;
      const totalFirstYear = annualValue + c.bonusValueUSD;

      let blocked = null;
      if (c.annualFee > maxFee) blocked = d.blockedFee;
      if (rule524 && c.rules.some((r) => r.includes("5/24") && !r.includes("does NOT"))) blocked = d.blocked524;
      if (pointPref !== "any" && c.pointType !== pointPref) blocked = d.blockedCurrency;

      return { ...c, annualPoints, annualValue, totalFirstYear, blocked };
    }).sort((a, b) => {
      if (a.blocked && !b.blocked) return 1;
      if (!a.blocked && b.blocked) return -1;
      if (sort === "bonus") return b.bonusValueUSD - a.bonusValueUSD;
      if (sort === "fee") return a.annualFee - b.annualFee;
      return b.totalFirstYear - a.totalFirstYear;
    });
  }, [spend, maxFee, rule524, pointPref, sort, lang]);

  const d = T[lang].discover;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-amber-300 font-serif text-xl italic">§ I.</span>
          <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{d.s1}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-stone-900/40 border border-stone-800/60 p-6 rounded-sm">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <label key={key} className="block group">
                <div className="flex items-center gap-2 mb-2 text-stone-400 group-hover:text-amber-200 transition-colors">
                  <Icon size={14} />
                  <span className="text-xs uppercase tracking-wider">{d.cats[key]}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-stone-500 text-sm">$</span>
                  <input
                    type="number"
                    value={spend[key]}
                    onChange={(e) => setSpend({ ...spend, [key]: Math.max(0, Number(e.target.value)) })}
                    className="bg-transparent border-b border-stone-700 focus:border-amber-300 outline-none text-2xl font-serif text-stone-100 w-24 transition-colors"
                  />
                  <span className="text-xs text-stone-600 ml-1">{d.perMonth}</span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-amber-300 font-serif text-xl italic">§ II.</span>
          <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{d.s2}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-stone-900/40 border border-stone-800/60 p-5 rounded-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">{d.maxFee}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-stone-500">$</span>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={maxFee}
                onChange={(e) => setMaxFee(Number(e.target.value))}
                className="flex-1 accent-amber-400"
              />
              <span className="text-xl font-serif text-amber-200 w-16 text-right">${maxFee}</span>
            </div>
          </div>
          <button
            onClick={() => setRule524(!rule524)}
            className={`p-5 rounded-sm border text-left transition-all ${
              rule524 ? "bg-amber-950/30 border-amber-700/50" : "bg-stone-900/40 border-stone-800/60 hover:border-stone-700"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs uppercase tracking-wider text-stone-500">{d.rule524label}</p>
              <div className={`w-4 h-4 border ${rule524 ? "bg-amber-400 border-amber-400" : "border-stone-600"}`}>
                {rule524 && <Check size={14} className="text-stone-950" />}
              </div>
            </div>
            <p className="text-sm text-stone-300 font-light">{d.rule524desc}</p>
          </button>
          <div className="bg-stone-900/40 border border-stone-800/60 p-5 rounded-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">{d.currencyPref}</p>
            <select
              value={pointPref}
              onChange={(e) => setPointPref(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 px-3 py-2 text-stone-200 text-sm focus:border-amber-400 outline-none"
            >
              <option value="any">{d.anyCurrency}</option>
              <option value="Chase UR">Chase Ultimate Rewards</option>
              <option value="Amex MR">Amex Membership Rewards</option>
              <option value="C1 Miles">Capital One Miles</option>
              <option value="Citi TYP">Citi ThankYou</option>
            </select>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-baseline gap-4">
            <span className="text-amber-300 font-serif text-xl italic">§ III.</span>
            <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{d.s3}</h2>
          </div>
          <div className="flex gap-2 text-xs">
            {[
              { id: "score", label: d.sortYear1 },
              { id: "bonus", label: d.sortBonus },
              { id: "fee", label: d.sortFee },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                  sort === s.id ? "text-amber-200 border-b border-amber-300" : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {scored.map((c, i) => (
            <CardRow key={c.id} card={c} rank={i + 1} onPick={() => openCard(c)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CardRow({ card, rank, onPick }) {
  const lang = useLang();
  const d = T[lang].discover;
  const blocked = !!card.blocked;
  return (
    <button
      onClick={onPick}
      className={`w-full text-left grid grid-cols-12 gap-4 items-center p-5 border transition-all group ${
        blocked
          ? "border-stone-900 bg-stone-950/40 opacity-50"
          : "border-stone-800 bg-stone-900/30 hover:border-amber-700/50 hover:bg-stone-900/60"
      }`}
    >
      <div className="col-span-1">
        <span className="font-serif text-3xl text-stone-600 group-hover:text-amber-300 transition-colors">
          {String(rank).padStart(2, "0")}
        </span>
      </div>
      <div className="col-span-11 sm:col-span-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: card.color }} />
          <span className="text-xs uppercase tracking-wider text-stone-500">{card.issuer}</span>
        </div>
        <h3 className="font-serif text-xl text-stone-100 group-hover:text-amber-100 transition-colors">{card.name}</h3>
        <p className="text-xs text-stone-500 italic mt-1">"{card.tagline}"</p>
      </div>
      <div className="col-span-6 sm:col-span-2">
        <p className="text-[10px] uppercase tracking-widest text-stone-600">{d.colBonus}</p>
        <p className="font-serif text-lg text-amber-200">{fmt(card.bonus)}</p>
        <p className="text-[10px] text-stone-500">≈ {fmtUSD(card.bonusValueUSD)}</p>
      </div>
      <div className="col-span-3 sm:col-span-2">
        <p className="text-[10px] uppercase tracking-widest text-stone-600">{d.colYear1}</p>
        <p className={`font-serif text-lg ${blocked ? "text-stone-600" : "text-stone-100"}`}>
          {fmtUSD(card.totalFirstYear)}
        </p>
        <p className="text-[10px] text-stone-500">{d.afterFee} ${card.annualFee} {d.fee}</p>
      </div>
      <div className="col-span-3 sm:col-span-2 text-right">
        {blocked ? (
          <span className="text-[10px] uppercase tracking-wider text-red-400/60">{card.blocked}</span>
        ) : (
          <ChevronRight className="text-stone-600 group-hover:text-amber-300 ml-auto transition-colors" size={20} />
        )}
      </div>
    </button>
  );
}

function CardDetail({ card, onClose, onAddToTracker, inTracker }) {
  const lang = useLang();
  const d = T[lang].detail;
  const cats = T[lang].discover.cats;
  if (!card) return null;
  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="ml-auto relative bg-stone-950 border-l border-stone-800 w-full max-w-xl h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8" style={{ background: `linear-gradient(180deg, ${card.color}40 0%, transparent 80%)` }}>
          <button onClick={onClose} className="text-stone-500 hover:text-amber-200 mb-6 text-xs uppercase tracking-widest">
            {d.close}
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-2">{card.issuer} · {card.network}</p>
          <h2 className="font-serif text-4xl text-stone-100 leading-tight mb-3">{card.name}</h2>
          <p className="text-stone-400 italic font-light">"{card.tagline}"</p>
        </div>

        <div className="px-8 pb-8 space-y-8">
          <div className="grid grid-cols-3 gap-4 border-y border-stone-800 py-6">
            <Stat label={d.annualFee} value={fmtUSD(card.annualFee)} />
            <Stat label={d.signupBonus} value={fmt(card.bonus)} sub={card.bonusUnit} />
            <Stat label={d.minSpend} value={fmtUSD(card.minSpend)} sub={`${d.inPre}${card.spendWindow}${d.inSuf}`} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">{d.sweetSpot}</p>
            <p className="text-stone-200 font-serif text-lg leading-snug">{card.sweetSpot}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">{d.earningRates}</p>
            <div className="space-y-2">
              {Object.entries(card.categories).map(([k, v]) => {
                const meta = CATEGORY_META[k];
                const Icon = meta.icon;
                return (
                  <div key={k} className="flex items-center justify-between border-b border-stone-900 py-2">
                    <span className="flex items-center gap-3 text-stone-400 text-sm">
                      <Icon size={14} className="text-stone-600" />
                      {cats[k]}
                    </span>
                    <span className={`font-serif text-lg ${v >= 3 ? "text-amber-200" : "text-stone-300"}`}>
                      {v}× {v >= 3 && <span className="text-amber-300/60 text-xs">★</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">{d.appRules}</p>
            <ul className="space-y-2">
              {card.rules.map((r, i) => (
                <li key={i} className="flex gap-2 text-stone-300 text-sm">
                  <AlertCircle size={14} className="text-amber-400/70 mt-0.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => onAddToTracker(card)}
            disabled={inTracker}
            className={`w-full py-4 border text-xs uppercase tracking-[0.3em] transition-all ${
              inTracker
                ? "border-stone-800 text-stone-600 cursor-not-allowed"
                : "border-amber-400 text-amber-200 hover:bg-amber-400 hover:text-stone-950"
            }`}
          >
            {inTracker ? d.alreadyTracking : d.track}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">{label}</p>
      <p className="font-serif text-2xl text-stone-100">{value}</p>
      {sub && <p className="text-[10px] text-stone-500">{sub}</p>}
    </div>
  );
}

function Tracker({ tracked, setTracked }) {
  const lang = useLang();
  const tr = T[lang].tracker;
  const updateProgress = (id, value) => {
    setTracked(tracked.map((t) => (t.id === id ? { ...t, spent: value } : t)));
  };
  const updateDate = (id, value) => {
    setTracked(tracked.map((t) => (t.id === id ? { ...t, openedDate: value } : t)));
  };
  const remove = (id) => setTracked(tracked.filter((t) => t.id !== id));

  if (tracked.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center py-24 border border-dashed border-stone-800 rounded-sm">
          <Calendar className="mx-auto text-stone-700 mb-4" size={32} />
          <h3 className="font-serif text-2xl text-stone-300 mb-2">{tr.emptyTitle}</h3>
          <p className="text-stone-500 text-sm">{tr.emptyDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-amber-300 font-serif text-xl italic">§</span>
        <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{tr.inFlight}</h2>
        <span className="text-stone-600 text-xs">{tracked.length} {tracked.length === 1 ? tr.card : tr.cards}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tracked.map((t) => {
          const card = CARDS.find((c) => c.id === t.id);
          if (!card) return null;
          const today = new Date().toISOString().slice(0, 10);
          const opened = new Date(t.openedDate);
          const deadline = new Date(opened);
          deadline.setMonth(deadline.getMonth() + card.spendWindow);
          const daysLeft = daysBetween(today, deadline.toISOString().slice(0, 10));
          const pct = Math.min(100, (t.spent / card.minSpend) * 100);
          const danger = daysLeft < 14 && pct < 100;

          return (
            <div key={t.id} className="border border-stone-800 bg-stone-900/30 p-6 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ background: card.color }} />
              <button
                onClick={() => remove(t.id)}
                className="absolute top-4 right-4 text-stone-600 hover:text-red-400"
              >
                <X size={16} />
              </button>

              <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{card.issuer}</p>
              <h3 className="font-serif text-xl text-stone-100 mb-4">{card.name}</h3>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-stone-500 mb-2">
                  <span className="uppercase tracking-wider">{tr.minSpend}</span>
                  <span className={pct >= 100 ? "text-green-400" : danger ? "text-red-400" : "text-stone-400"}>
                    {fmtUSD(t.spent)} / {fmtUSD(card.minSpend)}
                  </span>
                </div>
                <div className="h-2 bg-stone-900 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 transition-all ${
                      pct >= 100 ? "bg-green-500" : danger ? "bg-red-500" : "bg-amber-400"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-stone-500 text-xs">$</span>
                  <input
                    type="number"
                    value={t.spent}
                    onChange={(e) => updateProgress(t.id, Math.max(0, Number(e.target.value)))}
                    className="bg-transparent border-b border-stone-700 focus:border-amber-300 outline-none text-stone-200 w-full text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-800">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{tr.opened}</p>
                  <input
                    type="date"
                    value={t.openedDate}
                    onChange={(e) => updateDate(t.id, e.target.value)}
                    className="bg-transparent text-stone-300 text-sm border-b border-stone-800 focus:border-amber-300 outline-none w-full"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{tr.daysLeft}</p>
                  <p className={`font-serif text-2xl ${danger ? "text-red-400" : daysLeft < 30 ? "text-amber-300" : "text-stone-200"}`}>
                    {daysLeft < 0 ? tr.expired : `${daysLeft}${tr.daySuffix}`}
                  </p>
                </div>
              </div>

              {pct >= 100 ? (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs uppercase tracking-wider">
                  <Check size={14} /> {tr.bonusEarned} {fmt(card.bonus)} {card.bonusUnit}
                </div>
              ) : danger ? (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs uppercase tracking-wider">
                  <Flame size={14} /> {tr.behind} {fmtUSD(card.minSpend - t.spent)} {tr.inDays}{daysLeft}{tr.inDaysSuffix}
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-stone-500 text-xs">
                  <Target size={14} /> {fmtUSD(card.minSpend - t.spent)} {tr.toGo} {fmtUSD(Math.ceil((card.minSpend - t.spent) / Math.max(1, daysLeft)))} {tr.perDay}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Rules() {
  const lang = useLang();
  const rules = RULES_I18N[lang];
  const r = T[lang].rules;

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">{r.eyebrow}</p>
        <h2
          className="font-serif text-4xl text-stone-100 leading-tight mb-4"
          dangerouslySetInnerHTML={{ __html: r.title }}
        />
        <p className="text-stone-400 font-light leading-relaxed">{r.desc}</p>
      </div>

      <div className="space-y-px">
        {rules.map((rule, i) => (
          <details key={i} className="group border-b border-stone-800 open:border-amber-900/40 transition-colors">
            <summary className="cursor-pointer p-6 flex items-center justify-between hover:bg-stone-900/30 transition-colors list-none">
              <div className="flex items-center gap-6">
                <span className="font-serif text-3xl text-stone-700 group-open:text-amber-300 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{rule.issuer}</p>
                  <h3 className="font-serif text-2xl text-stone-100">{rule.title}</h3>
                </div>
              </div>
              <ChevronRight className="text-stone-600 group-open:rotate-90 transition-transform" size={20} />
            </summary>
            <div className="px-6 pb-8 pl-24">
              <p className="text-stone-300 text-lg font-serif italic mb-6 leading-relaxed border-l-2 border-amber-400/30 pl-4">
                {rule.essence}
              </p>
              <ul className="space-y-2">
                {rule.details.map((detail, j) => (
                  <li key={j} className="flex gap-3 text-stone-400 text-sm">
                    <span className="text-amber-400/60 font-serif">·</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function ValueCalculator() {
  const lang = useLang();
  const v = T[lang].value;
  const [points, setPoints] = useState({
    "Chase UR": 50000,
    "Amex MR": 100000,
    "C1 Miles": 0,
    "Citi TYP": 0,
    "Marriott": 0,
    "Hilton": 0,
    "Alaska": 0,
    "Bilt": 0,
  });

  const total = Object.entries(points).reduce((acc, [k, amt]) => acc + amt * (POINT_VALUES[k] || 0), 0);

  const sweetSpots = [
    { from: "Chase UR", to: "Hyatt", rate: "1:1", deal: "Park Hyatt Tokyo for 30k pts/night (cash rate $800+)" },
    { from: "Amex MR", to: "ANA", rate: "1:1", deal: "Round-trip business class to Japan for ~88k MR + fees" },
    { from: "C1 Miles", to: "Turkish", rate: "2:1.5", deal: "United domestic flights for 7,500 miles one-way" },
    { from: "Citi TYP", to: "Choice", rate: "1:2", deal: "Effective 4¢/pt for Choice properties in Europe" },
    { from: "Alaska", to: "JAL", rate: "direct", deal: "First class HNL→Tokyo for 70k miles (cash $20k+)" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">{v.eyebrow}</p>
        <h2 className="font-serif text-4xl text-stone-100 leading-tight">
          {v.titleA} <em className="text-amber-200">{v.titleEm}</em> {v.titleB}
        </h2>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-3">
          {Object.entries(points).map(([currency, amount]) => (
            <div key={currency} className="grid grid-cols-12 items-center gap-4 border-b border-stone-800 pb-3">
              <div className="col-span-5">
                <p className="font-serif text-stone-200">{currency}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                  ≈ {(POINT_VALUES[currency] * 100).toFixed(1)}{v.perPoint}
                </p>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setPoints({ ...points, [currency]: Math.max(0, Number(e.target.value)) })}
                className="col-span-4 bg-transparent border-b border-stone-700 focus:border-amber-300 outline-none text-stone-100 text-right text-lg font-serif"
              />
              <p className="col-span-3 text-right text-amber-200 font-serif">
                {fmtUSD(amount * (POINT_VALUES[currency] || 0))}
              </p>
            </div>
          ))}
          <div className="grid grid-cols-12 items-baseline gap-4 pt-6">
            <p className="col-span-9 text-xs uppercase tracking-[0.3em] text-stone-400">{v.total}</p>
            <p className="col-span-3 text-right font-serif text-3xl text-amber-200">{fmtUSD(total)}</p>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-amber-300" size={16} />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">{v.sweetSpots}</p>
            </div>
            <div className="space-y-4">
              {sweetSpots.map((s, i) => (
                <div key={i} className="text-sm border-b border-stone-800 pb-3 last:border-0">
                  <p className="text-stone-300 font-serif">
                    {s.from} <span className="text-stone-600">→</span> {s.to}
                    <span className="text-xs text-stone-500 ml-2">({s.rate})</span>
                  </p>
                  <p className="text-stone-500 text-xs mt-1 italic">{s.deal}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- GUIDE TAB ----------
const DIFFICULTY_COLOR = {
  Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
  Intermediate: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
};

function Playbook({ openCard }) {
  const lang = useLang();
  const g = T[lang].guide;
  const [activePlay, setActivePlay] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [view, setView] = useState("start");

  const plays = PLAYS_I18N[lang];
  const cardGuides = CARD_GUIDES_I18N[lang];
  const scoreFactors = SCORE_FACTORS_I18N[lang];
  const scoreMilestones = SCORE_MILESTONES_I18N[lang];
  const starterCards = STARTER_CARDS_I18N[lang];
  const creditTimeline = CREDIT_TIMELINE_I18N[lang];

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* Hero */}
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">{g.eyebrow}</p>
        <h2 className="font-serif text-4xl text-stone-100 leading-tight mb-4">
          {g.heroTitleA} <em className="text-amber-200">{g.heroTitleEm}</em>
        </h2>
        <p className="text-stone-400 font-light leading-relaxed text-sm">{g.heroDesc}</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-10 border-b border-stone-800 overflow-x-auto">
        {[
          { id: "start", label: g.tab0 },
          { id: "plays", label: g.tab1 },
          { id: "cards", label: g.tab2 },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-[2px] whitespace-nowrap ${
              view === v.id
                ? "text-amber-200 border-amber-300"
                : "text-stone-500 hover:text-stone-300 border-transparent"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* § 0. Credit From Zero */}
      {view === "start" && (
        <div className="space-y-16">

          {/* Credit Score */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-300 font-serif text-xl italic">01</span>
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{g.sec01}</h3>
            </div>
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-3">
                {scoreFactors.map((f) => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-stone-300 text-sm">{f.label}</span>
                      <span className="font-serif text-xl text-amber-200">{f.pct}%</span>
                    </div>
                    <div className="h-2 bg-stone-900 mb-1">
                      <div className={`h-full ${f.color} transition-all`} style={{ width: `${f.pct * 2.86}%` }} />
                    </div>
                    <p className="text-xs text-stone-600">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="md:col-span-5 bg-stone-900/40 border border-stone-800 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-4">{g.coreRules}</p>
                <ol className="space-y-4">
                  {[
                    { n: "01", rule: g.r1, sub: g.r1sub },
                    { n: "02", rule: g.r2, sub: g.r2sub },
                    { n: "03", rule: g.r3, sub: g.r3sub },
                  ].map((item) => (
                    <li key={item.n} className="flex gap-4">
                      <span className="font-serif text-2xl text-amber-300/40 flex-shrink-0">{item.n}</span>
                      <div>
                        <p className="text-stone-200 font-serif text-lg leading-tight">{item.rule}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{item.sub}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          {/* Score Milestones */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-300 font-serif text-xl italic">02</span>
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{g.sec02}</h3>
            </div>
            <div className="space-y-2">
              {scoreMilestones.map((m) => (
                <div key={m.range} className={`p-5 border border-stone-800 ${m.bar} rounded-sm`}>
                  <div className="grid md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-3">
                      <p className={`font-serif text-2xl ${m.color}`}>{m.range}</p>
                      <p className="text-xs text-stone-500 uppercase tracking-wider mt-1">{m.label}</p>
                    </div>
                    <div className="md:col-span-5">
                      <p className="text-stone-300 text-sm">{m.cards}</p>
                    </div>
                    <div className="md:col-span-4">
                      <p className="text-xs text-stone-500 italic">{m.next}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Starter Cards */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-300 font-serif text-xl italic">03</span>
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{g.sec03}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {starterCards.map((c) => (
                <div key={c.name} className="border border-stone-800 bg-stone-900/20 p-6 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: c.color }} />
                  <h4 className="font-serif text-xl text-stone-100 mb-1">{c.name}</h4>
                  <p className="text-xs text-stone-500 italic mb-4">"{c.why}"</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{g.annualFee}</p>
                      <p className="text-stone-200 font-serif text-lg">{c.fee}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{g.deposit}</p>
                      <p className="text-stone-200 font-serif text-lg">{c.deposit}</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-stone-800 pt-4">
                    <div className="flex gap-2 text-sm">
                      <span className="text-amber-400/60 font-serif flex-shrink-0">·</span>
                      <span className="text-stone-400">{c.earn}</span>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="text-amber-400/60 font-serif flex-shrink-0">·</span>
                      <span className="text-stone-400">{c.highlight}</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-amber-400/60 font-serif flex-shrink-0">·</span>
                      <span className="text-stone-500 italic">{c.timeline}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section>
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-amber-300 font-serif text-xl italic">04</span>
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">{g.sec04}</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[88px] top-0 bottom-0 w-px bg-stone-800 hidden md:block" />
              <div className="space-y-0">
                {creditTimeline.map((phase, i) => (
                  <div key={phase.month} className="md:grid md:grid-cols-12 gap-8 mb-0">
                    <div className="md:col-span-2 flex md:flex-col md:items-end md:text-right pb-2 md:pb-0 md:pt-5">
                      <div className="hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{phase.month}</p>
                        <div className="w-3 h-3 rounded-full border-2 ml-auto" style={{ borderColor: phase.color, background: phase.color + "40" }} />
                      </div>
                      <p className="text-xs text-stone-500 md:hidden">{phase.month}</p>
                    </div>
                    <div className={`md:col-span-10 pb-8 md:pl-8 border-b border-stone-900 ${i === creditTimeline.length - 1 ? "border-b-0" : ""}`}>
                      <p className="font-serif text-xl mb-4" style={{ color: phase.color }}>{phase.phase}</p>
                      <ul className="space-y-2">
                        {phase.actions.map((a, j) => (
                          <li key={j} className="flex gap-3 text-stone-400 text-sm">
                            <span className="font-serif text-amber-400/50 flex-shrink-0">·</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* CTA */}
            <div className="mt-10 border border-amber-700/30 bg-amber-950/20 p-6 flex items-center justify-between">
              <div>
                <p className="font-serif text-xl text-amber-200 mb-1">{g.ctaTitle}</p>
                <p className="text-stone-400 text-sm">{g.ctaDesc}</p>
              </div>
              <ChevronRight className="text-amber-400 flex-shrink-0" size={24} />
            </div>
          </section>

        </div>
      )}

      {/* § I. Strategy Plays */}
      {view === "plays" && (
        <div className="space-y-3">
          {plays.map((play) => {
            const isOpen = activePlay === play.id;
            return (
              <div key={play.id} className="border border-stone-800 rounded-sm overflow-hidden">
                <button
                  onClick={() => setActivePlay(isOpen ? null : play.id)}
                  className={`w-full text-left p-6 flex items-center gap-6 transition-all group ${
                    isOpen ? "bg-stone-900/60" : "bg-stone-900/20 hover:bg-stone-900/40"
                  }`}
                >
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ background: play.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${DIFFICULTY_COLOR[play.difficulty]}`}>
                        {play.difficulty}
                      </span>
                      <span className="text-[10px] text-stone-600 uppercase tracking-wider flex items-center gap-1">
                        <Clock size={10} /> {play.timeframe}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-stone-100 group-hover:text-amber-100 transition-colors">
                      {play.goal}
                    </h3>
                    <p className="text-sm text-stone-500 italic mt-0.5">{play.subtitle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-stone-600 uppercase tracking-wider mb-1">Value</p>
                    <p className="font-serif text-lg text-amber-200">{play.totalValue}</p>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`text-stone-600 flex-shrink-0 transition-transform ${isOpen ? "rotate-90 text-amber-300" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-stone-800">
                    <div className="px-6 py-4 bg-stone-950/50 flex items-center gap-3 flex-wrap border-b border-stone-900">
                      <span className="text-[10px] uppercase tracking-widest text-stone-600">{g.cardsNeeded}</span>
                      {play.cards.map((cid) => {
                        const card = CARDS.find((c) => c.id === cid);
                        if (!card) return null;
                        return (
                          <button
                            key={cid}
                            onClick={() => openCard(card)}
                            className="flex items-center gap-2 px-3 py-1 border border-stone-700 hover:border-amber-500 text-stone-300 hover:text-amber-200 text-xs transition-all"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: card.color }} />
                            {card.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="divide-y divide-stone-900">
                      {play.steps.map((step) => {
                        const linkedCard = step.card ? CARDS.find((c) => c.id === step.card) : null;
                        return (
                          <div key={step.n} className="flex gap-6 p-6 hover:bg-stone-900/20 transition-colors">
                            <div className="flex-shrink-0 w-10 h-10 border border-stone-700 flex items-center justify-center">
                              <span className="font-serif text-2xl text-amber-300/60">{step.n}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-lg text-stone-100 mb-2">{step.headline}</h4>
                              <p className="text-stone-400 text-sm leading-relaxed">{step.detail}</p>
                              {step.action && (
                                <p className="mt-2 text-[10px] uppercase tracking-widest text-amber-400/70 flex items-center gap-1">
                                  <ChevronRight size={10} /> {step.action}
                                </p>
                              )}
                            </div>
                            {linkedCard && (
                              <div
                                className="flex-shrink-0 w-2 self-stretch rounded-full"
                                style={{ background: linkedCard.color }}
                                title={linkedCard.name}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* § II. Card-by-card earning guides */}
      {view === "cards" && (
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 space-y-1">
            {Object.entries(cardGuides).map(([id, guide]) => {
              const isActive = activeGuide === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveGuide(isActive ? null : id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 border transition-all ${
                    isActive
                      ? "border-amber-700/50 bg-stone-900/60 text-amber-100"
                      : "border-stone-800 bg-stone-900/20 hover:border-stone-700 text-stone-300"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: guide.color }}
                  />
                  <span className="font-serif text-base leading-tight">{guide.name}</span>
                  <ChevronRight
                    size={14}
                    className={`ml-auto flex-shrink-0 transition-transform text-stone-600 ${isActive ? "rotate-90 text-amber-300" : ""}`}
                  />
                </button>
              );
            })}
          </div>

          <div className="md:col-span-8">
            {!activeGuide ? (
              <div className="h-full flex items-center justify-center border border-dashed border-stone-800 min-h-64">
                <div className="text-center">
                  <Lightbulb className="mx-auto text-stone-700 mb-3" size={28} />
                  <p className="text-stone-500 text-sm">{g.selectCard}</p>
                </div>
              </div>
            ) : (
              (() => {
                const guide = cardGuides[activeGuide];
                const card = CARDS.find((c) => c.id === activeGuide);
                return (
                  <div
                    className="border border-stone-800 rounded-sm overflow-hidden"
                    style={{ background: `linear-gradient(180deg, ${guide.color}20 0%, transparent 30%)` }}
                  >
                    <div className="p-6 border-b border-stone-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-1">
                        {card?.issuer} · {g.stepByStep}
                      </p>
                      <h3 className="font-serif text-3xl text-stone-100">{guide.name}</h3>
                    </div>

                    <div className="p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70 mb-4">{g.stepByStep}</p>
                      <ol className="space-y-4 mb-8">
                        {guide.steps.map((step, i) => (
                          <li key={i} className="flex gap-4">
                            <span className="flex-shrink-0 w-6 h-6 border border-stone-700 flex items-center justify-center text-xs font-serif text-amber-300/70">
                              {i + 1}
                            </span>
                            <p className="text-stone-300 text-sm leading-relaxed pt-0.5">{step}</p>
                          </li>
                        ))}
                      </ol>

                      <div className="border-t border-stone-800 pt-6">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70 mb-4 flex items-center gap-2">
                          <Lightbulb size={12} /> {g.proTips}
                        </p>
                        <ul className="space-y-3">
                          {guide.proTips.map((tip, i) => (
                            <li key={i} className="flex gap-3 text-stone-400 text-sm">
                              <span className="text-amber-400/60 font-serif flex-shrink-0">·</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {card && (
                        <button
                          onClick={() => openCard(card)}
                          className="mt-6 w-full py-3 border border-amber-400/40 text-amber-200 text-xs uppercase tracking-[0.3em] hover:bg-amber-400 hover:text-stone-950 transition-all"
                        >
                          {g.viewDetails}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PointsAtlas() {
  const [tab, setTab] = useState("discover");
  const [selectedCard, setSelectedCard] = useState(null);
  const [tracked, setTracked] = useLocal("points-atlas-tracked", []);
  const [lang, setLang] = useState("en");

  const addToTracker = (card) => {
    if (tracked.find((t) => t.id === card.id)) return;
    setTracked([
      ...tracked,
      { id: card.id, openedDate: new Date().toISOString().slice(0, 10), spent: 0 },
    ]);
    setSelectedCard(null);
    setTab("tracker");
  };

  return (
    <LangContext.Provider value={lang}>
      <div className="min-h-screen bg-stone-950 text-stone-200" style={{ fontFamily: "'Inter', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap');
          .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
          input[type="range"]::-webkit-slider-thumb { background: #fcd34d; }
          ::selection { background: #fcd34d; color: #0c0a09; }
          details summary::-webkit-details-marker { display: none; }
        `}</style>

        <div className="fixed inset-0 pointer-events-none opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        <Header tab={tab} setTab={setTab} lang={lang} setLang={setLang} />
        {tab === "discover" && <HeroQuote />}

        <main>
          {tab === "discover" && <Discover openCard={setSelectedCard} />}
          {tab === "guide" && <Playbook openCard={setSelectedCard} />}
          {tab === "tracker" && <Tracker tracked={tracked} setTracked={setTracked} />}
          {tab === "rules" && <Rules />}
          {tab === "value" && <ValueCalculator />}
        </main>

        <CardDetail
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddToTracker={addToTracker}
          inTracker={selectedCard ? !!tracked.find((t) => t.id === selectedCard.id) : false}
        />

        <footer className="border-t border-stone-900 py-8 text-center">
          <p className="text-xs text-stone-600 italic">{T[lang].footer}</p>
        </footer>
      </div>
    </LangContext.Provider>
  );
}
