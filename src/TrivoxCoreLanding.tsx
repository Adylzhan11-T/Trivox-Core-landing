import React, { useEffect, useMemo, useRef, useState } from "react";
import "./styles/landing.css";
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
  Compass,
  Handshake,
  LifeBuoy,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Rocket,
  Server,
  ShieldCheck,
  Smartphone,
  Target,
  X,
  Zap,
} from "lucide-react";

const LinkedinIcon = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const WhatsAppIcon = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const InstagramIcon = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TelegramIcon = ({ size = 20, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const HeroIllustration = () => (
  <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "auto" }}>
    <rect x="40" y="24" width="320" height="220" rx="14" fill="#fff" stroke="#D0DEF0" strokeWidth="1.2"/>
    <rect x="40" y="24" width="320" height="32" rx="14" fill="#F4F7FC"/>
    <rect x="40" y="44" width="320" height="12" fill="#F4F7FC"/>
    <circle cx="62" cy="40" r="4.5" fill="#D0DEF0"/>
    <circle cx="76" cy="40" r="4.5" fill="#D0DEF0"/>
    <circle cx="90" cy="40" r="4.5" fill="#D0DEF0"/>
    <rect x="64" y="74" width="55" height="5" rx="2.5" fill="rgba(30,127,216,.4)"/>
    <rect x="64" y="87" width="95" height="5" rx="2.5" fill="rgba(30,127,216,.15)"/>
    <rect x="78" y="100" width="75" height="5" rx="2.5" fill="rgba(30,127,216,.25)"/>
    <rect x="78" y="113" width="48" height="5" rx="2.5" fill="rgba(30,127,216,.12)"/>
    <rect x="64" y="126" width="82" height="5" rx="2.5" fill="rgba(30,127,216,.3)"/>
    <rect x="64" y="139" width="105" height="5" rx="2.5" fill="rgba(30,127,216,.1)"/>
    <rect x="78" y="152" width="55" height="5" rx="2.5" fill="rgba(30,127,216,.2)"/>
    <rect x="218" y="70" width="124" height="80" rx="8" fill="rgba(30,127,216,.03)" stroke="rgba(30,127,216,.08)"/>
    <rect x="234" y="116" width="14" height="24" rx="4" fill="rgba(30,127,216,.2)"/>
    <rect x="256" y="104" width="14" height="36" rx="4" fill="rgba(30,127,216,.35)"/>
    <rect x="278" y="110" width="14" height="30" rx="4" fill="rgba(30,127,216,.22)"/>
    <rect x="300" y="96" width="14" height="44" rx="4" fill="rgba(30,127,216,.42)"/>
    <rect x="322" y="106" width="14" height="34" rx="4" fill="rgba(30,127,216,.28)"/>
    <rect x="218" y="164" width="124" height="7" rx="3.5" fill="rgba(30,127,216,.06)"/>
    <rect x="218" y="164" width="78" height="7" rx="3.5" fill="rgba(39,174,96,.3)"/>
    <circle cx="224" cy="192" r="5" fill="rgba(39,174,96,.3)"/>
    <rect x="234" y="188" width="50" height="4" rx="2" fill="rgba(30,127,216,.12)"/>
    <rect x="234" y="197" width="35" height="4" rx="2" fill="rgba(30,127,216,.06)"/>
    <rect x="330" y="44" width="130" height="68" rx="12" fill="#fff" stroke="#D0DEF0" strokeWidth="1"/>
    <circle cx="352" cy="70" r="10" fill="rgba(30,127,216,.1)"/>
    <rect x="368" y="65" width="72" height="5" rx="2.5" fill="rgba(30,127,216,.18)"/>
    <rect x="368" y="76" width="48" height="4" rx="2" fill="rgba(30,127,216,.08)"/>
    <rect x="346" y="94" width="75" height="5" rx="2.5" fill="rgba(30,127,216,.06)"/>
    <rect x="346" y="94" width="50" height="5" rx="2.5" fill="rgba(39,174,96,.22)"/>
    <rect x="10" y="258" width="115" height="56" rx="12" fill="#fff" stroke="#D0DEF0" strokeWidth="1"/>
    <circle cx="32" cy="280" r="8" fill="rgba(30,127,216,.12)"/>
    <rect x="46" y="276" width="60" height="4" rx="2" fill="rgba(30,127,216,.15)"/>
    <rect x="46" y="286" width="42" height="4" rx="2" fill="rgba(30,127,216,.06)"/>
    <circle cx="420" cy="200" r="22" fill="rgba(30,127,216,.04)" stroke="rgba(30,127,216,.1)" strokeWidth="1.2" strokeDasharray="4 4"/>
    <circle cx="420" cy="200" r="8" fill="rgba(30,127,216,.12)"/>
    <circle cx="16" cy="100" r="14" fill="rgba(30,127,216,.03)" stroke="rgba(30,127,216,.06)" strokeDasharray="3 3"/>
    <line x1="360" y1="112" x2="400" y2="182" stroke="rgba(30,127,216,.08)" strokeWidth="1.2" strokeDasharray="4 4"/>
    <line x1="130" y1="244" x2="75" y2="264" stroke="rgba(30,127,216,.08)" strokeWidth="1.2" strokeDasharray="4 4"/>
  </svg>
);

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
    icon: Compass,
    title: "CJM — карта пути клиента",
    text: "Анализируем путь клиента от первого касания до повторной покупки, находим точки роста и оптимизируем конверсию.",
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
    { name: "Flutter", slug: "flutter" },
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const code = value ? `+${getCountryCallingCode(value)}` : "";

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setSearch(""); }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const all = options.filter((o: any) => o.value);
  const q = search.trim().toLowerCase();
  const filtered = q
    ? all.filter((o: any) => {
        const cc = String(getCountryCallingCode(o.value));
        return o.label.toLowerCase().includes(q) || `+${cc}`.includes(q) || cc.includes(q);
      })
    : all;

  const cis = filtered.filter((o: any) => CIS_SET.has(o.value));
  const other = filtered.filter((o: any) => !CIS_SET.has(o.value));

  const pick = (c: string) => { onChange(c); setOpen(false); setSearch(""); };

  return (
    <div className="cs-wrap" ref={wrapRef}>
      <div className="cs-trigger" onClick={() => setOpen(!open)}>
        {value && Icon && <Icon country={value} label="" />}
        <span className="cs-code">{code}</span>
        <span className="cs-arrow">{open ? "▴" : "▾"}</span>
      </div>
      {open && (
        <div className="cs-dropdown">
          <div className="cs-search-box">
            <input
              ref={searchRef}
              className="cs-search"
              placeholder="Страна или код"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="cs-list">
            {cis.map((o: any) => (
              <div key={o.value} className={`cs-option${o.value === value ? " cs-active" : ""}`} onClick={() => pick(o.value)}>
                {Icon && <Icon country={o.value} label="" />}
                <span className="cs-name">{o.label}</span>
                <span className="cs-cc">+{getCountryCallingCode(o.value)}</span>
              </div>
            ))}
            {cis.length > 0 && other.length > 0 && <div className="cs-divider" />}
            {other.map((o: any) => (
              <div key={o.value} className={`cs-option${o.value === value ? " cs-active" : ""}`} onClick={() => pick(o.value)}>
                {Icon && <Icon country={o.value} label="" />}
                <span className="cs-name">{o.label}</span>
                <span className="cs-cc">+{getCountryCallingCode(o.value)}</span>
              </div>
            ))}
            {cis.length === 0 && other.length === 0 && (
              <div className="cs-empty">Ничего не найдено</div>
            )}
          </div>
        </div>
      )}
    </div>
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
  const [sending, setSending] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
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
    setSending(true);
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
    setSending(false);
    window.setTimeout(() => setFormMsg({ type: "idle", text: "" }), 3500);
  };

  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 80);
      setShowTop(window.scrollY > 600);
    };
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
              <div className="hero-layout">
                <div className="hero-text">
                  <div className="hero-company hero-badge-row">
                    <span>TRIVOX CORE</span>
                    <i className="hero-company-mark" />
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
                </div>
                <div className="hero-illust">
                  <HeroIllustration />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="context-section">
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
                  <h3>Банковский уровень</h3>
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
            <div className="process-track">
              {steps.map((s, i) => (
                <div className="process-card" key={s.n}>
                  <div className="process-top">
                    <span className="process-num">{s.n}</span>
                    {i < steps.length - 1 && <span className="process-connector" />}
                  </div>
                  <h3 style={{ marginTop: 14, fontSize: 15 }}>{s.title}</h3>
                  <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5, paddingRight: 8 }}>{s.text}</p>
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
                  <a href="mailto:team@trivoxcore.com" style={{ color: "#fff", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
                    team@trivoxcore.com
                  </a>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                <a
                  href="https://wa.me/77001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link social-link-wa"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://t.me/trivoxcore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link social-link-tg"
                >
                  <TelegramIcon size={16} />
                  Telegram
                </a>
                <a
                  href="https://www.linkedin.com/company/trivox-core/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <LinkedinIcon size={16} />
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/trivoxcore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                >
                  <InstagramIcon size={16} />
                  Instagram
                </a>
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
              {/* Honeypot — скрытое поле для защиты от спамботов (Formspree игнорирует _gotcha) */}
              <input name="_gotcha" type="text" style={{ display: "none" }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label htmlFor="contact-name" className="sr-only">Ваше имя</label>
              <input
                id="contact-name"
                className="email-input"
                placeholder="Ваше имя"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label htmlFor="contact-phone" className="sr-only">Номер телефона</label>
              <PhoneInput
                international
                defaultCountry="KZ"
                countries={ALLOWED_COUNTRIES}
                countrySelectComponent={CountrySelect}
                placeholder="Номер телефона"
                id="contact-phone"
                value={phone}
                onChange={setPhone}
                className="phone-input-wrap"
              />
              <label htmlFor="contact-email" className="sr-only">Email</label>
              <input
                id="contact-email"
                className="email-input"
                placeholder="Email (необязательно)"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="contact-message" className="sr-only">Описание задачи</label>
              <textarea
                id="contact-message"
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
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 12, opacity: sending ? 0.7 : 1 }} disabled={sending}>
                {sending ? "Отправка..." : "Отправить заявку"}
                {!sending && <ArrowRight size={16} />}
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
              <div style={{ display: "flex", gap: 14, marginTop: 12, alignItems: "center" }}>
                <a href="https://wa.me/77001234567" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsAppIcon size={20} color="#25D366" /></a>
                <a href="https://t.me/trivoxcore" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><TelegramIcon size={20} color="#29B6F6" /></a>
                <a href="https://www.linkedin.com/company/trivox-core/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LinkedinIcon size={20} color="#fff" /></a>
                <a href="https://www.instagram.com/trivoxcore" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon size={20} color="#fff" /></a>
                <a href="mailto:team@trivoxcore.com" aria-label="Email"><Mail size={20} color="#fff" /></a>
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
                <a href="https://maps.google.com/?q=Алматы,+Казахстан" target="_blank" rel="noopener noreferrer">
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

      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Наверх"
        >
          <ArrowRight size={18} style={{ transform: "rotate(-90deg)" }} />
        </button>
      )}
    </div>
  );
}

