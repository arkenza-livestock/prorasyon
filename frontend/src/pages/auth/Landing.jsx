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
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <Link to="/giris" style={{color:'rgba(255,255,255,0.8)',textDecoration:'none',fontSize:'0.9rem',fontWeight:600,padding:'8px 16px'}}>Giriş Yap</Link>
          <Link to="/kayit" style={{background:'#22c55e',color:'#fff',textDecoration:'none',fontSize:'0.9rem',fontWeight:700,padding:'10px 22px',borderRadius:12}}>Hemen Başla</Link>
        </div>
      </nav>

      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#0a1f0a 0%,#0f2d0f 40%,#1a3d1a 70%,#0d260d 100%)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',paddingTop:68}}>
        <div style={{position:'absolute',top:'10%',right:'5%',width:400,height:400,background:'radial-gradient(circle,rgba(74,222,128,0.08) 0%,transparent 70%)',borderRadius:'50%'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
        <div style={{maxWidth:1200,margin:'0 auto',padding:'80px 40px',textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:999,padding:'6px 16px',marginBottom:32}}>
            <span style={{fontSize:'0.75rem',color:'#4ade80',fontWeight:700}}>🐄 TÜRKİYE'NİN AKILLI BESİ YÖNETİM PLATFORMU</span>
          </div>
          <h1 style={{fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,color:'#fff',lineHeight:1.1,marginBottom:24}}>
            Besiciliğinizi<br /><span style={{color:'#4ade80'}}>Dijitale Taşıyın</span>
          </h1>
          <p style={{fontSize:'clamp(1rem,2vw,1.25rem)',color:'rgba(255,255,255,0.65)',maxWidth:600,margin:'0 auto 40px',lineHeight:1.7}}>
            Rasyon hesaplama, tartım takibi, gider defteri ve kâr analizi — hepsi tek platformda. Türkiye'nin çiftçileri için geliştirildi.
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/kayit" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#22c55e',color:'#fff',textDecoration:'none',fontSize:'1rem',fontWeight:800,padding:'16px 32px',borderRadius:14,boxShadow:'0 8px 30px rgba(34,197,94,0.35)'}}>Hemen Başla →</Link>
            <Link to="/giris" style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.08)',color:'#fff',textDecoration:'none',fontSize:'1rem',fontWeight:700,padding:'16px 32px',borderRadius:14,border:'1px solid rgba(255,255,255,0.15)'}}>Giriş Yap</Link>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:48,marginTop:64,flexWrap:'wrap'}}>
            {[{num:'500K+',label:'Büyükbaş İşletme'},{num:'%0',label:'Komisyon'},{num:'7/24',label:'Erişim'},{num:'₺0',label:'Başlangıç Ücreti'}].map(s=>(
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
            <h2 style={{fontSize:'clamp(1.8rem,3vw,2.6rem)',fontWeight:900,color:'#0f2d0f',lineHeight:1.2}}>Besi yönetiminin her adımı<br />tek ekranda</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24}}>
            {[
              {icon:'🐄',title:'Rasyon Hesaplama',desc:'Yem kalemlerini, oranlarını ve kuru madde değerlerini kendiniz belirleyin. Dönemsel maliyet tabloları otomatik hesaplanır.'},
              {icon:'⚖️',title:'Tartım Takibi',desc:'Her tartım kaydı tarih damgasıyla saklanır. FCR, günlük canlı ağırlık artışı ve performans durumu anlık gösterilir.'},
              {icon:'🧾',title:'Gider Defteri',desc:'8 aylık işçilik, veteriner, elektrik, yem ve diğer giderler çiftlik bazlı kayıt altına alınır.'},
              {icon:'📈',title:'Kâr Analizi',desc:'Alış maliyeti, yem gideri ve karkas satış gelirinden net kâr/zarar, ROI ve başa baş fiyatı hesaplanır.'},
              {icon:'📄',title:'Profesyonel Raporlar',desc:'Word ve Excel formatında rapor alın. Muhasebe ve banka için hazır belgeler oluşturun.'},
              {icon:'🏢',title:'Çok Çiftlik Desteği',desc:'Birden fazla çiftlik ve grup yönetin. Her grup bağımsız verilere sahip.'},
            ].map(f=>(
              <div key={f.title} style={{background:'#fff',borderRadius:20,padding:'28px 24px',border:'1px solid #e5ece0',boxShadow:'0 4px 20px rgba(0,0,0,0.04)'}}>
                <div style={{fontSize:'2rem',marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontSize:'1rem',fontWeight:800,color:'#0f2d0f',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'0.85rem',color:'#5a6e53',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'#0f2d0f',padding:'100px 40px'}}>
        <div style={{maxWidth:1100,margin:'0 auto',textAlign:'center'}}>
          <div style={{color:'#4ade80',fontWeight:800,fontSize:'0.8rem',letterSpacing:'0.1em',marginBottom:12}}>NEDEN PRORASYON?</div>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.4rem)',fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:48}}>Türk çiftçisi için<br />Türk çiftçisi tarafından</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20}}>
            {[
              {icon:'🇹🇷',title:'Tamamen Türkçe',desc:'Arayüzden raporlara kadar her şey Türkçe. TL cinsinden hesaplama.'},
              {icon:'📱',title:'Her Cihazda Çalışır',desc:'Telefon, tablet veya bilgisayardan erişin. İnternet olan her yerde kullanın.'},
              {icon:'🔒',title:'Güvenli Veri',desc:'Verileriniz şifreli olarak bulutta saklanır. Sadece siz erişirsiniz.'},
              {icon:'💰',title:'Hızlı Kurulum',desc:'Hesap açın, hemen kullanmaya başlayın. Kredi kartı gerekmez.'},
            ].map(f=>(
              <div key={f.title} style={{background:'rgba(255,255,255,0.05)',borderRadius:18,padding:'28px 22px',border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize:'2rem',marginBottom:14}}>{f.icon}</div>
                <h3 style={{fontSize:'1rem',fontWeight:800,color:'#fff',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'0.83rem',color:'rgba(255,255,255,0.55)',lineHeight:1.65}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{background:'linear-gradient(135deg,#14532d 0%,#15803d 100%)',padding:'100px 40px',textAlign:'center'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <h2 style={{fontSize:'clamp(1.8rem,3vw,2.8rem)',fontWeight:900,color:'#fff',lineHeight:1.2,marginBottom:20}}>Çiftliğinizi dijitale taşımaya hazır mısınız?</h2>
          <p style={{color:'rgba(255,255,255,0.7)',fontSize:'1.05rem',marginBottom:36,lineHeight:1.7}}>Dakikalar içinde hesap açın. Kredi kartı gerekmez.</p>
          <Link to="/kayit" style={{display:'inline-flex',alignItems:'center',gap:8,background:'#fff',color:'#15803d',textDecoration:'none',fontSize:'1.05rem',fontWeight:800,padding:'18px 40px',borderRadius:14,boxShadow:'0 8px 30px rgba(0,0,0,0.2)'}}>Hesap Oluştur →</Link>
        </div>
      </div>

      <footer style={{background:'#0a1a0a',padding:'40px',textAlign:'center'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16}}>
          <span style={{fontSize:'1.2rem'}}>🌾</span>
          <span style={{color:'#fff',fontWeight:800,fontSize:'1rem'}}>ProRasyon</span>
        </div>
        <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.78rem'}}>© 2026 ProRasyon — Akıllı Besi Yönetimi • Tüm hakları saklıdır.</p>
      </footer>

    </div>
  )
}