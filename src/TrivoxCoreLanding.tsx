import React, { useEffect, useMemo, useRef, useState } from "react";
import PhoneInput, { getCountryCallingCode } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import type { E164Number } from "libphonenumber-js";
import {
  ArrowRight,
  BadgeDollarSign,
  Bot,
  BrainCircuit,
  Building2,
  CircleDot,
  Check,
  Handshake,
  LifeBuoy,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Phone,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Target,
  X,
  Zap,
} from "lucide-react";

type Service = { icon: React.ComponentType<{ size?: number }>; title: string; text: string };
type Advantage = { icon: React.ComponentType<{ size?: number }>; title: string; text: string };
type Step = { n: string; title: string; text: string };

type Tech = { name: string; slug: string };

const services: Service[] = [
  {
    icon: Monitor,
    title: "Веб-разработка",
    text: "Сайты, порталы, личные кабинеты и CRM-системы с быстрой загрузкой и адаптивным дизайном.",
  },
  {
    icon: Smartphone,
    title: "Мобильные приложения",
    text: "iOS + Android: от MVP до полноценного продукта с монетизацией и масштабированием.",
  },
  {
    icon: Bot,
    title: "AI-агенты и чат-боты",
    text: "Автоматизация общения с клиентами, обработка запросов и ассистенты для команды.",
  },
  {
    icon: Zap,
    title: "Автоматизация рутины",
    text: "Документооборот, уведомления, отчёты и внутренние процессы, которые сейчас делаются вручную.",
  },
  {
    icon: Server,
    title: "Backend и интеграции",
    text: "Надёжная архитектура, API, микросервисы и подключение внешних систем.",
  },
  {
    icon: LifeBuoy,
    title: "Поддержка и развитие",
    text: "Не бросаем после сдачи: развиваем продукт, исправляем баги и улучшаем UX.",
  },
];

const advantages: Advantage[] = [
  {
    icon: Zap,
    title: "Быстрый старт",
    text: "Начинаем проект за 3 дня после подписания договора.",
  },
  {
    icon: BadgeDollarSign,
    title: "Дешевле рынка",
    text: "Честная цена за результат без лишних агентских наценок.",
  },
  {
    icon: Target,
    title: "Простой продукт",
    text: "Интуитивный интерфейс и понятная логика для вашей команды.",
  },
  {
    icon: BrainCircuit,
    title: "AI уже внутри",
    text: "Автоматизация там, где это реально выгодно бизнесу.",
  },
  {
    icon: ShieldCheck,
    title: "Качество по-банковски",
    text: "Надёжность, безопасность и стабильность на каждом релизе.",
  },
  {
    icon: Handshake,
    title: "Долгосрочное партнёрство",
    text: "Не исчезаем после сдачи: развиваем продукт вместе с вами.",
  },
];

const steps: Step[] = [
  { n: "01", title: "Бесплатный аудит", text: "Обсуждаем задачу, находим узкие места и определяем направление." },
  { n: "02", title: "Детальное ТЗ", text: "Фиксируем объём, функции, сроки и бюджет. Прозрачно и понятно." },
  { n: "03", title: "Договор", text: "Фиксированная цена и сроки. Никаких скрытых платежей." },
  { n: "04", title: "Разработка", text: "Регулярные демонстрации: вы видите прогресс каждую неделю." },
  { n: "05", title: "Тестирование", text: "QA-контроль перед сдачей: функциональность, безопасность, производительность." },
  { n: "06", title: "Запуск", text: "Сдаём рабочий продукт, обучаем команду, передаём документацию." },
  { n: "07", title: "Поддержка", text: "Фиксим, улучшаем и масштабируем продукт после релиза." },
];

const stackTabs: Record<"web" | "backend", Tech[]> = {
  web: [
    { name: "React", slug: "react" },
    { name: "Angular", slug: "angular" },
    { name: "Vue", slug: "vuedotjs" },
    { name: "Node.js", slug: "nodedotjs" },
    { name: "Webpack", slug: "webpack" },
    { name: "Java", slug: "openjdk" },
    { name: "Kotlin", slug: "kotlin" },
    { name: "Swift", slug: "swift" },
    { name: "Objective-C", slug: "objectivec" },
    { name: "Firebase", slug: "firebase" },
  ],
  backend: [
    { name: "Spring", slug: "spring" },
    { name: "Golang", slug: "go" },
    { name: "Python", slug: "python" },
    { name: "Docker", slug: "docker" },
    { name: "Kafka", slug: "apachekafka" },
    { name: "RabbitMQ", slug: "rabbitmq" },
    { name: "PostgreSQL", slug: "postgresql" },
    { name: "Redis", slug: "redis" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "Nginx", slug: "nginx" },
  ],
};

const CIS_CODES = ["KZ","RU","UZ","KG","TJ","TM","BY","UA","AZ","AM","GE","MD"];
const POPULAR_CODES = ["US","GB","DE","FR","TR","AE","CN","IN","IL","KR","JP","SA","QA","IT","ES","PL","CZ","CA"];
const ALLOWED_COUNTRIES = [...CIS_CODES, ...POPULAR_CODES] as any;
const CIS_SET = new Set(CIS_CODES);

