const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "name": "Daniele",
  "city": "Napoli",
  "taglineFilm": "Videomaker · Fonico · Montatore",
  "taglineDev": "Developer · Tool · Game · App",
  "accentFilm": "oklch(72% 0.14 55)",
  "accentDev": "oklch(72% 0.14 195)"
}/*EDITMODE-END*/;

// ─── Intersection observer hook ─────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ─── Typing effect ───────────────────────────────────────────────────────────
function useTyping(text, speed = 55, start = true) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!start) return;
    setDisplayed('');
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, start]);
  return displayed;
}

// ─── Label ───────────────────────────────────────────────────────────────────
function Label({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <div style={{ width: '24px', height: '1px', background: 'var(--accent)', transition: 'background 0.6s' }} />
      <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--fg3)', letterSpacing: '0.2em' }}>
        {text.toUpperCase()}
      </span>
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ mode, setMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = ['about', 'skills', 'esperienze', 'studi', 'ingrippo'];

  return (
    <>
      <nav className="nav-container" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px',
        background: scrolled ? 'rgba(11,11,11,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.4s ease',
      }}>
        <span className="nav-brand" style={{ fontFamily: 'Space Mono', fontSize: '0.75rem', color: 'var(--fg3)', letterSpacing: '0.15em', zIndex: 101 }}>
          PORTFOLIO
        </span>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="nav-links-wrapper">
          {links.map(l => (
            <a key={l} href={`#${l}`} className="nav-link-item" style={{
              color: 'var(--fg2)', fontSize: '0.78rem', textDecoration: 'none',
              letterSpacing: '0.08em', textTransform: 'uppercase', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--fg)'}
            onMouseLeave={e => e.target.style.color = 'var(--fg2)'}
            >{l}</a>
          ))}
          <button onClick={() => setMode(m => m === 'film' ? 'dev' : 'film')} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: '20px', padding: '5px 12px', cursor: 'pointer',
            color: 'var(--fg2)', fontSize: '0.72rem', letterSpacing: '0.06em',
            fontFamily: 'Space Mono', transition: 'all 0.3s', zIndex: 101,
          }}>
            <span style={{ color: mode === 'film' ? 'var(--film)' : 'var(--fg3)' }}>FILM</span>
            <span style={{ color: 'var(--fg3)' }}>/</span>
            <span style={{ color: mode === 'dev' ? 'var(--dev)' : 'var(--fg3)' }}>DEV</span>
          </button>
          
          <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', color: 'var(--fg)', fontSize: '1.5rem', cursor: 'pointer', zIndex: 101, padding: '0 0 0 1rem'
          }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            {links.map(l => (
              <a key={l} href={`#${l}`} onClick={() => setMenuOpen(false)} style={{
                color: 'var(--fg)', fontSize: '1.2rem', textDecoration: 'none',
                letterSpacing: '0.1em', textTransform: 'uppercase'
              }}>{l}</a>
            ))}
         </div>
      </div>
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ mode, tweaks }) {
  const typed = useTyping(mode === 'film' ? tweaks.taglineFilm : tweaks.taglineDev, 45, true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="hero-section" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', width: '500px', height: '500px', borderRadius: '50%',
        background: mode === 'film'
          ? 'radial-gradient(circle, oklch(72% 0.14 55 / 0.12) 0%, transparent 70%)'
          : 'radial-gradient(circle, oklch(72% 0.14 195 / 0.12) 0%, transparent 70%)',
        left: '-100px', top: '50%', transform: 'translateY(-50%)',
        transition: 'background 0.8s ease', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem',
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.7s ease 0.1s',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', transition: 'background 0.6s' }} />
          <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.2em' }}>
            {tweaks.city.toUpperCase()} · 2026
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 700,
          lineHeight: 1.0, letterSpacing: '-0.03em', marginBottom: '1.5rem',
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s',
        }}>{tweaks.name}</h1>

        <p style={{
          fontFamily: 'Space Mono', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
          color: 'var(--accent)', minHeight: '2em',
          opacity: loaded ? 1 : 0,
          transition: 'color 0.6s ease, opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
        }}>
          {typed}<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </p>

        <p style={{
          marginTop: '2rem', maxWidth: '540px',
          color: 'var(--fg2)', fontSize: '1.05rem', lineHeight: 1.7,
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.8s ease 0.6s',
        }}>
          Ho frequentato un istituto professionale in{' '}
          <em style={{ color: 'var(--fg)', fontStyle: 'normal' }}>Servizi Culturali e dello Spettacolo</em>,
          indirizzo audiovisivo. E attualmente frequento il corso di{' '}
          <em style={{ color: 'var(--fg)', fontStyle: 'normal' }}>NTA (Nuove tecnologie dell'arte)</em>{' '}
           all'Accademia di Belle Arti di Napoli.
        </p>

        <div style={{
          marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap',
          opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.8s ease 0.8s',
        }}>
          <a href="#esperienze" style={{
            padding: '0.8rem 2rem', background: 'var(--accent)', color: '#0b0b0b',
            borderRadius: '4px', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
            transition: 'background 0.6s, opacity 0.2s',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
          >Esperienze →</a>
          <a href="#skills" style={{
            padding: '0.8rem 2rem', border: '1px solid var(--border)',
            color: 'var(--fg2)', borderRadius: '4px', textDecoration: 'none',
            fontSize: '0.9rem', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--fg3)'; e.target.style.color = 'var(--fg)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--fg2)'; }}
          >Skills</a>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', opacity: 0.4,
      }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--fg3)' }}>SCROLL</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(var(--fg3), transparent)', animation: 'fadeDown 2s ease-in-out infinite' }} />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const [ref, visible] = useReveal();
  return (
    <section id="about" ref={ref} className="section" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="grid-2" style={{
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)',
        transition: 'all 0.9s ease',
      }}>
        <div>
          <Label text="About" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Due mondi,<br />un'unica<br /><span style={{ color: 'var(--accent)', transition: 'color 0.6s' }}>visione.</span>
          </h2>
          <p style={{ color: 'var(--fg2)', lineHeight: 1.8, marginBottom: '1rem' }}>
            Ho frequentato un istituto professionale ad indirizzo{' '}
            <strong style={{ color: 'var(--fg)' }}>Servizi Culturali e dello Spettacolo</strong>,
            dove ho sviluppato una formazione tecnica e artistica nel campo audiovisivo.
          </p>
          <p style={{ color: 'var(--fg2)', lineHeight: 1.8 }}>
            In parallelo, la passione per l'informatica mi ha portato a diventare uno{' '}
            <strong style={{ color: 'var(--fg)' }}>sviluppatore per hobby</strong>: creo tool, giochi e applicazioni,
            e collaboro con <strong style={{ color: 'var(--fg)' }}>Pred</strong> anche in ambito software. </p >
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
          {[
            { num: '2×', label: 'Identità', sub: 'Videomaker & Developer' },
            { num: 'NAP', label: 'Base', sub: 'Napoli, Campania' },
            { num: 'NTA', label: 'Studi correnti', sub: 'Accademia di Belle Arti' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1.5rem',
              padding: '1.2rem 1.5rem', background: 'var(--bg3)',
              border: '1px solid var(--border)', borderRadius: '8px',
              opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(20px)',
              transition: `all 0.7s ease ${0.2 + i * 0.1}s`,
            }}>
              <span style={{ fontFamily: 'Space Mono', fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent)', minWidth: '70px', transition: 'color 0.6s' }}>{s.num}</span>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--fg3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</div>
                <div style={{ fontWeight: 600 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function Skills() {
  const [ref, visible] = useReveal();
  const [tab, setTab] = useState('film');

  const filmSkills = [
    { title: 'Linguaggi & Mercati', desc: 'Individuare, valorizzare e utilizzare stili e linguaggi di specifici mercati e contesti espressivi in prospettiva storica.' },
    { title: 'Produzione Audiovisiva', desc: 'Realizzare prodotti visivi, audiovisivi e sonori in collaborazione con Enti e Istituzioni pubblici e privati.' },
    { title: 'Soluzioni Tecnico-Espressive', desc: 'Ideare e realizzare soluzioni funzionali al concept del prodotto nel rispetto del target individuato.' },
  ];

  const devSkills = [
    { title: 'Sviluppo Web & App', desc: 'Creazione di applicazioni web e mobile come hobby, con focus su usabilità e funzionalità.' },
    { title: 'Tool & Automazione', desc: 'Progettazione e sviluppo di strumenti personalizzati per automatizzare processi e semplificare workflow.' },
    { title: 'Game Development', desc: 'Un mondo che sto iniziando ad esplorare: prototipazione, logica di gioco, interfacce interattive. Mi sto avvicinando con curiosità.' },
    { title: 'Collaborazione Pred', desc: 'Contributo attivo come sviluppatore nel team di Pred, affiancando la collaborazione come videomaker.' },
  ];

  const current = tab === 'film' ? filmSkills : devSkills;

  return (
    <section id="skills" ref={ref} className="section" style={{ background: 'var(--bg2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <Label text="Skills" />
          <div className="skills-header-flex" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Competenze</h2>
            <div style={{ display: 'flex', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              {[['film', '🎬 Audiovisivo'], ['dev', '</> Developer']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} style={{
                  padding: '0.6rem 1.5rem',
                  background: tab === key ? (key === 'film' ? 'var(--film)' : 'var(--dev)') : 'transparent',
                  color: tab === key ? '#0b0b0b' : 'var(--fg3)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'Space Grotesk', fontWeight: 600, fontSize: '0.85rem',
                  transition: 'all 0.3s',
                }}>{label}</button>
              ))}
            </div>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1px', background: 'var(--border)',
            border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden',
          }}>
            {current.map((s, i) => (
              <SkillCard key={`${tab}-${i}`} skill={s} idx={i} visible={visible} tab={tab} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, idx, visible, tab }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '1.8rem',
        background: hov ? 'var(--bg3)' : 'var(--bg2)',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(15px)',
        transition: `background 0.3s, opacity 0.6s ease ${idx * 0.05}s, transform 0.6s ease ${idx * 0.05}s`,
      }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: tab === 'film' ? 'var(--film)' : 'var(--dev)', marginBottom: '1rem', transition: 'background 0.6s' }} />
      <h3 style={{ fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.95rem' }}>{skill.title}</h3>
      <p style={{ color: 'var(--fg2)', fontSize: '0.85rem', lineHeight: 1.6 }}>{skill.desc}</p>
    </div>
  );
}

// ─── Esperienze ───────────────────────────────────────────────────────────────
function Esperienze() {
  const [ref, visible] = useReveal();

  const items = [
    {
      year: '2024 → oggi', role: 'Videomaker',
      company: 'Comicon × Scuola di Cinema di Napoli', type: 'film',
      desc: 'Chiamato ogni anno durante il Comicon di Napoli grazie alla collaborazione con la Scuola di Cinema e Pred. Riprese sul campo, copertura dell\'evento, storytelling visivo.',
      tags: ['Videomaking', 'Riprese', 'Storytelling'],
    },
    {
      year: '2024', role: 'Fonico a presa diretta & Montatore',
      company: 'Documentario su Napoli', type: 'film',
      desc: 'Partecipazione attiva alle riprese di un documentario su Napoli. Doppio ruolo: acquisizione audio in presa diretta sul set e montaggio del materiale in post-produzione.',
      tags: ['Presa diretta', 'Montaggio', 'Documentario'],
    },
    {
      year: '2023 → oggi', role: 'Sviluppatore Collaboratore',
      company: 'Pred', type: 'dev',
      desc: 'Collaborazione tecnica con Pred in ambito software development. Sviluppo di tool e soluzioni digitali a fianco del lavoro audiovisivo.',
      tags: ['Sviluppo', 'Tool', 'Collaborazione'],
    },
    {
      year: '2025 → oggi', role: 'Studente NTA',
      company: 'Accademia di Belle Arti di Napoli', type: 'dev',
      desc: 'Iscritto al corso di Nuove Tecnologie dell\'Arte (NTA), dove arte, tecnologia e design si incontrano in un percorso accademico sperimentale.',
      tags: ['Arte', 'Tecnologia', 'NTA'],
    },
  ];

  return (
    <section id="esperienze" ref={ref} className="section">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <Label text="Esperienze" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '3.5rem' }}>Sul campo</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '0', top: 0, bottom: 0, width: '1px', background: 'linear-gradient(var(--border), var(--border) 80%, transparent)' }} />
          {items.map((item, i) => <TimelineItem key={i} item={item} idx={i} visible={visible} />)}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, idx, visible }) {
  const [hov, setHov] = useState(false);
  const accentColor = item.type === 'film' ? 'var(--film)' : 'var(--dev)';
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        paddingLeft: '2.5rem', paddingBottom: '3rem', position: 'relative',
        opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-20px)',
        transition: `all 0.7s ease ${idx * 0.12}s`,
      }}>
      <div style={{
        position: 'absolute', left: '-5px', top: '6px',
        width: '11px', height: '11px', borderRadius: '50%',
        background: hov ? accentColor : 'var(--bg3)',
        border: `2px solid ${hov ? accentColor : 'var(--fg3)'}`,
        transition: 'all 0.3s',
      }} />
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.1em' }}>{item.year}</span>
        <span style={{
          fontSize: '0.65rem', padding: '2px 8px', borderRadius: '3px',
          background: item.type === 'film' ? 'oklch(72% 0.14 55 / 0.15)' : 'oklch(72% 0.14 195 / 0.15)',
          color: accentColor, fontFamily: 'Space Mono', letterSpacing: '0.08em',
        }}>{item.type === 'film' ? 'FILM' : 'DEV'}</span>
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.role}</h3>
      <p style={{ color: accentColor, fontSize: '0.85rem', marginBottom: '0.75rem', fontWeight: 500 }}>{item.company}</p>
      <p style={{ color: 'var(--fg2)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{item.desc}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {item.tags.map(t => (
          <span key={t} style={{ fontSize: '0.72rem', padding: '3px 10px', border: '1px solid var(--border)', borderRadius: '3px', color: 'var(--fg3)', fontFamily: 'Space Mono' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Studi ────────────────────────────────────────────────────────────────────
function Studi() {
  const [ref, visible] = useReveal();
  return (
    <section id="studi" ref={ref} className="section" style={{ background: 'var(--bg2)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <Label text="Studi" />
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '3rem' }}>Formazione</h2>
          <div className="grid-2-studi">
            <StudiCard period="Diploma" title="Servizi Culturali e dello Spettacolo" sub="Indirizzo Audiovisivo" color="var(--film)" delay={0} visible={visible} desc="Percorso quinquennale professionale con focus su produzione e post-produzione audiovisiva, comunicazione culturale, linguaggi espressivi e tecnica del suono." />
            <StudiCard period="In corso · 2025→" title="Nuove Tecnologie dell'Arte" sub="Accademia di Belle Arti di Napoli" color="var(--dev)" delay={0.15} visible={visible} desc="Corso accademico all'intersezione tra arte contemporanea, tecnologie digitali e sperimentazione creativa. Un laboratorio per ibridare i due mondi." />
          </div>
        </div>
      </div>
    </section>
  );
}

function StudiCard({ period, title, sub, color, delay, visible, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '2.5rem',
        border: `1px solid ${hov ? color : 'var(--border)'}`,
        borderRadius: '12px',
        background: hov ? 'var(--bg3)' : 'transparent',
        transition: 'all 0.3s',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        cursor: 'default',
        transitionDelay: `${delay}s`,
      }}>
      <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: 'var(--fg3)', letterSpacing: '0.12em' }}>{period.toUpperCase()}</span>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.75rem 0 0.25rem', lineHeight: 1.2 }}>{title}</h3>
      <p style={{ color, fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>{sub}</p>
      <p style={{ color: 'var(--fg2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

// ─── L'Ingrippo ───────────────────────────────────────────────────────────────
function Ingrippo() {
  const [ref, visible] = useReveal();
  const [active, setActive] = useState(null);

  const tensioni = [
    {
      n: '01',
      domanda: 'Si può fare arte con l\'informatica?',
      corpo: `Quando scrivo codice e costruisco qualcosa che funziona, sento il peso dell'ingegneria — la logica, la struttura, l'efficienza. Ho realizzato progetti dove il corpo diventa input: il gesto di una mano catturato da una telecamera, trasformato in dati, tradotto in luce su una matrice LED. Tecnicamente funziona. Ma è arte? Il dubbio non è se si possa fare arte con l'informatica — si può. Il dubbio è riuscire a vederlo come tale senza perdermi nei meccanismi che ci stanno dietro. Questa è la mia battaglia personale.`,
      keyword: 'Arte ↔ Ingegneria',
    },
    {
      n: '02',
      domanda: 'L\'AI rovina l\'arte o la espande?',
      corpo: `Sperimento con l'AI costruendo progetti dove la tecnologia diventa gesto — uno degli esempi più concreti è un dispositivo sviluppato insieme a due compagni: un sistema di tracking delle mani per disegnare su matrici LED, dove il movimento umano viene tradotto in luce mediato da un algoritmo. È arte? È ingegneria? Probabilmente entrambe le cose, e questo è esattamente il problema. Con progetti come questo mi trovo sempre nello stesso vicolo: finisco per valorizzare la complessità tecnica dietro il risultato invece di guardare cosa comunica. L'AI non rovina l'arte — ma rende più difficile distinguere quando stai costruendo uno strumento e quando stai esprimendo qualcosa. La domanda vera è: che tipo di arte emerge quando il gesto dell'autore è già filtrato da un modello?`,
      keyword: 'Tracking · LED · AI',
    },
    {
      n: '03',
      domanda: 'Perché l\'arte dopo il cinema e il codice?',
      corpo: `Vengo dal video — dal racconto visivo, dalla presa diretta, dal montaggio. Poi il codice, la logica, i tool. Il corso di NTA all'Accademia non è una deviazione: è il tentativo di trovare il vocabolario che manca. Un linguaggio che non sia solo tecnico né solo estetico, ma che stia nel mezzo. Forse l'arte è proprio quello spazio — dove la tecnica smette di spiegarsi e comincia a significare.`,
      keyword: 'Cinema · Codice · Arte',
    },
  ];

  return (
    <section id="ingrippo" ref={ref} className="ingrippo-section" style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Space Grotesk', fontWeight: 700,
        fontSize: 'clamp(8rem, 20vw, 18rem)',
        color: 'rgba(255,255,255,0.025)',
        whiteSpace: 'nowrap', userSelect: 'none',
        letterSpacing: '-0.05em', pointerEvents: 'none',
      }}>?</div>

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
          <Label text="L'Ingrippo" />
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.8rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '1rem' }}>
            Le domande<br />che non mi<br />danno pace.
          </h2>
          <p style={{ color: 'var(--fg2)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '4rem', fontSize: '1rem' }}>
            Non ho risposte. Ho tensioni. Tre, per ora — tra arte e tecnica, tra l'AI e la creatività, tra i mondi che abito.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {tensioni.map((t, i) => (
            <TensioneCard key={i} t={t} i={i} visible={visible} open={active === i} onToggle={() => setActive(active === i ? null : i)} />
          ))}
        </div>

        <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', opacity: visible ? 1 : 0, transition: 'opacity 1s ease 0.5s' }}>
          <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 600, lineHeight: 1.4, color: 'var(--fg)', letterSpacing: '-0.01em' }}>
            "L'informatica può diventare arte — o finisce sempre per essere solo ingegneria ben fatta?"
          </p>
          <p style={{ marginTop: '1rem', color: 'var(--fg3)', fontFamily: 'Space Mono', fontSize: '0.72rem', letterSpacing: '0.12em' }}>— DANIELE, 2026</p>
        </div>
      </div>
    </section>
  );
}

