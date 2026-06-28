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
    {n:"Pec Deck",       ar:"فراشة الصدر",      s:3,r:"12-15",m:"Chest"},
    {n:"Shoulder Press", ar:"ضغط الأكتاف",      s:3,r:"12",   m:"Shoulders"},
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
  {k:"subhan", ar:"سبحان الله",          en:"SubhanAllah",    n:33,c:"#6B70B0"},
  {k:"hamd",   ar:"الحمد لله",             en:"Alhamdulillah",    n:33,c:C.rose},
  {k:"akbar",  ar:"الله أكبر",             en:"Allahu Akbar",     n:33,c:"#507090"},
  {k:"tahleel",ar:"لا إله إلا الله",       en:"La ilaha illallah",n:10,c:C.green},
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
  try {
    const r=await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:max,system:sys,messages:[{role:"user",content:usr}]})
    });
    const d=await r.json();
    return d.content?.[0]?.text||"";
  } catch(e) {
    return "";
  }
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
            border:`1.5px solid ${lang===v?C.rose:C.n200}`,background:lang===v?rG:C.white,transition:"all .2s"}}>
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
  const tType=sched[jsDay]||"rest";
  const tW=tType!=="rest"&&tType!=="cardio"?WK[tType]:null;

  return(
    <div style={{padding:"16px",maxWidth:480,margin:"0 auto"}}>
      <div style={{...card(),padding:16,marginBottom:12}}>
        <h2 style={{fontSize:18,fontWeight:700,color:C.n900,marginBottom:4}}>{iA?"جدول التمارين":"Workout Schedule"}</h2>
        <p style={{fontSize:13,color:C.n600}}>{iA?"تتبع تمارين المقاومة والكارديو":"Track your resistance and cardio training"}</p>
      </div>

      {tW ? (
        <div style={{...card(),padding:"4px 18px"}}>
          {tW.ex.map((e,i)=>(
            <Row key={i} label={iA?e.ar:e.n} sub={`${e.s} مجموعات × ${e.r} عَدّة (${e.m})`} done={!!exDone[`${tType}-${e.n}`]} onToggle={()=>onToggle(tType,e.n)} color={tW.color}/>
          ))}
        </div>
      ) : (
        <div style={{...card(),padding:20,textAlign:"center"}}>
          <p style={{fontSize:15,color:C.n600}}>{tType==="cardio" ? (iA?"اليوم مخصص للكارديو (المشي 10,000 خطوة أو السباحة)":"Today is dedicated to Cardio (10k steps or pool)") : (iA?"اليوم يوم راحة واستشفاء عضلات!":"Today is a rest and recovery day!")}</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════
export default function App() {
  const [profile, setProfile] = useState(() => LS.get("bloom_profile", null));
  const [sched, setSched] = useState(() => LS.get("bloom_sched", {}));
  const [diet, setDiet] = useState(() => LS.get("bloom_diet", ""));
  const [mot, setMot] = useState(() => LS.get("bloom_mot", ""));
  const [tab, setTab] = useState("today");

  const [prayers, setPrayers] = useState(() => LS.get("bloom_prayers", {}));
  const [dhikr, setDhikr] = useState(() => LS.get("bloom_dhikr", {}));
  const [exDone, setExDone] = useState(() => LS.get("bloom_exdone", {}));
  const [foods, setFoods] = useState(() => LS.get("bloom_foods_list", []));
  const [totalCal, setTotalCal] = useState(() => LS.get("bloom_total_cal", 0));

  const dk = new Date().toISOString().split("T")[0];
  const jsDay = new Date().getDay();
  const tType = sched[jsDay] || "rest";
  const tW = tType !== "rest" && tType !== "cardio" ? WK[tType] : null;
  const iA = profile?.lang === "ar";

  const handleSetupDone = (p, s, d, m) => {
    setProfile(p); setSched(s); setDiet(d); setMot(m);
  };

  const togglePrayer = (k) => {
    const key = `${dk}-${k}`;
    const nv = { ...prayers, [key]: !prayers[key] };
    setPrayers(nv); LS.set("bloom_prayers", nv);
  };

  const toggleWorkout = (type, name) => {
    const key = `${type}-${name}`;
    const nv = { ...exDone, [key]: !exDone[key] };
    setExDone(nv); LS.set("bloom_exdone", nv);
  };

  const addFood = (item) => {
    const nv = [...foods, item];
    setFoods(nv); LS.set("bloom_foods_list", nv);
    setTotalCal(prev => { const tc = prev + item.calories; LS.set("bloom_total_cal", tc); return tc; });
  };

  const removeFood = (idx) => {
    const item = foods[idx];
    const nv = foods.filter((_, i) => i !== idx);
    setFoods(nv); LS.set("bloom_foods_list", nv);
    setTotalCal(prev => { const tc = Math.max(0, prev - item.calories); LS.set("bloom_total_cal", tc); return tc; });
  };

  if (!profile) return <Setup onDone={handleSetupDone} />;

  return (
    <div style={{ minHeight: "100vh", background: BG, paddingBottom: 80, direction: iA ? "rtl" : "ltr" }}>
      <FL />
      
      {/* Top Notification Motivation */}
      {mot && (
        <div style={{ background: rG, color: C.white, padding: "10px 16px", textCenter: "center", fontSize: 13, fontWeight: 500, textAlign: "center" }}>
          ✨ {mot}
        </div>
      )}

      {/* Screen Render */}
      {tab === "today" && (
        <Today profile={profile} dk={dk} prayers={prayers} dhikr={dhikr} exDone={exDone} tType={tType} tW={tW} totalCal={totalCal} onPrayer={togglePrayer} onAddFood={addFood} foods={foods} onRmFood={removeFood} sched={sched} />
      )}
      {tab === "workout" && (
        <Workout profile={profile} exDone={exDone} onToggle={toggleWorkout} sched={sched} />
      )}
      {tab === "diet" && (
        <div style={{ padding: "16px", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ ...card(), padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: C.n900, marginBottom: 12 }}>{iA ? "خطة التغذية الذكية" : "AI Meal Plan"}</h2>
            <div style={{ whiteSpace: "pre-line", fontSize: 14, color: C.n800, lineHeight: "1.6" }}>{diet}</div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div style={{ position: "fixed", bottom: 0, insetX: 0, width: "100%", background: C.white, borderTop: `1px solid ${C.n200}`, display: "flex", justifyContent: "space-around", padding: "10px 0", boxShaow: "0 -2px 10px rgba(0,0,0,0.03)" }}>
        <button onClick={() => setTab("today")} style={{ background: "none", border: "none", color: tab === "today" ? C.rose : C.n400, fontWeight: tab === "today" ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{iA ? "اليوم" : "Today"}</button>
        <button onClick={() => setTab("workout")} style={{ background: "none", border: "none", color: tab === "workout" ? C.rose : C.n400, fontWeight: tab === "workout" ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{iA ? "التمارين" : "Workouts"}</button>
        <button onClick={() => setTab("diet")} style={{ background: "none", border: "none", color: tab === "diet" ? C.rose : C.n400, fontWeight: tab === "diet" ? 700 : 500, fontSize: 13, cursor: "pointer" }}>{iA ? "التغذية" : "Nutrition"}</button>
      </div>
    </div>
  );
}