function CountrySelect({ value, onChange, options, iconComponent: Icon }: any) {
  const cis = options.filter((o: any) => o.value && CIS_SET.has(o.value));
  const other = options.filter((o: any) => o.value && !CIS_SET.has(o.value));
  const code = value ? `+${getCountryCallingCode(value)}` : "";

  return (
    <label className="cs-wrap">
      {value && Icon && <Icon country={value} label="" />}
      <span className="cs-code">{code}</span>
      <span className="cs-arrow">▾</span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="cs-native-select"
      >
        <optgroup label="СНГ">
          {cis.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label} (+{getCountryCallingCode(o.value)})
            </option>
          ))}
        </optgroup>
        <optgroup label="Другие">
          {other.map((o: any) => (
            <option key={o.value} value={o.value}>
              {o.label} (+{getCountryCallingCode(o.value)})
            </option>
          ))}
        </optgroup>
      </select>
    </label>
  );
}

export default function TrivoxCoreLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [stackTab, setStackTab] = useState<"web" | "backend">("web");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<E164Number | undefined>();
  const [message, setMessage] = useState("");
  const [formMsg, setFormMsg] = useState<{ type: "idle" | "ok" | "error"; text: string }>({ type: "idle", text: "" });

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = phone ? phone.replace(/[^\d]/g, "") : "";
    if (phoneDigits.length < 10) {
      setFormMsg({ type: "error", text: "Введите корректный номер телефона." });
      window.setTimeout(() => setFormMsg({ type: "idle", text: "" }), 2800);
      return;
    }
    const emailTrimmed = email.trim();
    if (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setFormMsg({ type: "error", text: "Проверьте формат email." });
      window.setTimeout(() => setFormMsg({ type: "idle", text: "" }), 2800);
      return;
    }
    try {
      const res = await fetch("https://formspree.io/f/xeeplqaa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          ...(emailTrimmed ? { email: emailTrimmed } : {}),
          message: message.trim() || "Запрос аудита с сайта",
        }),
      });
      if (res.ok) {
        setFormMsg({ type: "ok", text: "Отлично! Мы свяжемся с вами в течение 24-48 часов." });
        setEmail("");
        setName("");
        setPhone(undefined);
        setMessage("");
      } else {
        setFormMsg({ type: "error", text: "Ошибка отправки. Попробуйте позже." });
      }
    } catch {
      setFormMsg({ type: "error", text: "Ошибка сети. Попробуйте позже." });
    }
    window.setTimeout(() => setFormMsg({ type: "idle", text: "" }), 3500);
  };

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".fade-up"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const techMarquee = useMemo(
    () => [
      { name: "React", slug: "react" },
      { name: "Angular", slug: "angular" },
      { name: "Vue", slug: "vuedotjs" },
      { name: "Node.js", slug: "nodedotjs" },
      { name: "Spring", slug: "spring" },
      { name: "Golang", slug: "go" },
      { name: "Kotlin", slug: "kotlin" },
      { name: "Swift", slug: "swift" },
      { name: "Docker", slug: "docker" },
      { name: "Kafka", slug: "apachekafka" },
      { name: "PostgreSQL", slug: "postgresql" },
      { name: "Redis", slug: "redis" },
    ],
    []
  );

  const jump = (id: string) => {
    setMobileOpen(false);
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={rootRef} className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap');
        :root {
          --color-primary: #1A3A6B;
          --color-accent: #1E7FD8;
          --color-accent-light: #3BA3F0;
          --color-bg: #FFFFFF;
          --color-bg-soft: #F4F7FC;
          --color-bg-card: #EBF3FB;
          --color-text-main: #1A2540;
          --color-text-muted: #5A7090;
          --color-text-light: #FFFFFF;
          --color-border: #D0DEF0;
          --color-success: #27AE60;
          --gradient-brand: linear-gradient(135deg, #1E7FD8 0%, #1A3A6B 100%);
          --section-space: 100px;
        }
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        .site {
          font-family: 'Inter', sans-serif;
          color: var(--color-text-main);
          background: var(--color-bg);
        }
        h1, h2, h3, h4 {
          font-family: 'Manrope', sans-serif;
          margin: 0;
          color: var(--color-primary);
        }
        p { margin: 0; line-height: 1.7; color: var(--color-text-muted); }
        .container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px;
        }
        section { padding: var(--section-space) 0; }
        .section-soft { background: var(--color-bg-soft); }
        .eyebrow {
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
        h1 {
          font-size: clamp(42px, 6vw, 64px);
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 18px;
        }
        @media (min-width: 1280px) {
          h1 {
            font-size: clamp(44px, 4.1vw, 58px);
            max-width: 860px;
          }
        }
        h2 {
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.2;
          font-weight: 700;
          margin-bottom: 18px;
        }
        h3 {
          font-size: clamp(20px, 2.2vw, 24px);
          line-height: 1.3;
          font-weight: 600;
        }
        .card {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: 0 2px 16px rgba(26,58,107,0.08);
          transition: all .25s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(26,58,107,0.14);
        }
        .btn {
          height: 52px;
          border-radius: 10px;
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          border: none;
          padding: 0 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          text-decoration: none;
        }
        .btn-primary {
          background: var(--gradient-brand);
          color: var(--color-text-light);
        }
        .btn-secondary {
          background: transparent;
          color: var(--color-primary);
          border: 1px solid var(--color-border);
        }
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #fff;
          border-bottom: 1px solid rgba(208,222,240,.6);
          transition: box-shadow .25s ease;
        }
        .navbar.scrolled {
          box-shadow: 0 2px 20px rgba(26,58,107,0.1);
        }
        .nav-row {
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-link {
          font-family: 'Manrope', sans-serif;
          font-weight: 600;
          color: var(--color-primary);
          border: none;
          background: none;
          cursor: pointer;
        }
        .brand-text {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Manrope', sans-serif;
          font-weight: 800;
          font-size: 26px;
          color: var(--color-primary);
          letter-spacing: -.02em;
          white-space: nowrap;
        }
        .brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 0 4px rgba(30,127,216,.18);
        }
        .menu-btn { display: none; }

        .hero {
          min-height: 0;
          background:
            linear-gradient(120deg, #fff 0%, #fff 52%, #ebf3fb 100%);
          position: relative;
        }
        .hero:before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(30,127,216,.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(30,127,216,.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .hero-section {
          position: relative;
          z-index: 1;
          padding: 72px 0 66px;
        }
        .hero-core {
          max-width: 940px;
          margin: 0 auto;
        }
        .hero-company {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(22px, 2.5vw, 34px);
          font-weight: 800;
          letter-spacing: .06em;
          color: var(--color-primary);
          margin-bottom: 16px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(30,127,216,.12), rgba(59,163,240,.08));
          border: 1px solid rgba(30,127,216,.2);
          box-shadow: 0 6px 18px rgba(26,58,107,.08);
        }
        .hero-company-sub {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .02em;
          color: var(--color-text-muted);
          margin-left: 2px;
          white-space: nowrap;
        }
        .hero-company-mark {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-accent);
          box-shadow: 0 0 0 5px rgba(30,127,216,.18);
          flex-shrink: 0;
        }
        .context-section {
          padding-top: 0 !important;
          padding-bottom: 22px !important;
          margin-top: -26px;
        }
        .context-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 0;
        }
        .context-card {
          border: 1px solid var(--color-border);
          border-radius: 14px;
          background: #fff;
          padding: 20px;
          box-shadow: 0 8px 20px rgba(26,58,107,.06);
        }
        .rail-label {
          font-size: 13px;
          color: var(--color-text-muted);
          font-weight: 600;
          margin-bottom: 10px;
        }
        .context-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rail-pill {
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          color: var(--color-primary);
          transition: transform .2s ease, background .2s ease;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }
        .rail-pill svg {
          width: 14px;
          height: 14px;
          color: rgba(26,58,107,.74);
          flex-shrink: 0;
        }
        .rail-pill:hover {
          background: rgba(37, 99, 235, 0.14);
          transform: scale(1.03);
        }
        
        .hero-actions {
          margin-top: 28px;
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-lead {
          max-width: 760px;
          font-size: 18px;
        }
        @media (max-width: 767px) {
          .hero-lead {
            font-size: 16px;
          }
        }
        .hero-stats {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid var(--color-border);
          border-radius: 14px;
          overflow: hidden;
          background: #fff;
        }
        .hero-stat {
          padding: 14px 16px;
          min-height: 88px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid var(--color-border);
        }
        .hero-stat:last-child { border-right: none; }
        .hero-stat b { font-family: 'Manrope', sans-serif; font-size: 2rem; font-weight: 800; color: var(--color-primary); line-height: 1; }
        .hero-stat small { font-size: 20px; margin-right: 6px; }
        .hero-side { padding: 28px; border-radius: 20px; background: var(--color-bg-soft); border: 1px solid var(--color-border); }
        .hero-checks { list-style: none; padding: 0; margin: 20px 0; display: grid; gap: 12px; }
        .hero-checks li { display: flex; gap: 10px; align-items: flex-start; color: var(--color-text-main); }
        .hero-checks li svg { color: var(--color-success); flex-shrink: 0; margin-top: 2px; }
        .hero-price {
          margin-top: 14px;
          border-top: 1px solid var(--color-border);
          padding-top: 14px;
          display: grid;
          gap: 8px;
        }
        .hero-price strong { font-size: 18px; font-family: 'Manrope', sans-serif; color: var(--color-primary); }
        .hero-followup {
          padding-top: 20px;
          padding-bottom: 72px;
        }
        .hero-side-inner {
          display: grid;
          gap: 12px;
        }
        .hero-point {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: var(--color-text-main);
          font-size: 14px;
        }
        .hero-point svg {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--color-accent);
        }

        .marquee-wrap { overflow: hidden; margin-top: 24px; }
        .marquee {
          width: max-content;
          display: flex;
          gap: 26px;
          animation: marquee 36s linear infinite;
          padding: 6px 0;
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .tech-chip {
          height: 56px;
          min-width: 160px;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #fff;
        }
        .tech-chip img {
          width: 28px;
          height: 28px;
          filter: grayscale(1) saturate(0);
          transition: filter .2s ease;
        }
        .tech-chip:hover img { filter: none; }
        .tech-chip span { color: var(--color-text-main); font-weight: 500; font-size: 14px; }

        .about-grid, .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          align-items: stretch;
        }
        .about-cards { display: grid; gap: 16px; }
        .about-mini { padding: 22px; display: flex; gap: 12px; align-items: flex-start; }
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-card);
          color: var(--color-accent);
          flex-shrink: 0;
        }

        .problem-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .problem-card {
          padding: 22px;
          border-left: 4px solid var(--color-accent);
        }
        .problem-result {
          margin-top: 16px;
          padding: 24px;
          background: var(--color-bg-card);
          border-radius: 12px;
          border: 1px solid var(--color-border);
          font-weight: 500;
          color: var(--color-primary);
        }

        .services-grid, .advantages-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          align-items: stretch;
        }
        .service-card, .adv-card {
          padding: 22px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .service-card h3, .adv-card h3 { margin: 14px 0 10px; }

        .timeline {
          position: relative;
          margin-top: 26px;
          padding-left: 44px;
          display: grid;
          gap: 22px;
        }
        .timeline:before {
          content: "";
          position: absolute;
          left: 18px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-border);
        }
        .step { position: relative; }
        .step-dot {
          position: absolute;
          left: -44px;
          top: 4px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gradient-brand);
          color: #fff;
          font: 700 13px/1 'Manrope', sans-serif;
          display: grid;
          place-items: center;
          box-shadow: 0 6px 18px rgba(30,127,216,.3);
        }

        .stack-tabs { display: inline-flex; gap: 8px; padding: 6px; background: var(--color-bg-soft); border-radius: 12px; border: 1px solid var(--color-border); }
        .stack-tab {
          border: none;
          background: transparent;
          color: var(--color-primary);
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          padding: 10px 14px;
          border-radius: 9px;
          cursor: pointer;
        }
        .stack-tab.active {
          background: #fff;
          box-shadow: 0 2px 10px rgba(26,58,107,.1);
        }
        .stack-grid {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }
        .stack-item {
          border: 1px solid var(--color-border);
          border-radius: 14px;
          background: #fff;
          height: 92px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .stack-item img {
          width: 36px;
          height: 36px;
          filter: grayscale(1) saturate(0);
          transition: filter .2s ease;
        }
        .stack-item:hover img { filter: none; }
        .stack-item span { font-size: 12px; color: var(--color-text-main); font-weight: 500; text-align: center; }

        .contact {
          background: var(--gradient-brand);
          color: #fff;
        }
        .contact h2, .contact h3, .contact p { color: #fff; }
        .contact .muted { color: rgba(255,255,255,.84); }
        .tag-row { margin-top: 16px; display: flex; gap: 8px; flex-wrap: wrap; }
        .tag { border: 1px solid rgba(255,255,255,.35); border-radius: 20px; padding: 6px 12px; font-size: 13px; color: #fff; }
        .contact-form {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          color: var(--color-text-main);
          border: 1px solid rgba(255,255,255,.2);
        }
        .contact-form h3, .contact-form p { color: var(--color-text-main); }
        .email-input {
          width: 100%;
          height: 52px;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          padding: 0 14px;
          font-size: 15px;
          margin-top: 12px;
        }
        .phone-input-wrap {
          margin-top: 12px;
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: 10px;
          background: #fff;
          position: relative;
          z-index: 50;
        }
        .phone-input-wrap:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(30,127,216,.12);
        }
        .phone-input-wrap .PhoneInputInput {
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 0 10px 10px 0;
          padding: 0 14px;
          font-size: 15px;
          font-family: inherit;
          outline: none;
          background: transparent;
        }
        .cs-wrap {
          display: flex;
          align-items: center;
          padding: 0 10px 0 14px;
          gap: 6px;
          flex-shrink: 0;
          position: relative;
          cursor: pointer;
          border-right: 1px solid var(--color-border);
          align-self: stretch;
        }
        .cs-wrap .PhoneInputCountryIcon {
          width: 22px;
          height: 16px;
          overflow: hidden;
          border-radius: 2px;
          flex-shrink: 0;
          line-height: 0;
        }
        .cs-wrap .PhoneInputCountryIconImg,
        .cs-wrap .PhoneInputCountryIcon img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cs-code {
          font-size: 15px;
          font-weight: 500;
          color: var(--color-text-main);
          white-space: nowrap;
        }
        .cs-arrow {
          font-size: 11px;
          color: var(--color-text-muted);
        }
        .cs-native-select {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }
        .form-note { margin-top: 10px; font-size: 12px; color: var(--color-text-muted) !important; }
        .mini-help {
          margin-top: 14px;
          border-radius: 12px;
          padding: 16px;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-border);
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .green-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--color-text-main);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-success);
          display: inline-block;
        }

        .footer {
          background: #1A2540;
          color: #fff;
          padding: 70px 0 24px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 24px;
        }
        .footer h4 { color: #fff; font-size: 16px; margin-bottom: 12px; }
        .footer p, .footer a, .footer button {
          color: rgba(255,255,255,.72);
          font-size: 14px;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          cursor: pointer;
        }
        .footer-links { display: grid; gap: 8px; }
        .footer-logo { height: 36px; width: auto; filter: brightness(0) invert(1); }
        .footer-brand {
          font: 800 32px/1.05 'Manrope', sans-serif;
          letter-spacing: -.02em;
          color: #fff;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .footer-brand .brand-dot { box-shadow: 0 0 0 4px rgba(255,255,255,.14); }
        .footer-bottom {
          margin-top: 24px;
          border-top: 1px solid rgba(255,255,255,.1);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          color: rgba(255,255,255,.62);
          font-size: 13px;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity .6s ease, transform .6s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          * {
            max-width: 100%;
            box-sizing: border-box;
          }
          body {
            overflow-x: hidden;
          }
          .hero-section, section, .container {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .hero-badge-row {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 16px;
          }
          .cta-buttons {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
          }
          .cta-buttons button, .cta-buttons a {
            width: 100%;
            padding: 14px 24px;
            border-radius: 12px;
          }
          .stats-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            border: 0;
            background: transparent;
          }
          .stats-row > div {
            padding: 14px 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.08);
            background: rgba(255,255,255,0.65);
          }
          .stats-row > div:first-child,
          .stats-row > div:last-child {
            border-radius: 12px;
          }
          .focus-block, .format-block {
            padding: 16px;
            border-radius: 14px;
            margin: 0 0 16px 0;
            width: 100%;
            box-sizing: border-box;
          }
          .focus-block .tag, .format-block .tag {
            padding: 8px 14px;
            border-radius: 10px;
            display: block;
            margin-bottom: 8px;
          }
        }

        @media (max-width: 1024px) {
          .container { padding: 0 24px; }
          section { --section-space: 80px; }
          .nav-row { height: 74px; gap: 14px; }
          .brand-text { font-size: 22px; }
          .nav-links, .nav-cta { display: none; }
          .menu-btn { display: inline-flex; width: 44px; height: 44px; align-items: center; justify-content: center; border: 1px solid var(--color-border); background: #fff; border-radius: 10px; }
          .about-grid, .contact-grid { grid-template-columns: 1fr; }
          .hero-section { padding: 66px 0 20px; }
          .context-section { margin-top: -14px; }
          .context-grid { grid-template-columns: 1fr; }
          .services-grid, .advantages-grid { grid-template-columns: repeat(2, 1fr); }
          .stack-grid { grid-template-columns: repeat(3, 1fr); }
          .footer-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 767px) {
          .container { padding: 0 20px; }
          section { padding: 64px 0; }
          .nav-row { height: 68px; }
          .brand-text { font-size: 18px; letter-spacing: 0; }
          .brand-dot { width: 8px; height: 8px; box-shadow: 0 0 0 3px rgba(30,127,216,.16); }
          .hero-section { padding: 56px 0 14px; }
          .context-section { margin-top: 0; padding-bottom: 20px !important; }
          .hero-company {
            font-size: 18px;
            padding: 8px 10px;
            gap: 8px;
          }
          .hero-company-sub {
            width: 100%;
            margin-left: 0;
            white-space: normal;
            font-size: 12px;
          }
          h1 { font-size: 36px; }
          h2 { font-size: 28px; }
          .hero-actions .btn { width: 100%; }
          .hero-stats { grid-template-columns: 1fr; }
          .hero-stat { border-right: none; border-bottom: 1px solid var(--color-border); }
          .hero-stat:last-child { border-bottom: none; }
          .problem-grid, .services-grid, .advantages-grid { grid-template-columns: 1fr; }
          .stack-grid { grid-template-columns: repeat(2, 1fr); }
          .context-card { padding: 14px; }
          .context-tags { display: grid; grid-template-columns: 1fr; }
          .rail-pill { width: 100%; font-size: 13px; }
          .footer-grid, .footer-bottom { grid-template-columns: 1fr; display: grid; }
        }

        @media (max-width: 375px) {
          .container,
          .hero-section,
          section {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
          .hero-section {
            padding-top: 48px !important;
            padding-bottom: 10px !important;
          }
          h1 {
            font-size: 32px !important;
            line-height: 1.12;
            margin-bottom: 12px;
          }
          .hero-lead {
            font-size: 14px !important;
            line-height: 1.56;
          }
          .hero-company {
            margin-bottom: 12px;
            padding: 7px 9px;
          }
          .hero-company-sub {
            font-size: 11px;
          }
          .cta-buttons {
            gap: 10px;
          }
          .cta-buttons .btn {
            min-height: 48px;
            padding: 12px 16px !important;
            font-size: 14px;
          }
          .stats-row > div {
            padding: 12px 14px;
          }
          .hero-stat b {
            font-size: 1.45rem !important;
          }
          .hero-stat p {
            font-size: 13px !important;
            line-height: 1.45;
          }
          .context-section {
            padding-bottom: 16px !important;
          }
          .context-card {
            padding: 12px !important;
          }
          .rail-pill {
            font-size: 12px !important;
            padding: 7px 12px !important;
          }
          .hero-followup {
            padding-top: 6px;
            padding-bottom: 46px;
          }
          .hero-side {
            padding: 16px;
          }
        }
        @media (max-width: 768px) {
          * { box-sizing: border-box; }
          body { overflow-x: hidden; }
          .pill-tag, .focus-tag { color: #1a1a2e !important; }
          .tag-label { color: #1a1a2e !important; }
        }
      `}</style>

      <header className={`navbar ${navScrolled ? "scrolled" : ""}`}>
        <div className="container nav-row">
          <button onClick={() => jump("top")} style={{ border: "none", background: "none", padding: 0, cursor: "pointer" }} aria-label="Наверх">
            <span className="brand-text">
              TRIVOX CORE
              <i className="brand-dot" />
            </span>
          </button>

          <nav className="nav-links">
            {[
              ["services", "Услуги"],
              ["process", "Как работаем"],
              ["stack", "Технологии"],
              ["contacts", "Контакты"],
            ].map(([id, label]) => (
              <button key={id} className="nav-link" onClick={() => jump(id)}>
                {label}
              </button>
            ))}
          </nav>

          <button className="btn btn-primary nav-cta" onClick={() => jump("contacts")}>
            Запросить аудит
          </button>

          <button className="menu-btn" onClick={() => setMobileOpen((v) => !v)} aria-label="Меню">
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {mobileOpen && (
          <div className="container" style={{ paddingBottom: 14 }}>
            <div className="card" style={{ padding: 14, display: "grid", gap: 8 }}>
              {[
                ["services", "Услуги"],
                ["process", "Как работаем"],
                ["stack", "Технологии"],
                ["contacts", "Контакты"],
              ].map(([id, label]) => (
                <button key={id} className="btn btn-secondary" onClick={() => jump(id)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero">
          <div className="container hero-section">
            <div className="hero-core fade-up">
              <div className="hero-company hero-badge-row">
                <span>TRIVOX CORE</span>
                <i className="hero-company-mark" />
                <span className="hero-company-sub">tech partner, не подрядчик</span>
              </div>
              <h1>
                IT-аутсорсинг
                <br />
                нового поколения
              </h1>
              <p className="hero-lead">
                Мы объединяем senior-разработчиков и product-специалистов, чтобы запускать решения быстрее,
                прозрачнее и выгоднее для бизнеса.
              </p>
              <div className="hero-actions cta-buttons">
                <button className="btn btn-primary" onClick={() => jump("contacts")}>
                  Запросить бесплатный аудит
                </button>
                <button className="btn btn-secondary" onClick={() => jump("process")}>
                  Как мы работаем
                </button>
              </div>
              <div className="hero-stats stats-row">
                {[
                  ["⚡", "3 дня", "до старта разработки"],
                  ["✅", "99% QA", "на каждом шаге"],
                  ["🤖", "AI в деле", "встраиваем по делу"],
                ].map(([icon, v, t]) => (
                  <div key={v} className="hero-stat">
                    <b><small>{icon}</small>{v}</b>
                    <p style={{ fontSize: 14 }}>{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="context-section" style={{ paddingTop: 6, paddingBottom: 28 }}>
          <div className="container">
            <div className="context-grid fade-up">
              <div className="context-card focus-block">
                <div className="rail-label">Фокус:</div>
                <div className="context-tags">
                  <span className="rail-pill"><Zap size={14} />Автоматизация</span>
                  <span className="rail-pill"><Bot size={14} />AI-агенты</span>
                  <span className="rail-pill"><Server size={14} />Интеграции API</span>
                </div>
              </div>
              <div className="context-card format-block">
                <div className="rail-label">Формат:</div>
                <div className="context-tags">
                  <span className="rail-pill"><BadgeDollarSign size={14} />Фикс-бюджет</span>
                  <span className="rail-pill"><Rocket size={14} />Weekly демо</span>
                  <span className="rail-pill"><CircleDot size={14} />QA контроль</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-followup">
          <div className="container">
            <div className="hero-side card fade-up">
              <h3>Короткий путь к результату</h3>
              <p style={{ marginTop: 8 }}>Без пропажи разработчиков и тишины после сдачи.</p>
              <ul className="hero-checks">
                {["Прогресс каждую неделю", "QA перед каждой сдачей", "Поддержка после релиза"].map((x) => (
                  <li key={x}>
                    <Check size={18} />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <div className="hero-price">
                <strong>Что вы получаете на старте</strong>
                <div className="hero-side-inner">
                  <div className="hero-point">
                    <Rocket size={16} />
                    <span>Детальный roadmap и прозрачные этапы.</span>
                  </div>
                  <div className="hero-point">
                    <ShieldCheck size={16} />
                    <span>Фиксированный scope и ответственность по срокам.</span>
                  </div>
                  <div className="hero-point">
                    <LifeBuoy size={16} />
                    <span>План развития после релиза, а не “сдали и забыли”.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ paddingTop: 58, paddingBottom: 58 }}>
          <div className="container fade-up">
            <div className="eyebrow">ТЕХНОЛОГИИ, С КОТОРЫМИ МЫ РАБОТАЕМ</div>
            <div className="marquee-wrap">
              <div className="marquee">
                {[...techMarquee, ...techMarquee].map((item, i) => (
                  <div className="tech-chip" key={`${item.slug}-${i}`}>
                    <img src={`https://cdn.simpleicons.org/${item.slug}/1A3A6B`} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section-soft">
          <div className="container about-grid">
            <div className="fade-up">
              <div className="eyebrow">Кто мы</div>
              <h2>Не типичная IT-компания</h2>
              <p>
                Мы команда разработчиков и менеджеров, которая 4 года вместе работала над сложными цифровыми продуктами
                в крупнейших финтех-компаниях Казахстана и СНГ. После этого объединились, чтобы приносить этот же
                уровень качества бизнесу любого масштаба.
              </p>
            </div>
            <div className="about-cards">
              <div className="card about-mini fade-up">
                <span className="icon-box"><Building2 size={22} /></span>
                <div>
                  <h3>Не типичная IT-компания</h3>
                  <p style={{ marginTop: 8 }}>
                    Команда, выращенная в условиях банковских требований к качеству и срокам. Никаких фрилансеров.
                  </p>
                </div>
              </div>
              <div className="card about-mini fade-up">
                <span className="icon-box"><Zap size={22} /></span>
                <div>
                  <h3>Доступно каждому</h3>
                  <p style={{ marginTop: 8 }}>
                    Раньше такое качество было доступно только банкам и корпорациям. Теперь — доступно бизнесу любого масштаба.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problem">
          <div className="container fade-up">
            <div className="eyebrow">Боль рынка</div>
            <h2>Почему большинство IT-проектов проваливаются</h2>
            <div className="problem-grid">
              {[
                ["Срыв сроков", "Разработчики срывают дедлайны и пропадают на связи. Проект зависает без результата."],
                ["Код без решения", "Продукт написан, но бизнес-задача не решена. Технически красиво, а по сути бесполезно."],
                ["Нет поддержки", "После сдачи — тишина. Никто не исправляет ошибки и не развивает продукт."],
                ["Скрытые расходы", "Скрытые наценки и бесконечные доплаты превращают проект в дорогой и долгий."],
              ].map(([t, d]) => (
                <div key={t} className="card problem-card">
                  <h3>{t}</h3>
                  <p style={{ marginTop: 8 }}>{d}</p>
                </div>
              ))}
            </div>
            <div className="problem-result">
              В итоге: деньги потрачены, проблема осталась. Мы строим иначе — с гарантией результата.
            </div>
          </div>
        </section>

        <section id="services" className="section-soft">
          <div className="container fade-up">
            <div className="eyebrow">Что мы строим</div>
            <h2>IT-решения, которые работают на ваш бизнес</h2>
            <p style={{ marginBottom: 24 }}>
              Специализируемся на том, что реально двигает бизнес вперёд.
            </p>
            <div className="services-grid">
              {services.map((s) => (
                <article key={s.title} className="card service-card">
                  <span className="icon-box"><s.icon size={24} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="advantages">
          <div className="container fade-up">
            <div className="eyebrow">Наши преимущества</div>
            <h2>Почему стоит работать с нами</h2>
            <div className="advantages-grid">
              {advantages.map((a) => (
                <article key={a.title} className="card adv-card">
                  <span className="icon-box"><a.icon size={24} /></span>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="section-soft">
          <div className="container fade-up">
            <div className="eyebrow">Как это работает</div>
            <h2>Просто и прозрачно</h2>
            <p>Чёткий процесс без неожиданностей.</p>
            <div className="timeline">
              {steps.map((s) => (
                <div className="step" key={s.n}>
                  <span className="step-dot">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p style={{ marginTop: 8 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="stack">
          <div className="container fade-up">
            <h2>Технологический стек</h2>
            <div className="stack-tabs">
              <button className={`stack-tab ${stackTab === "web" ? "active" : ""}`} onClick={() => setStackTab("web")}>
                Web & Mobile
              </button>
              <button className={`stack-tab ${stackTab === "backend" ? "active" : ""}`} onClick={() => setStackTab("backend")}>
                Backend & DevOps
              </button>
            </div>
            <div className="stack-grid">
              {stackTabs[stackTab].map((t) => (
                <div key={t.name} className="stack-item">
                  <img src={`https://cdn.simpleicons.org/${t.slug}/1A3A6B`} alt={t.name} />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="contact">
          <div className="container contact-grid fade-up">
            <div>
              <div className="eyebrow" style={{ color: "rgba(255,255,255,.72)" }}>Готовы построить иначе?</div>
              <h2>
                Запросите бесплатный аудит
                <br />
                и получите фиксированный план
              </h2>
              <p className="muted" style={{ marginTop: 14 }}>
                Мы быстро разберёмся в задаче, предложим архитектуру и оценку сроков/стоимости — так, чтобы вы понимали,
                за что платите и что получите.
              </p>
              <div className="tag-row">
                {["прозрачность", "скорость", "качество", "AI по делу"].map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20 }}>
                <span className="icon-box" style={{ background: "rgba(255,255,255,.18)", color: "#fff" }}><Mail size={18} /></span>
                <div>
                  <p className="muted" style={{ fontSize: 12, margin: 0 }}>Напишите нам напрямую</p>
                  <a href="mailto:team@trivoxcore.com" style={{ color: "#fff", fontFamily: "'Manrope', sans-serif", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                    team@trivoxcore.com
                  </a>
                </div>
              </div>
            </div>

            <form className="contact-form" onSubmit={onSubmitEmail} noValidate>
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h3>Запросить аудит</h3>
                  <p style={{ marginTop: 6 }}>Ответим с конкретикой и ближайшим шагом.</p>
                </div>
                <span className="green-badge"><i className="dot" /> 24-48h</span>
              </div>
              <input
                className="email-input"
                placeholder="Ваше имя"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <PhoneInput
                international
                defaultCountry="KZ"
                countries={ALLOWED_COUNTRIES}
                countrySelectComponent={CountrySelect}
                placeholder="Номер телефона"
                value={phone}
                onChange={setPhone}
                className="phone-input-wrap"
              />
              <input
                className="email-input"
                placeholder="Email (необязательно)"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <textarea
                placeholder="Опишите задачу (необязательно)"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  fontSize: 15,
                  marginTop: 12,
                  fontFamily: "inherit",
                  resize: "none",
                }}
              />
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 12 }}>
                Отправить заявку
                <ArrowRight size={16} />
              </button>
              <div style={{ marginTop: 10, minHeight: 20, fontSize: 12 }}>
                {formMsg.type === "ok" && (
                  <p style={{ color: "var(--color-success)", margin: 0 }}>{formMsg.text}</p>
                )}
                {formMsg.type === "error" && (
                  <p style={{ color: "#e74c3c", margin: 0 }}>{formMsg.text}</p>
                )}
                {formMsg.type === "idle" && (
                  <p className="form-note" style={{ margin: 0 }}>Нажимая кнопку, вы соглашаетесь на обработку запроса.</p>
                )}
              </div>
              <div className="mini-help">
                <span className="icon-box"><Bot size={20} /></span>
                <div>
                  <h3 style={{ fontSize: 16 }}>Сразу по делу</h3>
                  <p style={{ marginTop: 4 }}>Мы зададим 5-7 вопросов для анализа и дадим план.</p>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <span className="footer-brand">
                TRIVOX CORE
                <i className="brand-dot" />
              </span>
              <p style={{ marginTop: 10 }}>делаем то, чего не хватает рынку</p>
              <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
                <a href="#" aria-label="Telegram"><Phone size={20} color="#fff" /></a>
                <a href="#" aria-label="LinkedIn"><Mail size={20} color="#fff" /></a>
              </div>
            </div>
            <div>
              <h4>Компания</h4>
              <div className="footer-links">
                <button onClick={() => jump("advantages")}>Преимущества</button>
                <button onClick={() => jump("process")}>Процесс</button>
              </div>
            </div>
            <div>
              <h4>Услуги</h4>
              <div className="footer-links">
                <button onClick={() => jump("services")}>Веб-разработка</button>
                <button onClick={() => jump("services")}>Мобильные приложения</button>
                <button onClick={() => jump("services")}>AI-агенты и боты</button>
                <button onClick={() => jump("services")}>Автоматизация</button>
              </div>
            </div>
            <div>
              <h4>Контакты</h4>
              <div className="footer-links">
                <button onClick={() => jump("contacts")}>Запросить аудит</button>
                <a href="mailto:team@trivoxcore.com">team@trivoxcore.com</a>
                <a href="#">
                  <MapPin size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} />
                  Алматы, Казахстан
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 TRIVOX CORE. Все права защищены.</span>
            <span>Сделано для результата. Без "просто кода"</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

