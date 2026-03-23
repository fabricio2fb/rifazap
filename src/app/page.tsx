"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Zap,
  MessageCircle,
  Share2,
  CheckCircle2,
  Smartphone,
  Users,
  ShieldCheck,
  Menu,
  Trophy,
  MousePointer2,
  QrCode,
  Loader2,
  ExternalLink,
  HelpCircle,
  Wifi,
  BatteryMedium,
  Signal,
  Sparkles,
  Palette,
  Clock,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const T = {
  bg: "#FAFAF8",
  bg2: "#F2F2EF",
  white: "#FFFFFF",
  border: "#E8E8E3",
  border2: "#D6D6CF",
  ink: "#0A0A08",
  ink2: "#1A1A16",
  muted: "#6B6B60",
  muted2: "#9A9A8E",
  accent: "#F5C800",
  accent2: "#D4A800",
  accentLight: "#FFFBE0",
  green: "#2D9E6B",
} as const;

export default function Home() {
  const [animationStep, setAnimationStep] = useState(0);
  const [editorPrimaryColor, setEditorPrimaryColor] = useState("#F5C800");
  const [editorThemeMode, setEditorThemeMode] = useState<"claro" | "escuro">("claro");
  const [isEditorInteracted, setIsEditorInteracted] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [notifName, setNotifName] = useState("Maria Silva");
  const [showNotif, setShowNotif] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Redireciona se encontrar um código de autenticação (OAuth Relay)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (code) {
        console.log("[Auth Relay] Código detectado na Home, redirecionando para callback...");
        router.push(`/auth/callback?${params.toString()}`);
      }
    }
  }, [router]);

  const editorColors = useMemo(
    () => ["#F5C800", "#0A0A08", "#2D9E6B", "#3b82f6", "#ef4444", "#a855f7", "#ec4899", "#06b6d4", "#D4A800"],
    []
  );

  const templatesList = [
    { id: "mint", name: "Mint" }, { id: "gold", name: "Gold" }, { id: "pink", name: "Pink" },
    { id: "solar", name: "Solar" }, { id: "nebula", name: "Nebula" }, { id: "scrapbook", name: "Scrapbook" },
    { id: "calor", name: "Calor" }, { id: "juliana", name: "Juliana" }, { id: "creme", name: "Creme" },
  ];

  const names = ["Maria Silva", "João Pedro", "Ana Costa", "Carlos Lima", "Beatriz Souza", "Felipe Torres", "Larissa Mendes"];

  useEffect(() => {
    const t = setInterval(() => setAnimationStep((p) => (p + 1) % 4), 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (isEditorInteracted) return;
    const t = setInterval(() => {
      setEditorThemeMode((p) => (p === "claro" ? "escuro" : "claro"));
      setEditorPrimaryColor((p) => {
        const i = editorColors.indexOf(p);
        return editorColors[(i + 1) % editorColors.length];
      });
    }, 3500);
    return () => clearInterval(t);
  }, [isEditorInteracted, editorColors]);

  useEffect(() => {
    let ni = 0;
    const show = () => {
      setNotifName(names[ni % names.length]);
      ni++;
      setShowNotif(true);
      setTimeout(() => setShowNotif(false), 4000);
    };
    const t1 = setTimeout(() => {
      show();
      const t2 = setInterval(show, 8000);
      return () => clearInterval(t2);
    }, 3000);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accentStyle = { backgroundColor: T.accent, color: T.ink };
  const cardStyle = { background: T.white, border: `1px solid ${T.border}`, borderRadius: 16 };

  return (
    <div style={{ background: T.bg, color: T.ink, fontFamily: "'Geist', system-ui, sans-serif", overflowX: "hidden", minHeight: "100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box}
        body{-webkit-font-smoothing:antialiased}
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}

        .noise-bg::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.025;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")}

        .hero-grid{position:absolute;inset:0;z-index:0;
          background-image:linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px);
          background-size:48px 48px;
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%);
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%)}

        .orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .orb1{width:600px;height:600px;background:radial-gradient(circle,rgba(245,200,0,.18),transparent 70%);top:-100px;left:-100px;animation:orbFloat1 12s ease-in-out infinite}
        .orb2{width:500px;height:500px;background:radial-gradient(circle,rgba(245,200,0,.10),transparent 70%);bottom:-50px;right:-100px;animation:orbFloat2 10s ease-in-out infinite}
        .orb3{width:300px;height:300px;background:radial-gradient(circle,rgba(245,200,0,.08),transparent 70%);top:40%;left:60%;animation:orbFloat3 14s ease-in-out infinite}
        @keyframes orbFloat1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,40px) scale(1.05)}66%{transform:translate(-30px,60px) scale(0.97)}}
        @keyframes orbFloat2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,-40px) scale(1.08)}}
        @keyframes orbFloat3{0%,100%{transform:translate(0,0)}50%{transform:translate(40px,-60px)}}

        .rev{opacity:0;transform:translateY(32px);transition:opacity .65s ease,transform .65s ease}
        .rev.on{opacity:1;transform:translateY(0)}

        @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}
        .shimmer-bar::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.5) 50%,transparent 100%);animation:shimmer 2s infinite}

        @keyframes logoPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,200,0,.6)}50%{box-shadow:0 0 0 5px rgba(245,200,0,0)}}
        .logo-dot{width:7px;height:7px;border-radius:50%;background:${T.accent};display:inline-block;animation:logoPulse 2s ease-in-out infinite;flex-shrink:0}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        .blink{animation:blink 1.5s infinite}

        @keyframes fadeUp{from{transform:translateY(28px);opacity:0}to{transform:translateY(0);opacity:1}}
        .fade-up-1{animation:fadeUp .7s .1s ease both}
        .fade-up-2{animation:fadeUp .7s .2s ease both}
        .fade-up-3{animation:fadeUp .7s .35s ease both}
        .fade-up-4{animation:fadeUp .7s .5s ease both}

        .grad-text{background:linear-gradient(135deg,${T.accent} 0%,#FFE066 50%,${T.accent2} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200%;animation:gradShift 6s ease-in-out infinite alternate}
        @keyframes gradShift{0%{background-position:0% 50%}100%{background-position:100% 50%}}

        @keyframes tscroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .ttrack{display:flex;gap:1rem;width:max-content;animation:tscroll 32s linear infinite}
        .ttrack:hover{animation-play-state:paused}

        @keyframes notifIn{from{transform:translateX(-120%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes notifOut{from{transform:translateX(0);opacity:1}to{transform:translateX(-120%);opacity:0}}
        .notif-show{animation:notifIn .4s ease both}
        .notif-hide{animation:notifOut .4s ease both}

        /* ── NAV DESKTOP ── */
        .nav-pill{
          display:flex;align-items:center;
          background:#1A1A1A;
          border:1px solid rgba(255,255,255,.10);
          border-radius:100px;
          padding:.7rem .7rem .7rem 1.5rem;
          box-shadow:0 4px 32px rgba(0,0,0,.25),0 1px 2px rgba(0,0,0,.3);
          backdrop-filter:blur(20px);
          gap:.4rem;
          animation:fadeUp .6s ease both;
        }
        .nav-links{display:flex}
        .nav-ctas-desktop{display:flex}

        /* ── NAV MOBILE ── */
        .nav-mobile-btn{display:none}
        .mobile-menu{display:none}

        @media(max-width:768px){
          .nav-pill{
            padding:.6rem .6rem .6rem 1.1rem;
            gap:.3rem;
          }
          .nav-links{display:none}
          .nav-ctas-desktop{display:none}
          .nav-mobile-btn{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:#fff;cursor:pointer}
          .mobile-menu{
            display:block;
            position:fixed;top:0;left:0;right:0;bottom:0;
            background:#111;
            z-index:999;
            padding:80px 2rem 2rem;
            transform:translateX(100%);
            transition:transform .3s ease;
          }
          .mobile-menu.open{transform:translateX(0)}
        }

        .step-card{padding:2rem;position:relative;transition:background .2s;cursor:default}
        .step-card:hover{background:${T.bg2}}

        .pcard{transition:transform .25s,box-shadow .25s}
        .pcard:hover{transform:translateY(-4px);box-shadow:0 8px 40px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06)}

        .tcard{flex-shrink:0;width:160px;border-radius:14px;overflow:hidden;border:1px solid ${T.border};background:${T.white};cursor:pointer;transition:all .2s;box-shadow:0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)}
        .tcard:hover{transform:translateY(-6px);box-shadow:0 8px 40px rgba(0,0,0,.10);border-color:rgba(245,200,0,.5)}

        .prog-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,${T.accent},#FFE066);position:relative;overflow:hidden}

        .p-cota{aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:600;cursor:pointer;transition:all .15s;background:${T.bg};border:1px solid ${T.border};color:${T.ink2}}
        .p-cota:hover{border-color:${T.accent};background:${T.accentLight}}
        .p-cota.sold{background:${T.bg2};color:${T.muted2};border-color:transparent;cursor:default}
        .p-cota.sel{background:${T.accent};color:${T.ink};border-color:${T.accent};transform:scale(1.12)}

        .editor-bg{background:#0C0C0A;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06);position:relative;overflow:hidden}
        .editor-bg::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 50% 70% at 80% 50%,rgba(245,200,0,.07),transparent 70%)}

        .faq-item{border-bottom:1px solid ${T.border}}
        .faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;padding:1.25rem 0;font-size:.95rem;font-weight:700;color:${T.ink};cursor:pointer;background:none;border:none;text-align:left;font-family:inherit}
        .faq-a{font-size:.88rem;color:${T.muted};line-height:1.7;padding-bottom:1.25rem;display:none}
        .faq-item.open .faq-a{display:block}
        .faq-icon{transition:transform .25s;flex-shrink:0;margin-left:1rem}
        .faq-item.open .faq-icon{transform:rotate(45deg)}

        .btn-primary{padding:.75rem 1.75rem;border-radius:10px;background:${T.accent};color:${T.ink};font-size:.95rem;font-weight:700;cursor:pointer;border:none;text-decoration:none;transition:all .2s;font-family:inherit;box-shadow:0 2px 8px rgba(245,200,0,.3),0 0 0 1px ${T.accent2};display:inline-flex;align-items:center;gap:.5rem}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(245,200,0,.4);background:#FFD700}
        .btn-outline{padding:.75rem 1.75rem;border-radius:10px;background:${T.white};color:${T.ink};font-size:.95rem;font-weight:600;cursor:pointer;border:1px solid ${T.border2};text-decoration:none;transition:all .2s;font-family:inherit;display:inline-flex;align-items:center;gap:.5rem;box-shadow:0 1px 3px rgba(0,0,0,.06)}
        .btn-outline:hover{box-shadow:0 8px 40px rgba(0,0,0,.10);transform:translateY(-1px)}

        /* ════════════════ RESPONSIVE FIXES ════════════════ */

        /* Hero stats 4 col → 2x2 */
        @media(max-width:640px){
          .stats-grid{grid-template-columns:repeat(2,1fr) !important}
          .stats-grid > div:nth-child(2){border-right:none !important}
          .stats-grid > div:nth-child(3){border-top:1px solid ${T.border}}
          .stats-grid > div:nth-child(4){border-top:1px solid ${T.border};border-right:none !important}
        }

        /* Section paddings mobile */
        @media(max-width:768px){
          .section-pad{padding:64px 1.25rem !important}
          .section-pad-sm{padding:48px 1.25rem !important}
        }

        /* How it works: 4 col → stack */
        @media(max-width:768px){
          .steps-grid{grid-template-columns:1fr !important}
          .steps-grid > div{border-right:none !important;border-bottom:1px solid ${T.border}}
          .steps-grid > div:last-child{border-bottom:none}
          .step-card{padding:1.5rem}
        }

        /* Preview section: 2 col → 1 col stack */
        @media(max-width:900px){
          .two-col{grid-template-columns:1fr !important;gap:2.5rem !important}
          .phone-center{justify-content:center}
        }

        /* Benefits section: 2 col → 1 col */
        @media(max-width:900px){
          .benefits-grid{grid-template-columns:1fr !important;gap:2rem !important}
          .phone-preview-wrap{max-width:360px !important;margin:0 auto !important}
        }

        /* Editor: 2 col → stacked, hide right panel */
        @media(max-width:900px){
          .editor-grid{grid-template-columns:1fr !important}
          .editor-right-panel{display:none !important}
        }

        /* Pricing: auto-fit already works, just fix padding */
        @media(max-width:640px){
          .pricing-grid{grid-template-columns:1fr !important;max-width:380px !important}
        }

        /* Trusted band: wrap nicely */
        @media(max-width:640px){
          .trusted-band{gap:0.75rem !important;padding:24px 1.25rem !important}
          .trusted-pill{font-size:.72rem !important;padding:.3rem .75rem !important}
        }

        /* Hero CTAs stack on mobile */
        @media(max-width:480px){
          .hero-ctas{flex-direction:column !important;align-items:center !important}
          .hero-ctas a{width:100%;justify-content:center !important}
        }

        /* Legal notice mobile */
        @media(max-width:480px){
          .legal-notice{font-size:.7rem !important;padding:.4rem .75rem !important;text-align:center}
        }

        /* Footer grid */
        @media(max-width:640px){
          .footer-grid{grid-template-columns:1fr !important;gap:2rem !important}
        }

        /* Notif: smaller on mobile */
        @media(max-width:480px){
          .float-notif{max-width:230px !important;bottom:16px !important;left:12px !important}
        }

        /* Animate marquee */
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .animate-marquee{animation:marquee 32s linear infinite}

        /* Editor tabs scroll on mobile */
        @media(max-width:768px){
          .editor-tabs{overflow-x:auto;-ms-overflow-style:none;scrollbar-width:none}
          .editor-tabs::-webkit-scrollbar{display:none}
          .editor-tabs button{white-space:nowrap;flex-shrink:0}
        }
      `}</style>

      <div className="noise-bg">

        {/* ══════════════════════════════ NAV ══════════════════════════════ */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 88, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5%", background: "transparent", pointerEvents: "none" }}>
          <div className="nav-pill" style={{ pointerEvents: "all" }}>
            {/* logo */}
            <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginRight: ".85rem", flexShrink: 0 }}>
              <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>Apoiêfy</span>
              <span className="logo-dot" />
            </div>

            {/* links - hidden on mobile */}
            <ul className="nav-links" style={{ gap: ".15rem", listStyle: "none", margin: 0, padding: 0, marginRight: ".6rem" }}>
              {["#exemplo,Exemplo", "#beneficios,Benefícios", "#precos,Preços", "#faq,Dúvidas"].map((s) => {
                const [href, label] = s.split(",");
                return (
                  <li key={href}>
                    <a href={href} style={{ color: "rgba(255,255,255,.65)", fontSize: ".88rem", textDecoration: "none", fontWeight: 500, padding: ".55rem 1rem", borderRadius: 100, display: "inline-block", transition: "all .15s" }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.color = "#fff"; (e.target as HTMLElement).style.background = "rgba(255,255,255,.07)"; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,.65)"; (e.target as HTMLElement).style.background = "transparent"; }}>
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* CTAs desktop */}
            <div className="nav-ctas-desktop" style={{ gap: ".35rem", alignItems: "center" }}>
              <Link href="/login" style={{ padding: ".58rem 1.2rem", borderRadius: 100, border: "1px solid rgba(255,255,255,.12)", background: "transparent", color: "rgba(255,255,255,.75)", fontSize: ".88rem", fontWeight: 500, textDecoration: "none" }}>
                Acessar Painel
              </Link>
              <Link href="/login" style={{ padding: ".6rem 1.35rem", borderRadius: 100, background: T.accent, color: T.ink, fontSize: ".88rem", fontWeight: 700, textDecoration: "none" }}>
                Começar Agora
              </Link>
            </div>

            {/* Hamburger mobile */}
            <button className="nav-mobile-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={18} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <button onClick={() => setMobileMenuOpen(false)}
            style={{ position: "absolute", top: 28, right: 24, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }}>
            <X size={18} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>Apoiêfy</span>
            <span className="logo-dot" />
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "2rem" }}>
            {["#exemplo,Exemplo", "#beneficios,Benefícios", "#precos,Preços", "#faq,Dúvidas"].map((s) => {
              const [href, label] = s.split(",");
              return (
                <li key={href}>
                  <a href={href} onClick={() => setMobileMenuOpen(false)}
                    style={{ color: "rgba(255,255,255,.75)", fontSize: "1.1rem", textDecoration: "none", fontWeight: 600, padding: ".75rem 0", display: "block", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}
              style={{ padding: ".85rem 1.5rem", borderRadius: 12, border: "1px solid rgba(255,255,255,.15)", background: "transparent", color: "#fff", fontSize: "1rem", fontWeight: 600, textDecoration: "none", textAlign: "center" }}>
              Acessar Painel
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}
              style={{ padding: ".85rem 1.5rem", borderRadius: 12, background: T.accent, color: T.ink, fontSize: "1rem", fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
              Começar Agora
            </Link>
          </div>
        </div>

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="section-pad" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 5% 80px", position: "relative", overflow: "hidden" }}>
          <div className="orb orb1" /> <div className="orb orb2" /> <div className="orb orb3" />
          <div className="hero-grid" />

          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            {/* badge */}
            <div className="fade-up-1" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: 100, padding: ".35rem 1rem", fontSize: ".75rem", fontWeight: 600, color: T.ink2, marginBottom: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)" }}>
              <span style={{ background: T.accent, color: T.ink, borderRadius: 100, padding: ".15rem .55rem", fontSize: ".68rem", fontWeight: 700 }}>NOVO</span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block" }} className="blink" />
              Plataforma #1 para Campanhas Digitais
            </div>

            {/* headline */}
            <h1 className="fade-up-2" style={{ fontSize: "clamp(2.4rem,7vw,6rem)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.04, color: T.ink, margin: 0 }}>
              Sua Campanha no{" "}
              <span className="grad-text">WhatsApp</span>
              <br />
              <span style={{ color: T.muted }}>em 60 Segundos</span>
            </h1>

            {/* desc */}
            <p className="fade-up-3" style={{ fontSize: "clamp(.95rem,2.5vw,1.1rem)", color: T.muted, maxWidth: 520, lineHeight: 1.7, margin: "1.5rem auto 0", fontWeight: 400 }}>
              A maneira mais simples, rápida e profissional de organizar campanhas online, gerenciar participações e arrecadar muito mais.
            </p>

            {/* legal notice */}
            <div className="fade-up-3 legal-notice" style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", background: "rgba(245,200,0,.08)", border: "1px solid rgba(245,200,0,.35)", borderRadius: 8, padding: ".5rem 1rem", fontSize: ".78rem", color: "#8A6F00", fontWeight: 500, marginTop: "1rem" }}>
              ⚡ Valores enviados diretamente via PIX — a Apoiêfy não intermedeia financeiramente.
            </div>

            {/* CTAs */}
            <div className="fade-up-4 hero-ctas" style={{ display: "flex", gap: ".75rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login" className="btn-primary">
                Criar Minha Campanha <ArrowRight size={18} />
              </Link>
              <Link href="/campanha/exemplo-pc-gamer" className="btn-outline">
                Ver Demonstração <ExternalLink size={16} />
              </Link>
            </div>

            {/* stats band */}
            <div className="fade-up-4 stats-grid" style={{ width: "100%", maxWidth: 700, margin: "3.5rem auto 0", display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)", position: "relative", zIndex: 2 }}>
              {[
                { n: "+12.400", l: "Campanhas Criadas" },
                { n: "R$4.2M+", l: "Arrecadados" },
                { n: "100%", l: "Seguro via PIX" },
                { n: "+45k", l: "Apoiadores Ativos" },
              ].map((s, i) => (
                <div key={i} style={{ padding: "1.25rem .75rem", textAlign: "center", position: "relative", borderRight: i < 3 ? `1px solid ${T.border}` : undefined }}>
                  <div style={{ fontSize: "clamp(1.1rem,3.5vw,1.6rem)", fontWeight: 800, letterSpacing: "-1px", color: T.ink, lineHeight: 1.1 }}>{s.n}</div>
                  <div style={{ fontSize: ".65rem", color: T.muted, marginTop: ".25rem", fontWeight: 500 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ TRUSTED ══════════════════════════════ */}
        <div className="trusted-band" style={{ padding: "32px 5%", display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap", borderTop: `1px solid ${T.border}`, background: T.white }}>
          <span style={{ fontSize: ".75rem", color: T.muted2, fontWeight: 500, textTransform: "uppercase", letterSpacing: "1.5px", width: "100%", textAlign: "center" }}>Confiado por</span>
          {["✅ PIX Direto", "🔒 Dados Seguros", "⚡ 60 Segundos", "🇧🇷 Feito no Brasil"].map((t) => (
            <div key={t} className="trusted-pill" style={{ display: "flex", alignItems: "center", gap: ".5rem", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 100, padding: ".4rem 1rem", fontSize: ".8rem", fontWeight: 600, color: T.ink2 }}>{t}</div>
          ))}
        </div>

        {/* ══════════════════════════════ HOW IT WORKS ══════════════════════════════ */}
        <section className="section-pad" style={{ padding: "96px 5%", background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent2, marginBottom: ".75rem" }}>Como Funciona</div>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: T.ink }}>Simples do começo ao fim</h2>
            <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: ".6rem auto 0" }}>Quatro passos para sua campanha estar no ar e arrecadando.</p>
          </div>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", background: T.white, boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)", maxWidth: 900, margin: "0 auto" }}>
            {[
              { icon: "📱", n: "01", t: "Crie a Campanha", d: "Configure título, imagem, valor por cota e número de participações em minutos." },
              { icon: "🎨", n: "02", t: "Personalize o Visual", d: "Escolha templates prontos ou use o Editor PRO para deixar com a sua cara." },
              { icon: "🔗", n: "03", t: "Compartilhe o Link", d: "Envie o link único pelo WhatsApp, Instagram ou onde quiser. Um clique e pronto." },
              { icon: "💰", n: "04", t: "Receba via PIX", d: "Cada apoiador paga direto na sua conta. Você confirma com um toque no painel." },
            ].map((s, i) => (
              <div key={i} className="step-card" style={{ borderRight: i < 3 ? `1px solid ${T.border}` : undefined }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", marginBottom: "1.25rem", background: T.accentLight, border: "1px solid rgba(245,200,0,.3)" }}>{s.icon}</div>
                <div style={{ fontSize: ".7rem", fontWeight: 700, color: T.muted2, letterSpacing: "1px", marginBottom: ".4rem", textTransform: "uppercase" }}>{s.n}</div>
                <div style={{ fontSize: ".95rem", fontWeight: 700, color: T.ink, marginBottom: ".4rem" }}>{s.t}</div>
                <div style={{ fontSize: ".83rem", color: T.muted, lineHeight: 1.6 }}>{s.d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════ PREVIEW ══════════════════════════════ */}
        <section id="exemplo" className="section-pad" style={{ padding: "96px 5%", background: T.bg }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
            {/* phone mockup */}
            <div className="phone-center" style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ width: "min(300px, 88vw)", borderRadius: 32, background: T.white, border: `1px solid ${T.border}`, boxShadow: `0 8px 40px rgba(0,0,0,.10),0 2px 8px rgba(0,0,0,.06),0 0 0 8px ${T.bg2},0 0 0 9px ${T.border}`, overflow: "hidden" }}>
                <div style={{ background: T.white, padding: ".7rem 1.1rem .5rem", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: ".65rem", color: T.muted2, fontFamily: "'Geist Mono', monospace" }}>apoiefy.com.br/campanha</span>
                  <span style={{ display: "flex", alignItems: "center", gap: ".3rem", fontSize: ".65rem", fontWeight: 600, color: T.green }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} className="blink" /> AO VIVO
                  </span>
                </div>
                <div style={{ height: 150, background: "linear-gradient(135deg,#f0f0f2,#e4e4e7)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                  <Image src="/pcgamer.jpg" alt="PC Gamer" fill className="object-cover" />
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", border: `1px solid ${T.border}`, borderRadius: 100, fontSize: ".65rem", fontWeight: 700, color: T.green, padding: ".2rem .6rem", display: "flex", alignItems: "center", gap: ".3rem" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green }} className="blink" /> ATIVA
                  </div>
                </div>
                <div style={{ padding: "1rem 1.1rem" }}>
                  <div style={{ fontSize: ".95rem", fontWeight: 800, color: T.ink, letterSpacing: "-.3px", marginBottom: ".3rem" }}>Apoie nosso Projeto + PC Gamer</div>
                  <div style={{ fontSize: ".72rem", color: T.muted, marginBottom: ".85rem" }}>Cada participação: R$ 1,00</div>
                  <div style={{ background: T.bg2, borderRadius: 100, height: 5, marginBottom: ".35rem", overflow: "hidden" }}>
                    <div className="prog-fill shimmer-bar" style={{ width: "64%" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".65rem", color: T.muted, marginBottom: ".85rem" }}>
                    <span>64% vendido</span><span>640 / 1000</span>
                  </div>
                  <div style={{ fontSize: ".72rem", fontWeight: 600, color: T.ink, marginBottom: ".5rem" }}>Escolha sua Cota</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: ".3rem" }}>
                    {Array.from({ length: 20 }, (_, i) => {
                      const sold = [2, 5, 8, 11, 14, 17, 3, 9].includes(i);
                      return <div key={i} className={`p-cota ${sold ? "sold" : ""}`}>{String(i + 1).padStart(2, "0")}</div>;
                    })}
                  </div>
                  <button style={{ display: "block", width: "100%", marginTop: ".85rem", padding: ".65rem", borderRadius: 9, background: T.ink, color: T.white, fontSize: ".85rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    COMPRAR AGORA
                  </button>
                </div>
              </div>
            </div>

            {/* text + features */}
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent2, marginBottom: ".75rem" }}>Veja na Prática</div>
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: T.ink }}>Preview real da<br /><span style={{ color: T.muted }}>página de campanha</span></h2>
              <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.7, maxWidth: 480, margin: ".6rem 0 1.5rem" }}>
                Seus apoiadores acessam um sistema dinâmico, rápido e visual, otimizado para fechar a venda na hora.
              </p>
              <Link href="/campanha/exemplo-pc-gamer" className="btn-primary" style={{ marginBottom: "2rem", display: "inline-flex" }}>
                Abrir Exemplo Completo <ExternalLink size={16} />
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { icon: "📊", t: "Grade de cotas interativa", d: "Apoiador vê em tempo real o que está livre ou ocupado." },
                  { icon: "⚡", t: "Cadastro sem senha", d: "Só nome e WhatsApp. Zero fricção até o PIX." },
                  { icon: "💬", t: "Confirmação por WhatsApp", d: "Comprovante enviado direto. Baixa com um clique no painel." },
                ].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: ".9rem", alignItems: "flex-start", padding: "1rem 1.1rem", background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.06)" }}>
                    <div style={{ width: 36, height: 36, flexShrink: 0, borderRadius: 9, background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".95rem", border: "1px solid rgba(245,200,0,.25)" }}>{f.icon}</div>
                    <div>
                      <div style={{ fontSize: ".88rem", fontWeight: 700, color: T.ink, marginBottom: ".2rem" }}>{f.t}</div>
                      <div style={{ fontSize: ".8rem", color: T.muted, lineHeight: 1.5 }}>{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ BENEFITS ══════════════════════════════ */}
        <section id="beneficios" className="section-pad" style={{ padding: "96px 5%", background: T.white, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div className="benefits-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", maxWidth: 1100, margin: "0 auto" }}>
            {/* left text */}
            <div>
              <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent2, marginBottom: ".75rem" }}>Simulação de Compra</div>
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: T.ink }}>Como seus clientes participam</h2>
              <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.7, maxWidth: 480, margin: ".6rem 0 2rem" }}>Interface desenhada para facilitar compras com poucos cliques direto no celular.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}>
                {[
                  { icon: <Smartphone size={20} />, t: "Escolha das Participações", d: "Grade interativa onde o apoiador vê na hora o que está livre ou ocupado.", a: animationStep === 0 },
                  { icon: <Users size={20} />, t: "Cadastro Instantâneo", d: "Sem senhas. O cliente só coloca Nome e WhatsApp e já vai para o pagamento.", a: animationStep === 1 },
                  { icon: <ShieldCheck size={20} />, t: "PIX Automático", d: "Geramos o código PIX automaticamente. Pagamento direto na conta do organizador.", a: animationStep === 2 },
                  { icon: <CheckCircle2 size={20} />, t: "Baixa em 1 Segundo", d: "O cliente envia o comprovante no WhatsApp e você confirma com um clique.", a: animationStep === 3 },
                ].map((b, i) => (
                  <div key={i} style={{ display: "flex", gap: ".9rem", padding: "1rem", borderRadius: 12, transition: "all .4s", background: b.a ? T.white : "transparent", boxShadow: b.a ? "0 4px 20px rgba(0,0,0,.08)" : "none", border: b.a ? `2px solid ${T.accent}` : `2px solid transparent`, opacity: b.a ? 1 : 0.45 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: b.a ? T.accent : T.bg2, color: b.a ? T.ink : T.muted, flexShrink: 0, transition: "all .4s" }}>{b.icon}</div>
                    <div>
                      <div style={{ fontSize: ".95rem", fontWeight: 700, color: T.ink }}>{b.t}</div>
                      <div style={{ fontSize: ".82rem", color: T.muted, lineHeight: 1.5, marginTop: ".2rem" }}>{b.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* right: animated phone */}
            <div className="phone-preview-wrap" style={{ background: T.white, borderRadius: 32, border: `1px solid ${T.border}`, boxShadow: "0 8px 40px rgba(0,0,0,.10)", overflow: "hidden", width: "100%", maxWidth: 380, margin: "0 auto", minHeight: 500, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "1.5rem", flex: 1 }}>
                {animationStep === 0 && (
                  <div style={{ animation: "fadeUp .5s ease both" }}>
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: T.ink, marginBottom: ".25rem" }}>iPhone 15 Pro</div>
                    <div style={{ fontSize: ".78rem", color: T.muted, marginBottom: "1.5rem" }}>Escolha suas participações</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: ".5rem" }}>
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} style={{ aspectRatio: "1", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".78rem", fontWeight: 700, border: `1px solid ${i === 8 ? T.accent : T.border}`, background: i === 8 ? T.accent : [2, 5, 12, 18].includes(i) ? T.bg2 : T.bg, color: i === 8 ? T.ink : [2, 5, 12, 18].includes(i) ? T.muted2 : T.ink2, transform: i === 8 ? "scale(1.1)" : undefined }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      ))}
                    </div>
                    <button style={{ marginTop: "1.5rem", width: "100%", padding: ".75rem", borderRadius: 10, background: T.ink, color: T.white, fontWeight: 700, border: "none", fontSize: ".88rem", cursor: "pointer", fontFamily: "inherit" }}>RESERVAR 01 PARTICIPAÇÃO</button>
                  </div>
                )}
                {animationStep === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeUp .5s ease both", gap: "1.25rem" }}>
                    <Users size={48} color={T.accent2} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.ink }}>Quase lá!</div>
                      <div style={{ fontSize: ".82rem", color: T.muted, marginTop: ".25rem" }}>Preencha para garantir sua reserva</div>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: ".75rem" }}>
                      <div style={{ height: 48, background: T.bg, border: `2px solid ${T.accent}`, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 1rem", fontWeight: 700, color: T.ink }}>João da Silva|</div>
                      <div style={{ height: 48, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, display: "flex", alignItems: "center", padding: "0 1rem", color: T.muted }}>(11) 99999-9999</div>
                    </div>
                    <button style={{ width: "100%", padding: ".75rem", borderRadius: 10, background: T.accent, color: T.ink, fontWeight: 700, border: "none", fontSize: ".88rem", cursor: "pointer", fontFamily: "inherit" }}>CONFIRMAR RESERVA</button>
                  </div>
                )}
                {animationStep === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeUp .5s ease both", gap: "1.25rem" }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: T.ink }}>Pagamento PIX</div>
                      <div style={{ fontSize: ".82rem", color: T.muted }}>Copie a chave e pague no seu banco</div>
                    </div>
                    <div style={{ padding: "1.5rem", background: T.white, border: `2px solid ${T.accent}`, borderRadius: 20 }}>
                      <QrCode size={120} color={T.ink} />
                    </div>
                    <div style={{ width: "100%", height: 48, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1rem", fontFamily: "'Geist Mono', monospace", fontSize: ".78rem", color: T.ink2 }}>
                      00020126330014BR.GOV... <Loader2 size={16} color={T.accent2} style={{ animation: "spin 1s linear infinite" }} />
                    </div>
                    <button style={{ width: "100%", padding: ".75rem", borderRadius: 10, background: T.accent, color: T.ink, fontWeight: 700, border: "none", fontSize: ".88rem", cursor: "pointer", fontFamily: "inherit" }}>COPIAR CÓDIGO PIX</button>
                  </div>
                )}
                {animationStep === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeUp .5s ease both", gap: "1.5rem" }}>
                    <div style={{ width: 80, height: 80, background: T.green, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 32px rgba(45,158,107,.3)" }}>
                      <CheckCircle2 size={44} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem", color: T.ink }}>SUCESSO!</div>
                      <div style={{ fontSize: ".85rem", color: T.muted, marginTop: ".25rem" }}>Reserva da participação 09 confirmada. Boa sorte!</div>
                    </div>
                    <button style={{ width: "100%", padding: "1rem", borderRadius: 10, background: "#25D366", color: "#fff", fontWeight: 700, border: "none", fontSize: ".9rem", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: ".5rem" }}>
                      <MessageCircle size={18} /> ENVIAR COMPROVANTE
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ EDITOR PRO ══════════════════════════════ */}
        <section className="editor-bg section-pad" style={{ padding: "80px 5%" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent, marginBottom: ".75rem", display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <Sparkles size={13} /> Exclusividade Apoiêfy
              </div>
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", margin: "0 0 .6rem" }}>Experimente o Editor PRO</h2>
              <p style={{ color: "rgba(255,255,255,.4)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
                A única plataforma que deixa você transformar sua campanha num site profissional com identidade própria.
              </p>
            </div>

            <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", boxShadow: "0 40px 120px rgba(0,0,0,.7)", background: "#111213" }}>
              {/* top bar */}
              <div style={{ background: "#0d0d0f", borderBottom: "1px solid rgba(255,255,255,.07)", padding: ".75rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button style={{ fontSize: ".78rem", color: "rgba(255,255,255,.45)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>← Voltar</button>
                  <div>
                    <div style={{ fontSize: ".85rem", fontWeight: 700, color: "#fff" }}>Editor da Rifa</div>
                    <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.35)" }}>PC Gamer RTX 4090 + Monitor 4K</div>
                  </div>
                </div>
                <button style={{ padding: ".6rem 1.4rem", borderRadius: 8, background: T.accent, color: T.ink, fontSize: ".85rem", fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: ".45rem", whiteSpace: "nowrap" }}>
                  💾 SALVAR
                </button>
              </div>

              {/* body */}
              <div className="editor-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px" }}>
                {/* LEFT PANEL */}
                <div style={{ borderRight: "1px solid rgba(255,255,255,.07)" }}>
                  <div className="editor-tabs" style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "0 1.5rem" }}>
                    {[
                      { id: "design", label: "🎨 Design", active: true },
                      { id: "avisos", label: "🔔 Avisos", active: false },
                      { id: "confianca", label: "🛡️ Confiança", active: false },
                      { id: "vendas", label: "📈 Vendas", active: false },
                    ].map((tab) => (
                      <button key={tab.id} onClick={() => setIsEditorInteracted(true)}
                        style={{ padding: "1rem 1.1rem", fontSize: ".82rem", fontWeight: 700, border: "none", borderBottom: tab.active ? `2px solid ${T.accent}` : "2px solid transparent", background: "none", color: tab.active ? T.accent : "rgba(255,255,255,.4)", cursor: "pointer", fontFamily: "inherit", marginBottom: -1 }}>
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ padding: "1.75rem 1.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {/* CORES E TEMA */}
                    <div>
                      <div style={{ fontSize: ".95rem", fontWeight: 800, color: "#fff", marginBottom: ".25rem" }}>Cores e Tema</div>
                      <div style={{ fontSize: ".8rem", color: "rgba(255,255,255,.35)", marginBottom: "1.5rem" }}>Personalize a aparência da sua página.</div>
                      <div style={{ marginBottom: "1.5rem" }}>
                        <div style={{ fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: ".6rem" }}>Tema Base</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)" }}>
                          {(["claro", "escuro"] as const).map((t) => (
                            <button key={t} onClick={() => { setEditorThemeMode(t); setIsEditorInteracted(true); }}
                              style={{ padding: ".9rem", fontSize: ".88rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", background: editorThemeMode === t ? T.accent : "rgba(255,255,255,.04)", color: editorThemeMode === t ? T.ink : "rgba(255,255,255,.5)" }}>
                              {t === "claro" ? "Claro" : "Escuro"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: ".68rem", fontWeight: 700, color: "rgba(255,255,255,.35)", textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: ".75rem" }}>Cor Primária</div>
                        <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, padding: "1rem", display: "flex", flexWrap: "wrap", gap: ".6rem", marginBottom: ".75rem" }}>
                          {editorColors.map((c) => (
                            <button key={c} onClick={() => { setEditorPrimaryColor(c); setIsEditorInteracted(true); }}
                              style={{ width: 40, height: 40, borderRadius: "50%", background: c, border: editorPrimaryColor === c ? `3px solid rgba(255,255,255,.9)` : "3px solid transparent", cursor: "pointer", transform: editorPrimaryColor === c ? "scale(1.15)" : undefined, transition: "all .2s" }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RECURSOS */}
                    <div>
                      <div style={{ fontSize: ".95rem", fontWeight: 800, color: "#fff", marginBottom: "1.1rem" }}>Recursos ao Vivo</div>
                      {[
                        { label: "Notificações de compras", on: true },
                        { label: "Contador regressivo", on: true },
                        { label: "Cupons de desconto", on: false },
                      ].map((item) => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".85rem 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                          <span style={{ fontSize: ".88rem", color: "rgba(255,255,255,.65)" }}>{item.label}</span>
                          <div onClick={() => setIsEditorInteracted(true)}
                            style={{ width: 44, height: 24, borderRadius: 100, background: item.on ? T.accent : "rgba(255,255,255,.12)", position: "relative", cursor: "pointer", flexShrink: 0 }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: item.on ? 23 : 3, transition: "all .2s" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT: PHONE PREVIEW (hidden on mobile) */}
                <div className="editor-right-panel" style={{ background: "#0d0d0f", display: "flex", flexDirection: "column", alignItems: "center", padding: "1.5rem 1.25rem", gap: "1rem" }}>
                  <div style={{ display: "flex", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 100, overflow: "hidden", width: "100%" }}>
                    {["📱 Celular", "💻 Computador"].map((label, i) => (
                      <button key={label}
                        style={{ flex: 1, padding: ".5rem .75rem", fontSize: ".75rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit", background: i === 0 ? "rgba(255,255,255,.10)" : "transparent", color: i === 0 ? "#fff" : "rgba(255,255,255,.35)" }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  <div style={{ width: 260, background: "#fff", borderRadius: 40, border: "8px solid #1c1c1c", overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,.06),0 32px 80px rgba(0,0,0,.7)", transition: "all .4s" }}>
                    <div style={{ height: 22, background: editorThemeMode === "claro" ? "#fff" : "#111", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .4s" }}>
                      <div style={{ width: 60, height: 7, background: "#1c1c1c", borderRadius: 100 }} />
                    </div>
                    <div style={{ height: 130, position: "relative", overflow: "hidden" }}>
                      <Image src="/pcgamer.jpg" alt="Preview" fill className="object-cover" />
                      <div style={{ position: "absolute", top: 8, right: 8, background: T.green, color: "#fff", borderRadius: 6, fontSize: ".52rem", fontWeight: 800, padding: ".2rem .5rem" }}>● ATIVA</div>
                    </div>
                    <div style={{ background: editorThemeMode === "claro" ? "#fff" : "#111", padding: ".75rem .85rem", transition: "background .4s" }}>
                      <div style={{ fontWeight: 800, fontSize: ".82rem", color: editorThemeMode === "claro" ? T.ink : "#fff", marginBottom: ".15rem" }}>PC Gamer RTX 4090 + Monitor 4K</div>
                      <div style={{ background: T.ink, color: T.accent, borderRadius: 7, padding: ".4rem", textAlign: "center", fontFamily: "'Geist Mono', monospace", fontSize: ".85rem", fontWeight: 800, letterSpacing: "2px", marginBottom: ".6rem" }}>01:22:37</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: ".12rem", marginBottom: ".6rem" }}>
                        {Array.from({ length: 70 }, (_, i) => {
                          const sold = [3, 8, 12, 15, 22, 27, 33, 5, 19, 41, 44, 50, 63, 70].includes(i + 1);
                          return (
                            <div key={i} style={{ aspectRatio: "1", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".3rem", fontWeight: 600, background: sold ? T.bg2 : T.bg, border: sold ? "none" : `1px solid ${T.border}`, color: sold ? T.muted2 : T.ink2, opacity: sold ? 0.5 : 1 }}>
                              {String(i + 1).padStart(2, "0")}
                            </div>
                          );
                        })}
                      </div>
                      <button style={{ display: "block", width: "100%", padding: ".6rem", borderRadius: 8, background: T.ink, color: "#fff", fontSize: ".72rem", fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                        COMPRAR AGORA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ TEMPLATES ══════════════════════════════ */}
        <section style={{ padding: "96px 0 96px", background: "#FAFAF8", borderBottom: `1px solid ${T.border}`, overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 128, height: "100%", background: `linear-gradient(to right, #FAFAF8, transparent)`, zIndex: 10, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: 128, height: "100%", background: `linear-gradient(to left, #FAFAF8, transparent)`, zIndex: 10, pointerEvents: "none" }} />

          <div style={{ textAlign: "center", marginBottom: "3rem", padding: "0 1.25rem" }}>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-1.5px", color: T.ink, margin: "0 0 .75rem" }}>9 Templates Prontos<br />para Uso</h2>
            <p style={{ fontSize: "1rem", color: T.muted, fontWeight: 500, maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Selecione o modelo visual que mais combina com a sua campanha em apenas um clique.</p>
          </div>

          <div style={{ position: "relative", width: "100%", paddingBottom: "2rem" }}>
            <div className="animate-marquee" style={{ display: "flex", gap: "1.5rem", width: "max-content", paddingLeft: "1.5rem" }}>
              {[...templatesList, ...templatesList, ...templatesList].map((t, idx) => (
                <div key={`${t.id}-${idx}`} style={{ flexShrink: 0, width: 200, cursor: "pointer" }}>
                  <div style={{ aspectRatio: "9/16", background: "#e4e4e7", borderRadius: 28, overflow: "hidden", border: "6px solid #fff", boxShadow: "0 4px 20px rgba(0,0,0,.10)", position: "relative", ringColor: T.border }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/tamplates/${t.id}.png`} alt={`Template ${t.name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: ".75rem", color: T.muted, marginTop: "1rem", textTransform: "uppercase", letterSpacing: "1.5px" }}>{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ PRICING ══════════════════════════════ */}
        <section id="precos" className="section-pad" style={{ padding: "96px 5%", background: T.white, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent2, marginBottom: ".75rem" }}>Preços</div>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: T.ink }}>Justo e Sem Surpresas</h2>
            <p style={{ color: T.muted, fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: ".6rem auto 0" }}>Você só paga a ativação. Sem porcentagem em cima da sua arrecadação.</p>
          </div>
          <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem", maxWidth: 700, margin: "0 auto" }}>
            {/* básico */}
            <div className="pcard" style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 20, padding: "2rem", boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.muted, marginBottom: ".4rem" }}>Plano</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-.4px", marginBottom: "1.25rem" }}>Básico</div>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: T.muted, verticalAlign: "super" }}>R$</span>
                <span style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>14</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800 }}>,90</span>
                <span style={{ fontSize: ".8rem", color: T.muted, marginLeft: ".25rem" }}>/campanha</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.75rem", padding: 0 }}>
                {["9 Templates Exclusivos", "Até 1.000 participações", "100% via PIX na sua conta", "Painel de Gestão Completo", "Upload de imagem", "Encerramento automático"].map((item) => (
                  <li key={item} style={{ display: "flex", gap: ".55rem", alignItems: "flex-start", fontSize: ".85rem", color: T.muted }}>
                    <span style={{ color: T.accent2, fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-outline" style={{ width: "100%", justifyContent: "center" }}>Criar Agora</Link>
            </div>
            {/* PRO */}
            <div className="pcard" style={{ background: T.ink, border: `1px solid ${T.ink}`, borderRadius: 20, padding: "2rem", boxShadow: "0 8px 40px rgba(0,0,0,.20)", position: "relative" }}>
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${T.accent},#FFD000)`, color: T.ink, fontSize: ".68rem", fontWeight: 700, padding: ".25rem .9rem", borderRadius: 100, whiteSpace: "nowrap" }}>✦ Máxima Conversão</div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,.5)", marginBottom: ".4rem" }}>Plano</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-.4px", color: T.accent, marginBottom: "1.25rem" }}>Apoiêfy PRO</div>
              <div style={{ marginBottom: "1.5rem" }}>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,.6)", verticalAlign: "super" }}>R$</span>
                <span style={{ fontSize: "3rem", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, color: "#fff" }}>25</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>,90</span>
                <span style={{ fontSize: ".8rem", color: "rgba(255,255,255,.5)", marginLeft: ".25rem" }}>/campanha</span>
              </div>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.75rem", padding: 0 }}>
                {["Tudo do Básico, mais:", "Editor Visual PRO", "Cores Personalizadas e Tema Escuro", "Notificações ao Vivo", "Contador Regressivo", "Cupons de Desconto", "Remover logo Apoiêfy"].map((item, i) => (
                  <li key={item} style={{ display: "flex", gap: ".55rem", alignItems: "flex-start", fontSize: ".85rem", color: i === 0 ? "#fff" : "rgba(255,255,255,.75)", fontWeight: i === 0 ? 700 : 400 }}>
                    <span style={{ color: T.accent, fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="btn-primary" style={{ width: "100%", justifyContent: "center", borderRadius: 10, padding: ".85rem 1.75rem" }}>Assinar PRO Agora</Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════ FAQ ══════════════════════════════ */}
        <section id="faq" className="section-pad" style={{ padding: "96px 5%", background: T.bg, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentLight, border: `1px solid rgba(245,200,0,.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <HelpCircle size={22} color={T.accent2} />
              </div>
              <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent2, marginBottom: ".75rem" }}>FAQ</div>
              <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: T.ink }}>Perguntas Frequentes</h2>
            </div>
            {[
              { q: "Como recebo o dinheiro das minhas campanhas?", a: "O valor pago pelos apoiadores é transferido diretamente para sua conta via PIX. A Apoiêfy não recebe nem administra os valores arrecadados." },
              { q: "As campanhas online são permitidas?", a: "Sim, desde que respeitadas as normas vigentes. A Apoiêfy é uma ferramenta de gestão. Recomendamos o uso para campanhas filantrópicas ou promocionais." },
              { q: "Como funciona a gestão interna de resultados?", a: "No seu painel, você acessa uma ferramenta de organização de encerramento que estrutura todos os dados das participações confirmadas, garantindo controle e transparência total." },
              { q: "Qual o limite de participações por campanha?", a: "Você pode criar campanhas de 10 até 1.000 participações, garantindo navegação rápida e fluida no celular." },
              { q: "Tenho suporte caso precise de ajuda?", a: "Sim! Temos uma equipe de suporte humanizado via WhatsApp pronta para te ajudar a configurar sua primeira campanha." },
            ].map((faq, i) => (
              <div key={i} className="faq-item" style={{ borderBottom: `1px solid ${T.border}` }}>
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 0", fontSize: ".95rem", fontWeight: 700, color: T.ink, cursor: "pointer", background: "none", border: "none", textAlign: "left", fontFamily: "inherit" }}>
                  {faq.q}
                  <span style={{ flexShrink: 0, marginLeft: "1rem", fontSize: "1.2rem", transition: "transform .25s", transform: faqOpen === i ? "rotate(45deg)" : "none", display: "inline-block" }}>+</span>
                </button>
                {faqOpen === i && (
                  <div style={{ fontSize: ".88rem", color: T.muted, lineHeight: 1.7, paddingBottom: "1.25rem", animation: "fadeUp .3s ease both" }}>{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════ FINAL CTA ══════════════════════════════ */}
        <section className="section-pad" style={{ padding: "96px 5%", background: T.ink, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle,rgba(245,200,0,.12),transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
            <div style={{ fontSize: ".72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: T.accent, marginBottom: ".75rem" }}>🚀 Comece Agora</div>
            <h2 style={{ fontSize: "clamp(1.75rem,4vw,3rem)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.1, color: "#fff", margin: "0 0 1rem" }}>Sua jornada de sucesso começa aqui.</h2>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>Pare de lutar com planilhas e cadernos. Profissionalize sua gestão hoje mesmo.</p>
            <Link href="/login" className="btn-primary" style={{ fontSize: "clamp(.9rem,2.5vw,1rem)", padding: "1rem 2rem", borderRadius: 12 }}>
              🚀 CRIAR MINHA PRIMEIRA CAMPANHA
            </Link>
            <div style={{ marginTop: "1rem", fontSize: ".75rem", color: "rgba(255,255,255,.3)", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase" }}>Crie agora · Pague apenas R$ 14,90</div>
          </div>
        </section>

        {/* ══════════════════════════════ FOOTER ══════════════════════════════ */}
        <footer style={{ background: T.ink2, padding: "64px 5% 32px" }}>
          <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "3rem", maxWidth: 1100, margin: "0 auto" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fff" }}>Apoiêfy</span>
                <span className="logo-dot" />
              </div>
              <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,.4)", lineHeight: 1.6, marginBottom: "1rem" }}>A maior e mais segura plataforma de infraestrutura e gestão para campanhas digitais do Brasil.</p>
              <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.3)", lineHeight: 1.8 }}>
                <br />São Gonçalo - RJ<br />contato@apoiêfy.com.br
              </div>
            </div>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,.4)", marginBottom: "1.25rem" }}>Plataforma</div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: ".85rem" }}>
                {[["Área do Organizador", "/login"], ["Criar Nova Campanha", "/login"], ["Preços", "#precos"]].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 500 }}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,.4)", marginBottom: "1.25rem" }}>Legal</div>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: ".85rem" }}>
                {[["Termos de Uso", "/termos"], ["Política de Privacidade", "/privacidade"]].map(([l, h]) => (
                  <li key={l}><Link href={h} style={{ fontSize: ".85rem", color: "rgba(255,255,255,.5)", textDecoration: "none", fontWeight: 500 }}>{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ fontSize: ".7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,.4)", marginBottom: "1.25rem" }}>Suporte</div>
              <p style={{ fontSize: ".82rem", color: "rgba(255,255,255,.4)", lineHeight: 1.6, marginBottom: "1.25rem" }}>Precisa de ajuda? Fale com nossa equipe agora.</p>
              <button onClick={() => window.open("https://wa.me/5521996567301", "_blank")}
                style={{ display: "flex", alignItems: "center", gap: ".5rem", padding: ".7rem 1.2rem", borderRadius: 10, background: "#25D366", color: "#fff", fontSize: ".85rem", fontWeight: 700, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <MessageCircle size={16} /> 💬 Suporte WhatsApp
              </button>
            </div>
          </div>
          <div style={{ maxWidth: 1100, margin: "3rem auto 0", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
            <div style={{ fontSize: ".72rem", color: "rgba(255,255,255,.25)", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", textAlign: "center" }}>© 2026 APOIÊFY — TECNOLOGIA PARA GESTÃO. TODOS OS DIREITOS RESERVADOS.</div>
            <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.15)" }}>Orgulhosamente desenvolvido para inovadores digitais.</div>
          </div>
        </footer>

        {/* ══════════════════════════════ FLOATING NOTIF ══════════════════════════════ */}
        {showNotif && (
          <div className="notif-show float-notif" style={{ position: "fixed", bottom: 24, left: 24, zIndex: 1000, background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: ".75rem 1rem", boxShadow: "0 8px 32px rgba(0,0,0,.12)", display: "flex", alignItems: "center", gap: ".75rem", maxWidth: 280 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1rem" }}>🎉</div>
            <div>
              <div style={{ fontSize: ".78rem", fontWeight: 700, color: T.ink }}>{notifName}</div>
              <div style={{ fontSize: ".72rem", color: T.muted }}>acabou de comprar uma cota!</div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, flexShrink: 0 }} className="blink" />
          </div>
        )}

      </div>
    </div>
  );
}