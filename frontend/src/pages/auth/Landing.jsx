import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",color:'#1a1a1a',overflowX:'hidden'}}>

      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'rgba(15,30,15,0.92)',backdropFilter:'blur(12px)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 40px',height:68,borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:'1.6rem'}}>🌾</span>
          <span style={{color:'#fff',fontWeight:900,fontSize:'1.25rem'}}>ProRasyon</span>
          <span style={{color:'#4ade80',fontSize:'0.7rem',fontWeight:700,background:'rgba(74,222,128,0.15)',padding:'2px 8px',borderRadius:999}}>BETA</span>
        </div>
        <div style={{display:'flex',gap:24,alignItems:'center'}}>
          <a href="#hakkinda" style={{color:'rgba(255,255,255,0.7)',textDecoration:'none',fontSize:'.85rem',fontWeight:600}}>Hakkimizda</a>
          <a href="#iletisim" style={{color:'rgba(255,255,255,0.7)',textDecoration:'none',fontSize:'.85rem',fontWeight:600}}>Iletisim</a>
          <Link to="/giris" style={{color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'0.9rem',fontWeight:600,padding:'8px 16px'}}>Giris Yap</Link>
          <Link to="/kayit" style={{background:'#22c55e',color:'#fff',textDecoration:'none',fontSize:'0.9rem',fontWeight:700,padding:'10px 22px',borderRadius:12}}>Hemen Basla</Link>
        </div>
      </nav>

      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a1f0a 0%,#0f2d0f 40%,#1a3d1a 70%,#0d260d 100%)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:68}}>
        <div style={{position:'absolute',top:'10%',right:'5%',width:400,height:400,background:'radial-gradient(circle,rgba(74,222,128,0.08) 0%,transparent 70%)',borderRadius:'50%'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        <div style={{maxWidth:1200,margin:'0 auto',padding:'80px 40px',textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:999,padding:'6px 16px',marginBottom:32}}>
            <span style={{fontSize:'0.75rem',color:'#4ade80',fontWeight:700}}>TURKIYE'NIN AKILLI BESI YONETIM PLATFORMU</span>
          </div>
          <h1 style={{fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:24}}>
            Besiciliginizi<br /><span style={{color:'#4ade80'}}>Dijitale Tasiyin</span>
          </h1>
          <p style={{fontSize:'clamp(1rem,2vw,1.25rem)',color:'rgba(255,255,255,0.65)',maxWidth:600,margin:'0 auto 40px',lineHeight:1.7}}>
            Rasyon hesaplama, tartim takibi, gider defteri ve kar analizi -- hepsi tek platformda.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/kayit" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#22c55e',color:'#fff',textDecoration:'none',fontSize:'1rem',fontWeight:800,padding:'16px 32px',borderRadius:14,boxShadow:'0 8px 30px rgba(34,197,94,0.35)'}}>Hemen Basla</Link>
            <Link to="/giris" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.08)',color:'#fff',textDecoration:'none',fontSize:'1rem',fontWeight:700,padding:'16px 32px',borderRadius:14,border:'1px solid rgba(255,255,255,0.15)'}}>Giris Yap</Link>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:48,marginTop:64,flexWrap:'wrap'}}>
            {[{num:'500K+',label:'Buyukbas Isletme'},{num:'%0',label:'Komisyon'},{num:'7/24',label:'Erisim'},{num:'30 Gun',label:'Deneme Suresi'}].map(s=>(
              <div key={s.label} style={{textAlign:'center'}}>
                <div style={{fontSize:'1.8rem',fontWeight:900,color:'#4ade80'}}>{s.num}</div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.45)',marginTop:4,fontWeight:600}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#f8faf4',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:64}}>
            <div style={{color:'#16a34a',fontWeight:800,fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:12}}>NELER YAPILIR?</div>
            <h2 style={{fontSize:'clamp(1.8rem,3vw,2.6rem)',fontWeight:900,color:'#0f2d0f',lineHeight:1.2}}>Besi yonetiminin her adimi<br />tek ekranda</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {[
              {title:'Rasyon Hesaplama',desc:'Yem kalemlerini, oranlarini ve kuru madde degerlerini kendiniz belirleyin.'},
              {title:'Tartim Takibi',desc:'Her tarti kaydi tarih damgasiyla saklanir. FCR ve gunluk artis hesaplanir.'},
              {title:'Gider Defteri',desc:'8 aylik isçilik, veteriner, elektrik ve diger giderler kayit altina alinir.'},
              {title:'Kar Analizi',desc:'Alis maliyeti, yem gideri ve satis gelirinden net kar/zarar hesaplanir.'},
              {title:'Profesyonel Raporlar',desc:'Word ve Excel formatinda rapor alin.'},
              {title:'Cok Ciftlik Destegi',desc:'Birden fazla ciftlik ve grup yonetin.'},
            ].map(f=>(
              <div key={f.title} style={{background:'#fff',borderRadius:20,padding:'28px 24px',border:'1px solid #e5ece0',boxShadow:'0 4px 20px rgba(0,0,0,0.04)'}}>
                <h3 style={{fontSize:'1rem',fontWeight:800,color:'#0f2d0f',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'0.85rem',color:'#5a6e53',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="hakkinda" style={{background:'#fff',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
          <div>
            <div style={{color:'#16a34a',fontWeight:800,fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:12}}>HAKKIMIZDA</div>
            <h2 style={{fontSize:'clamp(1.6rem,2.5vw,2.2rem)',fontWeight:900,color:'#0f2d0f',lineHeight:1.25,marginBottom:20}}>Arkenza Grup'un<br />tarim teknolojisi markasi</h2>
            <p style={{color:'#5a6e53',lineHeight:1.75,marginBottom:16,fontSize:'0.95rem'}}>
              ProRasyon, Arkenza Grup tarafindan gelistirilen, Turkiye'deki buyukbas hayvancilik isletmelerinin dijital donusumunu hedefleyen bir platformdur.
            </p>
            <p style={{color:'#5a6e53',lineHeight:1.75,marginBottom:28,fontSize:'0.95rem'}}>
              Ziraat muhendisligi ve yazilim gelistirme deneyimini birlestirerek, sahadaki gercek ihtiyaclara cozum ureten araclar insa ediyoruz.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            {[
              {label:'Misyon: Ciftcinin isini kolaylastirmak'},
              {label:'Vizyon: Turkiye nin lider besi platformu olmak'},
              {label:'Deger: Seffaflik ve guvenilirlik'},
              {label:'Odak: Sahadan gelen gercek ihtiyaclar'},
            ].map(s=>(
              <div key={s.label} style={{background:'#f0fdf4',borderRadius:16,padding:'22px 18px',border:'1px solid #bbf7d0',textAlign:'center'}}>
                <div style={{fontSize:'0.78rem',color:'#166534',fontWeight:600,lineHeight:1.4}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#0f2d0f',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',textAlign:'center'}}>
          <div style={{color:'#4ade80',fontWeight:800,fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:12}}>NEDEN PRORASYON?</div>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:48}}>Turk ciftcisi icin<br />Turk ciftcisi tarafindan</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
            {[
              {title:'Tamamen Turkce',desc:'Arayuzden raporlara kadar her sey Turkce.'},
              {title:'Her Cihazda Calisir',desc:'Telefon, tablet veya bilgisayardan erisin.'},
              {title:'Guvenli Veri',desc:'Verileriniz sifreli olarak bulutta saklanir.'},
              {title:'Hizli Kurulum',desc:'Hesap acin, hemen kullanmaya baslayin.'},
            ].map(f=>(
              <div key={f.title} style={{background:'rgba(255,255,255,0.05)',borderRadius:18,padding:'28px 22px',border:'1px solid rgba(255,255,255,0.08)'}}>
                <h3 style={{fontSize:'1rem',fontWeight:800,color:'#fff',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'0.83rem',color:'rgba(255,255,255,0.55)',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="iletisim" style={{background:'#f8faf4',padding:'100px 40px'}}>
        <div style={{maxWidth:700,margin:'0 auto',textAlign:'center'}}>
          <div style={{color:'#16a34a',fontWeight:800,fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:12}}>ILETISIM</div>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:900,color:'#0f2d0f',lineHeight:1.2,marginBottom:16}}>Bize Ulasin</h2>
          <p style={{color:'#5a6e53',fontSize:'1rem',marginBottom:40,lineHeight:1.7}}>
            Sorulariniz icin bizimle iletisime gecebilirsiniz.
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20}}>
            <div style={{background:'#fff',borderRadius:18,padding:'28px 22px',border:'1px solid #e5ece0'}}>
              <div style={{fontSize:'.78rem',color:'#6b7280',fontWeight:700,marginBottom:4}}>ISLETME</div>
              <div style={{fontSize:'.95rem',color:'#0f2d0f',fontWeight:700}}>Arkenza Grup</div>
            </div>
            <div style={{background:'#fff',borderRadius:18,padding:'28px 22px',border:'1px solid #e5ece0'}}>
              <div style={{fontSize:'.78rem',color:'#6b7280',fontWeight:700,marginBottom:4}}>E-POSTA</div>
              <a href="mailto:arkenzagrup@gmail.com" style={{fontSize:'.95rem',color:'#16a34a',fontWeight:700,textDecoration:'none'}}>arkenzagrup@gmail.com</a>
            </div>
            <div style={{background:'#fff',borderRadius:18,padding:'28px 22px',border:'1px solid #e5ece0'}}>
              <div style={{fontSize:'.78rem',color:'#6b7280',fontWeight:700,marginBottom:4}}>WEB SITESI</div>
              <div style={{fontSize:'.95rem',color:'#0f2d0f',fontWeight:700}}>prorasyon.com.tr</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{background:'linear-gradient(135deg,#14532d 0%,#15803d 100%)',padding:'100px 40px',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:20}}>Ciftliginizi dijitale tasimaya hazir misiniz?</h2>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:'1.05rem',marginBottom:36,lineHeight:1.7}}>Dakikalar icinde hesap acin ve hemen kullanmaya baslayin.</p>
          <Link to="/kayit" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#fff',color:'#15803d',textDecoration:'none',fontSize:'1.05rem',fontWeight:800,padding:'18px 40px',borderRadius:14,boxShadow:'0 8px 30px rgba(0,0,0,0.2)'}}>Hesap Olustur</Link>
        </div>
      </div>

      <footer style={{background:'#0a1a0a',padding:'50px 40px 30px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:32,marginBottom:32}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
              <span style={{color:'#fff',fontWeight:800,fontSize:'1rem'}}>ProRasyon</span>
            </div>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:'.8rem',lineHeight:1.6}}>Turkiye'nin akilli besi yonetim platformu. Arkenza Grup markasidir.</p>
          </div>
          <div>
            <div style={{color:'#fff',fontWeight:700,fontSize:'.85rem',marginBottom:12}}>Sayfalar</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <a href="#hakkinda" style={{color:'rgba(255,255,255,0.5)',fontSize:'.82rem',textDecoration:'none'}}>Hakkimizda</a>
              <a href="#iletisim" style={{color:'rgba(255,255,255,0.5)',fontSize:'.82rem',textDecoration:'none'}}>Iletisim</a>
              <Link to="/giris" style={{color:'rgba(255,255,255,0.5)',fontSize:'.82rem',textDecoration:'none'}}>Giris Yap</Link>
            </div>
          </div>
          <div>
            <div style={{color:'#fff',fontWeight:700,fontSize:'.85rem',marginBottom:12}}>Iletisim</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <a href="mailto:arkenzagrup@gmail.com" style={{color:'rgba(255,255,255,0.5)',fontSize:'.82rem',textDecoration:'none'}}>arkenzagrup@gmail.com</a>
              <span style={{color:'rgba(255,255,255,0.5)',fontSize:'.82rem'}}>Arkenza Grup</span>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1100,margin:'0 auto',borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:20,textAlign:'center'}}>
          <p style={{color:'rgba(255,255,255,0.3)',fontSize:'.78rem'}}>(c) 2026 ProRasyon -- Arkenza Grup. Tum haklari saklidir.</p>
        </div>
      </footer>

    </div>
  )
}
