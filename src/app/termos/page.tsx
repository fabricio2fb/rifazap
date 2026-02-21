"use client";

import { Zap, ArrowLeft, Shield, FileText, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Aceitação dos Termos e Natureza do Serviço",
        icon: <CheckCircle2 className="w-5 h-5" />,
        content: `Ao acessar a TicketOn, você concorda integrante com estes Termos de Uso. A TicketOn é uma plataforma em formato SaaS (Software as a Service) que fornece exclusivamente tecnologia para organização e gestão digital de campanhas online. 

Na descrição da nossa atividade, ressaltamos que somos focados na tecnologia: fornecemos painéis e links gerados automaticamente. Não atuamos como promotores de campanhas.`
    },
    {
        id: "02",
        title: "Limitações da Plataforma",
        icon: <Zap className="w-5 h-5" />,
        content: `A TicketOn fornece apenas tecnologia para a gestão digital. A plataforma não realiza sorteios, concursos ou ações promocionais próprias. 

Ademais, a TicketOn não intermedia pagamentos entre usuários. Nossa infraestrutura apenas facilita a exibição das chaves de pagamento, mas não atua como processadora de transações financeiras. 

A plataforma não recebe, retém ou transaciona valores monetários vinculados aos números ou metas das campanhas criadas por terceiros. A TicketOn não participa da relação financeira entre o criador e os participantes.`
    },
    {
        id: "03",
        title: "Responsabilidade Exclusiva do Criador",
        icon: <AlertCircle className="w-5 h-5" />,
        content: `Toda a responsabilidade sobre a veracidade das informações, as promessas efetuadas, a realização de eventuais apurações, as entregas e a distribuição de bens ou prêmios é exclusivamente do criador (organizador) da campanha.

Os participantes devem contatar diretamente o organizador para a resolução de dúvidas, cobranças ou exigências relativas ao cumprimento do que foi anunciado.`
    },
    {
        id: "04",
        title: "Atividades Proibidas e Suspensão",
        icon: <Shield className="w-5 h-5" />,
        content: `É terminantemente proibido utilizar a infraestrutura da TicketOn para atividades ilegais, jogos de azar não autorizados, fraudes, lavagem de capital ou qualquer tipo de prática enganosa. 

A TicketOn detém o direito irrevogável de suspender, bloquear ou remover integralmente contas e campanhas que, a seu exclusivo critério, violem estas regras ou apresentem indícios de irregularidade, sem a necessidade de aviso prévio.`
    },
    {
        id: "05",
        title: "Registro de Logs e Conformidade",
        icon: <FileText className="w-5 h-5" />,
        content: `A plataforma registra e mantém logs de acesso, horários de criação, IPs de registro e vinculação de dispositivos para fins estritos de segurança da comunidade. Caso requisitado por uma autoridade policial ou judicial competente, a plataforma cooperará plenamente, fornecendo todas as informações e registros logs de campanhas suspeitas.`
    },
    {
        id: "06",
        title: "Limitação de Responsabilidade e Isenção de Disputas",
        icon: <AlertCircle className="w-5 h-5" />,
        content: `Em máxima extensão permitida pelas leis brasileiras aplicáveis, a TicketOn será eximida de qualquer responsabilidade de danos diretos, indiretos ou consequenciais sofridos por falhas no sistema, ação de terceiros ou expectativa não atendida.

Em caso de disputa ou litígio entre o criador de uma campanha e os seus participantes ou compradores, a TicketOn e seus operadores legais estão totalmente isentos de qualquer culpa, demanda ou responsabilização. A cobrança legal deve ser feita entre as partes envolvidas diretamente na promessa do evento.`
    },
    {
        id: "07",
        title: "Canal de Denúncia",
        icon: <MessageCircle className="w-5 h-5" />,
        content: `A TicketOn leva a segurança do nosso ambiente com absoluta seriedade. Disponibilizamos um canal de denúncia para relatar campanhas que violem as nossas diretrizes, apresentem forte indício de fraude ou descumpram o Código de Defesa do Consumidor.

Para realizar uma denúncia de uma campanha suspeita, utilize o botão de "Denunciar Campanha" localizado no rodapé do anúncio da própria ação ou envie um e-mail com as provas e o link da página para denuncia@ticketon.com.br.`
    }
];

export default function TermosPage() {
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
                        <FileText className="w-4 h-4" />
                        Documento Legal
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-primary-foreground tracking-tight">
                        Termos de Uso
                    </h1>
                    <p className="text-primary-foreground/80 font-medium max-w-xl mx-auto">
                        Leia com atenção antes de utilizar a plataforma. Última atualização: Janeiro de 2025.
                    </p>
                </div>
            </section>

            {/* Content */}
            <main className="flex-1 py-16 px-6">
                <div className="container mx-auto max-w-3xl space-y-6">

                    {/* Intro Card */}
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-2xl p-6 flex gap-4 items-start">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <p className="font-black text-sm uppercase tracking-widest text-primary-foreground mb-1">Resumo Simples</p>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                A TicketOn é uma plataforma digital. Você organiza e é responsável pela sua campanha. Nós fornecemos a tecnologia. O dinheiro vai direto pra você via PIX. A taxa da plataforma é de R$ 9,90 por campanha ativada.
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

                    {/* Last Updated */}
                    <div className="text-center py-8 space-y-2">
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
                            TicketOn — Termos de Uso • Versão 1.1
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Dúvidas? Entre em contato com nosso suporte via WhatsApp.
                        </p>
                    </div>
                </div>
            </main>

            {/* CTA Footer */}
            <section className="py-12 px-6 bg-foreground text-background">
                <div className="container mx-auto text-center space-y-6">
                    <p className="text-lg font-black">Ainda tem dúvidas sobre os termos?</p>
                    <Button className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-3 shadow-xl hover:scale-105 transition-transform">
                        <MessageCircle className="w-5 h-5 fill-current" /> Falar com Suporte
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-8 px-6 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary-foreground fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">TicketOn</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-muted-foreground">
                        <Link href="/termos" className="text-primary-foreground">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-primary-foreground transition-colors">Privacidade</Link>
                        <Link href="/etica" className="hover:text-primary-foreground transition-colors">Código de Ética</Link>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">© 2026 TicketOn</p>
                </div>
            </footer>
        </div>
    );
}