import React, { useState, useEffect, useMemo } from "react";
import { Plane, Hotel, UtensilsCrossed, ShoppingCart, Fuel, Sparkles, Calendar, TrendingUp, AlertCircle, Check, X, ChevronRight, CreditCard, Award, Clock, Target, Compass, Flame, BookOpen, Map, Lightbulb } from "lucide-react";

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

const PLAYS = [
  {
    id: "japan-biz",
    goal: "Japan in Business Class",
    subtitle: "Round-trip ANA or JAL — $0 out of pocket",
    difficulty: "Intermediate",
    timeframe: "3–6 months",
    totalValue: "$6,000–$10,000 in flights",
    color: "#1a4480",
    cards: ["csp", "ink", "amex-gold"],
    steps: [
      {
        n: 1,
        headline: "Chase Sapphire Preferred 먼저 신청",
        detail: "Chase 5/24 룰 때문에 Chase 카드를 제일 먼저 받아야 함. CSP는 75k UR 보너스로 기본 재료. 3개월 안에 $5,000 사용.",
        card: "csp",
        action: "Apply at chase.com",
      },
      {
        n: 2,
        headline: "Min Spend $5,000 채우기",
        detail: "자연스럽게: 식료품(3x), 다이닝(3x), 스트리밍(3x). 부족하면 payUSAtax.com으로 세금 납부 (수수료 1.85% < 포인트 가치), 또는 보험 선납.",
        card: null,
        action: "Route all spend here for 3 months",
      },
      {
        n: 3,
        headline: "Ink Business Preferred 추가 (사이드 비즈니스 있으면)",
        detail: "프리랜서, 이베이 판매, 컨설팅 등 소득 있으면 비즈 카드 신청 가능. 5/24에 안 걸림. 100k UR 추가로 총 175k UR.",
        card: "ink",
        action: "Does NOT count toward 5/24",
      },
      {
        n: 4,
        headline: "Chase UR → ANA 1:1 트랜스퍼",
        detail: "Chase 앱 → Transfer Points → ANA Mileage Club. 왕복 비즈니스 클래스: 서부 출발 88k, 동부 출발 95k 마일 + 약 $200 세금.",
        card: null,
        action: "Log in → Transfer Points → ANA",
      },
      {
        n: 5,
        headline: "ANA 'The Room' 비즈니스 예약",
        detail: "ana.co.jp에서 직접 예약. 왕복 88,000 마일 + $200 세금 = 현금 환산 $6,000–$10,000짜리 좌석. 11개월 전부터 예약 오픈.",
        card: null,
        action: "Book at ana.co.jp",
      },
    ],
  },
  {
    id: "starter",
    goal: "First-Timer Starter Pack",
    subtitle: "처음 시작하는 사람을 위한 최적 시퀀스",
    difficulty: "Beginner",
    timeframe: "1–4 months",
    totalValue: "$2,500+ in travel",
    color: "#2d5a3d",
    cards: ["csp", "amex-gold"],
    steps: [
      {
        n: 1,
        headline: "CSP로 시작 — Chase 카드는 무조건 먼저",
        detail: "5/24 룰 때문에 Chase 카드는 총 5장 안에 받아야 함. 다른 카드 먼저 받으면 막힘. CSP가 첫 카드로 최적: 75k 보너스, 해외결제 수수료 없음, 강력한 트랜스퍼 파트너.",
        card: "csp",
        action: "Start here — non-negotiable",
      },
      {
        n: 2,
        headline: "3개월 안에 $5,000 사용",
        detail: "모든 식비, 배달앱, 구독 서비스를 CSP로. 부족하면 배우자/파트너를 AU(Authorized User)로 추가 — 그들 사용금액도 합산됨.",
        card: null,
        action: "Add partner as Authorized User",
      },
      {
        n: 3,
        headline: "90일 후 Amex Gold 신청",
        detail: "이제 Chase 생태계를 잠깐 벗어남. Amex Gold는 다이닝·마트 4x로 일상 지출 최강. 100k 보너스 (6개월/$6,000). Amex 평생 1회 룰이 있으니 타이밍 중요.",
        card: "amex-gold",
        action: "Wait 90 days between apps",
      },
      {
        n: 4,
        headline: "카테고리별 카드 분리",
        detail: "식당·마트 → Amex Gold (4x). 여행·그 외 → CSP (2x). 절대 1x짜리 카드 쓰지 말 것. 이 두 장으로 평균 3x+ 적립.",
        card: null,
        action: "Never use a 1x card again",
      },
      {
        n: 5,
        headline: "첫 번째 무료 여행: UR → Hyatt",
        detail: "75,000 UR = Park Hyatt 2박 (1박 현금가 $400–800). Chase → Hyatt 1:1 트랜스퍼. 포인트의 가치를 피부로 느끼는 첫 경험.",
        card: null,
        action: "Chase → Hyatt 1:1 transfer",
      },
    ],
  },
  {
    id: "luxury-hotel",
    goal: "럭셔리 호텔 무료 숙박",
    subtitle: "Park Hyatt, Conrad, Marriott — 현금 $0",
    difficulty: "Beginner",
    timeframe: "3–6 months",
    totalValue: "$400–$1,200 per night",
    color: "#4a2d2d",
    cards: ["csp", "amex-gold", "hilton-aspire"],
    steps: [
      {
        n: 1,
        headline: "Hyatt 狙うなら: CSP → Hyatt 트랜스퍼",
        detail: "Chase UR → World of Hyatt 1:1이 호텔 트랜스퍼 중 최고의 가치. 75k UR = Park Hyatt Tokyo 2박 (1박 $700+). 포인트 게임에서 최고의 스윗스팟.",
        card: "csp",
        action: "Transfer to Hyatt 1:1",
      },
      {
        n: 2,
        headline: "Hilton 狙うなら: Aspire 카드로 자동 무료 숙박",
        detail: "Hilton Aspire는 연 1회 무료 주말 숙박권 자동 제공 ($30k 사용 시 추가 1회). Diamond 상태 자동 부여 = 무료 조식 + 업그레이드. 175k 보너스 = 추가 2–3박.",
        card: "hilton-aspire",
        action: "Free night cert auto-issued yearly",
      },
      {
        n: 3,
        headline: "비수기·평일 예약으로 포인트 30% 절감",
        detail: "Hyatt의 Peak/Off-Peak 가격제: 같은 호텔이 비수기에 20–30% 적은 포인트. 주말보다 평일이 저렴. 날짜를 유연하게 잡으면 1박이 2박으로.",
        card: null,
        action: "Search off-peak dates first",
      },
      {
        n: 4,
        headline: "Diamond/Globalist 혜택 스택",
        detail: "Hilton Aspire → Diamond 상태 자동: 무료 조식 + 공항 라운지 + 스위트 업그레이드. Conrad나 Waldorf에서 이 혜택 = 숙박가 대비 50–100% 추가 가치.",
        card: null,
        action: "Stack status with free night certs",
      },
      {
        n: 5,
        headline: "Marriott는 Boundless 카드로 Free Night Awards",
        detail: "Marriott Boundless: 연 1회 35k 포인트 무료 숙박권. 유럽 Marriott Category 4–5 호텔 (1박 현금 $250–400)에 딱 맞음.",
        card: "marriott-bonvoy",
        action: "35k free night cert yearly",
      },
    ],
  },
  {
    id: "everyday-max",
    goal: "일상 지출 완전 최적화",
    subtitle: "매달 쓰는 돈으로 연간 $2,000+ 적립",
    difficulty: "Beginner",
    timeframe: "Ongoing",
    totalValue: "$1,500–$3,000/yr",
    color: "#8a6f3a",
    cards: ["amex-gold", "bilt", "csp", "citi-strata"],
    steps: [
      {
        n: 1,
        headline: "Amex Gold: 식당·마트 4x",
        detail: "모든 음식 관련 지출을 여기로. 외식, 배달앱, 미국 마트 전부 4x MR. 식비 $1,500/월 기준 연간 72,000 MR = 약 $1,440 가치.",
        card: "amex-gold",
        action: "Every restaurant & grocery → Gold",
      },
      {
        n: 2,
        headline: "Bilt: 월세 1x (수수료 0)",
        detail: "월세를 포인트로 전환하는 유일한 카드. $2,500 월세 기준 연 30,000 Bilt 포인트 = $600. 매월 1일 'Rent Day'는 모든 구매 2x.",
        card: "bilt",
        action: "Pay rent on the 1st for 2x bonus",
      },
      {
        n: 3,
        headline: "CSP: 여행·그 외 모든 지출 2x",
        detail: "항공, 호텔, Lyft, DoorDash 등 여행 관련은 CSP로. 식비 제외한 나머지 지출의 캐치올 카드. Chase Travel 포털 사용 시 5x.",
        card: "csp",
        action: "All travel spend → CSP",
      },
      {
        n: 4,
        headline: "Citi Strata: 주유·마트 백업 (3x)",
        detail: "Visa/Amex 안 받는 곳, 또는 주유·마트 Mastercard 필요 시. Citi Travel 포털 이용 시 호텔 10x. 연회비 $95 치고 범용성 높음.",
        card: "citi-strata",
        action: "Backup for gas + Mastercard merchants",
      },
      {
        n: 5,
        headline: "절대 1x 카드 쓰지 말 것",
        detail: "2% 캐시백 카드를 3x–4x 포인트 카드 대신 쓰면 달러당 1–2¢ 손실. 이 스택 평균 3x+ = 연 $3,000 지출마다 $60–90 추가 가치.",
        card: null,
        action: "Average 3x+ across all spend",
      },
    ],
  },
  {
    id: "business-stack",
    goal: "비즈니스 여행자 스택",
    subtitle: "라운지 + 크레딧 + 300k 보너스",
    difficulty: "Advanced",
    timeframe: "6–12 months",
    totalValue: "$8,000+ first year",
    color: "#3a3a2d",
    cards: ["amex-biz-plat", "ink", "amex-plat"],
    steps: [
      {
        n: 1,
        headline: "Amex Business Platinum 먼저",
        detail: "300,000 MR after $20,000/3개월. 많아 보이지만 비즈니스 비용(외주, 소프트웨어, 재고, 광고비)이면 충분. 포인트 가치 $6,000+.",
        card: "amex-biz-plat",
        action: "Biggest SUB in the game right now",
      },
      {
        n: 2,
        headline: "Centurion + Priority Pass 라운지 활성화",
        detail: "Amex Biz Plat = Priority Pass (게스트 10명 무료), Centurion Lounge, Delta Sky Club (Delta 탑승 시), Global Lounge Collection. 월 1회 이상 출장이면 연 $500+ 가치.",
        card: null,
        action: "Activate Priority Pass immediately",
      },
      {
        n: 3,
        headline: "Ink Business Preferred로 비즈니스 지출 3x",
        detail: "인터넷, 전화, 광고(Google/Meta), 배송비 3x (연 $150k 한도). 디지털 마케팅 비용이 크면 이 카드만으로도 연간 수만 포인트. 100k UR 보너스 추가.",
        card: "ink",
        action: "3x on Google Ads, internet, shipping",
      },
      {
        n: 4,
        headline: "Amex Plat 크레딧 최대 활용",
        detail: "$200 항공 크레딧 + $200 호텔 크레딧 + $300 다이닝 크레딧 = $700. 연회비 $895 중 $700 상쇄. 사실상 net $195짜리 카드.",
        card: "amex-plat",
        action: "Set credits on day 1 — don't forget",
      },
      {
        n: 5,
        headline: "300k MR → Singapore Airlines Suites",
        detail: "Amex MR → Singapore KrisFlyer 1:1. Singapore First Class (Suites) 편도 일본/동남아: 약 100k 마일. 현금가 $10,000–$20,000. 세계 최고 First Class 경험.",
        card: null,
        action: "Amex → Singapore 1:1 → Suites",
      },
    ],
  },
];

