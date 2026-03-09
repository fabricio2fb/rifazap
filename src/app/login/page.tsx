"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

/* ── constants ── */
const PM_SOLD = [3, 8, 12, 15, 22, 27, 33, 5, 19, 41, 44, 50, 63, 70];
const NOTIFS = [
  { name: "Maria S.", n: 3 },
  { name: "João P.", n: 1 },
  { name: "Ana C.", n: 5 },
  { name: "Carlos L.", n: 2 },
  { name: "Beatriz F.", n: 4 },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  /* form */
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  /* campaign preview */
  const [pmSel, setPmSel] = useState<number | null>(null);
  const [pmTime, setPmTime] = useState(1 * 3600 + 22 * 60 + 47);
  const [notifIdx, setNotifIdx] = useState(0);
  const [notifShow, setNotifShow] = useState(false);
  const notifTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── timer countdown ── */
  useEffect(() => {
    const t = setInterval(() => setPmTime(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── purchase notifications — fixed: each cycle waits for hide before showing next ── */
  useEffect(() => {
    let ni = 0;
    let mounted = true;

    const show = () => {
      if (!mounted) return;
      ni = (ni + 1) % NOTIFS.length;
      setNotifIdx(ni);
      setNotifShow(true);
      notifTimer.current = setTimeout(() => {
        if (!mounted) return;
        setNotifShow(false);
        notifTimer.current = setTimeout(() => { if (mounted) show(); }, 2000); // gap between notifs
      }, 3500); // visible duration
    };

    // first show after 1.5s
    notifTimer.current = setTimeout(show, 1500);
    return () => {
      mounted = false;
      if (notifTimer.current) clearTimeout(notifTimer.current);
    };
  }, []);

  /* ── helpers ── */
  const fmtTime = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, "0");
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  /* ── auth ── */
  const handleEmailAuth = async (type: "login" | "register") => {
    if (!email || !password) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha e-mail e senha." });
      return;
    }
    setAuthLoading(true);
    setErrorMessage(null);
    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/admin");
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        toast({ title: "Conta criada!", description: "Verifique seu e-mail para confirmar (se necessário)." });
        const { data: { session } } = await supabase.auth.getSession();
        if (session) router.push("/admin");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Erro na autenticação.");
      toast({ variant: "destructive", title: "Erro", description: err.message || "Verifique suas credenciais." });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro no Google", description: err.message || "Tente novamente." });
      setAuthLoading(false);
    }
  };

  const notif = NOTIFS[notifIdx];

  return (
    <>
      <style>{CSS}</style>
      <div className="lp-page">

        {/* ══════════ LEFT — CAMPAIGN PREVIEW ══════════ */}
        <div className="lp-left">
          <div className="lp-left-bg" />

          <Link href="/" className="lp-brand" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="lp-brand-icon"><Image src="/LOGOAP.png" alt="Apoiêfy" width={22} height={22} style={{ objectFit: "contain" }} /></div>
            Apoiêfy
          </Link>

          <div className="lp-stage">

            {/* phone */}
            <div className="lp-phone">
              <div className="lp-notch"><div className="lp-notch-pill" /></div>

              <div className="lp-banner">
                <div className="lp-banner-emoji">🖥️</div>
                <div className="lp-ativa"><span className="lp-dot" />ATIVA</div>
                {/* in-phone toast */}
                <div className={`lp-toast${notifShow ? " show" : ""}`}>
                  <div className="lp-toast-ico">👤</div>
                  <div className="lp-toast-txt">
                    <strong>{notif.name}</strong> comprou {notif.n} cota{notif.n > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              <div className="lp-pbody">
                <div className="lp-ptitle">PC Gamer RTX 4090 + Monitor 4K 🎮</div>
                <div className="lp-psub">Participe com apenas R$ 1,00 por cota!</div>

                <div className="lp-ppills">
                  <div className="lp-ppill"><div className="lp-ppill-lbl">BILHETE</div><div className="lp-ppill-val">R$ 1,00</div></div>
                  <div className="lp-ppill"><div className="lp-ppill-lbl">SORTEIO</div><div className="lp-ppill-val">14/01/25</div></div>
                </div>

                <div className="lp-prog-wrap">
                  <div className="lp-prog-labels"><span>64% vendido</span><span>700 cotas</span></div>
                  <div className="lp-prog-track"><div className="lp-prog-fill" style={{ width: "64%" }} /></div>
                </div>

                <div className="lp-timer">{fmtTime(pmTime)}</div>

                <div className="lp-cotas">
                  {Array.from({ length: 70 }, (_, i) => {
                    const n = i + 1, sold = PM_SOLD.includes(n), sel = pmSel === n;
                    return (
                      <div key={i} className={`lp-c${sold ? " s" : ""}${sel ? " a" : ""}`}
                        onClick={() => { if (sold) return; setPmSel(sel ? null : n); }}>
                        {String(n).padStart(2, "0")}
                      </div>
                    );
                  })}
                </div>

                <button className="lp-pbtn">
                  {pmSel ? `RESERVAR Nº ${String(pmSel).padStart(2, "00")}` : "COMPRAR AGORA"}
                </button>
              </div>
            </div>

            <div className="lp-preview-lbl">
              <span className="lp-preview-dot" />Prévia real da sua campanha
            </div>
          </div>
        </div>

        {/* ══════════ RIGHT — FORM ══════════ */}
        <div className="lp-right">
          <div className={`lp-card${shake ? " shake" : ""}`}>

            <div className="lp-card-header">
              <Link href="/"><div className="lp-card-logo"><Image src="/LOGOAP.png" alt="Apoiêfy" width={28} height={28} style={{ objectFit: "contain" }} /></div></Link>
              <div className="lp-card-title">
                {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
              </div>
              <div className="lp-card-sub">
                {mode === "login" ? "Entre e gerencie suas campanhas" : "Comece grátis. Pague só ao criar."}
              </div>
            </div>

            {errorMessage && (
              <div className="lp-error">
                <span>⚠️</span> {errorMessage}
              </div>
            )}

            {/* mode toggle */}
            <div className="lp-mode">
              <div className={`lp-mode-slider${mode === "register" ? " r" : ""}`} />
              <button className={`lp-mode-btn${mode === "login" ? " on" : ""}`}
                onClick={() => { setMode("login"); setErrorMessage(null); }}>Entrar</button>
              <button className={`lp-mode-btn${mode === "register" ? " on" : ""}`}
                onClick={() => { setMode("register"); setErrorMessage(null); }}>Criar Conta</button>
            </div>

            <div className="lp-form">
              {/* email */}
              <div className="lp-field">
                <label className="lp-label">E-mail</label>
                <div className={`lp-iwrap${focused === "email" ? " f" : ""}`}>
                  <span className="lp-iico">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input className="lp-inp" type="email" placeholder="seu@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    disabled={authLoading} />
                </div>
              </div>

              {/* password */}
              <div className="lp-field">
                <label className="lp-label">{mode === "register" ? "Crie uma Senha" : "Senha"}</label>
                <div className={`lp-iwrap${focused === "pass" ? " f" : ""}`}>
                  <span className="lp-iico">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input className="lp-inp" type={showPass ? "text" : "password"}
                    placeholder={mode === "register" ? "Mínimo 6 caracteres" : "••••••••"}
                    value={password} onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                    style={{ paddingRight: "3.5rem" }} disabled={authLoading} />
                  <button className="lp-iaction" onClick={() => setShowPass(p => !p)} type="button">
                    {showPass ? "ocultar" : "ver"}
                  </button>
                </div>
                {mode === "register" && password.length > 0 && (
                  <div className="lp-sbar">
                    <div className="lp-sfill" style={{
                      width: password.length < 6 ? "33%" : password.length < 10 ? "66%" : "100%",
                      background: password.length < 6 ? "#ef4444" : password.length < 10 ? "#F5C800" : "#2D9E6B",
                    }} />
                  </div>
                )}
              </div>

              {mode === "login" && (
                <div className="lp-forgot"><a href="#">Esqueceu a senha?</a></div>
              )}

              <button className={`lp-btn-sub${authLoading ? " loading" : ""}`}
                onClick={() => handleEmailAuth(mode)} disabled={authLoading}>
                {authLoading
                  ? <><Loader2 className="lp-spinner" size={15} />Verificando...</>
                  : mode === "login" ? "Acessar Painel →" : "Cadastrar e Iniciar →"}
              </button>

              <div className="lp-divider">
                <div className="lp-dline" /><span className="lp-dtxt">ou continue com</span><div className="lp-dline" />
              </div>

              <button className="lp-btn-google" onClick={handleGoogleLogin} disabled={authLoading}>
                <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Entrar com Google
              </button>
            </div>

            <div className="lp-trust">
              <div className="lp-tbadge"><span>🔒</span>Seguro</div>
              <div className="lp-tbadge"><span>⚡</span>PIX Direto</div>
              <div className="lp-tbadge"><span>🆓</span>Grátis</div>
            </div>

            <div className="lp-footer">
              {mode === "login"
                ? <>Não tem conta? <a href="#" onClick={e => { e.preventDefault(); setMode("register"); setErrorMessage(null); }}>Criar agora</a></>
                : <>Já tem conta? <a href="#" onClick={e => { e.preventDefault(); setMode("login"); setErrorMessage(null); }}>Entrar</a></>}
            </div>

            <p className="lp-dev-note">Acesso liberado: Qualquer e-mail e senha funcionam para teste.</p>
          </div>
        </div>
      </div>
    </>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;font-family:'Geist',sans-serif;overflow:hidden;}

:root{
  --lp-ink:#0A0A08; --lp-ink2:#1A1A16; --lp-muted:#6B6B60; --lp-muted2:#9A9A8E;
  --lp-bg:#FAFAF8;  --lp-bg2:#F2F2EF;  --lp-border:#E8E8E3; --lp-border2:#D6D6CF;
  --lp-accent:#F5C800; --lp-accent2:#D4A800; --lp-green:#2D9E6B;
}

.lp-page{
  display:grid;grid-template-columns:1fr 1fr;
  height:100vh;background:#0A0A08;overflow:hidden;
}

/* ── LEFT ── */
.lp-left{
  position:relative;background:#0A0A08;
  display:flex;flex-direction:column;overflow:hidden;
}
.lp-left-bg{
  position:absolute;inset:0;pointer-events:none;
  background:
    radial-gradient(ellipse 60% 50% at 20% 10%,rgba(245,200,0,.1),transparent),
    radial-gradient(ellipse 40% 40% at 85% 85%,rgba(245,200,0,.06),transparent);
}
.lp-left::after{
  content:'';position:absolute;inset:0;z-index:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);
  background-size:40px 40px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent);
}

.lp-brand{
  position:relative;z-index:2;flex-shrink:0;
  display:flex;align-items:center;gap:.6rem;
  font-size:1.05rem;font-weight:800;color:#fff;letter-spacing:-.4px;
  padding:1.75rem 2rem;
}
.lp-brand-icon{
  width:30px;height:30px;background:var(--lp-accent);border-radius:8px;
  display:flex;align-items:center;justify-content:center;
  font-size:.8rem;box-shadow:0 0 16px rgba(245,200,0,.4);
}

/* stage */
.lp-stage{
  position:relative;z-index:2;
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:0 2rem 2rem;gap:.75rem;min-height:0;
}

/* floating notif — sits at top of stage, centered-right */

/* phone */
.lp-phone{
  width:230px;flex-shrink:0;background:#fff;border-radius:30px;overflow:hidden;
  box-shadow:
    0 0 0 8px #1e1e1e,
    0 0 0 9px rgba(255,255,255,.05),
    0 32px 80px rgba(0,0,0,.85);
}
.lp-notch{height:18px;background:#fff;display:flex;align-items:center;justify-content:center}
.lp-notch-pill{width:48px;height:5px;background:#1c1c1c;border-radius:100px}

.lp-banner{
  height:105px;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);
  display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.lp-banner-emoji{font-size:2.4rem}
.lp-ativa{
  position:absolute;top:6px;right:6px;
  background:rgba(255,255,255,.92);backdrop-filter:blur(6px);
  border-radius:5px;padding:.12rem .4rem;
  font-size:.44rem;font-weight:700;color:#111;
  display:flex;align-items:center;gap:.2rem;
}
.lp-dot{
  width:4px;height:4px;border-radius:50%;background:var(--lp-green);
  animation:lpBlink 1.5s infinite;display:inline-block;
}
@keyframes lpBlink{0%,100%{opacity:1}50%{opacity:.2}}

/* in-phone toast */
.lp-toast{
  position:absolute;bottom:5px;left:5px;right:5px;
  background:rgba(255,255,255,.96);backdrop-filter:blur(8px);
  border-radius:7px;padding:.28rem .45rem;
  display:flex;align-items:center;gap:.3rem;
  border:1px solid rgba(0,0,0,.04);
  transform:translateY(28px);opacity:0;
  transition:transform .4s cubic-bezier(.34,1.56,.64,1),opacity .3s ease;
  will-change:transform,opacity;
}
.lp-toast.show{transform:translateY(0);opacity:1}
.lp-toast-ico{
  width:14px;height:14px;border-radius:50%;background:#f3f4f6;
  display:flex;align-items:center;justify-content:center;
  font-size:.45rem;flex-shrink:0;
}
.lp-toast-txt{font-size:.44rem;color:#555;line-height:1.3}
.lp-toast-txt strong{color:#111;font-weight:700}

/* phone body */
.lp-pbody{padding:.55rem .7rem}
.lp-ptitle{font-size:.68rem;font-weight:800;color:var(--lp-ink);letter-spacing:-.2px;margin-bottom:.12rem;line-height:1.2}
.lp-psub{font-size:.49rem;color:var(--lp-muted);margin-bottom:.5rem;line-height:1.4}

.lp-ppills{display:grid;grid-template-columns:1fr 1fr;gap:.3rem;margin-bottom:.5rem}
.lp-ppill{background:var(--lp-bg2);border:1px solid var(--lp-border);border-radius:6px;padding:.3rem .4rem}
.lp-ppill-lbl{font-size:.35rem;text-transform:uppercase;letter-spacing:.8px;color:var(--lp-muted2);font-weight:700;margin-bottom:.08rem}
.lp-ppill-val{font-size:.56rem;font-weight:800;color:var(--lp-ink)}

.lp-prog-wrap{margin-bottom:.45rem}
.lp-prog-labels{display:flex;justify-content:space-between;font-size:.42rem;color:var(--lp-muted);margin-bottom:.2rem}
.lp-prog-track{background:var(--lp-bg2);border-radius:100px;height:3px;overflow:hidden}
.lp-prog-fill{
  height:100%;border-radius:100px;
  background:linear-gradient(90deg,var(--lp-accent),#FFE066);
  position:relative;overflow:hidden;
}
.lp-prog-fill::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);
  animation:lpShimmer 2s infinite;
}
@keyframes lpShimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}

.lp-timer{
  text-align:center;background:var(--lp-ink);color:var(--lp-accent);
  border-radius:6px;padding:.25rem;margin-bottom:.45rem;
  font-family:'Geist Mono',monospace;font-size:.62rem;font-weight:800;letter-spacing:2px;
}

.lp-cotas{display:grid;grid-template-columns:repeat(10,1fr);gap:.08rem;margin-bottom:.45rem}
.lp-c{
  aspect-ratio:1;border-radius:2px;
  display:flex;align-items:center;justify-content:center;
  font-size:.28rem;font-weight:600;
  border:1px solid var(--lp-border);color:var(--lp-ink2);background:var(--lp-bg);
  cursor:pointer;transition:all .1s;
}
.lp-c.s{background:var(--lp-bg2);color:var(--lp-muted2);border-color:transparent;cursor:default}
.lp-c.a{background:var(--lp-accent);color:#000;border-color:var(--lp-accent)}

.lp-pbtn{
  display:block;width:100%;padding:.38rem;border-radius:6px;
  background:var(--lp-ink);color:#fff;font-size:.55rem;font-weight:800;
  border:none;cursor:pointer;font-family:'Geist',sans-serif;
  text-align:center;letter-spacing:.4px;transition:opacity .15s;
}
.lp-pbtn:hover{opacity:.85}

.lp-preview-lbl{
  display:flex;align-items:center;gap:.4rem;
  font-size:.7rem;font-weight:600;color:rgba(255,255,255,.35);
}
.lp-preview-dot{
  width:5px;height:5px;border-radius:50%;
  background:var(--lp-green);animation:lpBlink 1.5s infinite;
}

/* ── RIGHT ── */
.lp-right{
  background:var(--lp-bg);
  display:flex;align-items:center;justify-content:center;
  padding:2rem;position:relative;overflow:hidden;
}
.lp-right::before{
  content:'';position:absolute;
  top:-150px;right:-150px;width:450px;height:450px;border-radius:50%;
  background:radial-gradient(circle,rgba(245,200,0,.09),transparent 70%);
  pointer-events:none;
}
.lp-right::after{
  content:'';position:absolute;
  bottom:-100px;left:-80px;width:350px;height:350px;border-radius:50%;
  background:radial-gradient(circle,rgba(245,200,0,.05),transparent 70%);
  pointer-events:none;
}

.lp-card{
  width:100%;max-width:400px;
  position:relative;z-index:1;
  animation:lpCardIn .5s ease both;
}
@keyframes lpCardIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

.lp-card-header{text-align:center;margin-bottom:1.6rem}
.lp-card-logo{
  display:inline-flex;align-items:center;justify-content:center;
  width:44px;height:44px;background:var(--lp-accent);border-radius:13px;
  font-size:1.15rem;box-shadow:0 4px 18px rgba(245,200,0,.28);margin-bottom:.8rem;
}
.lp-card-title{font-size:1.4rem;font-weight:800;color:var(--lp-ink);letter-spacing:-.5px}
.lp-card-sub{font-size:.81rem;color:var(--lp-muted);margin-top:.3rem;line-height:1.5}

.lp-error{
  background:#fef2f2;border:1px solid #fecaca;border-radius:8px;
  padding:.65rem .9rem;font-size:.78rem;color:#dc2626;
  display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;
}

/* mode switch */
.lp-mode{
  display:grid;grid-template-columns:1fr 1fr;
  background:var(--lp-bg2);border:1px solid var(--lp-border);
  border-radius:10px;padding:3px;margin-bottom:1.5rem;position:relative;
}
.lp-mode-slider{
  position:absolute;top:3px;
  width:calc(50% - 3px);height:calc(100% - 6px);
  background:#fff;border-radius:8px;
  box-shadow:0 1px 3px rgba(0,0,0,.08),0 1px 8px rgba(0,0,0,.04);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1);
}
.lp-mode-slider.r{transform:translateX(calc(100% + 3px))}
.lp-mode-btn{
  padding:.58rem;font-size:.82rem;font-weight:600;
  border:none;background:transparent;cursor:pointer;
  border-radius:8px;font-family:'Geist',sans-serif;
  color:var(--lp-muted);transition:color .2s;position:relative;z-index:1;
}
.lp-mode-btn.on{color:var(--lp-ink)}

.lp-form{display:flex;flex-direction:column;gap:.8rem}

.lp-field{display:flex;flex-direction:column;gap:.38rem}
.lp-label{font-size:.67rem;font-weight:700;color:var(--lp-ink2);text-transform:uppercase;letter-spacing:.9px}
.lp-iwrap{position:relative;display:flex;align-items:center}
.lp-iico{
  position:absolute;left:.82rem;color:var(--lp-muted2);
  pointer-events:none;transition:color .2s;display:flex;
}
.lp-iwrap.f .lp-iico{color:var(--lp-ink)}
.lp-inp{
  width:100%;padding:.7rem .7rem .7rem 2.35rem;
  border:1.5px solid var(--lp-border);border-radius:10px;
  font-size:.85rem;font-family:'Geist',sans-serif;
  color:var(--lp-ink);background:#fff;outline:none;
  transition:border-color .2s,box-shadow .2s;-webkit-appearance:none;
}
.lp-inp::placeholder{color:#C0C0B8}
.lp-inp:focus{border-color:var(--lp-ink);box-shadow:0 0 0 3px rgba(10,10,8,.06)}
.lp-inp:disabled{opacity:.6;cursor:not-allowed}
.lp-iaction{
  position:absolute;right:.65rem;background:none;border:none;cursor:pointer;
  color:var(--lp-muted2);font-size:.7rem;font-family:'Geist',sans-serif;
  font-weight:600;transition:color .15s;padding:.2rem;
}
.lp-iaction:hover{color:var(--lp-ink)}

.lp-sbar{height:2px;border-radius:2px;background:var(--lp-border);margin-top:.3rem;overflow:hidden}
.lp-sfill{height:100%;border-radius:2px;transition:width .3s,background .3s}

.lp-forgot{text-align:right;margin-top:-.1rem}
.lp-forgot a{font-size:.7rem;color:var(--lp-muted2);text-decoration:none;transition:color .15s}
.lp-forgot a:hover{color:var(--lp-ink)}

.lp-btn-sub{
  width:100%;padding:.8rem;border-radius:10px;
  background:var(--lp-ink);color:#fff;font-size:.87rem;font-weight:700;
  border:none;cursor:pointer;font-family:'Geist',sans-serif;
  display:flex;align-items:center;justify-content:center;gap:.5rem;
  margin-top:.1rem;position:relative;overflow:hidden;
  transition:transform .2s,box-shadow .2s,opacity .2s;
}
.lp-btn-sub::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(245,200,0,.15),transparent);
  opacity:0;transition:opacity .2s;
}
.lp-btn-sub:hover::before{opacity:1}
.lp-btn-sub:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 8px 24px rgba(10,10,8,.18)}
.lp-btn-sub.loading,.lp-btn-sub:disabled{opacity:.7;cursor:not-allowed;transform:none}

.lp-spinner{animation:lpSpin .7s linear infinite}
@keyframes lpSpin{to{transform:rotate(360deg)}}

.lp-divider{display:flex;align-items:center;gap:.55rem;margin:.05rem 0}
.lp-dline{flex:1;height:1px;background:var(--lp-border)}
.lp-dtxt{font-size:.63rem;font-weight:600;color:#C0C0B8;text-transform:uppercase;letter-spacing:.9px;white-space:nowrap}

.lp-btn-google{
  width:100%;padding:.76rem;border-radius:10px;
  background:#fff;border:1.5px solid var(--lp-border);
  color:var(--lp-ink);font-size:.85rem;font-weight:600;cursor:pointer;
  font-family:'Geist',sans-serif;transition:all .2s;
  display:flex;align-items:center;justify-content:center;gap:.55rem;
  box-shadow:0 1px 3px rgba(0,0,0,.04);
}
.lp-btn-google:hover:not(:disabled){border-color:var(--lp-border2);box-shadow:0 4px 12px rgba(0,0,0,.07);transform:translateY(-1px)}
.lp-btn-google:disabled{opacity:.6;cursor:not-allowed}

.lp-trust{
  display:flex;align-items:center;justify-content:center;gap:.8rem;
  margin-top:1rem;
}
.lp-tbadge{
  display:flex;align-items:center;gap:.28rem;
  font-size:.65rem;color:#C0C0B8;font-weight:500;
}
.lp-tbadge span{font-size:.72rem}

.lp-footer{text-align:center;margin-top:1rem;font-size:.75rem;color:var(--lp-muted2)}
.lp-footer a{
  color:var(--lp-ink);font-weight:700;text-decoration:none;
  border-bottom:1.5px solid var(--lp-accent);transition:opacity .15s;
}
.lp-footer a:hover{opacity:.7}

.lp-dev-note{
  text-align:center;margin-top:.75rem;
  font-size:.65rem;color:#C0C0B8;line-height:1.4;
}

@keyframes lpShake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}80%{transform:translateX(4px)}
}
.shake{animation:lpShake .5s ease both}

@media(max-width:800px){
  .lp-page{grid-template-columns:1fr}
  .lp-left{display:none}
  .lp-right{overflow:hidden}
}
`;