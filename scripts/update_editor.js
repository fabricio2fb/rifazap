const fs = require('fs');
const file = 'src/app/admin/campanhas/[id]/editor/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Aspect Ratio State
if (!content.includes('const [aspectRatio, setAspectRatio] = useState("aspect-[4/3]");')) {
    content = content.replace(
        'const [cardRadius, setCardRadius] = useState(16);',
        'const [cardRadius, setCardRadius] = useState(16);\n    const [aspectRatio, setAspectRatio] = useState("aspect-[4/3]");'
    );
    content = content.replace(
        'setCardRadius(16);',
        'setCardRadius(16);\n        setAspectRatio("aspect-[4/3]");'
    );
}

// 2. Change Top wrapper and Topbar
content = content.replace(
    'className="flex flex-col h-full bg-[#F8F9FA] text-slate-900 overflow-hidden w-full"',
    'className="flex flex-col h-full bg-[#0c0c0e] text-white overflow-hidden w-full"'
);

const oldTopbarReg = /<div className="h-16 shrink-0 bg-\[#16161a\] border-b border-\[#2c2c35[\s\S]*?<\/div>\s*<\/div>/m;
const newTopbar = `<div className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 z-10 w-full overflow-x-auto shadow-sm">
                <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-700 hover:bg-slate-100 shrink-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 lg:gap-3 shrink-0 ml-4">
                    <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 h-9 font-semibold" onClick={resetEditor}>
                        <RotateCcw className="w-4 h-4 lg:mr-2" /> <span className="hidden lg:inline">Reset</span>
                    </Button>
                    <Button size="sm" className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold tracking-wide h-9" onClick={handleExport} disabled={exporting}>
                        {exporting ? <Loader2 className="w-4 h-4 lg:mr-2 animate-spin" /> : <Download className="w-4 h-4 lg:mr-2" />}
                        <span className="hidden lg:inline">BAIXAR PNG</span>
                        <span className="lg:hidden">BAIXAR</span>
                    </Button>
                </div>
            </div>`;
content = content.replace(oldTopbarReg, newTopbar);

// 3. Revert Sidebar Wrapper
const oldSidebarWrapperReg = /<aside className="w-full lg:w-\[450px\] bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col shrink-0 lg:overflow-hidden order-2 lg:order-1 relative z-20 shadow-\[10px_0_30px_rgba\(0,0,0,0\.03\)\]">/;
const newSidebarWrapper = `<aside className="w-full lg:w-[350px] bg-[#16161a] border-b lg:border-b-0 lg:border-r border-[#2c2c35] flex flex-col shrink-0 lg:overflow-hidden order-2 lg:order-1 relative z-20">`;
content = content.replace(oldSidebarWrapperReg, newSidebarWrapper);

// Change tab row wrapper
content = content.replace('bg-white z-10 w-full', 'bg-[#16161a] z-10 w-full');
// Change Tabs Content Wrapper
content = content.replace('custom-scrollbar bg-white', 'custom-scrollbar');
// Revert tabs styling
content = content.replace(/border-transparent text-slate-500 hover:text-slate-900/g, 'border-transparent text-slate-400 hover:text-white');

// Color picker border and background 
content = content.replace('w-10 h-10 p-0 border border-slate-200 bg-white rounded cursor-pointer shadow-sm', 'w-10 h-10 p-0 border border-[#2c2c35] bg-[#0c0c0e] rounded cursor-pointer shadow-sm');
content = content.replace('text-sm font-semibold text-slate-700">Customizada:', 'text-sm font-semibold text-slate-400">Customizada:');

// Specific Labels Light -> Dark
content = content.replace(/text-slate-700 font-bold mb-3 block/g, 'text-slate-400 font-bold mb-3 block');
content = content.replace(/text-slate-700 font-bold block/g, 'text-slate-400 font-bold block');
content = content.replace(/text-slate-700 font-bold mb-2 block/g, 'text-slate-400 font-bold mb-2 block');
content = content.replace(/text-sm font-semibold text-slate-700/g, 'text-[13px] font-semibold text-slate-300');

// Input and Buttons light -> dark
content = content.replace(/bg-white border-slate-300 text-slate-900 mb-2 font-medium/g, 'bg-[#0c0c0e] border-[#2c2c35] text-white mb-2 font-medium');
content = content.replace(/bg-slate-50 border-slate-300 text-xs/g, 'bg-[#0c0c0e] border-[#2c2c35] text-xs text-white');
content = content.replace(/bg-white border-slate-300 font-black text-slate-900/g, 'bg-[#0c0c0e] border-[#2c2c35] font-black text-white');
content = content.replace(/bg-white border-slate-300 text-slate-900 font-medium/g, 'bg-[#0c0c0e] border-[#2c2c35] text-white font-medium');
content = content.replace(/bg-slate-100 border-slate-200 text-slate-600/g, 'bg-[#111116] border-[#2c2c35] text-slate-400');
content = content.replace(/bg-white border-slate-300 font-bold text-slate-900/g, 'bg-[#0c0c0e] border-[#2c2c35] font-bold text-white');
content = content.replace(/bg-white border-slate-300 font-bold/g, 'bg-[#0c0c0e] border-[#2c2c35] font-bold text-white');

