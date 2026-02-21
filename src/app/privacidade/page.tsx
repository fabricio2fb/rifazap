"use client";

import { Zap, ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Trash2, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Quais Dados Coletamos",
        icon: <Database className="w-5 h-5" />,
        content: `Coletamos apenas os dados estritamente necessários para o funcionamento da plataforma:

Dados do Organizador: nome completo, endereço de e-mail, número de WhatsApp e chave PIX para recebimento.

Dados do Participante: nome completo e número de WhatsApp, informados no momento do registro de participantes.

Dados de Uso: informações técnicas como endereço IP, tipo de dispositivo, navegador utilizado e páginas acessadas, coletadas automaticamente para fins de segurança e melhoria da plataforma.`
    },
    {
        id: "02",
        title: "Como Usamos Seus Dados",
        icon: <Eye className="w-5 h-5" />,
        content: `Utilizamos seus dados exclusivamente para:

— Criar e gerenciar sua conta na plataforma.
— Permitir que o organizador gerencie os participantes da sua campanha.
— Enviar notificações relacionadas às suas campanhas ativas.
— Garantir a segurança e prevenir fraudes na plataforma.
— Cumprir obrigações legais e regulatórias.

Não utilizamos seus dados para fins de marketing de terceiros, nem vendemos, alugamos ou compartilhamos suas informações com anunciantes.`
    },
    {
        id: "03",
        title: "Compartilhamento de Dados",
        icon: <UserCheck className="w-5 h-5" />,
        content: `Seus dados podem ser compartilhados nas seguintes situações:

Com o Organizador: os dados do participante (nome e WhatsApp) são compartilhados com o organizador da campanha para que ele possa confirmar pagamentos e comunicar o resultado da apuração.

Com Prestadores de Serviço: podemos compartilhar dados com fornecedores de tecnologia que nos auxiliam na operação da plataforma, sempre sob contratos de confidencialidade.

Por Obrigação Legal: quando exigido por lei, ordem judicial ou autoridade competente.

Nunca vendemos seus dados a terceiros.`
    },
    {
        id: "04",
        title: "Armazenamento e Segurança",
        icon: <Lock className="w-5 h-5" />,
        content: `Seus dados são armazenados em servidores seguros localizados no Brasil, com criptografia em trânsito (SSL/TLS) e em repouso.

Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema é 100% seguro — em caso de incidente que afete seus dados, você será notificado conforme exigido pela LGPD.

Os dados são mantidos pelo período necessário para a prestação dos serviços ou conforme exigido por lei.`
    },
    {
        id: "05",
        title: "Seus Direitos (LGPD)",
        icon: <Shield className="w-5 h-5" />,
        content: `Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:

— Confirmar a existência de tratamento dos seus dados.
— Acessar os dados que temos sobre você.
— Corrigir dados incompletos, inexatos ou desatualizados.
— Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.
— Solicitar a portabilidade dos seus dados.
— Revogar o consentimento a qualquer momento.

Para exercer qualquer um desses direitos, entre em contato com nossa equipe via WhatsApp.`
    },
    {
        id: "06",
        title: "Cookies e Rastreamento",
        icon: <Eye className="w-5 h-5" />,
        content: `Utilizamos cookies essenciais para o funcionamento da plataforma, como manutenção de sessão e preferências do usuário.

Não utilizamos cookies de rastreamento para publicidade comportamental de terceiros.

Você pode configurar seu navegador para recusar cookies, mas isso pode afetar o funcionamento de algumas funcionalidades da plataforma.`
    },
    {
        id: "07",
        title: "Retenção e Exclusão",
        icon: <Trash2 className="w-5 h-5" />,
        content: `Mantemos seus dados pelo tempo necessário para a prestação dos serviços. Após o encerramento da sua conta:

— Dados de participantes são anonimizados em até 90 dias.
— Dados de organizadores são mantidos por até 5 anos para fins fiscais e legais.
— Logs de segurança são mantidos por 12 meses.

Você pode solicitar a exclusão antecipada dos seus dados entrando em contato com nosso suporte, respeitadas as obrigações legais de retenção.`
    },
    {
        id: "08",
        title: "Menores de Idade",
        icon: <UserCheck className="w-5 h-5" />,
        content: `A plataforma TicketOn não é destinada a menores de 18 anos. Não coletamos intencionalmente dados de menores de idade.

Caso identifiquemos que um menor forneceu dados sem o consentimento dos responsáveis, removeremos essas informações imediatamente.

Se você acredita que coletamos dados de um menor, entre em contato conosco via WhatsApp.`
    },
    {
        id: "09",
        title: "Alterações nesta Política",
        icon: <FileText className="w-5 h-5" />,
        content: `Podemos atualizar esta Política de Privacidade periodicamente. Alterações significativas serão comunicadas com antecedência mínima de 7 dias via e-mail ou notificação na plataforma.

Recomendamos que você revise esta página regularmente. O uso continuado da plataforma após as alterações constitui aceitação da nova política.

Esta Política é regida pela legislação brasileira, em especial pela Lei nº 13.709/2018 (LGPD).`
    }
];

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-6 mx-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
                        <span className="text-2xl font-bold tracking-tighter">TicketOn</span>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="font-bold border-2 gap-2">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="bg-primary py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="container mx-auto relative text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider text-primary-foreground">
                        <Shield className="w-4 h-4" />
                        Documento Legal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground tracking-tight">
                        Política de Privacidade
                    </h1>
                    <p className="text-primary-foreground/80 font-medium max-w-xl mx-auto">
                        Transparência total sobre como tratamos seus dados. Em conformidade com a LGPD. Última atualização: Janeiro de 2025.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-16 px-6">
                <div className="container mx-auto max-w-3xl space-y-6">

                    {/* LGPD Badge */}
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                            <Lock className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest text-primary-foreground mb-1">Comprometidos com a LGPD</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                Seguimos rigorosamente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Seus dados são seus — coletamos apenas o necessário, usamos com transparência e protegemos com responsabilidade.
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    {sections.map((section, i) => (
                        <div key={i} className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4 p-6 border-b bg-muted/20">
                                <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                                    {section.icon}
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-muted-foreground tracking-[0.2em] uppercase">{section.id}</span>
                                    <h2 className="text-lg font-black tracking-tight">{section.title}</h2>
                                </div>
                            </div>
                            <div className="p-6">
                                {section.content.split('\n\n').map((paragraph, j) => (
                                    <p key={j} className="text-muted-foreground font-medium text-sm leading-relaxed mb-3 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* DPO Contact */}
                    <div className="bg-foreground text-background rounded-2xl p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                                <UserCheck className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-primary/80">Encarregado de Dados (DPO)</p>
                                <p className="font-black text-lg">Fale com nossa equipe</p>
                            </div>
                        </div>
                        <p className="text-background/70 text-sm font-medium leading-relaxed">
                            Para exercer seus direitos previstos na LGPD ou tirar dúvidas sobre como tratamos seus dados, entre em contato com nosso Encarregado de Proteção de Dados via WhatsApp.
                        </p>
                        <Button
                            className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-base gap-3 shadow-xl hover:scale-105 transition-transform"
                            onClick={() => window.open("https://wa.me/5561995256066", "_blank")}
                        >
                            <MessageCircle className="w-5 h-5 fill-current" /> Contatar DPO via WhatsApp
                        </Button>
                    </div>

                    {/* Version */}
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            TicketOn — Política de Privacidade • Versão 1.1
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Em conformidade com a Lei nº 13.709/2018 (LGPD).
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-8 px-6 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary-foreground fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">TicketOn</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-muted-foreground">
                        <Link href="/termos" className="hover:text-primary-foreground transition-colors">Termos de Uso</Link>
                        <Link href="/privacidade" className="text-primary-foreground">Privacidade</Link>
                        <Link href="/etica" className="hover:text-primary-foreground transition-colors">Código de Ética</Link>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">© 2026 TicketOn</p>
                </div>
            </footer>
        </div>
    );
}