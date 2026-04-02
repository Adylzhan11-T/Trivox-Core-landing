import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  Code2,
  Globe,
  Mail,
  Menu,
  MessageCircle,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Send,
  Star,
  X,
} from "lucide-react";

type RevealTarget = HTMLElement;

type Stat = {
  label: string;
  value: number; // target numeric value (not formatted)
  suffix: "%" | "K" | "M" | "";
  decimals?: number;
};

type Plan = {
  name: string;
  popular?: boolean;
  monthly: number;
  description: string;
  features: string[];
};

type PlanWithPrice = Plan & { price: number };

type FAQ = {
  q: string;
  a: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function formatStatValue(v: number, suffix: Stat["suffix"], decimals = 0) {
  if (suffix === "%") return `${Math.round(v)}%`;
  if (suffix === "K") {
    const out = v / 1000;
    const fixed = out.toFixed(decimals);
    return `${stripTrailingZeros(fixed)}K`;
  }
  if (suffix === "M") {
    const out = v / 1_000_000;
    const fixed = out.toFixed(decimals);
    return `${stripTrailingZeros(fixed)}M`;
  }
  return v.toLocaleString("ru-RU", { maximumFractionDigits: decimals });
}

function stripTrailingZeros(s: string) {
  if (!s.includes(".")) return s;
  return s.replace(/\.?0+$/, "");
}

function getInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
}