const CARD_GUIDES = {
  csp: {
    name: "Chase Sapphire Preferred",
    color: "#1a4480",
    steps: [
      "chase.com에서 신청 — 즉시 승인 또는 수일 내 결정",
      "카드 도착 즉시 자동이체 설정 후 모든 식비·여행·스트리밍 라우팅",
      "$5,000/3개월: 보험 선납, 세금(payUSAtax.com), 유틸리티 선납으로 채우기",
      "Chase Travel 포털로 항공·호텔 예약 시 5x (SUB 기간 중 특히 적극 활용)",
      "SUB 후 → Chase UR을 Hyatt 1:1 트랜스퍼 (최고 스윗스팟)",
    ],
    proTips: [
      "배우자/파트너를 Authorized User로 추가 — 그들 지출도 min spend 합산",
      "DashPass 멤버십 포함 → DoorDash 5x + 무료 배달",
      "Lyft 탑승 10x (분기별 확인 필요)",
    ],
  },
  "amex-gold": {
    name: "Amex Gold",
    color: "#8a6f3a",
    steps: [
      "신청 즉시 4x 카테고리 확인: 모든 레스토랑 + 미국 마트 자동 적용",
      "모든 음식 관련 지출을 여기로 집중 — 다른 카드 절대 쓰지 말 것",
      "$6,000/6개월: 식비, 배달앱, 음식점으로 자연스럽게 달성",
      "$10/월 다이닝 크레딧 사용 (Grubhub, Cheesecake Factory 등) — 월초 리마인더 설정",
      "MR → Hyatt 1:1 또는 ANA 1:1로 트랜스퍼해 최대 가치 실현",
    ],
    proTips: [
      "Walmart+ 구독 = 마트로 인식 → 4x 적립",
      "$10/월 Uber Cash 자동 제공 (Uber 앱에 카드 등록 필수)",
      "Whole Foods, Trader Joe's, 대형 체인 전부 4x",
    ],
  },
  "amex-biz-plat": {
    name: "Amex Business Platinum",
    color: "#3a3a2d",
    steps: [
      "비즈니스 등록 없어도 신청 가능 — 프리랜서, 1인 사업자, 부업 모두 해당",
      "$20,000/3개월: 비즈니스 경비 선납, 외주 비용, 소프트웨어 연간 결제",
      "Priority Pass 즉시 활성화 → 첫 출장부터 라운지 사용",
      "연 $200 항공 크레딧: 카드 등록 후 1개 항공사 선택, 수하물·좌석 업그레이드에 사용",
      "300k MR → Singapore Airlines → First Class Suites 예약 (최고 가치 환산)",
    ],
    proTips: [
      "Adobe, Slack, AWS 등 소프트웨어 연간 결제로 min spend 쉽게 충족",
      "항공 직구매 5x (여행사 통하면 1.5x로 감소)",
      "35% Rebate: 특정 항공사 Business/First를 MR로 구매 시 35% 환급",
    ],
  },
  bilt: {
    name: "Bilt Blue",
    color: "#1a1a1a",
    steps: [
      "Bilt 앱 다운로드 → 월세 납부 방식 설정 (집주인 계좌 직접 연동 또는 Bilt 포털)",
      "포인트 적립 조건: 월 5회 이상 결제 필수 (월세 포함)",
      "매월 1일 Rent Day: 그날 모든 결제 2x — 큰 지출은 1일로 몰기",
      "Bilt 포인트 → Hyatt 1:1 트랜스퍼 (월세를 럭셔리 호텔로 변환)",
      "더 높은 혜택 필요 시 Obsidian($95) 또는 Palladium($495) 업그레이드 고려",
    ],
    proTips: [
      "Bilt → United, American Airlines, Hyatt 전부 1:1 트랜스퍼",
      "연회비 $0 → 영구 보유 카드로 크레딧 히스토리 유지에 유리",
      "Palladium 카드: 50k 보너스 + $300 Bilt Cash (연회비 $495 상쇄)",
    ],
  },
  csp: {
    name: "Chase Sapphire Preferred",
    color: "#1a4480",
    steps: [
      "chase.com에서 신청 — 즉시 승인 또는 수일 내 결정",
      "카드 도착 즉시 자동이체 설정 후 모든 식비·여행·스트리밍 라우팅",
      "$5,000/3개월: 보험 선납, 세금(payUSAtax.com), 유틸리티 선납으로 채우기",
      "Chase Travel 포털로 항공·호텔 예약 시 5x (SUB 기간 중 특히 적극 활용)",
      "SUB 후 → Chase UR을 Hyatt 1:1 트랜스퍼 (최고 스윗스팟)",
    ],
    proTips: [
      "배우자/파트너를 Authorized User로 추가 — 그들 지출도 min spend 합산",
      "DashPass 멤버십 포함 → DoorDash 5x + 무료 배달",
      "Lyft 탑승 10x (분기별 확인 필요)",
    ],
  },
  ink: {
    name: "Ink Business Preferred",
    color: "#2d5a3d",
    steps: [
      "소득이 있는 활동(프리랜서, 이베이, 컨설팅 등)으로 신청 — 사업자 등록 불필요",
      "5/24에 카운트 안 됨 → Chase 개인 카드와 동시 진행 가능",
      "3x 카테고리 집중: 인터넷, 전화, 배송비, Google/Meta 광고비 ($150k/년 한도)",
      "$8,000/3개월: 비즈니스 소프트웨어 연간 결제, 사무용품, 통신비 선납",
      "100k UR → ANA(일본행), Hyatt(호텔), 또는 Southwest(미국 내 저가 항공)로 트랜스퍼",
    ],
    proTips: [
      "Chase.com에서 '비즈니스 신용카드'로 신청 → 개인 크레딧 점수 기반 심사",
      "Slack, Zoom, AWS 등 SaaS 비용 → 3x 적립",
      "CSP + Ink Preferred 조합이 US 포인트 게임의 기본 중 기본",
    ],
  },
  "venture-x": {
    name: "Capital One Venture X",
    color: "#3d2d4a",
    steps: [
      "신청 전 최근 조회 수 최소화 — Capital One은 3개 신용국 전부 조회함",
      "신청 시 기존 C1 카드 없는 게 유리 (개인 최대 2장)",
      "$4,000/3개월: 일상 지출로 자연스럽게 달성 가능",
      "$300 여행 크레딧 즉시 활성화 → Capital One Travel 포털에서 항공·호텔 예약",
      "매년 10,000 마일 생일 보너스 → 카드 보유만으로 연 $200 가치",
    ],
    proTips: [
      "Lounge Access: Capital One 라운지 + Priority Pass (게스트 2명 무료)",
      "net 연회비: $395 - $300 크레딧 - $200 마일 보너스 = 사실상 $-105",
      "C1 Miles → Avianca(저렴한 Star Alliance 항공권), Turkish, Air Canada로 트랜스퍼",
    ],
  },
  "hilton-aspire": {
    name: "Hilton Honors Aspire",
    color: "#3a4a5a",
    steps: [
      "Amex 플랫폼 → 평생 1회 보너스 규칙 적용 (첫 신청인지 확인)",
      "카드 발급 즉시 Diamond 상태 자동 부여 → Hilton 앱에서 확인",
      "$4,000/3개월: 다이닝(7x), 여행(7x) 카테고리 집중 활용",
      "연 무료 주말 숙박권 발급 확인 (발급 후 1년 내 사용)",
      "Diamond 혜택 활용: 무료 조식, 라운지, 업그레이드 요청 (체크인 시 Globalist 언급)",
    ],
    proTips: [
      "$30k 추가 사용 시 무료 숙박권 1장 추가 = 연 2장",
      "Conrad, Waldorf Astoria에서 Diamond 무료 조식 = $50–100/박 절약",
      "175k 보너스 시 복귀할 경우: 정기적으로 elevated 오퍼 모니터링",
    ],
  },
  "citi-strata": {
    name: "Citi Strata Premier",
    color: "#2d4a4a",
    steps: [
      "48개월 룰 확인: 동일 제품군(ThankYou)에서 보너스 받거나 해지한 지 4년 지났는지",
      "75k 보너스: $4,000/3개월 — 마트(3x), 주유(3x), 다이닝(3x)으로 쉽게 달성",
      "Citi Travel 포털에서 호텔 예약 시 10x — SUB 기간 중 전략적 활용",
      "ThankYou 포인트 → Choice Hotels 2:1 트랜스퍼 (유럽 Choice 호텔 4¢/pt 가치)",
      "연 $100 호텔 크레딧 (Citi Travel 포털 $500+ 예약 시) 활용",
    ],
    proTips: [
      "Citi TYP → Turkish Miles&Smiles 1:1 → United 항공권 7,500마일 편도 (국내선)",
      "Mastercard라 Amex 안 받는 곳에서 유용한 백업 카드",
      "주유 3x는 Citi TYP 중 드문 카테고리 — 기름값 많으면 메인 카드로 활용 가능",
    ],
  },
  "alaska-summit": {
    name: "Alaska Atmos Rewards Summit",
    color: "#1a3a4a",
    steps: [
      "BoA 2/3/4 룰 체크: 2개월 내 2장, 12개월 내 3장, 24개월 내 4장 초과 금지",
      "100k 마일 + 25k Global Companion Award: $6,500/3개월 목표",
      "Alaska Airlines 직구매 3x, 여행 2x 집중",
      "Global Companion Award로 동반자 비즈니스 클래스 티켓 할인 활용",
      "Oneworld 파트너 항공사(British Airways, Cathay, Finnair)로 트랜스퍼 가능",
    ],
    proTips: [
      "JAL First Class 하와이→도쿄 편도: 70k 마일 (현금가 $5,000+)",
      "British Airways Avios → 단거리 American Airlines 항공권 (7,500 마일부터)",
      "Alaska 자체 노선: Pacific Northwest, Hawaii, 멕시코 저렴한 스윗스팟 多",
    ],
  },
  "marriott-bonvoy": {
    name: "Marriott Bonvoy Boundless",
    color: "#4a2d2d",
    steps: [
      "Chase 5/24 카운트됨 → Chase 카드 시퀀스 내에서 계획적으로 신청",
      "3 Free Night Awards (최대 50k pts each): $3,000/3개월 후 발급",
      "Marriott 앱에서 무료 숙박권 확인 → Category 4–5 호텔에 사용 (유럽, 아시아 추천)",
      "연 $100 항공 구매 크레딧 활용 (2026년 신규 혜택)",
      "연간 35k 무료 숙박권 자동 발급 (카드 보유 유지 시)",
    ],
    proTips: [
      "Marriott Bonvoy → Hyatt 불가 but → 항공사 마일리지 전환 가능 (3:1 비율, 비효율)",
      "Free Night Award는 Category 4–5에 사용할 때 최고 가치 ($250–400/박)",
      "실버 엘리트 자동 부여 → 레이트 체크아웃, 포인트 보너스",
    ],
  },
  "amex-plat": {
    name: "Amex Platinum",
    color: "#5a4a2d",
    steps: [
      "Pop-up 룰 확인 — 신청 전 incognito로 사전 체크 (팝업 뜨면 보너스 없음)",
      "$12,000/6개월: 여행비, 세금, 보험, 렌트비 등 큰 지출 집중",
      "항공 직구매 5x — 반드시 항공사 직접 예매 (여행사/OTA 제외)",
      "첫 달: $200 항공 크레딧, $200 호텔 크레딧, $300 다이닝 크레딧 전부 설정",
      "175k MR → ANA 비즈니스 클래스 왕복 또는 Singapore Suites 편도",
    ],
    proTips: [
      "Centurion Lounge: 탑승일 해당 항공사 탑승권 있으면 무료 입장",
      "Fine Hotels & Resorts: $200 크레딧 + 무료 조식 + 룸 업그레이드 + 레이트 체크아웃",
      "Global Entry 크레딧 $100 (TSA PreCheck 포함) — 4년마다 갱신",
    ],
  },
};

