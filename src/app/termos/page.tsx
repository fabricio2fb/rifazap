"use client";

import { Zap, ArrowLeft, Shield, FileText, AlertCircle, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const sections = [
    {
        id: "01",
        title: "Natureza do Serviço e Aceitação",
        icon: <CheckCircle2 className="w-5 h-5" />,
        content: `Ao acessar a Apoiêfy, você concorda integralmente com estes Termos de Uso. A Apoiêfy é fornecedora exclusivamente de tecnologia em formato SaaS (Software as a Service) para a gestão de campanhas digitais.
A Apoiêfy não atua como intermediadora financeira, instituição de pagamento ou custodiante de valores. Todos os valores arrecadados são enviados diretamente para a conta do organizador por meio de ferramentas de cobrança de terceiros (ex.: PIX ou outro método escolhido), sem qualquer retenção, custódia ou intervenção da Apoiêfy.`
    },
    {
        id: "02",
        title: "Provedores de Pagamento e Taxa de Software",
        icon: <Zap className="w-5 h-5" />,
        content: `O processamento de pagamentos na plataforma é realizado estritamente por provedores externos (ex: Mercado Pago, gateways, PIX). A Apoiêfy não armazena dados completos de cartão de crédito.
O único pagamento recebido pela Apoiêfy via gateway é exclusivamente referente à taxa de licença/ativação do software. O valor arrecadado com as campanhas vai diretamente ao organizador via PIX ou meio por ele escolhido. Eventuais bloqueios, chargebacks ou retenções de saldo pelo gateway recebedor são de exclusiva responsabilidade do processador financeiro utilizado.`
    },
    {
        id: "03",
        title: "Responsabilidade Exclusiva do Organizador",
        icon: <AlertCircle className="w-5 h-5" />,
        content: `O organizador é integralmente responsável pelo conteúdo, legalidade, e cumprimento das promessas de cada campanha criada na plataforma. 
A Apoiêfy não valida a entrega de prêmios ou os bens ofertados. A plataforma atua apenas como espelho tecnológico do evento. Temos o direito de suspender ou banir imediatamente campanhas que violem a legislação vigente, promovam atividades fraudulentas ou apresentem indícios de irregularidades, sem aviso prévio.`
    },
    {
        id: "04",
        title: "Limitação de Responsabilidade e Isenções",
        icon: <Shield className="w-5 h-5" />,
        content: `A Apoiêfy limita sua responsabilidade legal exclusivamente à disponibilidade técnica e manutenção da sua própria plataforma de software (falhas técnicas próprias). 
Em nenhuma hipótese a plataforma, seus sócios ou representantes serão responsabilizados por atos de terceiros, uso indevido da ferramenta pelos organizadores, prejuízos financeiros em campanhas, disputas entre participantes e criadores ou lucros cessantes.`
    },
    {
        id: "05",
        title: "Cancelamento e Reembolso",
        icon: <FileText className="w-5 h-5" />,
        content: `A taxa paga à Apoiêfy refere-se unicamente ao serviço digital de ativação e licenciamento da infraestrutura de software no momento da criação da campanha.
Uma vez que o software tenha sido ativado e disponibilizado para uso, a prestação do serviço digital é considerada concluída e consumida. Portanto, não haverá reembolso da taxa de ativação em casos de arrependimento posterior, cancelamento da campanha por parte do organizador ou suspensão por violação dos nossos Termos de Uso.`
    },
    {
        id: "06",
        title: "Código de Ética e Uso Responsável",
        icon: <Shield className="w-5 h-5" />,
        content: `A plataforma exige conduta ética de todos os seus usuários. É terminantemente proibido o uso da Apoiêfy para atividades ilícitas, crimes, lavagem de dinheiro, ou ações que violem leis vigentes.
O organizador compromete-se a atuar com transparência e honestidade. Quaisquer indícios de fraude, manipulação de resultados ou descumprimento intencional da entrega do prêmio resultarão no banimento imediato e definitivo da conta, bem como reporte às autoridades competentes se aplicável.`
    },
    {
        id: "07",
        title: "Canal de Denúncia",
        icon: <MessageCircle className="w-5 h-5" />,
        content: `A Apoiêfy leva a segurança do nosso ambiente com absoluta seriedade. Disponibilizamos um canal de denúncia para relatar campanhas que violem as nossas diretrizes, apresentem forte indício de fraude ou descumpram o Código de Defesa do Consumidor.
Para realizar uma denúncia de uma campanha suspeita, utilize o botão de "Denunciar Campanha" localizado no rodapé do anúncio da própria ação ou envie um e-mail com as provas para denuncia@apoiêfy.com.br.`
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
                                A Apoiêfy é uma plataforma digital. Você organiza e é responsável pela sua campanha. Nós fornecemos a tecnologia. O dinheiro vai direto pra você via PIX. A taxa da plataforma é de R$ 14,90 por campanha ativada.
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
                            Apoiêfy — Termos de Uso • Versão 1.1
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
                    <Button
                        className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black text-lg gap-3 shadow-xl hover:scale-105 transition-transform"
                        onClick={() => window.open("https://wa.me/5521996567301", "_blank")}
                    >
                        <MessageCircle className="w-5 h-5 fill-current" /> Falar com Suporte
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-8 px-6 border-t">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary-foreground fill-primary" />
                        <span className="text-xl font-bold tracking-tighter">Apoiêfy</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold text-muted-foreground">
                        <Link href="/termos" className="text-primary-foreground">Termos de Uso</Link>
                        <Link href="/privacidade" className="hover:text-primary-foreground transition-colors">Privacidade</Link>
                        <Link href="/etica" className="hover:text-primary-foreground transition-colors">Código de Ética</Link>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">© 2026 Apoiêfy</p>
                </div>
            </footer>
        </div>
    );
}