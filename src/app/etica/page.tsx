"use client";

import { Zap, ArrowLeft, Shield, Heart, Users, AlertTriangle, Ban, CheckCircle2, MessageCircle, FileText, Scale, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const principles = [
    {
        id: "01",
        title: "Transparência Total",
        icon: <Star className="w-5 h-5" />,
        content: `Acreditamos que a confiança é construída com transparência. Por isso:

— Todas as taxas e condições são informadas antes de qualquer pagamento.
— Não existem cobranças ocultas ou surpresas no uso da plataforma.
— Comunicamos mudanças de regras com antecedência e clareza.
— Nosso modelo de negócio é simples: você paga R$ 9,90 por campanha e fica com 100% das vendas.`
    },
    {
        id: "02",
        title: "Compromisso com o Organizador",
        icon: <Users className="w-5 h-5" />,
        content: `O organizador é o coração da Apoiêfy. Nos comprometemos a:

— Oferecer ferramentas que realmente facilitem a gestão das suas campanhas.
— Garantir que o dinheiro chegue 100% na sua conta, sem intermediações.
— Prover suporte humanizado e ágil sempre que precisar.
— Ouvir feedbacks e melhorar continuamente com base nas suas necessidades.`
    },
    {
        id: "03",
        title: "Proteção ao Participante",
        icon: <Shield className="w-5 h-5" />,
        content: `Quem adquire um acesso merece respeito e segurança. Exigimos que os organizadores:

— Entreguem a meta/benefício prometido sem condições extras.
— Realizem o evento de conclusão na data informada ou comuniquem qualquer alteração com antecedência.
— Sejam honestos sobre os benefícios, não utilizando imagens ou descrições enganosas.
— Confirmem os pagamentos de forma justa, sem discriminação.

Denúncias de organizadores que descumpram essas regras serão investigadas e podem resultar em suspensão da conta.`
    },
    {
        id: "04",
        title: "Uso Responsável da Plataforma",
        icon: <Scale className="w-5 h-5" />,
        content: `A Apoiêfy é uma ferramenta de gestão digital. Esperamos que todos os usuários:

— Utilizem a plataforma apenas para campanhas legítimas, filantrópicas ou promocionais autorizadas.
— Não criem campanhas com fins de lavagem de dinheiro, fraude ou qualquer atividade ilícita.
— Respeitem os participantes e mantenham uma comunicação ética e transparente.
— Não utilizem a plataforma para coletar dados de terceiros sem consentimento.`
    },
    {
        id: "05",
        title: "O que Não Toleramos",
        icon: <Ban className="w-5 h-5" />,
        content: `A Apoiêfy tem tolerância zero com:

— Campanhas fraudulentas: organizar eventos de arrecadação sem intenção de cumprir as metas ou benefícios.
— Benefícios falsos: usar imagens ou descrições enganosas para atrair participantes.
— Discriminação: tratar participantes de forma diferente por raça, gênero, religião ou qualquer outro fator.
— Spam: enviar mensagens não solicitadas em massa usando os dados da plataforma.
— Golpes: usar a plataforma para aplicar golpes financeiros de qualquer natureza.

Contas que violem essas regras serão suspensas permanentemente e, quando necessário, reportadas às autoridades competentes.`
    },
    {
        id: "06",
        title: "Responsabilidade Social",
        icon: <Heart className="w-5 h-5" />,
        content: `Acreditamos no poder das campanhas de arrecadação para fazer o bem. A Apoiêfy apoia e valoriza:

— Campanhas com fins filantrópicos e beneficentes.
— Organizadores que usam a plataforma para ajudar comunidades, animais e causas sociais.
— O empreendedorismo de pequenos organizadores que buscam renda extra de forma honesta.

Nos orgulhamos de ser uma ferramenta que move recursos para causas que importam.`
    },
    {
        id: "07",
        title: "Denúncias e Fiscalização",
        icon: <AlertTriangle className="w-5 h-5" />,
        content: `Levamos a sério qualquer relato de uso indevido da plataforma. Se você presenciar ou suspeitar de uma campanha fraudulenta:

— Entre em contato com nosso suporte via WhatsApp informando o link da campanha suspeita.
— Nossa equipe investigará o caso em até 48 horas úteis.
— Campanhas confirmadas como fraudulentas serão removidas imediatamente.
— O organizador será suspenso e os participantes serão notificados.

Sua denúncia é confidencial e essencial para mantermos a plataforma segura para todos.`
    },
    {
        id: "08",
        title: "Nosso Compromisso Contínuo",
        icon: <CheckCircle2 className="w-5 h-5" />,
        content: `Este Código de Ética não é apenas um documento — é o reflexo dos valores que guiam cada decisão da Apoiêfy.

Revisamos e atualizamos nossas diretrizes regularmente para acompanhar o crescimento da plataforma e as necessidades dos nossos usuários.

Acreditamos que campanhas digitais, quando conduzidas com ética e responsabilidade, são uma ferramenta poderosa de geração de renda e impacto social. Esse é o futuro que queremos construir juntos.`
    }
];

export default function EticaPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-6 mx-auto">
                    <Link href="/" className="flex items-center gap-2">
                        <Zap className="h-6 w-6 text-primary-foreground fill-primary" />
                        <span className="text-2xl font-bold tracking-tighter">Apoiêfy</span>
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
                        <Heart className="w-4 h-4" />
                        Nossos Valores
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground tracking-tight">
                        Código de Ética
                    </h1>
                    <p className="text-primary-foreground/80 font-medium max-w-xl mx-auto">
                        Os princípios que guiam cada decisão da Apoiêfy e o que esperamos de todos que usam nossa plataforma.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-16 px-6">
                <div className="container mx-auto max-w-3xl space-y-6">

                    {/* Intro Card */}
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest text-primary-foreground mb-1">Nossa Missão</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                A Apoiêfy é estritamente uma provedora de tecnologia SaaS. Você organiza e é total responsável pela sua campanha. Nós fornecemos apenas o painel e os links. O dinheiro vai direto pra você via PIX. A taxa da plataforma é de R$ 14,90 por campanha ativada.r com ética, respeito e responsabilidade.
                            </p>
                        </div>
                    </div>

                    {/* Sections */}
                    {principles.map((section, i) => (
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

                    {/* Report Card */}
                    <div className="bg-foreground text-background rounded-2xl p-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="font-black text-sm uppercase tracking-widest text-primary/80">Canal de Denúncias</p>
                                <p className="font-black text-lg">Encontrou algo suspeito?</p>
                            </div>
                        </div>
                        <p className="text-background/70 text-sm font-medium leading-relaxed">
                            Se você identificou uma campanha fraudulenta ou qualquer uso indevido da plataforma, nos informe. Sua denúncia é confidencial e será investigada com prioridade.
                        </p>
                        <Button
                            className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-base gap-3 shadow-xl hover:scale-105 transition-transform"
                            onClick={() => window.open("https://wa.me/5521996567301", "_blank")}
                        >
                            <MessageCircle className="w-5 h-5 fill-current" /> Fazer uma Denúncia
                        </Button>
                    </div>

                    {/* Version */}
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            Apoiêfy — Código de Ética • Versão 1.1
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Revisado e atualizado regularmente pela equipe Apoiêfy.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white py-8 px-6 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary-foreground fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">Apoiêfy</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-muted-foreground">
                        <Link href="/termos" className="hover:text-primary-foreground transition-colors">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-primary-foreground transition-colors">Privacidade</Link>
                        <Link href="/etica" className="text-primary-foreground">Código de Ética</Link>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">© 2026 Apoiêfy</p>
                </div>
            </footer>
        </div>
    );
}