const CATEGORY_META = {
  dining: { label: "Dining", icon: UtensilsCrossed },
  travel: { label: "Travel", icon: Plane },
  groceries: { label: "Groceries", icon: ShoppingCart },
  streaming: { label: "Streaming", icon: Sparkles },
  gas: { label: "Gas", icon: Fuel },
  other: { label: "Everything else", icon: CreditCard },
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

function Header({ tab, setTab }) {
  const tabs = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "guide", label: "Guide", icon: Map },
    { id: "tracker", label: "Tracker", icon: Calendar },
    { id: "rules", label: "Rules", icon: BookOpen },
    { id: "value", label: "Value", icon: TrendingUp },
  ];
  return (
    <header className="border-b border-stone-800/60 bg-stone-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-serif italic text-amber-200 tracking-tight">Points</span>
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500 font-light">Atlas · Vol I</span>
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
  return (
    <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
      <div className="grid md:grid-cols-12 gap-8 items-end">
        <div className="md:col-span-8">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-4">A field guide for the points-curious</p>
          <h1 className="font-serif text-5xl md:text-7xl text-stone-100 leading-[0.95] tracking-tight">
            The map is not <em className="text-amber-200">the territory</em> —
            <br />
            but it gets you to <span className="underline decoration-amber-400/40 decoration-2 underline-offset-8">Tokyo</span> in business class.
          </h1>
        </div>
        <div className="md:col-span-4 border-l border-stone-800 pl-6">
          <p className="text-stone-400 text-sm leading-relaxed font-light">
            Eleven cards. Seven currencies. One coherent strategy. This atlas helps you decide which signup bonus to chase next, what rules constrain you, and what those points are actually worth.
          </p>
          <p className="text-xs text-stone-600 mt-3 italic">Updated April 2026 · USA</p>
        </div>
      </div>
    </div>
  );
}