// Template Selector borders
content = content.replace(/border-slate-200 hover:border-slate-300/g, 'border-[#2c2c35] hover:border-[#3f3f46]');

// Append Aspect Ratio Editor block inside Design tab
const aspectControl = `
                                <div>
                                    <Label className="text-xs uppercase text-slate-400 mb-3 block">Proporção (Formato)</Label>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setAspectRatio("aspect-[1/1]")} className={\`font-bold \${aspectRatio === "aspect-[1/1]" ? "border-[#ff6b2b] text-[#ff6b2b] bg-[#111116]" : "border-[#2c2c35] bg-[#111116] text-[#a0a0ab] hover:bg-[#2c2c35] hover:text-white"}\`}>1:1</Button>
                                        <Button variant="outline" size="sm" onClick={() => setAspectRatio("aspect-[4/3]")} className={\`font-bold \${aspectRatio === "aspect-[4/3]" ? "border-[#ff6b2b] text-[#ff6b2b] bg-[#111116]" : "border-[#2c2c35] bg-[#111116] text-[#a0a0ab] hover:bg-[#2c2c35] hover:text-white"}\`}>4:3</Button>
                                        <Button variant="outline" size="sm" onClick={() => setAspectRatio("aspect-[9/16]")} className={\`font-bold \${aspectRatio === "aspect-[9/16]" ? "border-[#ff6b2b] text-[#ff6b2b] bg-[#111116]" : "border-[#2c2c35] bg-[#111116] text-[#a0a0ab] hover:bg-[#2c2c35] hover:text-white"}\`}>9:16</Button>
                                    </div>
                                </div>
                                `;
content = content.replace(
    /<div>\s*<Label className="text-xs uppercase text-slate-400 mb-2 block">Canto Arredondado/,
    aspectControl + '\n                                <div>\n                                    <Label className="text-xs uppercase text-slate-400 mb-2 block">Canto Arredondado'
);

// 4. Update the CSS for the 'apoiefy' theme
// First remove previously injected apoiefy CSS
content = content.replace(/\.card-theme-apoiefy {.*?}/g, '');
content = content.replace(/\.card-theme-apoiefy \.card-stat-box {[\s\S]*?}/g, '');

const originalThemeCSS = `
                        .card-theme-apoiefy { 
                            --card-bg: #f8fafc; 
                            --card-text: #0f172a;
                            background-color: #f6f7f9;
                            background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l-15 35h12l-6 25 20-30H29l8-30z' fill='%23eab308' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E");
                        }
                        .card-theme-apoiefy h2 { text-align: center; font-size: 3.5rem !important; margin-bottom: 0px; letter-spacing: 0px; font-weight: normal; }
                        
                        .card-theme-apoiefy .card-stat-box {
                            background: #ffffff !important;
                            border: none !important;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                            padding: 16px 20px !important;
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            gap: 16px;
                        }
                        .card-theme-apoiefy .card-stat-box span.opacity-60 { font-size: 10px; opacity: 0.5; font-weight: bold; }
                        .card-theme-apoiefy .card-stat-box span.text-lg { font-size: 24px; color: #1e293b; font-weight: normal; font-family: 'Plus Jakarta Sans', sans-serif;}
                        
                        .card-theme-apoiefy .c-progress-header span:first-child { color: #475569; opacity: 1; font-weight: 500; font-size: 14px; }
                        .card-theme-apoiefy .c-progress-bar-bg { background: #e2e8f0; height: 10px; border: none; }
                        
                        .card-theme-apoiefy .c-grid-wrapper {
                            background-color: #fbbf24 !important;
                            border: 4px solid #f59e0b !important;
                            border-radius: 20px !important;
                            padding: 24px !important;
                        }
 
                        .card-theme-apoiefy .c-ticket-box {
                            background: white !important;
                            color: #334155 !important;
                            border-radius: 6px !important;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                            border: 1px solid #e2e8f0;
                            font-size: 11px;
                            font-weight: 500;
                        }
                        .card-theme-apoiefy .c-ticket-box.is-reserved {
                            background: #f97316 !important;
                            color: white !important;
                            border: none;
                        }
                        .card-theme-apoiefy .c-ticket-box.is-paid {
                            background: #cbd5e1 !important;
                            color: #334155 !important;
                            border: none;
                        }
 
                        .card-theme-apoiefy .c-footer-cta {
                            font-family: 'Plus Jakarta Sans', sans-serif !important;
                            font-size: 1.6rem !important;
                            color: #0f172a !important;
                            font-weight: 600;
                            margin-top: 10px;
                        }
`;

content = content.replace(
    /\/\* RESPONSIVE SCALING \*\//,
    originalThemeCSS + '\n                        /* RESPONSIVE SCALING */'
);

// Inject logic into HTML classnames & wrapping
// Add aspect ratio to container class
content = content.replace(
    'className={`card-export-wrapper card-theme-${theme} w-[450px] shrink-0 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 mx-auto`}',
    'className={`card-export-wrapper card-theme-${theme} w-[450px] ${aspectRatio} shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden flex flex-col transition-all duration-300 mx-auto justify-between pt-8 pb-4`}'
);