export default function TrivoxCoreLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "ok" | "error">("idle");

  const [statsStarted, setStatsStarted] = useState(false);
  const [statValues, setStatValues] = useState<number[]>([0, 0, 0, 0]);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats: Stat[] = useMemo(
    () => [
      { label: "Среднее ускорение релизов", value: 35, suffix: "%", decimals: 0 },
      { label: "Поставок в прод", value: 1200, suffix: "K", decimals: 1 },
      { label: "QA-покрытие на каждом шаге", value: 99, suffix: "%", decimals: 0 },
      { label: "Задержки, которые мы предотвращаем", value: 8, suffix: "K", decimals: 0 },
    ],
    []
  );

  const plans: Plan[] = useMemo(
    () => [
      {
        name: "Базовый",
        monthly: 790000,
        description: "Для быстрых решений и MVP.",
        features: [
          "Бесплатный аудит и подбор плана",
          "Детальное ТЗ и фиксированная оценка",
          "Разработка с еженедельными демо",
          "QA-контроль перед сдачей",
          "Запуск работающего продукта",
        ],
      },
      {
        name: "Про",
        popular: true,
        monthly: 1290000,
        description: "Оптимальный баланс скорости и качества.",
        features: [
          "Всё из Базового",
          "Больше итераций и ускоренный цикл",
          "AI-инструменты для экономии времени",
          "Интеграции и API (до лимитов)",
          "Приоритетная поддержка после релиза",
        ],
      },
      {
        name: "Энтерпрайз",
        monthly: 2290000,
        description: "Для сложных систем и команд.",
        features: [
          "Всё из Про",
          "Архитектура и масштабирование",
          "Комплексные интеграции",
          "Технический PM и регулярные статусы",
          "Постоянное развитие продукта",
        ],
      },
    ],
    []
  );

  const faqs: FAQ[] = useMemo(
    () => [
      {
        q: "Как вы гарантируете прозрачность разработки?",
        a: "У нас фиксированный процесс: аудит → детальное ТЗ → договор с понятными сроками. Мы показываем прогресс каждую неделю, а не “почти готово”.",
      },
      {
        q: "Сколько времени занимает старт проекта?",
        a: "После подписания договора мы начинаем разработку за 3 дня. Дальше работаем короткими циклами с демо и QA-контролем.",
      },
      {
        q: "Вы делаете только код или решаете бизнес-задачу?",
        a: "Мы работаем как технологический партнёр: фокус на результате для бизнеса. Код — лишь инструмент, а метрики и сроки — часть плана.",
      },
      {
        q: "Какие услуги вы покрываете?",
        a: "Веб и мобильные приложения, CRM/ERP/кабинеты/дашборды, AI-агенты и чат-боты, автоматизацию рутин, бэкенд и интеграции, плюс поддержку и развитие.",
      },
      {
        q: "Вы сопровождаете проект после релиза?",
        a: "Да. Мы не исчезаем после сдачи: остаёмся на связи и развиваем продукт вместе с вашей командой.",
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: "Качество по-банковски",
        text: "QA-контроль на каждом этапе. Мы не сдаём то, что не протестировано.",
      },
      {
        icon: Rocket,
        title: "Быстрый запуск",
        text: "Старт за 3 дня после договора и работа короткими итерациями.",
      },
      {
        icon: Sparkles,
        title: "AI уже внутри",
        text: "Внедряем AI-инструменты там, где реально экономим время и деньги.",
      },
      {
        icon: Network,
        title: "Интеграции и API",
        text: "Подключаем платёжки, CRM, мессенджеры, ERP и строим надёжную архитектуру.",
      },
      {
        icon: Bot,
        title: "Автоматизация рутин",
        text: "Убираем ручной труд: документы, уведомления, отчёты и внутренние процессы.",
      },
      {
        icon: Code2,
        title: "Понятный и простой продукт",
        text: "Без технического жаргона: вы всегда понимаете, что и зачем делаем.",
      },
    ],
    []
  );

  // Scroll blur for navbar + smooth section scroll (via scrollIntoView for anchors).
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver for section reveals.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<RevealTarget>("[data-reveal]"));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("reveal--in");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.2 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // Stats counter animation when stats section enters viewport.
  useEffect(() => {
    if (statsStarted) return;
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setStatsStarted(true);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [statsStarted]);

  useEffect(() => {
    if (!statsStarted) return;
    const durationMs = 2000;
    const start = performance.now();
    const startVals = [0, 0, 0, 0];
    const endVals = stats.map((s) => s.value);

    let raf = 0;
    const tick = (now: number) => {
      const t = clamp((now - start) / durationMs, 0, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const next = endVals.map((end, i) => startVals[i] + (end - startVals[i]) * eased);
      setStatValues(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stats, statsStarted]);

  const yearlyMultiplier = 0.8; // ~20% discount
  const yearlySuffixNote = "Скидка -20%";

  const scrollToId = (id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onNavLink = (id: string) => {
    setMobileOpen(false);
    // Close drawer first for nicer motion.
    setTimeout(() => scrollToId(id), 80);
  };

  const currentPrices = useMemo<PlanWithPrice[]>(() => {
    return plans.map((p) => {
      const monthly = p.monthly;
      const yearlyMonthly = Math.round(p.monthly * yearlyMultiplier);
      const price = billing === "monthly" ? monthly : yearlyMonthly;
      return { ...p, price };
    });
  }, [plans, billing]);

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if (!ok) {
      setEmailStatus("error");
      window.setTimeout(() => setEmailStatus("idle"), 2800);
      return;
    }

    try {
      const res = await fetch("https://formspree.io/f/xeeplqaa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: v,
          message: message.trim() || "Запрос аудита с сайта",
        }),
      });

      if (res.ok) {
        setEmailStatus("ok");
        setEmail("");
        setName("");
        setMessage("");
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }

    window.setTimeout(() => setEmailStatus("idle"), 3500);
  };

  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const gradientByIndex = (idx: number) => {
    const gradients = [
      "linear-gradient(135deg, rgba(124,58,237,.95), rgba(59,130,246,.9))",
      "linear-gradient(135deg, rgba(16,185,129,.95), rgba(59,130,246,.9))",
      "linear-gradient(135deg, rgba(244,63,94,.95), rgba(124,58,237,.9))",
    ];
    return gradients[idx % gradients.length];
  };

  return (
    <div ref={rootRef} className="trivoxRoot text-white">
      <style>{`
        html { scroll-behavior: smooth; }

        .trivoxRoot {
          --bg-primary: #08080f;
          --accent-from: #7c3aed; /* violet */
          --accent-to: #22c55e; /* emerald */
          --card-bg: rgba(255,255,255,.055);
          --card-bg-2: rgba(255,255,255,.075);
          --border: rgba(255,255,255,.12);
          --border-2: rgba(255,255,255,.18);
          --text-dim: rgba(255,255,255,.74);
          --shadow: rgba(124,58,237,.22);
          background-color: var(--bg-primary);
          overflow-x: hidden;
        }

        /* Motion */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 14px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes floaty {
          0% { transform: translate3d(0,0,0) scale(1); opacity: .75; }
          50% { transform: translate3d(0,-18px,0) scale(1.03); opacity: .95; }
          100% { transform: translate3d(0,0,0) scale(1); opacity: .75; }
        }
        @keyframes pulseSoft {
          0% { transform: scale(1); opacity: .7; }
          50% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: .7; }
        }
        @keyframes gridShift {
          from { transform: translate3d(0,0,0); opacity: .35; }
          to { transform: translate3d(0,18px,0); opacity: .55; }
        }

        .revealTarget {
          opacity: 0;
          transform: translate3d(0, 18px, 0);
          transition: opacity 700ms cubic-bezier(.2,.9,.2,1), transform 900ms cubic-bezier(.2,.9,.2,1);
          will-change: transform, opacity;
        }
        .reveal--in {
          opacity: 1 !important;
          transform: translate3d(0, 0, 0) !important;
        }

        .gradientText {
          background-image: linear-gradient(90deg, var(--accent-from), rgba(59,130,246,1), var(--accent-to));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .glowRing {
          box-shadow:
            0 0 0 1px var(--border),
            0 18px 50px rgba(124,58,237,.18),
            inset 0 1px 0 rgba(255,255,255,.08);
        }

        .glassCard {
          background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
          border: 1px solid var(--border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .cardHover {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .cardHover:hover {
          transform: translate3d(0,-4px,0) scale(1.03);
          border-color: var(--border-2);
          box-shadow:
            0 25px 70px rgba(0,0,0,.35),
            0 0 0 1px rgba(124,58,237,.25),
            0 0 40px rgba(124,58,237,.22);
        }

        .btn {
          min-height: 44px;
          padding-left: 18px;
          padding-right: 18px;
          border-radius: 14px;
          border: 1px solid var(--border);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease, background 220ms ease;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .btn:hover {
          transform: scale(1.05);
          box-shadow:
            0 0 0 1px rgba(124,58,237,.2),
            0 22px 70px rgba(0,0,0,.45),
            0 0 45px rgba(124,58,237,.22);
        }
        .btnPrimary {
          border: 1px solid rgba(255,255,255,.12);
          background-image: linear-gradient(135deg, rgba(124,58,237,.95), rgba(59,130,246,.95), rgba(34,197,94,.9));
        }
        .btnGhost {
          background: rgba(255,255,255,.04);
        }

        .navGlass {
          background: rgba(8,8,15,.6);
          border-bottom: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
        }

        .drawerOverlay {
          background: rgba(0,0,0,.4);
          animation: pulseOverlayIn 180ms ease both;
        }
        @keyframes pulseOverlayIn { from { opacity: 0; } to { opacity: 1; } }

        .drawerPanel {
          animation: drawerIn 260ms cubic-bezier(.2,.9,.2,1) both;
          transform-origin: top right;
        }
        @keyframes drawerIn {
          from { transform: translate3d(20px,0,0); opacity: 0; }
          to { transform: translate3d(0,0,0); opacity: 1; }
        }

        .blobAnim {
          animation: floaty 8s ease-in-out infinite;
        }
        .blobAnim2 { animation-duration: 11s; }
        .blobAnim3 { animation-duration: 9.5s; }
        .blobPulse { animation: pulseSoft 6s ease-in-out infinite; }

        .ringLine {
          height: 2px;
          background: linear-gradient(90deg, rgba(124,58,237,.0), rgba(124,58,237,.9), rgba(34,197,94,.8), rgba(34,197,94,.0));
          opacity: .85;
        }

        .accordionBtn svg {
          transition: transform 260ms ease;
        }
        .accordionBtn[data-open="true"] svg {
          transform: rotate(180deg);
        }

        /* For accordion animation */
        .accPanel {
          overflow: hidden;
          transition: max-height 420ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease;
        }

        /* Decorative grid */
        .bgGrid:before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: radial-gradient(circle at 30% 20%, black 0%, transparent 60%);
          opacity: .35;
          animation: gridShift 9s ease-in-out infinite alternate;
        }

        /* Improve focus */
        :focus-visible { outline: 2px solid rgba(124,58,237,.7); outline-offset: 2px; }
      `}</style>

      {/* NAVBAR */}
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300`}>
        <div className={`mx-auto max-w-6xl px-4 sm:px-6`}>
          <div className={`mt-3 rounded-2xl ${navScrolled ? "navGlass" : "bg-transparent"} transition-all duration-300`}>
            <div className="flex items-center justify-between px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => onNavLink("top")}
                className="flex items-center gap-2"
                aria-label="Перейти наверх"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/6 border border-white/10 glowRing">
                  <Rocket size={18} className="text-white" />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold tracking-wide">TRIVOX CORE</div>
                    <div className="text-xs text-white/60">tech partner, не подрядчик</div>
                </div>
              </button>

              {/* Desktop links */}
              <nav className="hidden items-center gap-6 lg:flex" aria-label="Навигация">
                {[
                  { id: "features", label: "Преимущества" },
                  { id: "process", label: "Как работаем" },
                  { id: "pricing", label: "Цены" },
                  { id: "faq", label: "FAQ" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => onNavLink(l.id)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
              </nav>

              <div className="hidden lg:flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavLink("contact")}
                  className="btn btnGhost text-sm text-white/85"
                >
                  Запросить аудит
                </button>
                <button
                  type="button"
                  onClick={() => onNavLink("pricing")}
                  className="btn btnPrimary text-sm font-semibold"
                >
                  Начать проект
                </button>
              </div>

              {/* Mobile menu */}
              <button
                type="button"
                className="lg:hidden btn btnGhost flex items-center justify-center w-11 px-0"
                onClick={() => setMobileOpen(true)}
                aria-label="Открыть меню"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="drawerOverlay absolute inset-0"
            onClick={() => setMobileOpen(false)}
            role="presentation"
          />
          <div ref={drawerRef} className="absolute left-3 right-3 top-3 max-w-sm">
            <div className="drawerPanel glassCard rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Меню</div>
                <button
                  type="button"
                  className="btn btnGhost w-11 px-0 flex items-center justify-center"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {[
                  { id: "features", label: "Преимущества" },
                  { id: "process", label: "Как работаем" },
                  { id: "pricing", label: "Цены" },
                  { id: "faq", label: "FAQ" },
                  { id: "contact", label: "Запросить аудит" },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className="btn btnGhost justify-start text-left text-sm"
                    onClick={() => onNavLink(l.id)}
                  >
                    {l.label}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btnPrimary font-semibold mt-1"
                  onClick={() => onNavLink("pricing")}
                >
                  Начать проект
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main id="top" className="relative">
        {/* HERO */}
        <section className="pt-28 sm:pt-32 pb-16 sm:pb-20">
          <div className="absolute inset-0 -z-10">
            <div className="bgGrid relative h-full">
              <div
                className="absolute -top-24 -left-28 rounded-full blur-3xl blobAnim"
                style={{
                  width: 420,
                  height: 420,
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(124,58,237,.95), rgba(124,58,237,0) 60%)",
                }}
              />
              <div
                className="absolute top-24 -right-20 rounded-full blur-3xl blobAnim blobAnim2"
                style={{
                  width: 380,
                  height: 380,
                  background:
                    "radial-gradient(circle at 40% 30%, rgba(34,197,94,.95), rgba(34,197,94,0) 62%)",
                }}
              />
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl blobPulse"
                style={{
                  width: 260,
                  height: 260,
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(59,130,246,.95), rgba(59,130,246,0) 60%)",
                }}
              />
            </div>
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <div className="flex flex-wrap gap-2 mb-5">
                  {[
                    "прозрачная разработка",
                    "быстрый запуск",
                    "бизнес-результат",
                  ].map((pill, i) => (
                    <span
                      key={pill}
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-white/10 bg-white/5"
                      style={{
                        boxShadow: i === 1 ? "0 0 40px rgba(124,58,237,.22)" : undefined,
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight"
                  style={{
                    animation: "fadeInUp 900ms ease both",
                    animationDelay: "40ms",
                    lineHeight: 1.02,
                  }}
                >
                  <span className="gradientText">TRIVOX CORE</span>
                  <span className="block mt-2 text-white/90 text-2xl sm:text-3xl font-semibold">
                    IT-аутсорсинг нового уровня
                  </span>
                </h1>

                <p
                  className="mt-5 text-base sm:text-lg text-white/75 max-w-xl"
                  style={{ animation: "fadeInUp 900ms ease both", animationDelay: "120ms" }}
                >
                  Мы объединяем senior-разработчиков и product-специалистов, чтобы запускать решения быстрее,
                  прозрачнее и выгоднее для бизнеса.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center" style={{ animation: "fadeInUp 900ms ease both", animationDelay: "200ms" }}>
                  <button
                    type="button"
                    className="btn btnPrimary font-semibold text-sm sm:text-base"
                    onClick={() => onNavLink("pricing")}
                  >
                    Получить фикс-прайс
                  </button>
                  <button
                    type="button"
                    className="btn btnGhost text-sm sm:text-base text-white/90"
                    onClick={() => onNavLink("process")}
                  >
                    Как мы работаем
                  </button>
                </div>

                <div className="mt-7 grid sm:grid-cols-3 gap-3">
                  {[
                    { k: "3 дня", v: "до старта разработки" },
                    { k: "QA", v: "по банковским стандартам" },
                    { k: "AI", v: "встраиваем по делу" },
                  ].map((item, i) => (
                    <div
                      key={item.k}
                      className="glassCard rounded-2xl px-4 py-3 border border-white/10"
                      style={{
                        animation: "fadeInUp 900ms ease both",
                        animationDelay: `${240 + i * 70}ms`,
                      }}
                    >
                      <div className="text-sm font-semibold">{item.k}</div>
                      <div className="text-xs text-white/65 mt-1">{item.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="glassCard rounded-3xl border border-white/10 p-5 sm:p-6 glowRing relative overflow-hidden revealTarget" data-reveal>
                  <div
                    className="absolute -top-24 -right-28 rounded-full blur-3xl"
                    style={{
                      width: 260,
                      height: 260,
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(124,58,237,.9), rgba(124,58,237,0) 60%)",
                    }}
                  />

                  <div className="relative">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold">Короткий путь к результату</div>
                        <div className="text-xs text-white/65 mt-1">без пропажи разработчиков и тишины после сдачи</div>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/10 bg-white/5">
                        <Sparkles size={14} />
                        <span>senior team</span>
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {[
                        { icon: ShieldCheck, title: "Проверяем качество", text: "QA в процессе, а не в конце." },
                        { icon: Rocket, title: "Запускаем быстрее", text: "Чёткие этапы и короткие циклы." },
                        { icon: Network, title: "Подключаем всё", text: "Интеграции без хаоса." },
                      ].map((row, idx) => {
                        const Icon = row.icon;
                        return (
                          <div
                            key={row.title}
                            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/4 p-4"
                            style={{ animationDelay: `${idx * 80}ms` }}
                          >
                            <span
                              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10"
                              style={{
                                background: "linear-gradient(135deg, rgba(124,58,237,.25), rgba(34,197,94,.15))",
                              }}
                            >
                              <Icon size={18} />
                            </span>
                            <div>
                              <div className="text-sm font-semibold">{row.title}</div>
                              <div className="text-xs text-white/65 mt-1">{row.text}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/4 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Фиксированная цена</div>
                          <div className="text-xs text-white/65 mt-1">и прозрачные договорённости</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/60">от</div>
                          <div className="text-lg font-semibold">790k ₸</div>
                        </div>
                      </div>
                      <div className="mt-3 ringLine" />
                      <div className="mt-3 text-xs text-white/60">
                        Мы делаем оценку после анализа требований — без “угадываний”.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 glassCard rounded-3xl border border-white/10 p-4 sm:p-5 revealTarget" data-reveal>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Боль рынка, которую мы закрываем</div>
                      <div className="text-xs text-white/65 mt-1">разработчики срывают сроки → пропадают → бизнес остаётся без результата</div>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2">
                    {[
                      "Прогресс каждую неделю",
                      "QA перед сдачей",
                      "Поддержка и развитие после релиза",
                    ].map((t) => (
                      <div key={t} className="flex items-center gap-2 text-sm text-white/82">
                        <Check size={16} />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-white/80">Преимущества</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Делаем проекты так, чтобы бизнес реально выигрывал
                </h2>
              </div>
              <div className="hidden md:block text-sm text-white/65 max-w-md">
                Мы строим как технологический партнёр: качество, сроки и коммуникации — часть продукта.
              </div>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="glassCard rounded-3xl p-5 border border-white/10 cardHover revealTarget"
                    data-reveal
                    style={{ transitionDelay: `${idx * 40}ms` }}
                  >
                    <div
                      className="h-11 w-11 rounded-2xl border border-white/10 grid place-items-center"
                      style={{ background: gradientByIndex(idx) }}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 text-lg font-semibold">{f.title}</div>
                    <div className="mt-2 text-sm text-white/68 leading-relaxed">{f.text}</div>
                    <div className="mt-4">
                      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/10 bg-white/4">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(34,197,94,1)" }} />
                        <span>wow-эффект</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* STATS */}
        <section id="stats" className="py-16 sm:py-20">
          <div className="relative">
            <div
              className="absolute inset-0 -z-10"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(124,58,237,.22), rgba(59,130,246,.16), rgba(34,197,94,.18))",
                opacity: 0.55,
              }}
            />
            <div
              className="absolute left-0 right-0 top-0 h-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(124,58,237,0), rgba(124,58,237,.9), rgba(34,197,94,.9), rgba(34,197,94,0))",
                opacity: 0.9,
              }}
            />
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <div className="text-sm font-semibold text-white/80">Цифры</div>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                    Измеряем скорость, качество и влияние на результат
                  </h2>
                </div>
                <div className="hidden md:block text-sm text-white/65 max-w-md">
                  Счётчики стартуют, когда блок появляется в зоне просмотра.
                </div>
              </div>

              <div ref={statsRef} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, idx) => (
                  <div
                    key={s.label}
                    className="glassCard rounded-3xl p-5 border border-white/10 revealTarget"
                    data-reveal
                  >
                    <div className="text-4xl sm:text-5xl font-semibold tracking-tight gradientText">
                      {formatStatValue(statValues[idx] ?? 0, s.suffix, s.decimals ?? 0)}
                    </div>
                    <div className="mt-2 text-sm text-white/70 leading-relaxed">{s.label}</div>
                    <div className="mt-4">
                      <div className="ringLine" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="process" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-white/80">Как это работает</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Процесс простой и прозрачно контролируемый
                </h2>
              </div>
              <div className="hidden md:block text-sm text-white/65 max-w-md">
                Точная оценка, фиксированные условия, регулярные демонстрации.
              </div>
            </div>

            <div className="mt-10">
              <div className="relative">
                {/* connecting line on desktop */}
                <div className="hidden lg:block absolute left-6 right-6 top-1/2 -translate-y-1/2">
                  <div className="ringLine h-1.5 rounded-full" />
                </div>

                <div className="grid lg:grid-cols-3 gap-4">
                  {[
                    { n: "01", icon: ShieldCheck, title: "Бесплатный аудит", text: "Обсуждаем задачу и находим узкие места." },
                    { n: "02", icon: Code2, title: "Детальное ТЗ", text: "Фиксируем что именно делаем и сколько стоит." },
                    { n: "03", icon: Rocket, title: "Разработка и запуск", text: "Регулярные демо, QA перед сдачей, рабочий продукт." },
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.n}
                        className="glassCard rounded-3xl p-6 border border-white/10 cardHover revealTarget"
                        data-reveal
                        style={{ minHeight: 190 }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="flex-none grid place-items-center rounded-2xl border border-white/10"
                            style={{
                              width: 52,
                              height: 52,
                              background: `linear-gradient(135deg, rgba(124,58,237,.35), rgba(34,197,94,.18))`,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold"
                                style={{
                                  backgroundImage:
                                    idx === 0
                                      ? "linear-gradient(135deg, rgba(124,58,237,.95), rgba(59,130,246,.85))"
                                      : idx === 1
                                      ? "linear-gradient(135deg, rgba(59,130,246,.95), rgba(34,197,94,.85))"
                                      : "linear-gradient(135deg, rgba(34,197,94,.95), rgba(124,58,237,.85))",
                                  border: "1px solid rgba(255,255,255,.16)",
                                }}
                              >
                                {step.n}
                              </span>
                              <span className="text-sm font-semibold">{step.title}</span>
                            </div>
                            <div className="mt-2 text-sm text-white/68 leading-relaxed">{step.text}</div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border border-white/10 bg-white/4">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(124,58,237,1)" }} />
                            <span>прозрачность</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { k: "1️⃣", t: "Договор" },
                { k: "2️⃣", t: "Демо каждую неделю" },
                { k: "3️⃣", t: "QA контроль" },
                { k: "4️⃣", t: "Поддержка и развитие" },
              ].map((x, i) => (
                <div
                  key={x.k}
                  className="glassCard rounded-2xl border border-white/10 p-4 revealTarget"
                  data-reveal
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="text-xs text-white/65">{x.k}</div>
                  <div className="mt-1 text-sm font-semibold">{x.t}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-white/80">Отзывы</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Сильная команда и понятный результат
                </h2>
              </div>
              <div className="hidden md:block text-sm text-white/65 max-w-md">
                Показали прогресс, закрыли риски и запустили продукт. Без “тишины после сдачи”.
              </div>
            </div>

            <div className="mt-10">
              <div className="flex gap-4 overflow-x-auto pb-2 lg:overflow-x-visible lg:grid lg:grid-cols-3">
                {[
                  {
                    name: "Айдана С.",
                    role: "Head of Product, финтех",
                    quote:
                      "Команда взяла задачу как партнёр. Мы видели прогресс каждую неделю, а QA помог избежать “сюрпризов” перед релизом.",
                  },
                  {
                    name: "Ерлан А.",
                    role: "CTO, B2B сервис",
                    quote:
                      "У нас были интеграции с несколькими внешними системами. Сделали быстро и аккуратно, без костылей и с понятным планом.",
                  },
                  {
                    name: "Мадина К.",
                    role: "Operations Manager",
                    quote:
                      "Автоматизация рутин реально дала эффект. Бизнес-процесс стал быстрее, а отчёты перестали зависеть от ручных операций.",
                  },
                ].map((t, idx) => (
                  <div
                    key={t.name}
                    className="glassCard rounded-3xl border border-white/10 p-6 min-w-80 lg:min-w-0 cardHover revealTarget"
                    data-reveal
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="grid h-12 w-12 place-items-center rounded-full text-sm font-semibold border border-white/10"
                          style={{ background: gradientByIndex(idx) }}
                        >
                          {getInitials(t.name)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{t.name}</div>
                          <div className="text-xs text-white/65 mt-1">{t.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-300" aria-label="Рейтинг 5 из 5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" className="text-yellow-300" />
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/75 leading-relaxed">
                      “{t.quote}”
                    </div>
                    <div className="mt-5">
                      <div className="ringLine" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-white/80">Цены</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Фиксированная цена и честная структура оплаты
                </h2>
              </div>
              <div className="hidden md:block text-sm text-white/65 max-w-md">
                Сравнивайте тарифы: мы подбираем объём и сложность после аудита.
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-3">
              <div className="glassCard rounded-2xl border border-white/10 px-4 py-3 flex items-center gap-3">
                <div className="text-xs text-white/70">Месяц</div>
                <button
                  type="button"
                  className="relative inline-flex h-10 w-20 items-center rounded-full border border-white/12 bg-white/5"
                  onClick={() => setBilling((b) => (b === "monthly" ? "yearly" : "monthly"))}
                  aria-label="Переключить оплату"
                >
                  <span
                    className="absolute inset-y-1 left-1 w-8 rounded-full transition-transform duration-300"
                    style={{
                      transform: billing === "yearly" ? "translateX(30px)" : "translateX(0px)",
                      backgroundImage: "linear-gradient(135deg, rgba(124,58,237,.95), rgba(34,197,94,.85))",
                      boxShadow: "0 0 40px rgba(124,58,237,.25)",
                    }}
                  />
                  <span className="relative z-10 inline-flex flex-1 items-center justify-center text-xs font-semibold">
                    {billing === "monthly" ? "On" : "Off"}
                  </span>
                </button>
                <div className="text-xs text-white/70">Год</div>
              </div>
              <div className="hidden sm:block text-xs text-white/70 px-3 py-2 rounded-2xl border border-white/10 bg-white/4">
                {yearlySuffixNote}
              </div>
            </div>

            <div className="mt-10 grid sm:grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
              {currentPrices.map((p, idx) => (
                <div
                  key={p.name}
                  className={`glassCard rounded-3xl border border-white/10 p-6 relative cardHover revealTarget ${
                    p.popular ? "glowRing" : ""
                  }`}
                  data-reveal
                  style={{ transitionDelay: `${idx * 60}ms` }}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold border border-white/15 bg-white/10">
                        Популярный
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xl font-semibold">{p.name}</div>
                      <div className="text-sm text-white/65 mt-2">{p.description}</div>
                    </div>
                    <div className="h-12 w-12 rounded-2xl border border-white/10 grid place-items-center" style={{ background: gradientByIndex(idx) }}>
                      <Rocket size={18} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-xs text-white/60">Цена</div>
                    <div className="mt-1 flex items-end gap-2">
                      <div className="text-4xl font-semibold gradientText">
                        {Math.round(p.price / 1000)}k
                      </div>
                      <div className="text-sm text-white/70 mb-1">
                        {billing === "monthly" ? "₸/мес" : "₸/мес (в год)"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {p.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="mt-0.5 grid h-5 w-5 place-items-center rounded-full border border-white/10" style={{ background: "rgba(255,255,255,.05)" }}>
                          <Check size={14} />
                        </span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => onNavLink("contact")}
                      className={`btn ${p.popular ? "btnPrimary" : "btnGhost"} w-full justify-center font-semibold`}
                    >
                      {p.popular ? "Обсудить Про" : "Запросить предложение"}
                    </button>
                    {p.popular && (
                      <div className="mt-3 text-xs text-white/60">
                        Оптимальный выбор: быстрее в прод и аккуратнее по рискам.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-sm text-white/65">
              Мы всегда работаем с фиксированной ценой: итоговая сумма зависит от объёма и сложности.
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="pb-16 sm:pb-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-sm font-semibold text-white/80">FAQ</div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
                  Ответы на частые вопросы
                </h2>
              </div>
              <div className="hidden md:block text-sm text-white/65 max-w-md">
                Не нашли ответ? Оставьте email в CTA — вернёмся с конкретикой.
              </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-2 gap-4">
              {faqs.map((item, idx) => (
                <FAQItem
                  key={item.q}
                  index={idx}
                  q={item.q}
                  a={item.a}
                  openFaq={openFaq}
                  setOpenFaq={setOpenFaq}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section id="contact" className="pb-16 sm:pb-20">
          <div
            className="rounded-3xl border border-white/10 overflow-hidden"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(124,58,237,.25), rgba(59,130,246,.14), rgba(34,197,94,.18))",
            }}
          >
            <div className="relative">
              <div className="absolute -left-20 top-10 h-60 w-60 rounded-full blur-3xl blobAnim" style={{ background: "radial-gradient(circle at 30% 30%, rgba(124,58,237,.85), rgba(124,58,237,0) 62%)" }} />
              <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full blur-3xl blobAnim blobAnim2" style={{ background: "radial-gradient(circle at 40% 30%, rgba(34,197,94,.85), rgba(34,197,94,0) 64%)" }} />

              <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-14">
                <div className="grid lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6">
                    <div className="text-sm font-semibold text-white/80">Готовы построить иначе?</div>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight gradientText">
                      Запросите бесплатный аудит и получите фиксированный план
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-white/75 leading-relaxed">
                      Мы быстро разберёмся в задаче, предложим архитектуру и оценку сроков/стоимости так, чтобы вы понимали,
                      за что платите и что получите.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {["прозрачность", "скорость", "качество", "AI по делу"].map((x) => (
                        <span key={x} className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-white/10 bg-white/5">
                          {x}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
                        style={{ background: "linear-gradient(135deg, rgba(124,58,237,.25), rgba(59,130,246,.18))" }}
                      >
                        <Mail size={18} />
                      </span>
                      <div>
                        <div className="text-xs text-white/60">Напишите нам напрямую</div>
                        <a
                          href="mailto:team@trivoxcore.com"
                          className="text-sm font-semibold text-white hover:text-white/80 transition-colors"
                        >
                          team@trivoxcore.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 revealTarget" data-reveal>
                    <form onSubmit={onSubmitEmail} className="glassCard rounded-3xl border border-white/10 p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">Запросить аудит</div>
                          <div className="text-xs text-white/65 mt-1">
                            Ответим с конкретикой и ближайшим шагом.
                          </div>
                        </div>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-xs border border-white/10 bg-white/4">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(34,197,94,1)" }} />
                          <span className="ml-2">24-48h</span>
                        </span>
                      </div>

                      <div className="mt-5 flex flex-col gap-3">
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ваше имя"
                          type="text"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/10"
                          aria-label="Имя"
                        />
                        <input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          type="email"
                          required
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/10"
                          aria-label="Email"
                        />
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Опишите задачу (необязательно)"
                          rows={3}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-white/10 resize-none"
                          aria-label="Сообщение"
                        />
                        <button type="submit" className="btn btnPrimary font-semibold text-sm w-full justify-center">
                          Отправить заявку
                        </button>
                      </div>

                      <div className="mt-4 min-h-5 text-sm">
                        {emailStatus === "ok" && (
                          <div className="text-white/85">Отлично! Мы свяжемся с вами в течение 24-48 часов.</div>
                        )}
                        {emailStatus === "error" && (
                          <div className="text-red-200">Что-то пошло не так. Проверьте email и попробуйте снова.</div>
                        )}
                        {emailStatus === "idle" && (
                          <div className="text-white/60">
                            Нажимая кнопку, вы соглашаетесь на обработку запроса.
                          </div>
                        )}
                      </div>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/4 p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10" style={{ background: gradientByIndex(2) }}>
                            <Sparkles size={18} />
                          </span>
                          <div>
                            <div className="text-sm font-semibold">Сразу по делу</div>
                            <div className="text-xs text-white/65 mt-1">
                              Мы зададим 5–7 вопросов для анализа и дадим план.
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pb-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="glassCard rounded-3xl border border-white/10 p-6 sm:p-8">
              <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/6 border border-white/10 glowRing">
                      <Rocket size={18} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold tracking-wide">TRIVOX CORE</div>
                      <div className="text-xs text-white/65 mt-1">делаем то, чего не хватает рынку</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/70 leading-relaxed">
                    Прозрачная разработка, быстрый запуск и бизнес-результат. Мы работаем как технологический партнёр.
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    {[
                      { Icon: Send, label: "Telegram", href: "#" },
                      { Icon: MessageCircle, label: "WhatsApp", href: "#" },
                      { Icon: Globe, label: "Сайт", href: "#" },
                      { Icon: Mail, label: "Email", href: "mailto:team@trivoxcore.com" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        className="h-11 w-11 rounded-2xl border border-white/10 grid place-items-center bg-white/4 hover:bg-white/6 transition-colors"
                        aria-label={s.label}
                      >
                        <s.Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>

                <FooterCol
                  title="Компания"
                  links={[
                    { id: "features", label: "Преимущества" },
                    { id: "process", label: "Процесс" },
                    { id: "testimonials", label: "Отзывы" },
                  ]}
                  onJump={onNavLink}
                />
                <FooterCol
                  title="Услуги"
                  links={[
                    { id: "features", label: "Веб-разработка" },
                    { id: "features", label: "Мобильные приложения" },
                    { id: "features", label: "AI-агенты и боты" },
                    { id: "features", label: "Автоматизация рутин" },
                  ]}
                  onJump={onNavLink}
                />
                <FooterCol
                  title="Ресурсы"
                  links={[
                    { id: "pricing", label: "Тарифы" },
                    { id: "faq", label: "FAQ" },
                    { id: "contact", label: "Запросить аудит" },
                  ]}
                  onJump={onNavLink}
                />
                <FooterCol
                  title="Контакты"
                  links={[
                    { id: "contact", label: "Запросить аудит" },
                    { id: "pricing", label: "Тарифы" },
                    { id: "process", label: "Процесс работы" },
                  ]}
                  onJump={onNavLink}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-white/60">
                  © {new Date().getFullYear()} TRIVOX CORE. Все права защищены.
                </div>
                <div className="text-xs text-white/60">
                  Сделано для результата. Без “просто кода”.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FooterCol({
  title,
  links,
  onJump,
}: {
  title: string;
  links: Array<{ id: string; label: string }>;
  onJump: (id: string) => void;
}) {
  return (
    <div className="lg:col-span-2">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <button
            key={l.label}
            type="button"
            onClick={() => onJump(l.id)}
            className="text-sm text-white/70 hover:text-white transition-colors text-left"
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function FAQItem({
  index,
  q,
  a,
  openFaq,
  setOpenFaq,
}: {
  index: number;
  q: string;
  a: string;
  openFaq: number | null;
  setOpenFaq: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState<number>(0);
  const isOpen = openFaq === index;

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const h = el.scrollHeight;
    setMaxH(h);
  }, [a, isOpen]);

  return (
    <div className="glassCard rounded-3xl border border-white/10 p-5 revealTarget" data-reveal>
      <button
        type="button"
        className="accordionBtn w-full text-left flex items-center justify-between gap-4"
        data-open={isOpen ? "true" : "false"}
        onClick={() => setOpenFaq((cur) => (cur === index ? null : index))}
        aria-expanded={isOpen}
      >
        <div className="text-sm font-semibold">{q}</div>
        <ChevronDown size={18} className="text-white/80" />
      </button>
      <div
        className="accPanel"
        style={{
          maxHeight: isOpen ? maxH + 14 : 0,
          opacity: isOpen ? 1 : 0.5,
        }}
      >
        <div ref={panelRef} className="mt-3 text-sm text-white/70 leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
}