function Discover({ openCard }) {
  const [spend, setSpend] = useState({ dining: 800, travel: 400, groceries: 600, streaming: 50, gas: 200, other: 1500 });
  const [maxFee, setMaxFee] = useState(800);
  const [rule524, setRule524] = useState(false);
  const [pointPref, setPointPref] = useState("any");
  const [sort, setSort] = useState("score");

  const scored = useMemo(() => {
    return CARDS.map((c) => {
      const monthlyPoints = Object.entries(spend).reduce((acc, [cat, amt]) => {
        return acc + amt * (c.categories[cat] || 1);
      }, 0);
      const annualPoints = monthlyPoints * 12;
      const ptVal = POINT_VALUES[c.pointType] || 0.015;
      const annualValue = annualPoints * ptVal - c.annualFee;
      const totalFirstYear = annualValue + c.bonusValueUSD;

      let blocked = null;
      if (c.annualFee > maxFee) blocked = "Annual fee exceeds your limit";
      if (rule524 && c.rules.some((r) => r.includes("5/24") && !r.includes("does NOT"))) blocked = "Blocked by Chase 5/24";
      if (pointPref !== "any" && c.pointType !== pointPref) blocked = "Different point currency";

      return { ...c, annualPoints, annualValue, totalFirstYear, blocked };
    }).sort((a, b) => {
      if (a.blocked && !b.blocked) return 1;
      if (!a.blocked && b.blocked) return -1;
      if (sort === "bonus") return b.bonusValueUSD - a.bonusValueUSD;
      if (sort === "fee") return a.annualFee - b.annualFee;
      return b.totalFirstYear - a.totalFirstYear;
    });
  }, [spend, maxFee, rule524, pointPref, sort]);

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-amber-300 font-serif text-xl italic">§ I.</span>
          <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">Tell us how you spend</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-stone-900/40 border border-stone-800/60 p-6 rounded-sm">
          {Object.entries(CATEGORY_META).map(([key, meta]) => {
            const Icon = meta.icon;
            return (
              <label key={key} className="block group">
                <div className="flex items-center gap-2 mb-2 text-stone-400 group-hover:text-amber-200 transition-colors">
                  <Icon size={14} />
                  <span className="text-xs uppercase tracking-wider">{meta.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-stone-500 text-sm">$</span>
                  <input
                    type="number"
                    value={spend[key]}
                    onChange={(e) => setSpend({ ...spend, [key]: Math.max(0, Number(e.target.value)) })}
                    className="bg-transparent border-b border-stone-700 focus:border-amber-300 outline-none text-2xl font-serif text-stone-100 w-24 transition-colors"
                  />
                  <span className="text-xs text-stone-600 ml-1">/mo</span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-amber-300 font-serif text-xl italic">§ II.</span>
          <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">Set your constraints</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-stone-900/40 border border-stone-800/60 p-5 rounded-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">Max annual fee tolerance</p>
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
              <p className="text-xs uppercase tracking-wider text-stone-500">I'm at 5/24</p>
              <div className={`w-4 h-4 border ${rule524 ? "bg-amber-400 border-amber-400" : "border-stone-600"}`}>
                {rule524 && <Check size={14} className="text-stone-950" />}
              </div>
            </div>
            <p className="text-sm text-stone-300 font-light">Hide Chase personal cards I can't get</p>
          </button>
          <div className="bg-stone-900/40 border border-stone-800/60 p-5 rounded-sm">
            <p className="text-xs uppercase tracking-wider text-stone-500 mb-3">Currency preference</p>
            <select
              value={pointPref}
              onChange={(e) => setPointPref(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 px-3 py-2 text-stone-200 text-sm focus:border-amber-400 outline-none"
            >
              <option value="any">Any currency</option>
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
            <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">The recommendation</h2>
          </div>
          <div className="flex gap-2 text-xs">
            {[
              { id: "score", label: "Year 1 value" },
              { id: "bonus", label: "Bonus size" },
              { id: "fee", label: "Lowest fee" },
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
        <p className="text-[10px] uppercase tracking-widest text-stone-600">Bonus</p>
        <p className="font-serif text-lg text-amber-200">{fmt(card.bonus)}</p>
        <p className="text-[10px] text-stone-500">≈ {fmtUSD(card.bonusValueUSD)}</p>
      </div>
      <div className="col-span-3 sm:col-span-2">
        <p className="text-[10px] uppercase tracking-widest text-stone-600">Year 1 net</p>
        <p className={`font-serif text-lg ${blocked ? "text-stone-600" : "text-stone-100"}`}>
          {fmtUSD(card.totalFirstYear)}
        </p>
        <p className="text-[10px] text-stone-500">after ${card.annualFee} fee</p>
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
            ← Close
          </button>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-2">{card.issuer} · {card.network}</p>
          <h2 className="font-serif text-4xl text-stone-100 leading-tight mb-3">{card.name}</h2>
          <p className="text-stone-400 italic font-light">"{card.tagline}"</p>
        </div>

        <div className="px-8 pb-8 space-y-8">
          <div className="grid grid-cols-3 gap-4 border-y border-stone-800 py-6">
            <Stat label="Annual fee" value={fmtUSD(card.annualFee)} />
            <Stat label="Sign-up bonus" value={fmt(card.bonus)} sub={card.bonusUnit} />
            <Stat label="Min. spend" value={fmtUSD(card.minSpend)} sub={`in ${card.spendWindow} mo`} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">The sweet spot</p>
            <p className="text-stone-200 font-serif text-lg leading-snug">{card.sweetSpot}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">Earning rates</p>
            <div className="space-y-2">
              {Object.entries(card.categories).map(([k, v]) => {
                const meta = CATEGORY_META[k];
                const Icon = meta.icon;
                return (
                  <div key={k} className="flex items-center justify-between border-b border-stone-900 py-2">
                    <span className="flex items-center gap-3 text-stone-400 text-sm">
                      <Icon size={14} className="text-stone-600" />
                      {meta.label}
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
            <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-3">Application rules</p>
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
            {inTracker ? "✓ Already tracking" : "Track this signup bonus →"}
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
          <h3 className="font-serif text-2xl text-stone-300 mb-2">No applications in flight</h3>
          <p className="text-stone-500 text-sm">Head to <em className="text-amber-300">Discover</em> to start tracking a signup bonus.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-amber-300 font-serif text-xl italic">§</span>
        <h2 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">In flight</h2>
        <span className="text-stone-600 text-xs">{tracked.length} {tracked.length === 1 ? "card" : "cards"}</span>
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
                  <span className="uppercase tracking-wider">Min spend progress</span>
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
                  <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Opened</p>
                  <input
                    type="date"
                    value={t.openedDate}
                    onChange={(e) => updateDate(t.id, e.target.value)}
                    className="bg-transparent text-stone-300 text-sm border-b border-stone-800 focus:border-amber-300 outline-none w-full"
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">Days remaining</p>
                  <p className={`font-serif text-2xl ${danger ? "text-red-400" : daysLeft < 30 ? "text-amber-300" : "text-stone-200"}`}>
                    {daysLeft < 0 ? "Expired" : `${daysLeft}d`}
                  </p>
                </div>
              </div>

              {pct >= 100 ? (
                <div className="mt-4 flex items-center gap-2 text-green-400 text-xs uppercase tracking-wider">
                  <Check size={14} /> Bonus earned · award {fmt(card.bonus)} {card.bonusUnit}
                </div>
              ) : danger ? (
                <div className="mt-4 flex items-center gap-2 text-red-400 text-xs uppercase tracking-wider">
                  <Flame size={14} /> Behind schedule — need {fmtUSD(card.minSpend - t.spent)} in {daysLeft}d
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-stone-500 text-xs">
                  <Target size={14} /> {fmtUSD(card.minSpend - t.spent)} to go · {fmtUSD(Math.ceil((card.minSpend - t.spent) / Math.max(1, daysLeft)))} per day
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
  const rules = [
    {
      issuer: "Chase",
      title: "The 5/24 rule",
      color: "#1a4480",
      essence: "If you've opened 5+ personal credit cards across all banks in the past 24 months, Chase will deny most of their applications.",
      details: [
        "Counts cards from ALL issuers — not just Chase",
        "Authorized user accounts may count (varies by reporting bureau)",
        "Most Chase business cards do NOT count toward the limit",
        "Strategy: get Chase cards first, then move to other issuers",
      ],
    },
    {
      issuer: "American Express",
      title: "1 per lifetime",
      color: "#5a4a2d",
      essence: "You can earn the welcome bonus on each specific Amex card exactly once — ever. Cancel and reapply? No bonus.",
      details: [
        "Tracked by card product, not by your relationship with Amex",
        "Pop-up message during application reveals if you're ineligible",
        "CardMatch and pre-qualified offers can sometimes bypass",
        "The 1/5/24 rule limits you to 1 new Amex card per 5 days, 5 total per 24 months",
      ],
    },
    {
      issuer: "Citi",
      title: "48-month rule",
      color: "#2d4a4a",
      essence: "No bonus if you've earned or canceled a card in the same 'family' within the past 48 months.",
      details: [
        "Families: AAdvantage, ThankYou, Hilton, etc.",
        "Closing also restarts the clock — it's earned OR closed",
        "More restrictive than Chase 5/24 in many ways",
        "But: only triggers within product families, not bank-wide",
      ],
    },
    {
      issuer: "Capital One",
      title: "Inquiry sensitivity",
      color: "#3d2d4a",
      essence: "Capital One pulls all three credit bureaus and is wary of applicants with many recent inquiries.",
      details: [
        "Three hard pulls per application — biggest score hit in the game",
        "Generally limit of 1-2 personal C1 cards",
        "Best done early in your application sequence",
        "Some report 6 month cooldowns between approvals",
      ],
    },
    {
      issuer: "Bank of America",
      title: "The informal 2/3/4 rule",
      color: "#1a3a4a",
      essence: "Unofficial guidance: max 2 BoA cards per 2 months, 3 per 12 months, 4 per 24 months.",
      details: [
        "Not officially confirmed by BoA",
        "Plus an informal 7/12 rule across all issuers",
        "Alaska and other BoA cards (Premium Rewards) are popular targets",
        "Existing BoA banking relationship can help approval",
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="mb-12 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">A traveler's grammar</p>
        <h2 className="font-serif text-4xl text-stone-100 leading-tight mb-4">
          Each bank speaks a different <em className="text-amber-200">dialect</em> of "no."
        </h2>
        <p className="text-stone-400 font-light leading-relaxed">
          Every issuer enforces unwritten (and sometimes written) rules about who gets the bonus. Memorize these five and you'll save yourself months of denied applications.
        </p>
      </div>

      <div className="space-y-px">
        {rules.map((r, i) => (
          <details key={i} className="group border-b border-stone-800 open:border-amber-900/40 transition-colors">
            <summary className="cursor-pointer p-6 flex items-center justify-between hover:bg-stone-900/30 transition-colors list-none">
              <div className="flex items-center gap-6">
                <span className="font-serif text-3xl text-stone-700 group-open:text-amber-300 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-stone-500 mb-1">{r.issuer}</p>
                  <h3 className="font-serif text-2xl text-stone-100">{r.title}</h3>
                </div>
              </div>
              <ChevronRight className="text-stone-600 group-open:rotate-90 transition-transform" size={20} />
            </summary>
            <div className="px-6 pb-8 pl-24">
              <p className="text-stone-300 text-lg font-serif italic mb-6 leading-relaxed border-l-2 border-amber-400/30 pl-4">
                {r.essence}
              </p>
              <ul className="space-y-2">
                {r.details.map((d, j) => (
                  <li key={j} className="flex gap-3 text-stone-400 text-sm">
                    <span className="text-amber-400/60 font-serif">·</span>
                    {d}
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

  const total = Object.entries(points).reduce((acc, [k, v]) => acc + v * (POINT_VALUES[k] || 0), 0);

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
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">Counting the silver</p>
        <h2 className="font-serif text-4xl text-stone-100 leading-tight">
          What are your points <em className="text-amber-200">actually</em> worth?
        </h2>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7 space-y-3">
          {Object.entries(points).map(([currency, amount]) => (
            <div key={currency} className="grid grid-cols-12 items-center gap-4 border-b border-stone-800 pb-3">
              <div className="col-span-5">
                <p className="font-serif text-stone-200">{currency}</p>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">
                  ≈ {(POINT_VALUES[currency] * 100).toFixed(1)}¢ per point
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
            <p className="col-span-9 text-xs uppercase tracking-[0.3em] text-stone-400">Total redemption value</p>
            <p className="col-span-3 text-right font-serif text-3xl text-amber-200">{fmtUSD(total)}</p>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="bg-stone-900/40 border border-stone-800 p-6 rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-amber-300" size={16} />
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300/80">Sweet spots worth knowing</p>
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

const SCORE_FACTORS = [
  { label: "결제 이력", pct: 35, desc: "매달 제때 납부했는지. 단 한 번의 연체도 수년간 영향", color: "bg-amber-400" },
  { label: "사용률 (Utilization)", pct: 30, desc: "한도 대비 얼마나 쓰는지. 10% 이하 유지가 핵심", color: "bg-amber-300" },
  { label: "크레딧 기간", pct: 15, desc: "카드를 얼마나 오래 유지했는지. 오래된 카드는 절대 닫지 말 것", color: "bg-stone-400" },
  { label: "크레딧 종류", pct: 10, desc: "카드, 자동차 론, 학자금 등 다양할수록 유리", color: "bg-stone-500" },
  { label: "신규 조회 (Hard Pull)", pct: 10, desc: "카드 신청할 때마다 점수 하락. 한 번에 여러 장 금지", color: "bg-stone-600" },
];

const SCORE_MILESTONES = [
  { range: "< 580", label: "No Credit / Poor", cards: "Secured Card 전용 (보증금 필요)", color: "text-red-400", bar: "bg-red-400/30", next: "Secured 카드로 6개월 이상 거래 이력 쌓기" },
  { range: "580–669", label: "Fair", cards: "Store Card, Capital One Platinum", color: "text-orange-400", bar: "bg-orange-400/30", next: "사용률 낮추고 연체 없으면 3–6개월 안에 탈출" },
  { range: "670–739", label: "Good", cards: "Chase Sapphire Preferred, Amex Gold 신청 가능", color: "text-amber-300", bar: "bg-amber-300/30", next: "5/24 관리하며 Chase 카드 우선 신청" },
  { range: "740–799", label: "Very Good", cards: "프리미엄 카드 대부분 승인", color: "text-green-400", bar: "bg-green-400/30", next: "Amex Platinum, CSR 신청 타이밍" },
  { range: "800+", label: "Exceptional", cards: "최고 조건, 거의 모든 카드 승인", color: "text-emerald-300", bar: "bg-emerald-300/30", next: "이 앱의 모든 카드 신청 가능" },
];

const STARTER_CARDS = [
  {
    name: "Discover it® Secured",
    fee: "$0",
    deposit: "$200+",
    earn: "2% 주유·다이닝, 1% 기타",
    highlight: "첫 1년 캐시백 100% 매칭 (사실상 첫해 더블)",
    timeline: "6–8개월 후 Unsecured 전환 심사",
    color: "#e87722",
    why: "크레딧 없는 사람에게 가장 좋은 첫 카드. 보증금 돌려받음.",
  },
  {
    name: "Capital One Platinum Secured",
    fee: "$0",
    deposit: "$49 / $99 / $200",
    earn: "리워드 없음 (순수 크레딧 빌딩용)",
    highlight: "최소 보증금 $49 — 업계 최저",
    timeline: "6개월 후 자동 업그레이드 심사",
    color: "#004977",
    why: "보증금 부담이 최소. 빠른 한도 증가로 사용률 관리 유리.",
  },
  {
    name: "Chase Freedom Rise℠",
    fee: "$0",
    deposit: "없음 (Chase 계좌 $250 이상 시 우선 승인)",
    earn: "모든 구매 1.5% 캐시백",
    highlight: "Chase 계좌 연동 시 크레딧 이력 없어도 승인 가능",
    timeline: "12개월 후 Freedom Unlimited 업그레이드 가능",
    color: "#1a4480",
    why: "Chase 생태계 진입점. 나중에 UR 포인트 카드로 연결됨.",
  },
  {
    name: "Citi® Secured Mastercard",
    fee: "$0",
    deposit: "$200–$2,500",
    earn: "리워드 없음",
    highlight: "보증금 한도 내에서 크레딧 한도 설정 가능",
    timeline: "18개월 후 Unsecured 전환 검토",
    color: "#2d4a4a",
    why: "Citi 생태계 입문용. 나중에 Strata Premier로 연결 가능.",
  },
];

const CREDIT_TIMELINE = [
  {
    month: "Month 0–1",
    phase: "기반 만들기",
    color: "#5a4a2d",
    actions: [
      "Discover it Secured 또는 Capital One Platinum Secured 신청",
      "Chase 계좌 개설 ($250 이상 예치) — Freedom Rise 승인률 높아짐",
      "신청 카드 도착 즉시 자동이체 설정 (연체 방지)",
      "Credit Karma 또는 Chase Credit Journey 무료 모니터링 시작",
    ],
  },
  {
    month: "Month 3–6",
    phase: "사용률 최적화",
    color: "#8a6f3a",
    actions: [
      "잔액을 한도의 10% 이하로 유지 (예: $500 한도면 $50 이하 사용)",
      "매달 Statement Balance 전액 납부 (이자 절대 내지 말 것)",
      "한도 증가 요청 — 사용률이 자동으로 낮아짐",
      "두 번째 카드 추가 고려 (Credit Mix 향상)",
    ],
  },
  {
    month: "Month 6–12",
    phase: "점수 680+ 목표",
    color: "#2d5a3d",
    actions: [
      "Secured → Unsecured 전환 요청 (보증금 돌려받음)",
      "점수 670 넘으면 Chase Freedom Unlimited 또는 Flex 신청 가능",
      "기존 카드 절대 닫지 말 것 — 기간과 한도 유지가 핵심",
      "신규 카드 신청 간격 3개월 이상 유지",
    ],
  },
  {
    month: "Month 12–18",
    phase: "첫 리워드 카드",
    color: "#1a4480",
    actions: [
      "점수 700+ 달성 시 Chase Sapphire Preferred 신청 (75k 보너스)",
      "5/24 카운트 관리 시작 — 지금까지 몇 장 받았는지 체크",
      "CSP 승인 후 Discover/Cap One Secured는 유지 (기간 보존)",
      "이제 이 앱의 Discover 탭으로 이동해 다음 카드 계획 수립",
    ],
  },
  {
    month: "Month 18–24+",
    phase: "Full 포인트 게임",
    color: "#3d2d4a",
    actions: [
      "Amex Gold 추가 (다이닝·마트 4x) — 5/24 카운트 안 됨",
      "Ink Business Preferred (사이드 비즈니스 있으면) — 100k UR",
      "점수 750+ 유지하며 매 3–6개월마다 전략적으로 카드 추가",
      "Guide 탭의 전략 플레이로 일본 비즈니스 클래스 계획 시작",
    ],
  },
];

function Playbook({ openCard }) {
  const [activePlay, setActivePlay] = useState(null);
  const [activeGuide, setActiveGuide] = useState(null);
  const [view, setView] = useState("start"); // "start" | "plays" | "cards"

  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      {/* Hero */}
      <div className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-300/70 mb-3">Step-by-step playbook</p>
        <h2 className="font-serif text-4xl text-stone-100 leading-tight mb-4">
          목표를 정하면, <em className="text-amber-200">순서가 보입니다.</em>
        </h2>
        <p className="text-stone-400 font-light leading-relaxed text-sm">
          크레딧 제로에서 시작해 일본 비즈니스 클래스까지. 단계별로 따라가기만 하면 됩니다.
        </p>
      </div>

      {/* View toggle */}
      <div className="flex gap-1 mb-10 border-b border-stone-800 overflow-x-auto">
        {[
          { id: "start", label: "§ 0. 처음 시작하기" },
          { id: "plays", label: "§ I. 목표별 전략" },
          { id: "cards", label: "§ II. 카드별 가이드" },
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

          {/* Credit Score 구성 */}
          <section>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-amber-300 font-serif text-xl italic">01</span>
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">크레딧 스코어란</h3>
            </div>
            <div className="grid md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-3">
                {SCORE_FACTORS.map((f) => (
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
                <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-4">핵심 3원칙</p>
                <ol className="space-y-4">
                  {[
                    { n: "01", rule: "절대 연체하지 말 것", sub: "자동이체 설정이 최선" },
                    { n: "02", rule: "한도의 10% 이하만 사용", sub: "사용 후 바로 갚아도 됨" },
                    { n: "03", rule: "카드 닫지 말 것", sub: "오래 유지할수록 유리" },
                  ].map((r) => (
                    <li key={r.n} className="flex gap-4">
                      <span className="font-serif text-2xl text-amber-300/40 flex-shrink-0">{r.n}</span>
                      <div>
                        <p className="text-stone-200 font-serif text-lg leading-tight">{r.rule}</p>
                        <p className="text-stone-500 text-xs mt-0.5">{r.sub}</p>
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
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">점수별 신청 가능 카드</h3>
            </div>
            <div className="space-y-2">
              {SCORE_MILESTONES.map((m) => (
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
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">처음 받을 카드 추천</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {STARTER_CARDS.map((c) => (
                <div key={c.name} className="border border-stone-800 bg-stone-900/20 p-6 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: c.color }} />
                  <h4 className="font-serif text-xl text-stone-100 mb-1">{c.name}</h4>
                  <p className="text-xs text-stone-500 italic mb-4">"{c.why}"</p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">연회비</p>
                      <p className="text-stone-200 font-serif text-lg">{c.fee}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">보증금</p>
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
              <h3 className="text-stone-200 text-lg uppercase tracking-[0.3em] font-light">제로에서 포인트 게임까지 — 타임라인</h3>
            </div>
            <div className="relative">
              <div className="absolute left-[88px] top-0 bottom-0 w-px bg-stone-800 hidden md:block" />
              <div className="space-y-0">
                {CREDIT_TIMELINE.map((phase, i) => (
                  <div key={phase.month} className="md:grid md:grid-cols-12 gap-8 mb-0">
                    <div className="md:col-span-2 flex md:flex-col md:items-end md:text-right pb-2 md:pb-0 md:pt-5">
                      <div className="hidden md:block">
                        <p className="text-[10px] uppercase tracking-widest text-stone-600 mb-1">{phase.month}</p>
                        <div className="w-3 h-3 rounded-full border-2 ml-auto" style={{ borderColor: phase.color, background: phase.color + "40" }} />
                      </div>
                      <p className="text-xs text-stone-500 md:hidden">{phase.month}</p>
                    </div>
                    <div className={`md:col-span-10 pb-8 md:pl-8 border-b border-stone-900 ${i === CREDIT_TIMELINE.length - 1 ? "border-b-0" : ""}`}>
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
                <p className="font-serif text-xl text-amber-200 mb-1">크레딧 700+ 달성했나요?</p>
                <p className="text-stone-400 text-sm">이제 Discover 탭에서 첫 리워드 카드를 찾아보세요.</p>
              </div>
              <ChevronRight className="text-amber-400 flex-shrink-0" size={24} />
            </div>
          </section>

        </div>
      )}

      {/* § I. Strategy Plays */}
      {view === "plays" && (
        <div className="space-y-3">
          {PLAYS.map((play) => {
            const isOpen = activePlay === play.id;
            return (
              <div key={play.id} className="border border-stone-800 rounded-sm overflow-hidden">
                {/* Play header */}
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

                {/* Steps */}
                {isOpen && (
                  <div className="border-t border-stone-800">
                    {/* Related cards strip */}
                    <div className="px-6 py-4 bg-stone-950/50 flex items-center gap-3 flex-wrap border-b border-stone-900">
                      <span className="text-[10px] uppercase tracking-widest text-stone-600">필요한 카드</span>
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

                    {/* Numbered steps */}
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
          {/* Card list */}
          <div className="md:col-span-4 space-y-1">
            {Object.entries(CARD_GUIDES).map(([id, guide]) => {
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

          {/* Guide detail */}
          <div className="md:col-span-8">
            {!activeGuide ? (
              <div className="h-full flex items-center justify-center border border-dashed border-stone-800 min-h-64">
                <div className="text-center">
                  <Lightbulb className="mx-auto text-stone-700 mb-3" size={28} />
                  <p className="text-stone-500 text-sm">왼쪽에서 카드를 선택하세요</p>
                </div>
              </div>
            ) : (
              (() => {
                const guide = CARD_GUIDES[activeGuide];
                const card = CARDS.find((c) => c.id === activeGuide);
                return (
                  <div
                    className="border border-stone-800 rounded-sm overflow-hidden"
                    style={{ background: `linear-gradient(180deg, ${guide.color}20 0%, transparent 30%)` }}
                  >
                    <div className="p-6 border-b border-stone-800">
                      <p className="text-xs uppercase tracking-[0.3em] text-amber-300/70 mb-1">
                        {card?.issuer} · Step-by-step
                      </p>
                      <h3 className="font-serif text-3xl text-stone-100">{guide.name}</h3>
                    </div>

                    <div className="p-6">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/70 mb-4">실행 순서</p>
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
                          <Lightbulb size={12} /> Pro Tips
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
                          카드 상세 보기 →
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

      <Header tab={tab} setTab={setTab} />
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
        <p className="text-xs text-stone-600 italic">
          Points Atlas · Volume I · April 2026 — Bonuses change frequently. Verify current offers before applying.
        </p>
      </footer>
    </div>
  );
}
