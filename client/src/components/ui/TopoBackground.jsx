export function TopoBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none -z-10 bg-[#fafaf8] overflow-hidden">
      {/* The Map Pattern - Much denser and accurate to Pookpit */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1200' height='1200' viewBox='0 0 1200 1200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23a1a1aa' stroke-width='1.2' fill='none'%3E%3Cpath d='M-100,100 C100,50 300,200 500,100 S800,300 1000,100 S1300,300 1400,100' /%3E%3Cpath d='M-100,180 C100,130 300,280 500,180 S800,380 1000,180 S1300,380 1400,180' /%3E%3Cpath d='M-100,260 C100,210 300,360 500,260 S800,460 1000,260 S1300,460 1400,260' /%3E%3Cpath d='M-100,340 C100,290 300,440 500,340 S800,540 1000,340 S1300,540 1400,340' /%3E%3Cpath d='M-100,420 C100,370 300,520 500,420 S800,620 1000,420 S1300,620 1400,420' /%3E%3Cpath d='M-100,500 C100,450 300,600 500,500 S800,700 1000,500 S1300,700 1400,500' /%3E%3Cpath d='M-100,580 C100,530 300,680 500,580 S800,780 1000,580 S1300,780 1400,580' /%3E%3Cpath d='M-100,660 C100,610 300,760 500,660 S800,860 1000,660 S1300,860 1400,660' /%3E%3Cpath d='M-100,740 C100,690 300,840 500,740 S800,940 1000,740 S1300,940 1400,740' /%3E%3Cpath d='M-100,820 C100,770 300,920 500,820 S800,1020 1000,820 S1300,1020 1400,820' /%3E%3Cpath d='M-100,900 C100,850 300,1000 500,900 S800,1100 1000,900 S1300,1100 1400,900' /%3E%3Cpath d='M-100,980 C100,930 300,1080 500,980 S800,1180 1000,980 S1300,1180 1400,980' /%3E%3Cpath d='M-100,1060 C100,1010 300,1160 500,1060 S800,1260 1000,1060 S1300,1260 1400,1060' /%3E%3Cpath d='M200,-100 C250,100 150,400 250,700 S350,1000 250,1300' /%3E%3Cpath d='M400,-100 C450,100 350,400 450,700 S550,1000 450,1300' /%3E%3Cpath d='M600,-100 C650,100 550,400 650,700 S750,1000 650,1300' /%3E%3Cpath d='M800,-100 C850,100 750,400 850,700 S950,1000 850,1300' /%3E%3Cpath d='M1000,-100 C1050,100 950,400 1050,700 S1150,1000 1050,1300' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "1200px 1200px",
        }}
      />
      {/* Ambient color glows */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-[#4f46e5]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-[#fb923c]/5 rounded-full blur-[100px]" />
    </div>
  );
}