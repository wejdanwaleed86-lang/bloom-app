import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════
// DESIGN SYSTEM
// ═══════════════════════════════════════
const C = {
  // Neutrals
  n950: "#0F0F0F",
  n900: "#1A1A1A",
  n800: "#2D2D2D",
  n600: "#6B6B6B",
  n400: "#ABABAB",
  n200: "#E8E8E8",
  n100: "#F5F5F5",
  n50:  "#FAFAFA",
  white:"#FFFFFF",
  // Brand
  rose: "#B06070",
  roseL:"#C8909A",
  roseXS:"#F5ECED",
  gold: "#9A7B3E",
  goldS:"#F0E8D8",
  // Semantic
  green:"#3A7D5A",
  blue: "#3A6A9A",
  red:  "#B05050",
};
const rG = `linear-gradient(135deg,${C.rose},${C.roseL})`;
const gG = `linear-gradient(135deg,${C.gold},#C4A060)`;
const BG = "#F8F6F4";
const FN = `"Inter","Plus Jakarta Sans",-apple-system,sans-serif`;

const card = (ex={}) => ({
  background: C.white,
  borderRadius: 14,
  border: `1px solid ${C.n200}`,
  boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
  ...ex,
});

const FL = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    * { font-family: ${FN}; box-sizing: border-box; margin:0; padding:0; }
    ::-webkit-scrollbar { display:none; }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes up { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .up { animation: up .3s ease both; }
    input,button,textarea { font-family: ${FN}; }
  `}</style>
);

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════
const WEEK = [
  {js:5, ar:"الجمعة",   en:"Friday",    s:"Fri", type:"rest"},
  {js:6, ar:"السبت",    en:"Saturday",  s:"Sat", type:"push"},
  {js:0, ar:"الأحد",   en:"Sunday",    s:"Sun", type:"cardio"},
  {js:1, ar:"الاثنين", en:"Monday",    s:"Mon", type:"pull"},
  {js:2, ar:"الثلاثاء",en:"Tuesday",   s:"Tue", type:"cardio"},
  {js:3, ar:"الأربعاء",en:"Wednesday", s:"Wed", type:"legs"},
  {js:4, ar:"الخميس",  en:"Thursday",  s:"Thu", type:"cardio"},
];

const WK = {
  push:{ar:"الدفع",en:"Push",icon:"↑",color:C.rose,grad:rG,ex:[
    {n:"Chest Press",    ar:"ضغط الصدر",       s:4,r:"12-15",m:"Chest"},
    {n:"Pec Deck",       ar:"فراشة الصدر",     s:3,r:"12-15",m:"Chest"},
    {n:"Shoulder Press", ar:"ضغط الأكتاف",     s:3,r:"12",   m:"Shoulders"},
    {n:"Lateral Raise",  ar:"رفرفة جانبية",    s:3,r:"15",   m:"Shoulders"},
    {n:"Tricep Pushdown",ar:"تمديد الترايسبس", s:3,r:"12-15",m:"Triceps"},
  ]},
  pull:{ar:"السحب",en:"Pull",icon:"↓",color:"#6B70B0",grad:"linear-gradient(135deg,#6B70B0,#9098C8)",ex:[
    {n:"Lat Pulldown",   ar:"سحب علوي",    s:4,r:"12-15",m:"Back"},
    {n:"Seated Row",     ar:"تجديف جلوس",  s:3,r:"12-15",m:"Back"},
    {n:"Rear Delt",      ar:"كتف خلفي",    s:3,r:"15",   m:"Shoulders"},
    {n:"Face Pull",      ar:"سحب للوجه",   s:3,r:"15",   m:"Shoulders"},
    {n:"Bicep Curl",     ar:"شد البايسبس", s:3,r:"12",   m:"Biceps"},
  ]},
  legs:{ar:"الأرجل",en:"Legs",icon:"◇",color:"#507090",grad:"linear-gradient(135deg,#507090,#7898B0)",ex:[
    {n:"Leg Press",    ar:"بريس الأرجل",  s:4,r:"12-15",m:"Quads"},
    {n:"Leg Extension",ar:"فرد الأرجل",    s:3,r:"15",   m:"Quads"},
    {n:"Leg Curl",     ar:"ثني الأرجل",    s:3,r:"15",   m:"Hamstrings"},
    {n:"Hip Thrust",   ar:"رفع المؤخرة",   s:4,r:"12-15",m:"Glutes"},
    {n:"Abductor",     ar:"تبعيد الخفسة",  s:3,r:"15",   m:"Glutes"},
    {n:"Adductor",     ar:"تقريب الفخذ",   s:3,r:"15",   m:"Inner Thigh"},
    {n:"Kickback",     ar:"ركلة المؤخرة",  s:3,r:"15",   m:"Glutes"},
    {n:"Calf Raise",   ar:"تمرين السمانة", s:3,r:"20",   m:"Calves"},
  ]},
};

const PRAYERS = [
  {k:"fajr",   ar:"الفجر",  en:"Fajr",    icon:"◐",t:"05:00"},
  {k:"dhuhr",  ar:"الظهر",  en:"Dhuhr",   icon:"○",t:"12:30"},
  {k:"asr",    ar:"العصر",  en:"Asr",     icon:"◑",t:"15:45"},
  {k:"maghrib",ar:"المغرب", en:"Maghrib", icon:"●",t:"18:20"},
  {k:"isha",   ar:"العشاء", en:"Isha",    icon:"◉",t:"19:45"},
];

const ADHKAR = [
  {k:"subhan", ar:"سبحان الله",          en:"SubhanAllah",      n:33,c:"#6B70B0"},
  {k:"hamd",   ar:"الحمد لله",            en:"Alhamdulillah",    n:33,c:C.rose},
  {k:"akbar",  ar:"الله أكبر",            en:"Allahu Akbar",     n:33,c:"#507090"},
  {k:"tahleel",ar:"لا إله إلا الله",      en:"La ilaha illallah",n:10,c:C.green},
  {k:"salah",  ar:"اللهم صلِّ على النبي", en:"Allahumma Salli",  n:10,c:C.gold},
];

const QP = [
  {y:1,ar:"العام الأول",  su:"البقرة",          c:C.gold,
   months:[
    {m:1, v:"1–29",   wk:[{w:1,v:"1–5"},{w:2,v:"6–16"},{w:3,v:"17–24"},{w:4,v:"25–29"}]},
    {m:2, v:"30–61",  wk:[{w:1,v:"30–40"},{w:2,v:"41–52"},{w:3,v:"53–61"},{w:4,v:"مراجعة"}]},
    {m:3, v:"62–88",  wk:[{w:1,v:"62–71"},{w:2,v:"72–82"},{w:3,v:"83–88"},{w:4,v:"مراجعة"}]},
    {m:4, v:"89–112", wk:[{w:1,v:"89–99"},{w:2,v:"100–109"},{w:3,v:"110–112"},{w:4,v:"مراجعة"}]},
    {m:5, v:"113–141",wk:[{w:1,v:"113–121"},{w:2,v:"122–131"},{w:3,v:"132–141"},{w:4,v:"مراجعة"}]},
    {m:6, v:"142–169",wk:[{w:1,v:"142–152"},{w:2,v:"153–162"},{w:3,v:"163–169"},{w:4,v:"مراجعة"}]},
    {m:7, v:"170–190",wk:[{w:1,v:"170–177"},{w:2,v:"178–183"},{w:3,v:"184–190"},{w:4,v:"مراجعة"}]},
    {m:8, v:"191–215",wk:[{w:1,v:"191–203"},{w:2,v:"204–210"},{w:3,v:"211–215"},{w:4,v:"مراجعة"}]},
    {m:9, v:"216–233",wk:[{w:1,v:"216–221"},{w:2,v:"222–228"},{w:3,v:"229–233"},{w:4,v:"مراجعة"}]},
    {m:10,v:"234–252",wk:[{w:1,v:"234–242"},{w:2,v:"243–248"},{w:3,v:"249–252"},{w:4,v:"مراجعة"}]},
    {m:11,v:"253–269",wk:[{w:1,v:"253–260"},{w:2,v:"261–265"},{w:3,v:"266–269"},{w:4,v:"مراجعة"}]},
    {m:12,v:"270–286",wk:[{w:1,v:"270–276"},{w:2,v:"277–282"},{w:3,v:"283–286"},{w:4,v:"مراجعة"}]},
   ]},
  ...["آل عمران","النساء","المائدة","الأنعام","الأعراف","الكهف","مريم","طه","الأحزاب","ق–الناس"]
    .map((su,i)=>({y:i+2,ar:`العام ${["الثاني","الثالث","الرابع","الخامس","السادس","السابع","الثامن","التاسع","العاشر"][i]}`,su,c:[C.rose,"#6B70B0","#507090",C.green,C.blue,C.gold,C.rose,"#6B70B0","#507090",C.gold][i],months:Array.from({length:12},(_,j)=>({m:j+1,v:`الشهر ${j+1}`,wk:[{w:1,v:"أسبوع 1"},{w:2,v:"أسبوع 2"},{w:3,v:"أسبوع 3"},{w:4,v:"مراجعة"}]}))})),
];

// ═══════════════════════════════════════
// STORAGE + AI
// ═══════════════════════════════════════
const LS = {
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};
const SS = {
  get:(k,d)=>{try{const v=sessionStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{sessionStorage.setItem(k,JSON.stringify(v));}catch{}},
};

async function ask(sys,usr,max=600){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:max,system:sys,messages:[{role:"user",content:usr}]})
  });
  const d=await r.json();
  return d.content?.[0]?.text||"";
}

// ═══════════════════════════════════════
// ATOMS
// ═══════════════════════════════════════
const Label = ({children,sub}) => (
  <div style={{marginBottom:16}}>
    <p style={{fontSize:11,fontWeight:600,color:C.n600,letterSpacing:"0.08em",textTransform:"uppercase"}}>{children}</p>
    {sub&&<p style={{fontSize:13,color:C.n600,marginTop:2}}>{sub}</p>}
  </div>
);

const Ring = ({val,max,size=72,sw=6,color=C.rose,label,sub}) => {
  const pct=Math.min(100,Math.round((val/Math.max(1,max))*100));
  const r=(size/2)-sw; const c=2*Math.PI*r;
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.n200} strokeWidth={sw}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
            strokeLinecap="round" strokeDasharray={`${(pct/100)*c} ${c}`}
            style={{transition:"stroke-dasharray .5s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:size>70?15:11,fontWeight:700,color:C.n900}}>{val}</span>
          {sub&&<span style={{fontSize:8,color:C.n600,marginTop:1}}>{sub}</span>}
        </div>
      </div>
      {label&&<span style={{fontSize:10,fontWeight:500,color:C.n600}}>{label}</span>}
    </div>
  );
};

const Check = ({done,onToggle,color=C.rose,size=28}) => (
  <div onClick={onToggle} style={{
    width:size,height:size,borderRadius:size/3.5,flexShrink:0,cursor:"pointer",
    border:`1.5px solid ${done?color:C.n300}`,
    background:done?color:"transparent",
    display:"flex",alignItems:"center",justifyContent:"center",
    transition:"all .2s",
  }}>
    {done&&<svg width={size*.45} height={size*.45} viewBox="0 0 12 10" fill="none">
      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>}
  </div>
);

const Row = ({label,sub,done,onToggle,color=C.rose}) => (
  <div onClick={onToggle} style={{
    display:"flex",alignItems:"center",gap:12,padding:"13px 0",
    borderBottom:`1px solid ${C.n100}`,cursor:"pointer",
  }}>
    <Check done={done} onToggle={onToggle} color={color}/>
    <div style={{flex:1}}>
      <p style={{fontSize:14,fontWeight:500,color:done?C.n400:C.n900,textDecoration:done?"line-through":"none"}}>{label}</p>
      {sub&&<p style={{fontSize:11,color:C.n400,marginTop:1}}>{sub}</p>}
    </div>
    <div style={{width:6,height:6,borderRadius:"50%",background:done?color:C.n200,flexShrink:0}}/>
  </div>
);

const Btn = ({label,onClick,disabled,variant="primary",sm}) => {
  const styles = {
    primary:{background:disabled?"#E0E0E0":rG,color:disabled?C.n400:C.white,border:"none",boxShadow:disabled?"none":"0 2px 12px rgba(176,96,112,.3)"},
    outline:{background:"transparent",color:C.rose,border:`1.5px solid ${C.rose}`,boxShadow:"none"},
    ghost:{background:"transparent",color:C.n600,border:`1.5px solid ${C.n200}`,boxShadow:"none"},
    danger:{background:"transparent",color:C.red,border:`1.5px solid rgba(176,80,80,.3)`,boxShadow:"none"},
  };
  const s=styles[variant]||styles.primary;
  return(
    <button onClick={onClick} disabled={disabled} style={{
      width:sm?"auto":"100%",padding:sm?"8px 20px":"13px 0",borderRadius:50,
      fontWeight:600,fontSize:sm?13:15,cursor:disabled?"not-allowed":"pointer",
      transition:"all .2s",...s,
    }}>{label}</button>
  );
};

const Field = ({val,onChange,ph,type="text",onEnter,dir="rtl"}) => (
  <input type={type} value={val} onChange={e=>onChange(e.target.value)}
    placeholder={ph} onKeyDown={e=>e.key==="Enter"&&onEnter&&onEnter()}
    style={{width:"100%",padding:"11px 14px",borderRadius:10,
      border:`1.5px solid ${C.n200}`,background:C.white,
      fontSize:14,color:C.n900,outline:"none",direction:dir,
      transition:"border-color .2s",}}
    onFocus={e=>e.target.style.borderColor=C.roseL}
    onBlur={e=>e.target.style.borderColor=C.n200}
  />
);

// ═══════════════════════════════════════
// SETUP
// ═══════════════════════════════════════
function Setup({onDone}){
  const [step,setStep]=useState(0);
  const [lang,setLang]=useState("ar");
  const [form,setForm]=useState({name:"",age:"",height:"",weight:"",goal:"",mealType:"",wantSnack:"",issues:"",bfPref:"",luPref:"",diPref:""});
  const [sched,setSched]=useState({5:"rest",6:"push",0:"cardio",1:"pull",2:"cardio",3:"legs",4:"cardio"});
  const [loading,setLoading]=useState(false);
  const [lStep,setLStep]=useState(0);
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const iA=lang==="ar";

  const ok=()=>{
    if(step===0)return true;
    if(step===1)return form.name.trim().length>0;
    if(step===2)return form.age&&form.height&&form.weight;
    if(step===3)return form.goal;
    if(step===4)return form.mealType;
    if(step===5)return form.wantSnack;
    if(step===6)return true;
    if(step===7)return form.bfPref.trim().length>0;
    if(step===8)return form.luPref.trim().length>0;
    if(step===9)return form.diPref.trim().length>0;
    return true;
  };

  const go=async()=>{
    if(step<10){setStep(s=>s+1);return;}
    const w=parseFloat(form.weight),h=parseFloat(form.height),a=parseFloat(form.age);
    const bmr=10*w+6.25*h-5*a-161,tdee=Math.round(bmr*1.375);
    const target=tdee-(form.goal==="0.5"?550:1000);
    setLoading(true);setLStep(0);
    const ck=`bloom_v1_${lang}`;
    const cached=SS.get(ck,null);
    let diet="",mot="";
    if(cached){
      for(let i=1;i<=3;i++){setLStep(i);await new Promise(r=>setTimeout(r,350));}
      diet=cached.diet;mot=cached.mot;
    }else{
      const sA="أنتِ أخصائية تغذية محترفة. اكتبي بالعربية الفصحى فقط — ممنوع أي كلمة إنجليزية. لا تكرري نفس الطعام. خطة متنوعة واحترافية. حددي السعرات لكل وجبة.";
      const sE="Professional nutritionist. Write in English only — no Arabic. Never repeat foods. Varied professional plan. Include calories per meal.";
      const mA=`صممي خطة أكل يومية لـ${form.name}، ${form.age} سنة، طول ${form.height}سم، وزن ${form.weight}كجم. هدف إنقاص ${form.goal}كجم أسبوعياً. نظام: ${form.mealType==="if"?"صيام متقطع 16:8":"3 وجبات"}. سناك: ${form.wantSnack==="yes"?"نعم":"لا"}. مشاكل: ${form.issues||"لا يوجد"}. الفطور: ${form.bfPref}. الغداء: ${form.luPref}. العشاء: ${form.diPref}. السعرات المستهدفة: ${target}. اكتبي بالعربية فقط.`;
      const mE=`Design a daily meal plan for ${form.name}, ${form.age}yo, ${form.height}cm, ${form.weight}kg. Lose ${form.goal}kg/week. Plan: ${form.mealType==="if"?"IF 16:8":"3 meals"}. Snack: ${form.wantSnack==="yes"?"yes":"no"}. Issues: ${form.issues||"none"}. Breakfast pref: ${form.bfPref}. Lunch: ${form.luPref}. Dinner: ${form.diPref}. Target: ${target} kcal. English only.`;
      setLStep(1);
      diet=await ask(iA?sA:sE,iA?mA:mE,800);
      setLStep(2);
      mot=await ask(
        iA?"مدربة تحفيز للمرأة. جملة تحفيزية واحدة قصيرة بالعربية فقط.":"Motivational coach. One short motivating sentence in English only.",
        iA?`حفّزي ${form.name} اللي تبدأ رحلتها الصحية.`:`Motivate ${form.name} starting her wellness journey.`,80
      );
      setLStep(3);
      SS.set(ck,{diet,mot});
    }
    await new Promise(r=>setTimeout(r,400));
    const profile={...form,tdee,target,lang};
    LS.set("bloom_profile",profile);LS.set("bloom_sched",sched);
    LS.set("bloom_diet",diet);LS.set("bloom_mot",mot);
    onDone(profile,sched,diet,mot);
  };

  if(loading)return(
    <div style={{minHeight:"100vh",background:BG,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 32px",direction:iA?"rtl":"ltr"}}>
      <FL/>
      <div style={{width:48,height:48,borderRadius:"50%",border:`3px solid ${C.roseL}`,borderTopColor:"transparent",animation:"spin 1s linear infinite",marginBottom:32}}/>
      <h2 style={{fontSize:20,fontWeight:700,color:C.n900,marginBottom:6}}>{iA?"جاري التحضير...":"Preparing..."}</h2>
      <p style={{fontSize:13,color:C.n600,marginBottom:36,textAlign:"center"}}>{iA?"نصمم برنامجك الشخصي":"Designing your personal plan"}</p>
      <div style={{width:"100%",maxWidth:280,background:C.n200,borderRadius:50,height:3,overflow:"hidden",marginBottom:20}}>
        <div style={{width:`${((lStep+1)/4)*100}%`,height:"100%",background:rG,borderRadius:50,transition:"width .5s ease"}}/>
      </div>
      {["حساب السعرات","تصميم خطة الأكل","كتابة رسالتك","جاهز ✓"].map((s,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,opacity:i<=lStep?1:.3,transition:"opacity .4s"}}>
          <div style={{width:18,height:18,borderRadius:"50%",background:i<lStep?C.green:i===lStep?C.rose:C.n200,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {i<lStep&&<svg width={10} height={8} viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            {i===lStep&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
          </div>
          <span style={{fontSize:13,color:i<=lStep?C.n900:C.n400,fontWeight:i===lStep?600:400}}>{iA?s:["Calculating calories","Designing meal plan","Writing your message","Done ✓"][i]}</span>
        </div>
      ))}
    </div>
  );

  const opt=(k,val,title,sub)=>(
    <div onClick={()=>f(k,val)} style={{...card(),padding:"15px 18px",cursor:"pointer",marginBottom:10,
      border:`1.5px solid ${form[k]===val?C.rose:C.n200}`,
      background:form[k]===val?C.roseXS:C.white,transition:"all .2s"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><p style={{fontWeight:600,fontSize:14,color:C.n900}}>{title}</p>{sub&&<p style={{fontSize:12,color:C.n600,marginTop:3}}>{sub}</p>}</div>
        <div style={{width:18,height:18,borderRadius:"50%",border:`1.5px solid ${form[k]===val?C.rose:C.n300}`,background:form[k]===val?C.rose:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {form[k]===val&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
        </div>
      </div>
    </div>
  );

  const STEPS=[
    {t:"Choose Language / اختاري اللغة",body:(
      <div style={{display:"flex",flexDirection:"column",gap:10,direction:"ltr"}}>
        {[["ar","العربية","Arabic"],["en","English","إنجليزي"]].map(([v,lb,su])=>(
          <div key={v} onClick={()=>setLang(v)} style={{...card(),padding:"16px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,
            border:`1.5px solid ${lang===v?C.rose:C.n200}`,background:lang===v?C.roseXS:C.white,transition:"all .2s"}}>
            <div style={{width:40,height:40,borderRadius:10,background:lang===v?rG:C.n100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:lang===v?C.white:C.n600}}>{v==="ar"?"ع":"A"}</div>
            <div style={{flex:1}}><p style={{fontWeight:600,fontSize:15,color:C.n900}}>{lb}</p><p style={{fontSize:12,color:C.n600,marginTop:1}}>{su}</p></div>
            {lang===v&&<svg width={18} height={18} viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8.25" stroke={C.rose} strokeWidth="1.5"/><path d="M5.5 9l2.5 2.5L13 6" stroke={C.rose} strokeWidth="1.5" strokeLinecap="round"/></svg>}
          </div>
        ))}
      </div>
    )},
    {t:iA?"الاسم":"Your Name",body:<Field val={form.name} onChange={v=>f("name",v)} ph={iA?"اسمك...":"Your name..."}/>},
    {t:iA?"معلوماتك":"Your Stats",body:(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[["age",iA?"العمر":"Age","number"],["height",iA?"الطول (cm)":"Height (cm)","number"],["weight",iA?"الوزن (kg)":"Weight (kg)","number"]].map(([k,lb,t])=>(
          <div key={k}><p style={{fontSize:12,fontWeight:500,color:C.n600,marginBottom:6}}>{lb}</p><Field val={form[k]} onChange={v=>f(k,v)} ph={lb} type={t} dir="ltr"/></div>
        ))}
      </div>
    )},
    {t:iA?"الهدف":"Goal",body:<div>{opt("goal","0.5",iA?"نص كيلو في الأسبوع":"0.5 kg / week",iA?"أبطأ وأثبت":"Slower but sustainable")}{opt("goal","1",iA?"كيلو في الأسبوع":"1 kg / week",iA?"أسرع ويحتاج التزام":"Faster, needs discipline")}</div>},
    {t:iA?"نظام الأكل":"Meal Plan",body:<div>{opt("mealType","if",iA?"صيام متقطع 16:8":"Intermittent Fasting 16:8",iA?"نافذة أكل 8 ساعات":"8-hour eating window")}{opt("mealType","3meals",iA?"3 وجبات":"3 Meals",iA?"فطور، غداء، عشاء":"Breakfast, lunch, dinner")}</div>},
    {t:iA?"سناك؟":"Snack?",body:(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[["yes",iA?"نعم":"Yes"],["no",iA?"لا":"No"]].map(([v,lb])=>(
          <div key={v} onClick={()=>f("wantSnack",v)} style={{...card(),padding:"18px 0",cursor:"pointer",textAlign:"center",
            border:`1.5px solid ${form.wantSnack===v?C.rose:C.n200}`,background:form.wantSnack===v?C.roseXS:C.white,transition:"all .2s"}}>
            <p style={{fontWeight:600,fontSize:14,color:C.n900}}>{lb}</p>
          </div>
        ))}
      </div>
    )},
    {t:iA?"مشاكل صحية؟":"Health Issues?",body:<Field val={form.issues} onChange={v=>f("issues",v)} ph={iA?"اكتبي أو اتركيه فاضياً":"Write or leave empty"}/>},
    {t:iA?"تفضيلات الفطور":"Breakfast Preferences",body:<Field val={form.bfPref} onChange={v=>f("bfPref",v)} ph={iA?"مثل: بيض، شوفان...":"e.g. eggs, oats..."}/>},
    {t:iA?"تفضيلات الغداء":"Lunch Preferences",body:<Field val={form.luPref} onChange={v=>f("luPref",v)} ph={iA?"مثل: دجاج، سلطة...":"e.g. chicken, salad..."}/>},
    {t:iA?"تفضيلات العشاء":"Dinner Preferences",body:<Field val={form.diPref} onChange={v=>f("diPref",v)} ph={iA?"مثل: سمك، شوربة...":"e.g. fish, soup..."}/>},
    {t:iA?"الجدول الأسبوعي":"Weekly Schedule",body:(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {WEEK.map(d=>(
          <div key={d.js} style={{display:"flex",alignItems:"center",gap:10}}>
            <p style={{width:56,fontSize:12,fontWeight:500,color:C.n700,flexShrink:0,textAlign:"right"}}>{d.ar}</p>
            <div style={{display:"flex",gap:5,flex:1,overflowX:"auto"}}>
              {["rest","push","cardio","pull","legs"].map(type=>{
                const lb={rest:iA?"راحة":"Rest",push:"Push",cardio:iA?"كارديو":"Cardio",pull:"Pull",legs:iA?"أرجل":"Legs"};
                const sel=sched[d.js]===type;
                return(<button key={type} onClick={()=>setSched(p=>({...p,[d.js]:type}))}
                  style={{flexShrink:0,padding:"6px 10px",borderRadius:8,fontSize:11,fontWeight:sel?600:400,cursor:"pointer",
                    border:`1px solid ${sel?C.rose:C.n200}`,background:sel?C.roseXS:C.white,color:sel?C.rose:C.n600,transition:"all .15s"}}>
                  {lb[type]}
                </button>);
              })}
            </div>
          </div>
        ))}
      </div>
    )},
  ];

  const s=STEPS[step];
  const pct=Math.round(((step+1)/STEPS.length)*100);
  return(
    <div style={{minHeight:"100vh",background:BG,direction:iA?"rtl":"ltr",display:"flex",flexDirection:"column"}}>
      <FL/>
      <div style={{background:C.white,borderBottom:`1px solid ${C.n200}`,padding:"14px 20px"}}>
        <div style={{maxWidth:480,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:12,fontWeight:500,color:C.n600}}>{iA?`${step+1} / ${STEPS.length}`:`${step+1} / ${STEPS.length}`}</span>
            <span style={{fontSize:12,fontWeight:600,color:C.rose}}>{pct}%</span>
          </div>
          <div style={{background:C.n200,borderRadius:50,height:3}}>
            <div style={{width:`${pct}%`,height:"100%",borderRadius:50,transition:"width .3s",background:rG}}/>
          </div>
        </div>
      </div>
      <div style={{flex:1,padding:"32px 20px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <h1 style={{fontSize:22,fontWeight:700,color:C.n900,marginBottom:20}}>{s.t}</h1>
        {s.body}
      </div>
      <div style={{padding:"0 20px 36px",maxWidth:480,margin:"0 auto",width:"100%"}}>
        <Btn label={step===STEPS.length-1?(iA?"ابدئي →":"Start →"):iA?"التالي →":"Next →"} onClick={go} disabled={!ok()}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// TODAY SCREEN
// ═══════════════════════════════════════
function Today({profile,dk,prayers,dhikr,exDone,tType,tW,totalCal,onPrayer,onAddFood,foods,onRmFood,sched}){
  const iA=profile?.lang==="ar";
  const cT=profile?.target||1500;
  const cP=Math.min(100,Math.round((totalCal/cT)*100));
  const pDone=PRAYERS.filter(p=>prayers[`${dk}-${p.k}`]).length;
  const eC=tW?tW.ex.filter(e=>exDone[`${tType}-${e.n}`]).length:0;
  const eT=tW?tW.ex.length:0;
  const dDone=ADHKAR.filter(d=>(dhikr[`${dk}-${d.k}`]||0)>=d.n).length;
  const [serum,setSerum]=useState(()=>LS.get(`bloom_serum_${dk}`,false));
  const [vits,setVits]=useState(()=>LS.get(`bloom_vits_${dk}`,false));
  const [nf,setNf]=useState("");
  const [ana,setAna]=useState(false);
  const [lf,setLf]=useState(null);

  const tS=()=>{const v=!serum;setSerum(v);LS.set(`bloom_serum_${dk}`,v);};
  const tV=()=>{const v=!vits;setVits(v);LS.set(`bloom_vits_${dk}`,v);};

  const addF=async()=>{
    if(!nf.trim())return;
    setAna(true);
    const res=await ask('Nutrition expert. Reply ONLY valid JSON no extra text: {"food":"name","calories":number,"protein":number}',`Analyze: ${nf}`,120);
    try{const p=JSON.parse(res.replace(/```json|```/g,"").trim());setLf(p);onAddFood(p);}
    catch{setLf({food:nf,calories:0,protein:0});}
    setNf("");setAna(false);
  };

  const overall=Math.min(100,Math.round(
    (pDone/5)*35 +
    (tW?(eC/Math.max(1,eT))*35:35) +
    (dDone/ADHKAR.length)*20 +
    (cP>0&&cP<=100?10:0)
  ));

  const jsDay=new Date().getDay();
  const todayInfo=WEEK.find(d=>d.js===jsDay)||WEEK[0];

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>

      {/* Header card */}
      <div style={{...card(),padding:20,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <Ring val={overall} max={100} size={68} sw={5} color={C.rose} sub="%" label={iA?"إنجاز اليوم":"Progress"}/>
          <div style={{flex:1}}>
            <p style={{fontSize:13,fontWeight:500,color:C.n600,marginBottom:3}}>{iA?"مرحباً":"Welcome back"}</p>
            <h2 style={{fontSize:18,fontWeight:700,color:C.n900,marginBottom:2}}>{profile?.name}</h2>
            <p style={{fontSize:12,color:C.n600}}>{todayInfo.ar} · {todayInfo.en}</p>
          </div>
        </div>
      </div>

      {/* Daily checks */}
      <div style={{...card(),padding:"4px 18px",marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",padding:"12px 0 0"}}>
          {iA?"التذكيرات اليومية":"DAILY REMINDERS"}
        </p>
        <Row label={iA?"لاش سيروم":"Lash Serum"} sub={iA?"ضعيه قبل النوم":"Apply before sleep"} done={serum} onToggle={tS} color={C.rose}/>
        <Row label={iA?"فيتامينات":"Vitamins"} sub={iA?"مع الفطور":"With breakfast"} done={vits} onToggle={tV} color={C.gold}/>
      </div>

      {/* Calories */}
      <div style={{...card(),padding:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase"}}>{iA?"السعرات":"CALORIES"}</p>
          <p style={{fontSize:12,fontWeight:600,color:cP>100?C.red:C.green}}>
            {cP>100?(iA?`+${totalCal-cT} زيادة`:`+${totalCal-cT} over`):(iA?`${cT-totalCal} باقي`:`${cT-totalCal} left`)}
          </p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <Ring val={totalCal} max={cT} size={60} sw={5} color={cP>100?C.red:C.rose} sub="kcal"/>
          <div style={{flex:1}}>
            <div style={{background:C.n100,borderRadius:6,height:6,overflow:"hidden",marginBottom:6}}>
              <div style={{width:`${cP}%`,height:"100%",background:cP>100?`linear-gradient(90deg,${C.red},#D07070)`:rG,borderRadius:6,transition:"width .5s"}}/>
            </div>
            <p style={{fontSize:12,color:C.n600}}>{totalCal} / {cT} kcal</p>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={nf} onChange={e=>setNf(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addF()}
            placeholder={iA?"أضيفي ما أكلتِ...":"Add what you ate..."}
            style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none",direction:iA?"rtl":"ltr"}}
            onFocus={e=>e.target.style.borderColor=C.roseL} onBlur={e=>e.target.style.borderColor=C.n200}/>
          <button onClick={addF} disabled={ana} style={{background:ana?"#E0E0E0":rG,border:"none",borderRadius:10,padding:"0 16px",color:C.white,fontWeight:600,cursor:ana?"not-allowed":"pointer",fontSize:20,minWidth:46}}>
            {ana?"·":"+"}
          </button>
        </div>
        {lf&&<div style={{marginTop:8,padding:"8px 12px",background:C.roseXS,borderRadius:8,fontSize:12,color:C.n800}}>
          <span style={{fontWeight:600}}>{lf.food}</span> — {lf.calories} kcal · {lf.protein}g protein
        </div>}
        {foods.length>0&&<div style={{marginTop:8,borderTop:`1px solid ${C.n100}`,paddingTop:8}}>
          {foods.map((fd,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0"}}>
              <span style={{fontSize:12,color:C.n700}}>{fd.food}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:11,color:C.n400}}>{fd.calories} kcal</span>
                <button onClick={()=>onRmFood(i)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
              </div>
            </div>
          ))}
        </div>}
      </div>

      {/* Today workout */}
      <div style={{...card(),padding:18,marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"تمرين اليوم":"TODAY'S WORKOUT"}</p>
        {tW?(
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:tW.grad,borderRadius:8,padding:"6px 14px"}}>
                <span style={{fontSize:12,fontWeight:600,color:C.white}}>{iA?tW.ar:tW.en}</span>
              </div>
              <span style={{fontSize:12,color:C.n600}}>{eC}/{eT}</span>
            </div>
            <div style={{background:C.n100,borderRadius:6,height:4,overflow:"hidden"}}>
              <div style={{width:`${eT?Math.round((eC/eT)*100):0}%`,height:"100%",background:tW.grad,borderRadius:6,transition:"width .5s"}}/>
            </div>
          </>
        ):(
          <p style={{fontSize:14,color:C.n600}}>{tType==="cardio"?(iA?"يوم كارديو — سجّلي في صحتي":"Cardio day — log in Wellness"):(iA?"يوم راحة — استرحي":"Rest day — recover")}</p>
        )}
      </div>

      {/* Prayers mini */}
      <div style={{...card(),padding:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase"}}>{iA?"الصلوات":"PRAYERS"}</p>
          <p style={{fontSize:12,color:pDone===5?C.green:C.n600,fontWeight:500}}>{pDone}/5</p>
        </div>
        <div style={{display:"flex",gap:6}}>
          {PRAYERS.map(p=>{
            const done=prayers[`${dk}-${p.k}`];
            return(
              <button key={p.k} onClick={()=>onPrayer(p.k)} style={{flex:1,padding:"10px 4px",borderRadius:10,border:`1px solid ${done?"transparent":C.n200}`,background:done?C.goldS:C.white,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all .2s"}}>
                <span style={{fontSize:10,fontWeight:500,color:done?C.gold:C.n500}}>{iA?p.ar:p.en}</span>
                <div style={{width:6,height:6,borderRadius:"50%",background:done?C.gold:C.n200}}/>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// WORKOUT SCREEN
// ═══════════════════════════════════════
function Workout({profile,exDone,onToggle,sched}){
  const iA=profile?.lang==="ar";
  const jsDay=new Date().getDay();
  const todaySch=WEEK.find(d=>d.js===jsDay)||WEEK[0];
  const tType=sched[jsDay]||"rest";
  const tW=tType!=="rest"&&tType!=="cardio"?WK[tType]:null;

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      {/* Week bar */}
      <div style={{...card(),padding:16,marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"الجدول الأسبوعي":"WEEKLY SCHEDULE"}</p>
        <div style={{display:"flex",gap:5,overflowX:"auto"}}>
          {WEEK.map(d=>{
            const isT=d.js===jsDay;
            const type=sched[d.js]||"rest";
            const dotColor={rest:C.n300,push:C.rose,cardio:C.blue,pull:"#6B70B0",legs:"#507090"}[type];
            return(
              <div key={d.js} style={{flexShrink:0,textAlign:"center",borderRadius:10,padding:"10px 6px",minWidth:44,
                background:isT?C.roseXS:C.n50,border:`1px solid ${isT?C.roseL:C.n200}`,transition:"all .2s"}}>
                <p style={{fontSize:9,fontWeight:600,color:isT?C.rose:C.n400,marginBottom:5}}>{d.s}</p>
                <div style={{width:8,height:8,borderRadius:"50%",background:dotColor,margin:"0 auto"}}/>
              </div>
            );
          })}
        </div>
      </div>

      {tW?(
        <div style={{...card(),overflow:"hidden",marginBottom:12}}>
          <div style={{background:tW.grad,padding:"16px 18px"}}>
            <h2 style={{fontSize:16,fontWeight:700,color:C.white}}>{iA?tW.ar:tW.en}</h2>
            <p style={{fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2}}>{todaySch.ar} · {todaySch.en}</p>
          </div>
          <div style={{padding:"4px 18px 8px"}}>
            {tW.ex.map(ex=>{
              const done=exDone[`${tType}-${ex.n}`];
              return(
                <div key={ex.n} onClick={()=>onToggle(tType,ex.n)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${C.n100}`,cursor:"pointer",opacity:done?.4:1,transition:"all .2s"}}>
                  <Check done={done} onToggle={()=>onToggle(tType,ex.n)} color={tW.color}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:14,fontWeight:500,color:C.n900,textDecoration:done?"line-through":"none"}}>{ex.n}</p>
                    <p style={{fontSize:11,color:C.n400,marginTop:1}}>{ex.ar} · {ex.s} × {ex.r}</p>
                  </div>
                  <span style={{fontSize:10,fontWeight:500,color:C.n500,background:C.n100,borderRadius:20,padding:"2px 8px"}}>{ex.m}</span>
                </div>
              );
            })}
          </div>
        </div>
      ):(
        <div style={{...card(),padding:32,textAlign:"center"}}>
          <p style={{fontSize:32,marginBottom:10}}>{tType==="cardio"?"→":"·"}</p>
          <h3 style={{fontSize:16,fontWeight:600,color:C.n900,marginBottom:6}}>{tType==="cardio"?(iA?"يوم الكارديو":"Cardio Day"):(iA?"يوم الراحة":"Rest Day")}</h3>
          <p style={{fontSize:13,color:C.n500}}>{tType==="cardio"?(iA?"سجّلي نشاطك في صحتي":"Log your activity in Wellness"):(iA?"الجسم يحتاج للتعافي":"Your body needs recovery")}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// PRAYERS SCREEN
// ═══════════════════════════════════════
function Prayers({profile,prayers,onToggle,dk,pTimes}){
  const iA=profile?.lang==="ar";
  const done=PRAYERS.filter(p=>prayers[`${dk}-${p.k}`]).length;
  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:20,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{iA?"صلاتي":"MY PRAYERS"}</p>
            <p style={{fontSize:28,fontWeight:700,color:C.n900}}>{done}<span style={{fontSize:14,color:C.n400,fontWeight:400}}>/5</span></p>
          </div>
          <Ring val={done} max={5} size={56} sw={4} color={C.gold}/>
        </div>
        <div style={{background:C.n100,borderRadius:6,height:3,overflow:"hidden"}}>
          <div style={{width:`${(done/5)*100}%`,height:"100%",background:gG,borderRadius:6,transition:"width .5s"}}/>
        </div>
      </div>

      <div style={{...card(),padding:"4px 18px",marginBottom:12}}>
        {PRAYERS.map(p=>{
          const isDone=prayers[`${dk}-${p.k}`];
          const pt=pTimes?.[p.k];
          return(
            <div key={p.k} onClick={()=>onToggle(p.k)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:`1px solid ${C.n100}`,cursor:"pointer"}}>
              <Check done={isDone} onToggle={()=>onToggle(p.k)} color={C.gold} size={26}/>
              <div style={{flex:1}}>
                <p style={{fontSize:14,fontWeight:500,color:isDone?C.n500:C.n900,textDecoration:isDone?"line-through":"none"}}>{iA?p.ar:p.en}</p>
                {pt&&<p style={{fontSize:11,color:C.n400,marginTop:1}}>{pt}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {done===5&&(
        <div style={{...card(),padding:16,textAlign:"center",background:C.goldS,border:`1px solid rgba(154,123,62,.2)`}}>
          <p style={{fontSize:14,fontWeight:600,color:C.gold}}>ما شاء الله ✓</p>
          <p style={{fontSize:12,color:"#9A7B3E",marginTop:4}}>اللهم تقبّل منّا صالح الأعمال</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// ADHKAR SCREEN
// ═══════════════════════════════════════
function Adhkar({profile,dhikr,onTap,dk}){
  const iA=profile?.lang==="ar";
  const allDone=ADHKAR.every(d=>(dhikr[`${dk}-${d.k}`]||0)>=d.n);
  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      {allDone&&(
        <div style={{...card(),padding:14,marginBottom:12,textAlign:"center",background:C.roseXS,border:`1px solid ${C.roseL}`}}>
          <p style={{fontSize:13,fontWeight:600,color:C.rose}}>{iA?"أكملتِ أذكارك اليوم ✓":"Adhkar complete ✓"}</p>
        </div>
      )}
      {ADHKAR.map(d=>{
        const k=`${dk}-${d.k}`;
        const cnt=dhikr[k]||0;
        const done=cnt>=d.n;
        const pct=Math.round((cnt/d.n)*100);
        const r=34;const circ=2*Math.PI*r;
        return(
          <div key={d.k} style={{...card(),padding:18,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div style={{position:"relative",flexShrink:0,cursor:done?"default":"pointer"}} onClick={()=>!done&&onTap(d.k)}>
                <svg width={82} height={82} style={{transform:"rotate(-90deg)"}}>
                  <circle cx={41} cy={41} r={r} fill="none" stroke={C.n100} strokeWidth={5}/>
                  <circle cx={41} cy={41} r={r} fill="none" stroke={d.c} strokeWidth={5} strokeLinecap="round"
                    strokeDasharray={`${(pct/100)*circ} ${circ}`} style={{transition:"stroke-dasharray .2s"}}/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:18,fontWeight:700,color:done?d.c:C.n900}}>{cnt}</span>
                  <span style={{fontSize:8,color:C.n400}}>/{d.n}</span>
                </div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:15,fontWeight:600,color:C.n900,marginBottom:2}}>{d.ar}</p>
                <p style={{fontSize:11,color:C.n500,marginBottom:12}}>{d.en}</p>
                {done?(
                  <p style={{fontSize:12,fontWeight:500,color:d.c}}>{iA?"جزاكِ الله خيراً ✓":"May Allah reward you ✓"}</p>
                ):(
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>onTap(d.k)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",background:d.c,color:C.white,fontWeight:600,fontSize:13,cursor:"pointer"}}>
                      {iA?"اضغطي":"Tap"}
                    </button>
                    <button onClick={()=>onTap(d.k,"reset")} style={{padding:"9px 12px",borderRadius:10,border:`1px solid ${C.n200}`,background:C.white,color:C.n500,cursor:"pointer",fontSize:12}}>↺</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════
// DIET SCREEN
// ═══════════════════════════════════════
function Diet({profile,aiDiet,foods,onRmFood,totalCal,onAddFood}){
  const iA=profile?.lang==="ar";
  const cT=profile?.target||1500;
  const cP=Math.min(100,Math.round((totalCal/cT)*100));
  const [nf,setNf]=useState("");
  const [ana,setAna]=useState(false);
  const [editKey,setEditKey]=useState(null);
  const [editTxt,setEditTxt]=useState("");
  const [editLoading,setEditLoading]=useState(false);
  const [overrides,setOverrides]=useState(()=>LS.get("bloom_meal_ov",{}));
  const [overrideCals,setOverrideCals]=useState(()=>LS.get("bloom_meal_oc",{}));
  const [checked,setChecked]=useState(()=>LS.get(`bloom_mc_${new Date().toISOString().split("T")[0]}`,{}));

  const CARDS=[
    {k:"فطور",en:"Breakfast",c:"#9A7050",bg:"linear-gradient(135deg,#9A7050,#C09070)",lt:"#FAF2EC"},
    {k:"سناك", en:"Snack",    c:C.green, bg:"linear-gradient(135deg,#3A7D5A,#60A878)",lt:"#EDF5F0"},
    {k:"غداء", en:"Lunch",    c:C.rose,  bg:rG,                                        lt:C.roseXS},
    {k:"عشاء", en:"Dinner",   c:"#6B70B0",bg:"linear-gradient(135deg,#6B70B0,#9098C8)",lt:"#EEEFF8"},
    {k:"ماء",  en:"Water",    c:C.blue,  bg:"linear-gradient(135deg,#3A6A9A,#6090C0)",  lt:"#EEF3F8"},
    {k:"نصائح",en:"Tips",     c:C.gold,  bg:gG,                                        lt:C.goldS},
  ];

  const addF=async()=>{
    if(!nf.trim())return;setAna(true);
    const res=await ask('Nutrition expert. Reply ONLY valid JSON: {"food":"name","calories":number,"protein":number}',`Analyze: ${nf}`,120);
    try{const p=JSON.parse(res.replace(/```json|```/g,"").trim());onAddFood(p);}catch{}
    setNf("");setAna(false);
  };

  const saveEdit=async(key)=>{
    setEditLoading(true);
    const res=await ask("Nutrition expert. Reply ONLY JSON: {calories:number}",editTxt,80);
    let cals=0;try{cals=JSON.parse(res.replace(/```json|```/g,"").trim()).calories||0;}catch{}
    const nO={...overrides,[key]:editTxt};const nC={...overrideCals,[key]:cals};
    setOverrides(nO);setOverrideCals(nC);
    LS.set("bloom_meal_ov",nO);LS.set("bloom_meal_oc",nC);
    setEditKey(null);setEditLoading(false);
  };

  const toggleCheck=(key)=>{
    const dk=new Date().toISOString().split("T")[0];
    const next={...checked,[key]:!checked[key]};
    setChecked(next);LS.set(`bloom_mc_${dk}`,next);
  };

  const parseSection=(kws)=>{
    if(!aiDiet)return[];
    const lines=aiDiet.split("\n");let col=false,res=[];
    for(const ln of lines){
      const has=kws.some(k=>ln.includes(k));
      if(has){col=true;continue;}
      if(col){
        const isNext=CARDS.some(c=>!kws.includes(c.k)&&!kws.includes(c.en)&&(ln.includes(c.k)||ln.includes(c.en)));
        if(isNext&&res.length>1)break;
        if(ln.trim())res.push(ln.trim().replace(/^[•\-*🌸>_#]+\s*/g,""));
      }
    }
    return res;
  };

  const buildSections=()=>{
    const parsed=CARDS.map(c=>({...c,lines:parseSection([c.k,c.en])})).filter(c=>c.lines.length>0);
    if(parsed.length>=2)return parsed;
    if(!aiDiet)return[];
    const all=aiDiet.split("\n").map(l=>l.trim().replace(/^[•\-*🌸>_#]+\s*/g,"")).filter(l=>l.length>3);
    const ch=Math.ceil(all.length/4);
    return CARDS.slice(0,4).map((c,i)=>({...c,lines:all.slice(i*ch,(i+1)*ch)||[]})).filter(c=>c.lines.length>0);
  };

  const sections=buildSections();

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      {/* Stats bar */}
      <div style={{...card(),padding:18,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{iA?"الهدف اليومي":"DAILY TARGET"}</p>
            <p style={{fontSize:26,fontWeight:700,color:C.n900}}>{cT} <span style={{fontSize:13,color:C.n400,fontWeight:400}}>kcal</span></p>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[["TDEE",profile?.tdee],[iA?"مستهلك":"Eaten",totalCal],[iA?"باقي":"Left",Math.max(0,cT-totalCal)]].map(([lb,v])=>(
              <div key={lb} style={{textAlign:"center",background:C.n100,borderRadius:8,padding:"8px 10px"}}>
                <p style={{fontSize:9,color:C.n500,marginBottom:2}}>{lb}</p>
                <p style={{fontSize:13,fontWeight:600,color:C.n900}}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.n100,borderRadius:6,height:4,overflow:"hidden"}}>
          <div style={{width:`${cP}%`,height:"100%",background:cP>100?`linear-gradient(90deg,${C.red},#D07070)`:rG,borderRadius:6,transition:"width .5s"}}/>
        </div>
      </div>

      {/* Food log */}
      <div style={{...card(),padding:16,marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{iA?"سجل الأكل":"FOOD LOG"}</p>
        <div style={{display:"flex",gap:8}}>
          <input value={nf} onChange={e=>setNf(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addF()}
            placeholder={iA?"أضيفي ما أكلتِ...":"Add what you ate..."}
            style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none",direction:iA?"rtl":"ltr"}}
            onFocus={e=>e.target.style.borderColor=C.roseL} onBlur={e=>e.target.style.borderColor=C.n200}/>
          <button onClick={addF} disabled={ana} style={{background:ana?"#E0E0E0":rG,border:"none",borderRadius:10,padding:"0 16px",color:C.white,fontWeight:600,cursor:ana?"not-allowed":"pointer",minWidth:44,fontSize:18}}>
            {ana?"·":"+"}
          </button>
        </div>
        {foods.length>0&&<div style={{marginTop:10}}>
          {foods.map((fd,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderTop:`1px solid ${C.n100}`}}>
              <span style={{fontSize:12,color:C.n700}}>{fd.food}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:11,color:C.n400}}>{fd.calories} kcal</span>
                <button onClick={()=>onRmFood(i)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
              </div>
            </div>
          ))}
        </div>}
      </div>

      {/* Meal cards */}
      {sections.length>0?sections.map(s=>{
        const oL=overrides[s.k]?.split("\n").filter(Boolean)||[];
        const dL=oL.length>0?oL:s.lines;
        const isDone=checked[s.k];
        const oCal=overrideCals[s.k];
        return(
          <div key={s.k} style={{borderRadius:14,overflow:"hidden",marginBottom:10,border:`1px solid ${C.n200}`,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
            <div style={{background:s.bg,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:C.white}}>{iA?s.k:s.en}</p>
                <p style={{fontSize:10,color:"rgba(255,255,255,0.7)",marginTop:1}}>{iA?s.en:s.k}</p>
              </div>
              {oCal&&<span style={{fontSize:11,fontWeight:600,color:C.white,background:"rgba(255,255,255,0.2)",borderRadius:20,padding:"3px 10px"}}>{oCal} kcal</span>}
            </div>
            <div style={{padding:"12px 16px",background:s.lt}}>
              {editKey===s.k?(
                <>
                  <textarea value={editTxt} onChange={e=>setEditTxt(e.target.value)}
                    style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none",resize:"none",minHeight:90,direction:iA?"rtl":"ltr"}}/>
                  <div style={{display:"flex",gap:8,marginTop:8}}>
                    <button onClick={()=>saveEdit(s.k)} disabled={editLoading} style={{flex:1,padding:"9px 0",borderRadius:9,border:"none",background:s.bg,color:C.white,fontWeight:600,fontSize:12,cursor:"pointer"}}>
                      {editLoading?(iA?"جاري الحساب...":"Calculating..."):iA?"حفظ ✓":"Save ✓"}
                    </button>
                    <button onClick={()=>setEditKey(null)} style={{padding:"9px 14px",borderRadius:9,border:`1px solid ${C.n200}`,background:C.white,color:C.n500,cursor:"pointer",fontSize:12}}>{iA?"إلغاء":"Cancel"}</button>
                  </div>
                </>
              ):(
                <>
                  {dL.map((ln,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
                      <div style={{width:4,height:4,borderRadius:"50%",background:s.c,flexShrink:0,marginTop:6}}/>
                      <p style={{fontSize:13,color:C.n700,lineHeight:1.65}}>{ln}</p>
                    </div>
                  ))}
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <button onClick={()=>toggleCheck(s.k)} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,border:`1px solid ${isDone?"transparent":C.n200}`,background:isDone?`${C.green}18`:C.white,color:isDone?C.green:C.n500,fontWeight:500,fontSize:11,cursor:"pointer"}}>
                      <div style={{width:14,height:14,borderRadius:"50%",background:isDone?C.green:C.n200,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {isDone&&<svg width={8} height={6} viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                      </div>
                      {iA?"أكلتِها":"Eaten"}
                    </button>
                    <button onClick={()=>{setEditKey(s.k);setEditTxt(dL.join("\n"));}} style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:20,border:`1px solid ${C.n200}`,background:C.white,color:C.n500,fontWeight:500,fontSize:11,cursor:"pointer"}}>
                      <span style={{fontSize:10}}>✎</span> {iA?"تعديل":"Edit"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      }):(
        <div style={{...card(),padding:28,textAlign:"center"}}>
          <p style={{fontSize:13,color:C.n500}}>{iA?"أعيدي التسجيل لتوليد خطة جديدة":"Re-register to generate a new plan"}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// QURAN SCREEN
// ═══════════════════════════════════════
function Quran({profile}){
  const iA=profile?.lang==="ar";
  const [log,setLog]=useState(()=>LS.get("bloom_quran",{}));
  const [view,setView]=useState("years");
  const [selY,setSelY]=useState(null);
  const [selM,setSelM]=useState(null);
  const [selW,setSelW]=useState(null);
  const [tafsir,setTafsir]=useState({});
  const [tLoading,setTLoading]=useState(false);
  const [aiMsg,setAiMsg]=useState("");
  const [aiL,setAiL]=useState(false);
  const [startDate,setStartDate]=useState(()=>LS.get("bloom_quran_start",""));

  const toggle=(k)=>{const next={...log,[k]:!log[k]};setLog(next);LS.set("bloom_quran",next);};

  const yPct=(yr)=>{
    const y=QP.find(p=>p.y===yr);if(!y)return 0;
    let tot=0,dn=0;
    y.months.forEach(m=>m.wk.forEach(w=>{["h","t","f"].forEach(s=>{tot++;if(log[`y${yr}m${m.m}w${w.w}${s}`])dn++;});}));
    return tot>0?Math.round((dn/tot)*100):0;
  };

  const mPct=(yr,mn)=>{
    const y=QP.find(p=>p.y===yr);const m=y?.months.find(m=>m.m===mn);if(!m)return 0;
    let tot=0,dn=0;
    m.wk.forEach(w=>{["h","t","f"].forEach(s=>{tot++;if(log[`y${yr}m${mn}w${w.w}${s}`])dn++;});});
    return tot>0?Math.round((dn/tot)*100):0;
  };

  const fetchTafsir=async(verses,yr,mn,wk)=>{
    const k=`y${yr}m${mn}w${wk}`;
    if(tafsir[k])return;
    setTLoading(true);
    const res=await ask(
      iA?"أنتِ مفسّرة قرآن. اكتبي تفسيراً مختصراً جداً (3-4 جمل بالعربية فقط). أسلوبك واضح ودافئ.":
      "You are a Quran interpreter. Write a very brief tafsir (3-4 sentences in English only). Clear and warm.",
      iA?`تفسير مختصر للآيات: سورة البقرة ${verses}`:
      `Brief tafsir for Al-Baqarah verses: ${verses}`,200
    );
    setTafsir(p=>({...p,[k]:res}));setTLoading(false);
  };

  const fetchAiMsg=async()=>{
    setAiL(true);
    const y=QP.find(p=>p.y===selY)||QP[0];
    const pct=yPct(selY||1);
    const res=await ask(
      iA?"مشجعة حفظ قرآن. جملة تحفيزية قصيرة بالعربية فقط.":"Quran coach. One short motivating sentence in English only.",
      iA?`الطالبة في العام ${selY||1} من الحفظ، إنجاز ${pct}%.`:`Student in year ${selY||1}, ${pct}% complete.`,70
    );
    setAiMsg(res);setAiL(false);
  };

  const yData=QP.find(p=>p.y===selY);
  const mData=yData?.months.find(m=>m.m===selM);
  const wData=mData?.wk.find(w=>w.w===selW);

  const Crumb=()=>(
    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
      <button onClick={()=>{setView("years");setSelY(null);setSelM(null);setSelW(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:C.rose,fontWeight:500,padding:0}}>{iA?"الأعوام":"Years"}</button>
      {selY&&<><span style={{color:C.n300,fontSize:12}}>›</span><button onClick={()=>{setView("months");setSelM(null);setSelW(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:view!=="years"?C.n900:C.rose,fontWeight:500,padding:0}}>{yData?.ar}</button></>}
      {selM&&<><span style={{color:C.n300,fontSize:12}}>›</span><button onClick={()=>{setView("weeks");setSelW(null);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:view==="week"?C.rose:C.n900,fontWeight:500,padding:0}}>{iA?`الشهر ${selM}`:`Month ${selM}`}</button></>}
      {selW&&<><span style={{color:C.n300,fontSize:12}}>›</span><span style={{fontSize:12,color:C.n900,fontWeight:500}}>{iA?`أسبوع ${selW}`:`Week ${selW}`}</span></>}
    </div>
  );

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      {view!=="years"&&<Crumb/>}

      {/* Header */}
      <div style={{background:gG,borderRadius:14,padding:"18px 20px",marginBottom:12,color:C.white}}>
        <p style={{fontSize:9,fontWeight:600,letterSpacing:"0.1em",opacity:.8,textTransform:"uppercase"}}>{iA?"رحلتي مع القرآن":"QURAN JOURNEY"}</p>
        <h2 style={{fontSize:18,fontWeight:700,marginTop:4}}>{iA?"خطة الحفظ — ١٠ سنوات":"10-Year Memorization Plan"}</h2>
        {startDate&&<p style={{fontSize:11,opacity:.7,marginTop:4}}>{iA?"البداية:":"Started:"} {startDate}</p>}
      </div>

      {!startDate&&(
        <div style={{...card(),padding:14,marginBottom:12}}>
          <p style={{fontSize:12,fontWeight:500,color:C.n600,marginBottom:8}}>{iA?"متى بدأتِ؟":"When did you start?"}</p>
          <input type="date" onChange={e=>{setStartDate(e.target.value);LS.set("bloom_quran_start",e.target.value);}}
            style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none"}}/>
        </div>
      )}

      {/* AI motivator */}
      <div style={{...card(),padding:14,marginBottom:14,display:"flex",gap:10,alignItems:"flex-start"}}>
        <button onClick={fetchAiMsg} disabled={aiL} style={{flexShrink:0,background:aiL?"#E0E0E0":gG,border:"none",borderRadius:9,padding:"8px 12px",color:C.white,fontWeight:600,fontSize:11,cursor:aiL?"not-allowed":"pointer"}}>
          {aiL?"·":(iA?"تشجيع":"Motivate")}
        </button>
        <p style={{fontSize:12,color:C.n600,lineHeight:1.6,fontStyle:"italic"}}>{aiMsg||(iA?"اضغطي للتشجيع":"Tap for encouragement")}</p>
      </div>

      {/* YEARS */}
      {view==="years"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {QP.map(y=>{
            const pct=yPct(y.y);
            return(
              <div key={y.y} onClick={()=>{setSelY(y.y);setView("months");}}
                style={{...card(),padding:16,cursor:"pointer",transition:"all .15s"}}>
                <p style={{fontSize:11,fontWeight:600,color:y.c,marginBottom:2}}>{y.ar}</p>
                <p style={{fontSize:10,color:C.n500,marginBottom:10}}>{y.su}</p>
                <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden",marginBottom:5}}>
                  <div style={{width:`${pct}%`,height:"100%",background:y.c,borderRadius:4}}/>
                </div>
                <p style={{fontSize:11,fontWeight:600,color:y.c}}>{pct}%</p>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTHS */}
      {view==="months"&&yData&&yData.months.map(m=>{
        const pct=mPct(selY,m.m);
        return(
          <div key={m.m} onClick={()=>{setSelM(m.m);setView("weeks");}}
            style={{...card(),padding:14,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:`${yData.c}20`,display:"flex",alignItems:"center",justifyContent:"center",color:yData.c,fontWeight:700,fontSize:14,flexShrink:0}}>{m.m}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:500,color:C.n900,marginBottom:5}}>{iA?`الشهر ${m.m} — ${m.v}`:`Month ${m.m} — ${m.v}`}</p>
              <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:yData.c,borderRadius:4}}/>
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:600,color:yData.c}}>{pct}%</span>
          </div>
        );
      })}

      {/* WEEKS */}
      {view==="weeks"&&mData&&mData.wk.map(w=>{
        const stages=["h","t","f"];
        const pct=Math.round(stages.filter(s=>log[`y${selY}m${selM}w${w.w}${s}`]).length/3*100);
        return(
          <div key={w.w} onClick={()=>{setSelW(w.w);setView("week");fetchTafsir(mData.v,selY,selM,w.w);}}
            style={{...card(),padding:14,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:10,background:pct===100?`${yData?.c}20`:C.n100,display:"flex",alignItems:"center",justifyContent:"center",color:pct===100?yData?.c:C.n500,fontWeight:700,fontSize:14,flexShrink:0}}>{w.w}</div>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:500,color:C.n900,marginBottom:5}}>{iA?`الأسبوع ${w.w} — ${w.v}`:`Week ${w.w} — ${w.v}`}</p>
              <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:yData?.c||C.gold,borderRadius:4}}/>
              </div>
            </div>
            <span style={{fontSize:11,fontWeight:600,color:yData?.c||C.gold}}>{pct}%</span>
          </div>
        );
      })}

      {/* WEEK DETAIL */}
      {view==="week"&&wData&&(
        <>
          <div style={{...card(),padding:16,marginBottom:12,background:`${yData?.c}10`,border:`1px solid ${yData?.c}30`}}>
            <p style={{fontSize:11,fontWeight:600,color:yData?.c,marginBottom:3}}>{iA?`الأسبوع ${selW}`:`Week ${selW}`}</p>
            <h3 style={{fontSize:17,fontWeight:700,color:C.n900}}>{wData.v}</h3>
          </div>

          <div style={{...card(),padding:16,marginBottom:12}}>
            <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"مراحل الحفظ":"STAGES"}</p>
            {[{k:"h",ar:"حفظ",en:"Memorize",c:C.rose},{k:"t",ar:"تثبيت",en:"Review",c:"#6B70B0"},{k:"f",ar:"تفسير",en:"Tafsir",c:C.gold}].map(st=>{
              const key=`y${selY}m${selM}w${selW}${st.k}`;
              const done=log[key];
              return(
                <div key={st.k} onClick={()=>toggle(key)} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${C.n100}`,cursor:"pointer"}}>
                  <Check done={done} onToggle={()=>toggle(key)} color={st.c}/>
                  <p style={{fontSize:14,fontWeight:500,color:done?C.n400:C.n900,textDecoration:done?"line-through":"none"}}>{iA?st.ar:st.en}</p>
                  {done&&<span style={{marginRight:"auto",fontSize:11,color:st.c,fontWeight:500}}>✓</span>}
                </div>
              );
            })}
          </div>

          <div style={{...card(),padding:16,background:C.goldS,border:`1px solid rgba(154,123,62,.15)`}}>
            <p style={{fontSize:10,fontWeight:600,color:C.gold,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{iA?"تفسير مختصر":"BRIEF TAFSIR"}</p>
            {tLoading?(
              <p style={{fontSize:12,color:C.n500}}>{iA?"جاري التحميل...":"Loading..."}</p>
            ):tafsir[`y${selY}m${selM}w${selW}`]?(
              <p style={{fontSize:13,color:"#7A6020",lineHeight:1.75}}>{tafsir[`y${selY}m${selM}w${selW}`]}</p>
            ):(
              <button onClick={()=>fetchTafsir(wData.v,selY,selM,selW)} style={{background:gG,border:"none",borderRadius:9,padding:"8px 16px",color:C.white,fontWeight:600,fontSize:12,cursor:"pointer"}}>
                {iA?"اجلبي التفسير":"Get Tafsir"}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// WELLNESS SCREEN
// ═══════════════════════════════════════
function Wellness({profile,dk}){
  const iA=profile?.lang==="ar";
  const [sub,setSub]=useState("daily");
  const [water,setWater]=useState(()=>LS.get(`bloom_water_${dk}`,0));
  const [serum,setSerum]=useState(()=>LS.get(`bloom_serum_${dk}`,false));
  const [vits,setVits]=useState(()=>LS.get(`bloom_vits_${dk}`,false));
  const [habits,setHabits]=useState(()=>LS.get("bloom_habits",[]));
  const [hLog,setHLog]=useState(()=>LS.get(`bloom_hlog_${dk}`,{}));
  const [newH,setNewH]=useState("");
  const [cardioLog,setCardioLog]=useState(()=>LS.get(`bloom_cardio_${dk}`,null));
  const [sugs,setSugs]=useState([]);
  const [sugL,setSugL]=useState(false);
  const [selC,setSelC]=useState("");
  const [custC,setCustC]=useState("");
  const [mins,setMins]=useState("");

  const wGoal=Math.max(6,Math.round((parseFloat(profile?.weight)||65)*0.033*1000/250));
  const wPct=Math.min(100,Math.round((water/wGoal)*100));

  const setW=v=>{setWater(v);LS.set(`bloom_water_${dk}`,v);};
  const tS=()=>{const v=!serum;setSerum(v);LS.set(`bloom_serum_${dk}`,v);};
  const tV=()=>{const v=!vits;setVits(v);LS.set(`bloom_vits_${dk}`,v);};

  const addH=()=>{if(!newH.trim())return;const u=[...habits,{id:Date.now(),name:newH.trim()}];setHabits(u);LS.set("bloom_habits",u);setNewH("");};
  const togH=id=>{const next={...hLog,[id]:!hLog[id]};setHLog(next);LS.set(`bloom_hlog_${dk}`,next);};
  const delH=id=>{const u=habits.filter(h=>h.id!==id);setHabits(u);LS.set("bloom_habits",u);};

  const fetchSugs=async()=>{
    setSugL(true);
    const res=await ask(
      iA?"اقترحي 5 أنواع كارديو. ردّي فقط JSON: [\"نوع1\",\"نوع2\",\"نوع3\",\"نوع4\",\"نوع5\"]":"Suggest 5 cardio types. Reply ONLY JSON: [\"type1\",\"type2\",\"type3\",\"type4\",\"type5\"]",
      iA?`كارديو لبنت ${profile?.weight||65}كجم`:`Cardio for ${profile?.weight||65}kg woman`,100
    );
    try{setSugs(JSON.parse(res.replace(/```json|```/g,"").trim()));}
    catch{setSugs(iA?["مشي سريع","ركض خفيف","سباحة","دراجة","زومبا"]:["Brisk Walk","Light Run","Swimming","Cycling","Zumba"]);}
    setSugL(false);
  };

  const saveCardio=()=>{
    const type=custC.trim()||selC;
    if(!type||!mins)return;
    const entry={type,minutes:parseInt(mins)};
    setCardioLog(entry);LS.set(`bloom_cardio_${dk}`,entry);
  };

  const TABS=[["daily",iA?"يومي":"Daily"],["cardio",iA?"كارديو":"Cardio"],["habits",iA?"عاداتي":"Habits"]];

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",gap:6,marginBottom:16,borderBottom:`1px solid ${C.n200}`,paddingBottom:0}}>
        {TABS.map(([k,lb])=>(
          <button key={k} onClick={()=>setSub(k)} style={{padding:"8px 16px",background:"transparent",border:"none",borderBottom:`2px solid ${sub===k?C.rose:"transparent"}`,color:sub===k?C.rose:C.n400,fontWeight:sub===k?600:400,fontSize:13,cursor:"pointer",transition:"all .15s",marginBottom:-1}}>
            {lb}
          </button>
        ))}
      </div>

      {sub==="daily"&&(
        <>
          <div style={{...card(),padding:18,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{iA?"الماء":"WATER"}</p>
                <p style={{fontSize:24,fontWeight:700,color:C.blue}}>{water} <span style={{fontSize:13,color:C.n400,fontWeight:400}}>/ {wGoal} {iA?"كوب":"cups"}</span></p>
                <p style={{fontSize:11,color:C.n500,marginTop:2}}>≈ {Math.round(water*.25*10)/10}L</p>
              </div>
              <Ring val={water} max={wGoal} size={58} sw={4} color={C.blue}/>
            </div>
            <div style={{background:C.n100,borderRadius:6,height:4,overflow:"hidden",marginBottom:14}}>
              <div style={{width:`${wPct}%`,height:"100%",background:`linear-gradient(90deg,${C.blue},#6090C0)`,borderRadius:6,transition:"width .4s"}}/>
            </div>
            <div style={{display:"flex",gap:6}}>
              {[1,2,4].map(n=>(
                <button key={n} onClick={()=>setW(Math.min(wGoal*2,water+n))} style={{flex:1,padding:"9px 0",borderRadius:9,border:`1px solid rgba(58,106,154,.2)`,background:"rgba(58,106,154,.06)",color:C.blue,fontWeight:500,fontSize:12,cursor:"pointer"}}>+{n}</button>
              ))}
              <button onClick={()=>setW(Math.max(0,water-1))} style={{padding:"9px 12px",borderRadius:9,border:`1px solid ${C.n200}`,background:C.white,color:C.n500,cursor:"pointer",fontSize:13}}>−</button>
            </div>
            {water>=wGoal&&<p style={{fontSize:12,fontWeight:500,color:C.green,marginTop:10,textAlign:"center"}}>{iA?"هدف الماء مكتمل ✓":"Water goal complete ✓"}</p>}
          </div>
          <div style={{...card(),padding:"4px 18px"}}>
            <Row label={iA?"لاش سيروم":"Lash Serum"} done={serum} onToggle={tS} color={C.rose}/>
            <Row label={iA?"فيتامينات":"Vitamins"} done={vits} onToggle={tV} color={C.gold}/>
          </div>
        </>
      )}

      {sub==="cardio"&&(
        cardioLog?(
          <div style={{...card(),padding:28,textAlign:"center"}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:`${C.green}15`,border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
              <svg width={22} height={18} viewBox="0 0 22 18" fill="none"><path d="M2 9l5.5 5.5L20 2" stroke={C.green} strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <h3 style={{fontSize:16,fontWeight:600,color:C.n900,marginBottom:4}}>{iA?"أحسنتِ!":"Well done!"}</h3>
            <p style={{fontSize:13,color:C.n500,marginBottom:16}}>{cardioLog.type} · {cardioLog.minutes} {iA?"دقيقة":"min"}</p>
            <button onClick={()=>{setCardioLog(null);LS.set(`bloom_cardio_${dk}`,null);}} style={{padding:"8px 20px",borderRadius:20,border:`1px solid ${C.n200}`,background:C.white,color:C.n500,fontSize:12,cursor:"pointer",fontFamily:FN}}>
              {iA?"تعديل":"Edit"}
            </button>
          </div>
        ):(
          <div style={{...card(),padding:18}}>
            <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{iA?"كارديو اليوم":"TODAY'S CARDIO"}</p>
            <p style={{fontSize:13,color:C.n600,marginBottom:14}}>{iA?"وش تبين تسوين اليوم؟":"What cardio today?"}</p>
            {sugs.length===0?(
              <button onClick={fetchSugs} disabled={sugL} style={{width:"100%",padding:"10px 0",borderRadius:10,border:`1.5px solid ${C.n200}`,background:C.white,color:C.n700,fontWeight:500,fontSize:13,cursor:"pointer",marginBottom:12,fontFamily:FN}}>
                {sugL?(iA?"جاري التحميل...":"Loading..."):(iA?"اقتراحات AI":"AI Suggestions")}
              </button>
            ):(
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:12}}>
                {sugs.map((s,i)=>(
                  <button key={i} onClick={()=>{setSelC(s);setCustC("");}} style={{padding:"7px 14px",borderRadius:20,border:`1px solid ${selC===s?C.rose:C.n200}`,background:selC===s?C.roseXS:C.white,color:selC===s?C.rose:C.n600,fontWeight:500,fontSize:12,cursor:"pointer"}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <Field val={custC} onChange={v=>{setCustC(v);setSelC("");}} ph={iA?"أو اكتبي نوعاً آخر...":"Or write your own..."}/>
            <div style={{marginTop:12,marginBottom:14}}>
              <p style={{fontSize:12,fontWeight:500,color:C.n600,marginBottom:8}}>{iA?"المدة (دقيقة)":"Duration (min)"}</p>
              <div style={{display:"flex",gap:6}}>
                {[20,30,45,60].map(m=>(
                  <button key={m} onClick={()=>setMins(String(m))} style={{flex:1,padding:"9px 0",borderRadius:9,border:`1px solid ${mins===String(m)?C.rose:C.n200}`,background:mins===String(m)?C.roseXS:C.white,color:mins===String(m)?C.rose:C.n600,fontWeight:mins===String(m)?600:400,fontSize:12,cursor:"pointer"}}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Btn label={iA?"تم ✓":"Done ✓"} onClick={saveCardio} disabled={(!selC&&!custC.trim())||!mins}/>
          </div>
        )
      )}

      {sub==="habits"&&(
        <>
          <div style={{...card(),padding:16,marginBottom:12}}>
            <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{iA?"عادات أبطلها":"HABITS TO BREAK"}</p>
            <div style={{display:"flex",gap:8}}>
              <Field val={newH} onChange={setNewH} ph={iA?"مثل: السوشيال ميديا...":"e.g. social media..."} onEnter={addH}/>
              <button onClick={addH} style={{background:rG,border:"none",borderRadius:10,padding:"0 14px",color:C.white,fontWeight:600,cursor:"pointer",fontSize:18}}>+</button>
            </div>
          </div>
          {habits.map(h=>{
            const done=hLog[h.id];
            return(
              <div key={h.id} style={{...card(),padding:14,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <Check done={done} onToggle={()=>togH(h.id)} color={C.green}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:13,fontWeight:500,color:done?C.n400:C.n900,textDecoration:done?"line-through":"none"}}>{h.name}</p>
                    <p style={{fontSize:11,color:done?C.green:C.n400,marginTop:1}}>{done?(iA?"تجنبتِ اليوم ✓":"Avoided today ✓"):(iA?"لم تتجنبي بعد":"Not yet")}</p>
                  </div>
                  <button onClick={()=>delH(h.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:18,lineHeight:1}}>×</button>
                </div>
              </div>
            );
          })}
          {habits.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"24px 0"}}>{iA?"أضيفي عادة تبين تبطليها":"Add a habit to break"}</p>}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// CHAT SCREEN
// ═══════════════════════════════════════
function Chat({profile}){
  const iA=profile?.lang==="ar";
  const [msgs,setMsgs]=useState([{role:"assistant",text:iA?`أهلاً ${profile?.name} — قولي اللي في بالك`:`Hi ${profile?.name} — what's on your mind?`}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);

  const send=async()=>{
    if(!input.trim()||loading)return;
    const uMsg={role:"user",text:input.trim()};
    const next=[...msgs,uMsg];setMsgs(next);setInput("");setLoading(true);
    const history=next.map(m=>({role:m.role==="user"?"user":"assistant",content:m.text}));
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:300,
        system:iA?`أنتِ مساعدة دافئة تتكلمين مع ${profile?.name}. ردودك قصيرة وطبيعية باللهجة الخليجية.`:`You are a warm assistant chatting with ${profile?.name}. Short, natural replies in English.`,
        messages:history})
    });
    const d=await r.json();
    setMsgs([...next,{role:"assistant",text:d.content?.[0]?.text||"..."}]);
    setLoading(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)",padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{flex:1,overflowY:"auto",paddingBottom:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end",marginBottom:10}}>
            <div style={{maxWidth:"80%",padding:"11px 14px",borderRadius:14,fontSize:14,lineHeight:1.65,
              background:m.role==="user"?rG:C.white,color:m.role==="user"?C.white:C.n900,
              border:m.role==="assistant"?`1px solid ${C.n200}`:"none",
              boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
              {m.text}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
          <div style={{padding:"11px 16px",borderRadius:14,background:C.white,border:`1px solid ${C.n200}`,fontSize:13,color:C.n400}}>···</div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:8,borderTop:`1px solid ${C.n100}`}}>
        <Field val={input} onChange={setInput} ph={iA?"اكتبي هنا...":"Type here..."} onEnter={send} dir={iA?"rtl":"ltr"}/>
        <button onClick={send} disabled={loading} style={{background:loading?"#E0E0E0":rG,border:"none",borderRadius:10,padding:"0 18px",color:C.white,fontWeight:600,cursor:loading?"not-allowed":"pointer",fontSize:16}}>→</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// NOTES SCREEN
// ═══════════════════════════════════════
function Notes({profile}){
  const iA=profile?.lang==="ar";
  const [sub,setSub]=useState("notes");
  const [notes,setNotes]=useState(()=>LS.get("bloom_notes",[]));
  const [todos,setTodos]=useState(()=>LS.get("bloom_todos",[]));
  const [nTxt,setNTxt]=useState("");
  const [tTxt,setTTxt]=useState("");
  const dk=new Date().toISOString().split("T")[0];

  const addN=()=>{if(!nTxt.trim())return;const u=[{id:Date.now(),text:nTxt.trim(),date:new Date().toLocaleDateString()},...notes];setNotes(u);LS.set("bloom_notes",u);setNTxt("");};
  const delN=id=>{const u=notes.filter(n=>n.id!==id);setNotes(u);LS.set("bloom_notes",u);};
  const addT=()=>{if(!tTxt.trim())return;const u=[{id:Date.now(),text:tTxt.trim(),done:false,date:dk},...todos];setTodos(u);LS.set("bloom_todos",u);setTTxt("");};
  const togT=id=>{const u=todos.map(t=>t.id===id?{...t,done:!t.done}:t);setTodos(u);LS.set("bloom_todos",u);};
  const delT=id=>{const u=todos.filter(t=>t.id!==id);setTodos(u);LS.set("bloom_todos",u);};
  const todayTs=todos.filter(t=>t.date===dk);
  const donePct=todayTs.length?Math.round((todayTs.filter(t=>t.done).length/todayTs.length)*100):0;

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",gap:6,marginBottom:16,borderBottom:`1px solid ${C.n200}`}}>
        {[["notes",iA?"مذكرة":"Notes"],["todo","To-Do"]].map(([k,lb])=>(
          <button key={k} onClick={()=>setSub(k)} style={{padding:"8px 16px",background:"transparent",border:"none",borderBottom:`2px solid ${sub===k?C.rose:"transparent"}`,color:sub===k?C.rose:C.n400,fontWeight:sub===k?600:400,fontSize:13,cursor:"pointer",marginBottom:-1}}>
            {lb}
          </button>
        ))}
      </div>

      {sub==="notes"&&(
        <>
          <div style={{...card(),padding:16,marginBottom:12}}>
            <textarea value={nTxt} onChange={e=>setNTxt(e.target.value)} placeholder={iA?"اكتبي أفكارك...":"Write your thoughts..."} style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none",resize:"none",minHeight:80,direction:iA?"rtl":"ltr",fontFamily:FN}}
              onFocus={e=>e.target.style.borderColor=C.roseL} onBlur={e=>e.target.style.borderColor=C.n200}/>
            <div style={{marginTop:8}}><Btn label={iA?"إضافة":"Add"} onClick={addN} disabled={!nTxt.trim()}/></div>
          </div>
          {notes.map(n=>(
            <div key={n.id} style={{...card(),padding:14,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:10,color:C.n400}}>{n.date}</span>
                <button onClick={()=>delN(n.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
              </div>
              <p style={{fontSize:13,color:C.n800,lineHeight:1.65,whiteSpace:"pre-wrap"}}>{n.text}</p>
            </div>
          ))}
          {notes.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"28px 0"}}>{iA?"لا توجد مذكرات":"No notes yet"}</p>}
        </>
      )}

      {sub==="todo"&&(
        <>
          <div style={{...card(),padding:16,marginBottom:12}}>
            {todayTs.length>0&&(
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:11,color:C.n500}}>{iA?"اليوم":"Today"}</span>
                  <span style={{fontSize:11,fontWeight:600,color:C.rose}}>{donePct}%</span>
                </div>
                <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
                  <div style={{width:`${donePct}%`,height:"100%",background:rG,borderRadius:4,transition:"width .4s"}}/>
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:8}}>
              <Field val={tTxt} onChange={setTTxt} ph={iA?"أضيفي مهمة...":"Add a task..."} onEnter={addT}/>
              <button onClick={addT} style={{background:rG,border:"none",borderRadius:10,padding:"0 14px",color:C.white,fontWeight:600,cursor:"pointer",fontSize:18}}>+</button>
            </div>
          </div>
          {todos.map(t=>(
            <div key={t.id} style={{...card(),padding:12,marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Check done={t.done} onToggle={()=>togT(t.id)} color={C.green} size={24}/>
                <p style={{flex:1,fontSize:13,fontWeight:400,color:t.done?C.n400:C.n900,textDecoration:t.done?"line-through":"none"}}>{t.text}</p>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  {t.date!==dk&&<span style={{fontSize:9,color:C.n300}}>{t.date}</span>}
                  <button onClick={()=>delT(t.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
                </div>
              </div>
            </div>
          ))}
          {todos.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"28px 0"}}>{iA?"أضيفي مهامك":"Add your tasks"}</p>}
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// RECIPES SCREEN
// ═══════════════════════════════════════
function Recipes({profile}){
  const iA=profile?.lang==="ar";
  const [recipes,setRecipes]=useState(()=>LS.get("bloom_recipes",[]));
  const [newDish,setNewDish]=useState("");
  const [loading,setLoading]=useState(false);
  const [sel,setSel]=useState(null);
  const [editMode,setEditMode]=useState(false);
  const [editTxt,setEditTxt]=useState("");

  const generate=async()=>{
    if(!newDish.trim())return;setLoading(true);
    const res=await ask(
      iA?"طاهية محترفة. اكتبي وصفة واضحة بالعربية فقط مع المقادير والخطوات.":"Professional chef. Write a clear recipe in English only with ingredients and steps.",
      iA?`وصفة: ${newDish}`:`Recipe for: ${newDish}`,600
    );
    const r={id:Date.now(),name:newDish.trim(),content:res,date:new Date().toLocaleDateString()};
    const u=[r,...recipes];setRecipes(u);LS.set("bloom_recipes",u);setNewDish("");setLoading(false);setSel(r);
  };

  const save=()=>{
    const u=recipes.map(r=>r.id===sel.id?{...r,content:editTxt}:r);
    setRecipes(u);LS.set("bloom_recipes",u);setSel({...sel,content:editTxt});setEditMode(false);
  };

  const del=id=>{const u=recipes.filter(r=>r.id!==id);setRecipes(u);LS.set("bloom_recipes",u);if(sel?.id===id)setSel(null);};

  if(sel)return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <button onClick={()=>{setSel(null);setEditMode(false);}} style={{background:"none",border:"none",cursor:"pointer",color:C.rose,fontSize:13,fontWeight:500,marginBottom:16,padding:0,fontFamily:FN}}>← {iA?"رجوع":"Back"}</button>
      <div style={{...card(),padding:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div><h2 style={{fontSize:17,fontWeight:700,color:C.n900}}>{sel.name}</h2><p style={{fontSize:11,color:C.n400,marginTop:2}}>{sel.date}</p></div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setEditMode(!editMode);setEditTxt(sel.content);}} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${C.n200}`,background:C.white,color:C.n600,fontSize:11,cursor:"pointer",fontFamily:FN}}>{iA?"تعديل":"Edit"}</button>
            <button onClick={()=>del(sel.id)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid rgba(176,80,80,.25)",background:"transparent",color:C.red,fontSize:11,cursor:"pointer",fontFamily:FN}}>{iA?"حذف":"Delete"}</button>
          </div>
        </div>
        {editMode?(
          <>
            <textarea value={editTxt} onChange={e=>setEditTxt(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${C.n200}`,background:C.white,fontSize:13,color:C.n900,outline:"none",resize:"none",minHeight:280,direction:iA?"rtl":"ltr",fontFamily:FN}}/>
            <div style={{marginTop:10}}><Btn label={iA?"حفظ":"Save"} onClick={save}/></div>
          </>
        ):(
          <p style={{fontSize:13,color:C.n700,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{sel.content}</p>
        )}
      </div>
    </div>
  );

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:18,marginBottom:14}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{iA?"مفكرة الطبخ":"RECIPE BOOK"}</p>
        <p style={{fontSize:13,color:C.n500,marginBottom:12}}>{iA?"اكتبي اسم الأكل وAI يكتب الوصفة":"Write a dish name and AI writes the recipe"}</p>
        <div style={{display:"flex",gap:8}}>
          <Field val={newDish} onChange={setNewDish} ph={iA?"مثل: كبسة دجاج...":"e.g. chicken kabsa..."} onEnter={generate}/>
          <button onClick={generate} disabled={loading||!newDish.trim()} style={{background:loading||!newDish.trim()?"#E0E0E0":rG,border:"none",borderRadius:10,padding:"0 16px",color:C.white,fontWeight:600,cursor:"pointer",fontSize:18,minWidth:46}}>{loading?"·":"✦"}</button>
        </div>
        {loading&&<p style={{fontSize:12,color:C.n500,marginTop:8,textAlign:"center"}}>{iA?"AI يكتب الوصفة...":"AI is writing the recipe..."}</p>}
      </div>
      {recipes.map(r=>(
        <div key={r.id} onClick={()=>setSel(r)} style={{...card(),padding:14,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:9,background:C.roseXS,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🍽️</div>
          <div style={{flex:1}}><p style={{fontSize:14,fontWeight:500,color:C.n900}}>{r.name}</p><p style={{fontSize:11,color:C.n400,marginTop:2}}>{r.date}</p></div>
          <button onClick={e=>{e.stopPropagation();del(r.id);}} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:18,lineHeight:1}}>×</button>
        </div>
      ))}
      {recipes.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"30px 0"}}>{iA?"أضيفي أول وصفة":"Add your first recipe"}</p>}
    </div>
  );
}

// ═══════════════════════════════════════
// BOOKS SCREEN
// ═══════════════════════════════════════
function Books({profile}){
  const iA=profile?.lang==="ar";
  const [books,setBooks]=useState(()=>LS.get("bloom_books",[]));
  const [title,setTitle]=useState("");
  const [pages,setPages]=useState("");
  const [loading,setLoading]=useState(false);
  const [sel,setSel]=useState(null);
  const [readPg,setReadPg]=useState("");
  const [aiQ,setAiQ]=useState("");
  const [aiA,setAiA]=useState("");
  const [aL,setAL]=useState(false);

  const add=async()=>{
    if(!title.trim()||!pages.trim())return;setLoading(true);
    const sum=await ask(
      iA?"خبيرة كتب. لخّصي في 3 جمل بالعربية فقط.":"Book expert. Summarize in 3 sentences in English only.",
      iA?`لخّصي: ${title}`:`Summarize: ${title}`,150
    );
    const b={id:Date.now(),title:title.trim(),total:parseInt(pages),read:0,summary:sum};
    const u=[b,...books];setBooks(u);LS.set("bloom_books",u);setTitle("");setPages("");setLoading(false);
  };

  const updateRead=(id,pg)=>{
    const u=books.map(b=>b.id===id?{...b,read:Math.min(b.total,Math.max(0,parseInt(pg)||0))}:b);
    setBooks(u);LS.set("bloom_books",u);setSel(u.find(b=>b.id===id));
  };

  const ask2=async()=>{
    if(!aiQ.trim())return;setAL(true);
    const res=await ask(iA?`خبيرة في "${sel?.title}". أجيبي بالعربية.`:`Expert on "${sel?.title}". Answer in English.`,aiQ,200);
    setAiA(res);setAL(false);
  };

  const del=id=>{const u=books.filter(b=>b.id!==id);setBooks(u);LS.set("bloom_books",u);if(sel?.id===id)setSel(null);};

  if(sel)return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <button onClick={()=>setSel(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.rose,fontSize:13,fontWeight:500,marginBottom:16,padding:0,fontFamily:FN}}>← {iA?"رجوع":"Back"}</button>
      <div style={{...card(),padding:20,marginBottom:12}}>
        <h2 style={{fontSize:17,fontWeight:700,color:C.n900,marginBottom:6}}>{sel.title}</h2>
        <p style={{fontSize:12,color:C.n500,lineHeight:1.65,marginBottom:16}}>{sel.summary}</p>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <Field val={readPg} onChange={setReadPg} ph={`${iA?"الصفحة الحالية":"Current page"} (${sel.total})`} type="number" dir="ltr"/>
          <button onClick={()=>updateRead(sel.id,readPg)} style={{padding:"0 16px",borderRadius:10,border:"none",background:rG,color:C.white,fontWeight:600,cursor:"pointer",fontFamily:FN}}>✓</button>
        </div>
        <div style={{background:C.n100,borderRadius:6,height:4,overflow:"hidden",marginBottom:5}}>
          <div style={{width:`${Math.round((sel.read/sel.total)*100)}%`,height:"100%",background:rG,borderRadius:6}}/>
        </div>
        <p style={{fontSize:11,color:C.n500}}>{sel.read}/{sel.total} {iA?"صفحة":"pages"} · {Math.round((sel.read/sel.total)*100)}%</p>
      </div>
      <div style={{...card(),padding:18}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{iA?"اسأليني عن الكتاب":"ASK ABOUT THE BOOK"}</p>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <Field val={aiQ} onChange={setAiQ} ph={iA?"وش أبرز فكرة؟":"What's the main idea?"} onEnter={ask2}/>
          <button onClick={ask2} disabled={aL} style={{background:aL?"#E0E0E0":rG,border:"none",borderRadius:10,padding:"0 14px",color:C.white,fontWeight:600,cursor:"pointer",minWidth:44,fontSize:16}}>{aL?"·":"→"}</button>
        </div>
        {aiA&&<p style={{fontSize:13,color:C.n700,lineHeight:1.7,padding:"10px 12px",background:C.roseXS,borderRadius:9}}>{aiA}</p>}
      </div>
    </div>
  );

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:18,marginBottom:14}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"مكتبتي":"MY LIBRARY"}</p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Field val={title} onChange={setTitle} ph={iA?"اسم الكتاب...":"Book title..."}/>
          <div style={{display:"flex",gap:8}}>
            <Field val={pages} onChange={setPages} ph={iA?"عدد الصفحات":"Pages"} type="number" dir="ltr"/>
            <button onClick={add} disabled={loading||!title.trim()||!pages.trim()} style={{padding:"0 16px",borderRadius:10,border:"none",background:loading||!title.trim()||!pages.trim()?"#E0E0E0":rG,color:loading||!title.trim()||!pages.trim()?C.n400:C.white,fontWeight:600,cursor:"pointer",fontFamily:FN,fontSize:13}}>
              {loading?"·":(iA?"إضافة":"Add")}
            </button>
          </div>
        </div>
      </div>
      {books.map(b=>{
        const pct=Math.round((b.read/b.total)*100);
        return(
          <div key={b.id} style={{...card(),padding:14,marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{flex:1,cursor:"pointer"}} onClick={()=>setSel(b)}><p style={{fontSize:14,fontWeight:500,color:C.n900}}>{b.title}</p><p style={{fontSize:11,color:C.n400,marginTop:2}}>{b.read}/{b.total} {iA?"صفحة":"pages"}</p></div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:11,fontWeight:600,color:C.rose}}>{pct}%</span>
                <button onClick={()=>del(b.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
              </div>
            </div>
            <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:rG,borderRadius:4}}/>
            </div>
          </div>
        );
      })}
      {books.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"30px 0"}}>{iA?"أضيفي كتابك الأول":"Add your first book"}</p>}
    </div>
  );
}

// ═══════════════════════════════════════
// SHOWS SCREEN
// ═══════════════════════════════════════
function Shows({profile}){
  const iA=profile?.lang==="ar";
  const [shows,setShows]=useState(()=>LS.get("bloom_shows",[]));
  const [title,setTitle]=useState("");
  const [type,setType]=useState(iA?"مسلسل":"Series");
  const [filter,setFilter]=useState("all");
  const TYPES=iA?["مسلسل","أنمي","فيلم","برنامج"]:["Series","Anime","Film","Show"];
  const ICONS={"مسلسل":"◻","أنمي":"◈","فيلم":"◉","برنامج":"◎","Series":"◻","Anime":"◈","Film":"◉","Show":"◎"};

  const add=()=>{if(!title.trim())return;const s={id:Date.now(),title:title.trim(),type,done:false};const u=[s,...shows];setShows(u);LS.set("bloom_shows",u);setTitle("");};
  const tog=id=>{const u=shows.map(s=>s.id===id?{...s,done:!s.done}:s);setShows(u);LS.set("bloom_shows",u);};
  const del=id=>{const u=shows.filter(s=>s.id!==id);setShows(u);LS.set("bloom_shows",u);};

  const filtered=filter==="all"?shows:filter==="done"?shows.filter(s=>s.done):shows.filter(s=>!s.done);
  const donePct=shows.length?Math.round((shows.filter(s=>s.done).length/shows.length)*100):0;

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:18,marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"قائمة المشاهدة":"WATCHLIST"}</p>
        {shows.length>0&&(
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:11,color:C.n500}}>{shows.filter(s=>s.done).length}/{shows.length} {iA?"مشاهَد":"watched"}</span>
              <span style={{fontSize:11,fontWeight:600,color:C.rose}}>{donePct}%</span>
            </div>
            <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
              <div style={{width:`${donePct}%`,height:"100%",background:rG,borderRadius:4,transition:"width .4s"}}/>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {TYPES.map(t=>(
            <button key={t} onClick={()=>setType(t)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${type===t?C.rose:C.n200}`,background:type===t?C.roseXS:C.white,color:type===t?C.rose:C.n600,fontWeight:type===t?500:400,fontSize:11,cursor:"pointer"}}>{t}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <Field val={title} onChange={setTitle} ph={iA?"اسم المسلسل أو الأنمي...":"Show or anime name..."} onEnter={add}/>
          <button onClick={add} style={{background:rG,border:"none",borderRadius:10,padding:"0 14px",color:C.white,fontWeight:600,cursor:"pointer",fontSize:18}}>+</button>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:12}}>
        {[["all",iA?"الكل":"All"],["todo",iA?"لم تُشاهَد":"Unwatched"],["done",iA?"تمت":"Watched"]].map(([k,lb])=>(
          <button key={k} onClick={()=>setFilter(k)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filter===k?C.rose:C.n200}`,background:filter===k?C.roseXS:C.white,color:filter===k?C.rose:C.n500,fontWeight:filter===k?500:400,fontSize:11,cursor:"pointer"}}>{lb}</button>
        ))}
      </div>

      <div style={{...card(),padding:"4px 18px"}}>
        {filtered.map(s=>(
          <div key={s.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 0",borderBottom:`1px solid ${C.n100}`,opacity:s.done?.5:1,transition:"all .2s"}}>
            <Check done={s.done} onToggle={()=>tog(s.id)} color={C.green} size={24}/>
            <span style={{fontSize:13,color:C.n500,flexShrink:0}}>{ICONS[s.type]}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:500,color:s.done?C.n400:C.n900,textDecoration:s.done?"line-through":"none"}}>{s.title}</p>
              <p style={{fontSize:10,color:C.n400,marginTop:1}}>{s.type}</p>
            </div>
            <button onClick={()=>del(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.n300,fontSize:16,lineHeight:1}}>×</button>
          </div>
        ))}
        {filtered.length===0&&<p style={{textAlign:"center",color:C.n400,fontSize:13,padding:"28px 0"}}>{iA?"أضيفي أول مسلسل":"Add your first show"}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// PROGRESS SCREEN
// ═══════════════════════════════════════
function Progress({profile,prayers,dhikr,exDone,dk,totalCal,onReset}){
  const iA=profile?.lang==="ar";
  const cT=profile?.target||1500;
  const pDone=PRAYERS.filter(p=>prayers[`${dk}-${p.k}`]).length;
  const jsDay=new Date().getDay();
  const sched=LS.get("bloom_sched",{});
  const tType=sched[jsDay]||"rest";
  const tW=tType!=="rest"&&tType!=="cardio"?WK[tType]:null;
  const eC=tW?tW.ex.filter(e=>exDone[`${tType}-${e.n}`]).length:0;
  const eT=tW?tW.ex.length:1;
  const dDone=ADHKAR.filter(d=>(dhikr[`${dk}-${d.k}`]||0)>=d.n).length;
  const cP=Math.min(100,Math.round((totalCal/cT)*100));
  const overall=Math.min(100,Math.round((pDone/5)*35+(tW?(eC/eT)*35:35)+(dDone/ADHKAR.length)*20+(cP>0&&cP<=100?10:0)));
  const [confirm,setConfirm]=useState(false);

  const STATS=[
    {lb:iA?"الصلوات":"Prayers",val:pDone,max:5,color:C.gold},
    {lb:iA?"التمارين":"Workout",val:eC,max:Math.max(1,eT),color:C.rose},
    {lb:iA?"الأذكار":"Adhkar",val:dDone,max:5,color:"#6B70B0"},
    {lb:iA?"السعرات":"Calories",val:totalCal,max:cT,color:C.green},
  ];

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:24,marginBottom:12,textAlign:"center"}}>
        <Ring val={overall} max={100} size={96} sw={6} color={C.rose} sub="%" label={iA?"إنجاز اليوم":"Today's Progress"}/>
        <p style={{fontSize:13,color:C.n500,marginTop:12}}>{iA?`أحسنتِ ${profile?.name}`:`Keep going ${profile?.name}`}</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {STATS.map(s=>{
          const pct=Math.min(100,Math.round((s.val/s.max)*100));
          return(
            <div key={s.lb} style={{...card(),padding:14}}>
              <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{s.lb}</p>
              <p style={{fontSize:20,fontWeight:700,color:s.color,marginBottom:8}}>{s.val}<span style={{fontSize:11,color:C.n400,fontWeight:400}}>/{s.max}</span></p>
              <div style={{background:C.n100,borderRadius:4,height:3,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:s.color,borderRadius:4}}/>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{...card(),padding:18,marginBottom:12}}>
        <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"معلوماتك":"YOUR STATS"}</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[
            [iA?"الوزن":"Weight",`${profile?.weight} kg`],
            [iA?"الطول":"Height",`${profile?.height} cm`],
            ["TDEE",`${profile?.tdee} kcal`],
            [iA?"الهدف":"Target",`${profile?.target} kcal`],
          ].map(([lb,v])=>(
            <div key={lb} style={{background:C.n50,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.n200}`}}>
              <p style={{fontSize:10,color:C.n500,marginBottom:3}}>{lb}</p>
              <p style={{fontSize:13,fontWeight:600,color:C.n900}}>{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{...card(),padding:18,textAlign:"center"}}>
        {!confirm?(
          <>
            <p style={{fontSize:12,color:C.n500,marginBottom:12}}>{iA?"تبين تبدأين من جديد؟":"Want to start over?"}</p>
            <Btn label={iA?"إعادة البداية":"Reset"} onClick={()=>setConfirm(true)} variant="danger" sm/>
          </>
        ):(
          <>
            <p style={{fontSize:13,fontWeight:500,color:C.red,marginBottom:14}}>{iA?"⚠ سيتم مسح كل البيانات":"⚠ All data will be deleted"}</p>
            <div style={{display:"flex",gap:10}}>
              <Btn label={iA?"إلغاء":"Cancel"} onClick={()=>setConfirm(false)} variant="ghost"/>
              <Btn label={iA?"تأكيد":"Confirm"} onClick={onReset} variant="danger"/>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App(){
  const [profile,  setProfile]  = useState(()=>LS.get("bloom_profile",null));
  const [sched,    setSched]    = useState(()=>LS.get("bloom_sched",{5:"rest",6:"push",0:"cardio",1:"pull",2:"cardio",3:"legs",4:"cardio"}));
  const [aiDiet,   setAiDiet]   = useState(()=>LS.get("bloom_diet",""));
  const [mot,      setMot]      = useState(()=>LS.get("bloom_mot",""));
  const [tab,      setTab]      = useState("today");
  const [exDone,   setExDone]   = useState(()=>LS.get("bloom_ex",{}));
  const [prayers,  setPrayers]  = useState(()=>LS.get("bloom_prayers",{}));
  const [dhikr,    setDhikr]    = useState(()=>LS.get("bloom_dhikr",{}));
  const [foods,    setFoods]    = useState(()=>LS.get("bloom_food_"+new Date().toISOString().split("T")[0],[]));
  const [pTimes,   setPTimes]   = useState(null);
  const [showMore, setShowMore] = useState(false);

  const dk   = new Date().toISOString().split("T")[0];
  const jsDay= new Date().getDay();
  const tType= sched[jsDay]||"rest";
  const tW   = tType!=="rest"&&tType!=="cardio"?WK[tType]:null;
  const total= foods.reduce((s,f)=>s+(f.calories||0),0);
  const iA   = profile?.lang==="ar";

  const togPrayer=(k)=>{const key=`${dk}-${k}`;const next={...prayers,[key]:!prayers[key]};setPrayers(next);LS.set("bloom_prayers",next);};
  const togDhikr=(k,action)=>{const key=`${dk}-${k}`;const d=ADHKAR.find(x=>x.k===k);if(action==="reset"){const next={...dhikr,[key]:0};setDhikr(next);LS.set("bloom_dhikr",next);return;}if((dhikr[key]||0)>=d.n)return;const next={...dhikr,[key]:(dhikr[key]||0)+1};setDhikr(next);LS.set("bloom_dhikr",next);};
  const togEx=(type,n)=>{const k=`${type}-${n}`;const next={...exDone,[k]:!exDone[k]};setExDone(next);LS.set("bloom_ex",next);};
  const addFood=(f)=>{const u=[...foods,f];setFoods(u);LS.set("bloom_food_"+dk,u);};
  const rmFood=(i)=>{const u=foods.filter((_,idx)=>idx!==i);setFoods(u);LS.set("bloom_food_"+dk,u);};
  const reset=()=>{localStorage.clear();sessionStorage.clear();setProfile(null);};

  useEffect(()=>{
    if(!navigator.geolocation)return;
    navigator.geolocation.getCurrentPosition(async pos=>{
      try{
        const today=new Date();const d=`${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
        const r=await fetch(`https://api.aladhan.com/v1/timings/${d}?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=4`);
        const data=await r.json();const t=data.data.timings;
        setPTimes({fajr:t.Fajr,dhuhr:t.Dhuhr,asr:t.Asr,maghrib:t.Maghrib,isha:t.Isha});
      }catch{}
    });
  },[]);

  if(!profile)return <Setup onDone={(p,s,d,m)=>{setProfile(p);setSched(s);setAiDiet(d);setMot(m);}}/>;

  const TABS=[
    {k:"today",  ar:"اليوم",    en:"Today"},
    {k:"workout",ar:"تمارين",   en:"Workout"},
    {k:"prayers",ar:"صلاتي",    en:"Prayers"},
    {k:"adhkar", ar:"أذكاري",   en:"Adhkar"},
    {k:"diet",   ar:"دايتي",    en:"Diet"},
    {k:"quran",  ar:"القرآن",   en:"Quran"},
    {k:"wellness",ar:"صحتي",    en:"Wellness"},
    {k:"chat",   ar:"درشة",     en:"Chat"},
    {k:"notes",  ar:"مذكرة",    en:"Notes"},
    {k:"recipes",ar:"وصفاتي",   en:"Recipes"},
    {k:"books",  ar:"مكتبتي",   en:"Books"},
    {k:"shows",  ar:"مشاهداتي", en:"Shows"},
    {k:"progress",ar:"إنجازاتي",en:"Progress"},
  ];

  const BOTTOM=TABS.slice(0,4);
  const MORE  =TABS.slice(4);

  const pDone=PRAYERS.filter(p=>prayers[`${dk}-${p.k}`]).length;

  return(
    <div style={{minHeight:"100vh",background:BG,direction:iA?"rtl":"ltr",fontFamily:FN,paddingBottom:72}}>
      <FL/>

      {/* HEADER */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.n200}`,padding:"11px 16px",position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
        <div style={{maxWidth:480,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{fontSize:9,fontWeight:600,color:C.n400,letterSpacing:"0.12em",textTransform:"uppercase"}}>BLOOM</p>
            <h1 style={{fontSize:16,fontWeight:700,color:C.n900,marginTop:1}}>{profile.name}</h1>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{textAlign:"center",background:C.n50,borderRadius:8,padding:"5px 10px",border:`1px solid ${C.n200}`}}>
              <p style={{fontSize:9,color:C.n400,fontWeight:500}}>PRAYERS</p>
              <p style={{fontSize:13,fontWeight:700,color:pDone===5?C.green:C.n700}}>{pDone}/5</p>
            </div>
            <div style={{textAlign:"center",background:C.n50,borderRadius:8,padding:"5px 10px",border:`1px solid ${C.n200}`}}>
              <p style={{fontSize:9,color:C.n400,fontWeight:500}}>KCAL</p>
              <p style={{fontSize:13,fontWeight:700,color:total>=(profile.target||1500)?C.red:C.n700}}>{total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MOTIVATION BANNER */}
      {tab==="today"&&mot&&(
        <div style={{background:C.roseXS,borderBottom:`1px solid ${C.roseSoft}`,padding:"9px 16px"}}>
          <p style={{fontSize:12,color:C.rose,maxWidth:480,margin:"0 auto",fontStyle:"italic"}}>{mot}</p>
        </div>
      )}

      {/* SCREENS */}
      <div className="up">
        {tab==="today"   &&<Today profile={profile} dk={dk} prayers={prayers} dhikr={dhikr} exDone={exDone} tType={tType} tW={tW} totalCal={total} onPrayer={togPrayer} onAddFood={addFood} foods={foods} onRmFood={rmFood} sched={sched}/>}
        {tab==="workout" &&<Workout profile={profile} exDone={exDone} onToggle={togEx} sched={sched}/>}
        {tab==="prayers" &&<Prayers profile={profile} prayers={prayers} onToggle={togPrayer} dk={dk} pTimes={pTimes}/>}
        {tab==="adhkar"  &&<Adhkar profile={profile} dhikr={dhikr} onTap={togDhikr} dk={dk}/>}
        {tab==="diet"    &&<Diet profile={profile} aiDiet={aiDiet} foods={foods} onRmFood={rmFood} totalCal={total} onAddFood={addFood}/>}
        {tab==="quran"   &&<Quran profile={profile}/>}
        {tab==="wellness"&&<Wellness profile={profile} dk={dk}/>}
        {tab==="chat"    &&<Chat profile={profile}/>}
        {tab==="notes"   &&<Notes profile={profile}/>}
        {tab==="recipes" &&<Recipes profile={profile}/>}
        {tab==="books"   &&<Books profile={profile}/>}
        {tab==="shows"   &&<Shows profile={profile}/>}
        {tab==="progress"&&<Progress profile={profile} prayers={prayers} dhikr={dhikr} exDone={exDone} dk={dk} totalCal={total} onReset={reset}/>}
      </div>

      {/* MORE DRAWER */}
      {showMore&&(
        <div onClick={()=>setShowMore(false)} style={{position:"fixed",inset:0,zIndex:99,background:"rgba(0,0,0,0.3)"}}>
          <div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:64,left:0,right:0,background:C.white,borderTop:`1px solid ${C.n200}`,padding:"16px",boxShadow:"0 -4px 20px rgba(0,0,0,0.1)"}}>
            <div style={{maxWidth:480,margin:"0 auto"}}>
              <p style={{fontSize:10,fontWeight:600,color:C.n400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{iA?"الأقسام":"SECTIONS"}</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {MORE.map(t=>(
                  <button key={t.k} onClick={()=>{setTab(t.k);setShowMore(false);}} style={{border:"none",background:tab===t.k?C.roseXS:C.n50,borderRadius:10,padding:"12px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:`1px solid ${tab===t.k?C.roseL:C.n200}`,transition:"all .15s",fontFamily:FN}}>
                    <span style={{fontSize:11,fontWeight:tab===t.k?600:400,color:tab===t.k?C.rose:C.n600,textAlign:"center",lineHeight:1.3}}>{iA?t.ar:t.en}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:C.white,borderTop:`1px solid ${C.n200}`,display:"flex",padding:"6px 4px 8px",boxShadow:"0 -1px 8px rgba(0,0,0,0.06)"}}>
        {[...BOTTOM,{k:"more",ar:"المزيد",en:"More"}].map(t=>{
          const isActive=t.k==="more"?showMore:tab===t.k;
          return(
            <button key={t.k} onClick={()=>{if(t.k==="more"){setShowMore(p=>!p);}else{setTab(t.k);setShowMore(false);}}}
              style={{flex:1,border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 0",fontFamily:FN}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:isActive?C.rose:"transparent",marginBottom:2,transition:"background .2s"}}/>
              <span style={{fontSize:10,fontWeight:isActive?600:400,color:isActive?C.rose:C.n400,transition:"color .2s"}}>{iA?t.ar:t.en}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
