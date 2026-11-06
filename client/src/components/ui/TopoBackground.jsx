// client/src/components/ui/TopoBackground.jsx
export function TopoBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden bg-[#fafaf8]">
      {/* 
        This SVG string is drawn directly into the CSS. 
        No external files = No CORS errors = It will ALWAYS show up.
      */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='800' viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%236366f1' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M-100 200 Q 100 100 300 250 T 700 200 T 900 300' /%3E%3Cpath d='M-100 280 Q 100 180 300 330 T 700 280 T 900 380' /%3E%3Cpath d='M-100 360 Q 100 260 300 410 T 700 360 T 900 460' /%3E%3Cpath d='M-100 440 Q 100 340 300 490 T 700 440 T 900 540' /%3E%3Cpath d='M-100 520 Q 100 420 300 570 T 700 520 T 900 620' /%3E%3Cpath d='M-100 600 Q 100 500 300 650 T 700 600 T 900 700' /%3E%3Cpath d='M-100 680 Q 100 580 300 730 T 700 680 T 900 780' /%3E%3Cpath d='M200 -100 Q 300 150 150 400 T 250 800 T 150 900' /%3E%3Cpath d='M400 -100 Q 500 150 350 400 T 450 800 T 350 900' /%3E%3Cpath d='M600 -100 Q 700 150 550 400 T 650 800 T 550 900' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "800px 800px",
        }}
      />
      
      {/* Ambient Color Glows */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/10 blur-[120px] mix-blend-multiply" />
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-orange-400/10 blur-[100px] mix-blend-multiply" />
    </div>
  );
}