content = content.replace(
    'className="bg-black/5 border border-black/5 p-4 rounded-xl"',
    'className="bg-black/5 border border-black/5 p-4 rounded-xl c-grid-wrapper"'
);

// Stat boxes restructuring
const statBoxesHTML = `
                                {/* 3 CAIXAS DE INFO - ADAPTADO PARA MOCKUP */}
                                {theme === 'apoiefy' ? (
                                    <div className="flex gap-4 px-2">
                                        <div className="card-stat-box flex-1">
                                            <div className="text-yellow-600 bg-yellow-100 p-2.5 rounded text-xl">🏆</div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] uppercase font-bold opacity-60">Valor da Cota</span>
                                                <span className="font-medium text-lg text-slate-800">{price}</span>
                                            </div>
                                        </div>
                                        <div className="card-stat-box flex-1">
                                            <div className="text-red-500 bg-red-100 p-2.5 rounded text-xl text-center leading-none">
                                                <div className="text-[8px] font-bold mx-auto border-b border-red-500 mb-0.5">JUL</div>
                                                <div className="font-bold text-[12px]">17</div>
                                            </div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[10px] uppercase font-bold opacity-60">Sorteio Dia</span>
                                                <span className="font-medium text-lg text-slate-800">{dateText.replace('Em Breve', "20/03/2007")}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <div className="card-stat-box flex-1 p-3 rounded-lg flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold opacity-60">Cota</span>
                                            <span className="font-bold text-lg leading-none">{price}</span>
                                        </div>
                                        <div className="card-stat-box flex-1 p-3 rounded-lg flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold opacity-60">Sorteio</span>
                                            <span className="font-bold text-lg leading-none">{dateText}</span>
                                        </div>
                                        <div className="card-stat-box flex-1 p-3 rounded-lg flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold opacity-60">Tickets</span>
                                            <span className="font-bold text-lg leading-none">{totalTickets}</span>
                                        </div>
                                    </div>
                                )}
`;

content = content.replace(
    /<div className="flex gap-3">[\s\S]*?<\/div>\s*<\/div>\s*{\/\* PROGRESSO \*\//,
    statBoxesHTML + '\n\n                                {/* PROGRESSO */'
);

// Progress Bar headers
content = content.replace(
    'className="flex justify-between items-end text-xs font-bold"',
    'className="flex justify-between items-end text-[13px] font-bold c-progress-header px-1"'
);

content = content.replace(
    'className="uppercase opacity-70">Progresso',
    'className="uppercase opacity-70 tracking-wide">{theme === "apoiefy" ? "Progresso da Rifa" : "Progresso"}'
);

content = content.replace(
    'className="h-2.5 w-full bg-black/10 rounded-full overflow-hidden border border-black/5"',
    'className="h-2.5 w-full bg-black/10 rounded-full overflow-hidden border border-black/5 c-progress-bar-bg"'
);

// Grid Tickets Logic
content = content.replace(
    'className="aspect-square flex justify-center items-center text-white text-[9px] sm:text-xs font-bold rounded shadow-sm"',
    'className={`aspect-square flex justify-center items-center text-white text-[9px] sm:text-xs font-bold rounded shadow-sm c-ticket-box ${realTicketsMap[num] === "paid" ? "is-paid" : realTicketsMap[num] === "reserved" ? "is-reserved" : ""}`}'
);

// Bottom Footer specific text for apoiefy theme
content = content.replace(
    'className="card-bebas text-3xl"',
    'className="card-bebas text-3xl c-footer-cta"'
);

content = content.replace(
    '<div className="text-[10px] font-bold uppercase opacity-50 tracking-widest">\n                                        COMPRA SEGURA • PAGAMENTO VIA PIX\n                                    </div>',
    '<div className="text-[11px] mt-1 font-bold uppercase opacity-60 tracking-wider text-slate-700">\n                                        SORTEIO DIA: {dateText}\n                                    </div>\n                                    <div className="text-[9px] font-bold uppercase opacity-50 tracking-widest text-slate-500 mt-1">\n                                        COMPRA SEGURA • PAGAMENTO VIA SITE\n                                    </div>'
);

// Legend colors formatting fix
content = content.replace(
    'className="flex items-center justify-center gap-4 mb-4 text-[11px] font-bold opacity-80"',
    'className="flex items-center justify-center gap-6 mb-4 text-[13px] font-semibold opacity-90 text-slate-800"'
);

content = content.replace(
    '<div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>Livre',
    '<div className="w-3.5 h-3.5 rounded-full bg-green-500"></div>Livre'
);
content = content.replace(
    '<div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>Reserv.',
    '<div className="w-3.5 h-3.5 rounded-full bg-orange-500"></div>Reservado'
);
content = content.replace(
    '<div className="w-2.5 h-2.5 rounded-full bg-slate-500"></div>Pago',
    '<div className="w-3.5 h-3.5 rounded-full bg-slate-300"></div>Pago'
);

fs.writeFileSync(file, content);
console.log('Script ran successfully');