function TensioneCard({ t, i, visible, open, onToggle }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: open ? 'var(--bg3)' : hov ? '#0f0f0f' : 'var(--bg)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(10px)',
        transition: `background 0.3s, opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
      }}>
      <button className="tensione-card-btn" onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontFamily: 'Space Mono', fontSize: '0.7rem', color: open ? 'var(--accent)' : 'var(--fg3)', minWidth: '28px', transition: 'color 0.3s' }}>{t.n}</span>
        <span style={{ flex: 1, fontWeight: 600, fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: 'var(--fg)', letterSpacing: '-0.01em' }}>{t.domanda}</span>
        <span style={{ color: 'var(--fg3)', fontSize: '1.2rem', lineHeight: 1, transform: open ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>+</span>
      </button>
      <div className={`tensione-body${open ? ' open' : ''}`}>
        <div>
          <div className="tensione-body-content">
            <p style={{ color: 'var(--fg2)', lineHeight: 1.9, fontSize: '0.95rem', maxWidth: '600px' }}>{t.corpo}</p>
            <span style={{
              display: 'inline-block', marginTop: '1.2rem',
              fontFamily: 'Space Mono', fontSize: '0.65rem',
              color: 'var(--accent)', letterSpacing: '0.12em',
              padding: '3px 10px', border: '1px solid var(--accent)',
              borderRadius: '3px', opacity: 0.7,
            }}>{t.keyword}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ tweaks }) {
  return (
    <footer className="footer-section" style={{ borderTop: '1px solid var(--border)', textAlign: 'center' }}>
      <p style={{ fontFamily: 'Space Mono', fontSize: '0.72rem', color: 'var(--fg3)', letterSpacing: '0.15em' }}>
        {tweaks.name.toUpperCase()} · {tweaks.city.toUpperCase()} · 2026
      </p>
    </footer>
  );
}

// ─── TweaksPanel ──────────────────────────────────────────────────────────────
function TweaksPanel({ tweaks, setTweaks, visible, setVisible }) {
  const update = (key, val) => {
    const next = { ...tweaks, [key]: val };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };
  if (!visible) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 10000,
      background: '#1a1a1a', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '1.5rem', width: '280px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)', fontFamily: 'Space Grotesk',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tweaks</span>
        <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: 'var(--fg3)', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
      </div>
      {[{ key: 'name', label: 'Nome' }, { key: 'city', label: 'Città' }].map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--fg3)', display: 'block', marginBottom: '4px', letterSpacing: '0.08em' }}>{label.toUpperCase()}</label>
          <input value={tweaks[key]} onChange={e => update(key, e.target.value)} style={{
            width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
            color: 'var(--fg)', padding: '6px 10px', borderRadius: '6px',
            fontSize: '0.85rem', fontFamily: 'Space Grotesk', outline: 'none',
          }} />
        </div>
      ))}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [mode, setMode] = useState('film');
  const autoRef = useRef(null);

  const startAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => setMode(m => m === 'film' ? 'dev' : 'film'), 4000);
  };
  useEffect(() => { startAuto(); return () => clearInterval(autoRef.current); }, []);

  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [tweaksVisible, setTweaksVisible] = useState(false);

  const handleSetMode = (fn) => {
    setMode(fn);
    clearInterval(autoRef.current);
    autoRef.current = setTimeout(() => startAuto(), 10000);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', mode === 'film' ? tweaks.accentFilm : tweaks.accentDev);
    root.style.setProperty('--accent-dim', mode === 'film' ? 'oklch(45% 0.10 55)' : 'oklch(45% 0.10 195)');
  }, [mode, tweaks]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <>
      <Nav mode={mode} setMode={handleSetMode} />
      <Hero mode={mode} tweaks={tweaks} />
      <About />
      <Skills />
      <Esperienze />
      <Studi />
      <Ingrippo />
      <Footer tweaks={tweaks} />
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweaksVisible} setVisible={setTweaksVisible} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
