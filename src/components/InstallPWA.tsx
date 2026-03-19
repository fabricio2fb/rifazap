'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface InstallPWAProps {
  variant?: 'floating' | 'sidebar' | 'inline';
  className?: string;
}

export function InstallPWA({ variant = 'floating', className }: InstallPWAProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    // Better iOS detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad Pro
    setIsIOS(isIOSDevice);

    console.log('PWA: Initializing...', { isIOSDevice, standalone: window.matchMedia('(display-mode: standalone)').matches });

    const handler = (e: any) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    } else if (variant === 'inline' || variant === 'sidebar') {
      setIsVisible(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [variant]);

  const handleInstallClick = async () => {
    console.log('PWA: Install clicked', { hasPrompt: !!deferredPrompt, isIOS, isSecure: window.isSecureContext });

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('PWA: Install outcome:', outcome);
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSHint(true);
    } else {
      let msg = 'Não foi possível acionar a instalação automática.';
      
      if (!window.isSecureContext) {
        msg += '\n\nMotivo: O site não está em uma conexão segura (HTTPS). PWAs exigem HTTPS para instalação.';
      } else {
        msg += '\n\nPara instalar manualmente:\n1. Use o menu do seu navegador (três pontos ou seta);\n2. Selecione "Instalar aplicativo" ou "Adicionar à tela de início".';
      }
      
      alert(msg);
    }
  };

  if (!isVisible) return null;

  if (variant === 'sidebar') {
    return (
      <button
        onClick={handleInstallClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <Download className="w-5 h-5" />
        Instalar Aplicativo
      </button>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("md:hidden mb-6", className)}>
        {showIOSHint ? (
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border-2 border-[#F5C518] animate-in zoom-in-95 duration-300">
            <p className="text-sm font-bold mb-2 flex items-center gap-2">
              <Download className="w-4 h-4 text-[#F5C518]" />
              Instalar no iPhone/iPad
            </p>
            <ol className="text-xs space-y-2 text-muted-foreground">
              <li>1. Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta pra cima) na barra do Safari.</li>
              <li>2. Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.</li>
              <li>3. Toque em <strong>"Adicionar"</strong> no canto superior.</li>
            </ol>
            <button 
              onClick={() => setShowIOSHint(false)}
              className="mt-4 w-full text-xs font-bold text-primary underline"
            >
              Entendi
            </button>
          </div>
        ) : (
          <button
            onClick={handleInstallClick}
            className="w-full bg-[#F5C518] text-navy hover:bg-[#d4a914] font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-sm transition-all active:scale-95"
          >
            <div className="bg-white/30 p-2 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-sm">Instalar Aplicativo</span>
              <span className="text-[10px] opacity-70">Acesse mais rápido pelo seu celular</span>
            </div>
          </button>
        )}
      </div>
    );
  }

  // Hide floating variant on mobile as per user request
  return (
    <div className={cn("fixed bottom-4 left-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 hidden md:block", className)}>
      <Button 
        onClick={handleInstallClick}
        className="bg-[#F5C518] hover:bg-[#d4a914] text-navy font-bold shadow-lg flex items-center gap-2 rounded-full px-6 py-6"
      >
        <Download className="w-5 h-5" />
        Instalar app
      </Button>
    </div>
  );
}
