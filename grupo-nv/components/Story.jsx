"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourney, SECTIONS } from "@/lib/store";
import KpiCard from "@/components/KpiCard";
import { Monogram, LogoLockup } from "@/components/Logo";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function Headline({ lines, style }) {
  return (
    <h1 className="headline" style={style}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span data-reveal>{l}</span>
        </span>
      ))}
    </h1>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        yPercent: 110,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 74%" },
      });
      gsap.from(el.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 28,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}

function Chapter({ index, align = "left", eyebrow, className = "", children }) {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      className={`chapter ${className}`}
      data-align={align}
      id={`ch-${index}`}
    >
      <div className={align === "center" ? "stage" : "panel"}>
        {eyebrow && (
          <div className="eyebrow" data-reveal>
            {`${String(index + 1).padStart(2, "0")} — ${eyebrow}`}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

/* Project chapter — floating panel over the 3D render background. */
function Project({ index, eyebrow, title, location, lede, kpis }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="chapter proj" data-align="left" id={`ch-${index}`}>
      <div className="panel">
        <div className="eyebrow" data-reveal>
          {`${String(index + 1).padStart(2, "0")} — ${eyebrow}`}
        </div>
        <Headline lines={title} style={{ fontSize: "clamp(2rem,4.4vw,3.4rem)" }} />
        {location && (
          <div className="loc" data-reveal>
            ◐ {location}
          </div>
        )}
        <p className="lede" data-reveal>
          {lede}
        </p>
        <div className="kpi-grid">
          {kpis.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Member({ photo, name, role, bio, prev }) {
  return (
    <div className="glass member" data-fade>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ph" src={photo} alt={name} loading="lazy" />
      <div>
        <h3>{name}</h3>
        <div className="role">{role}</div>
        <div className="bio">{bio}</div>
        {prev && <div className="prev">{prev}</div>}
      </div>
    </div>
  );
}

function Rail() {
  const section = useJourney((s) => s.section);
  return (
    <nav className="rail" aria-label="Secciones">
      {Array.from({ length: SECTIONS }).map((_, i) => (
        <button
          key={i}
          data-active={i === section}
          aria-label={`Ir a la sección ${i + 1}`}
          onClick={() =>
            document.getElementById(`ch-${i}`)?.scrollIntoView({ behavior: "smooth" })
          }
        />
      ))}
    </nav>
  );
}

export default function Story() {
  return (
    <>
      <div className="brand">
        <div className="brand-logo">
          <Monogram size={26} />
          <span>GRUPO NV</span>
        </div>
        <small>Real Estate Private Equity</small>
      </div>
      <Rail />
      <div className="scroll-cue" data-reveal>
        Desliza
      </div>

      <main className="story">
        {/* 01 — MANIFIESTO */}
        <Chapter index={0} align="center">
          <div data-fade>
            <LogoLockup />
          </div>
          <Headline
            lines={["El valor no se encuentra.", "Se crea."]}
            style={{ marginTop: "2.4rem" }}
          />
          <p className="lede" data-reveal style={{ margin: "1.4rem auto 0", letterSpacing: "0.04em" }}>
            Capital. Disciplina. Diseño. Ejecución.
          </p>
        </Chapter>

        {/* 02 — TESIS + TRACK RECORD REAL */}
        <Chapter index={1} align="center" eyebrow="La Disciplina">
          <Headline lines={["Construimos plataformas", "inmobiliarias de largo plazo."]} />
          <div className="pillars" data-fade>
            Desarrollamos <span>·</span> Invertimos <span>·</span> Operamos
          </div>
          <div className="stats">
            <div className="stat" data-fade>
              <div className="n">
                +<CountUp value={150} />
              </div>
              <div className="k">Proyectos desarrollados</div>
            </div>
            <div className="stat" data-fade>
              <div className="n">
                +<CountUp value={1.5} decimals={1} />M
              </div>
              <div className="k">m² construidos</div>
            </div>
            <div className="stat" data-fade>
              <div className="n">
                +US$<CountUp value={3} />B
              </div>
              <div className="k">Inversión gestionada</div>
            </div>
            <div className="stat" data-fade>
              <div className="n">
                +<CountUp value={60} />
              </div>
              <div className="k">Años de experiencia</div>
            </div>
          </div>
        </Chapter>

        {/* 03 — CÓMO CREAMOS VALOR (3D build) */}
        <Chapter index={2} eyebrow="Cómo creamos valor">
          <Headline lines={["De la tierra", "al hito."]} />
          <p className="lede" data-reveal>
            Un proceso disciplinado para transformar oportunidades en activos
            generadores de valor — construido en tiempo real mientras navegas.
          </p>
          <div className="pillars" data-fade style={{ fontSize: "clamp(0.9rem,1.7vw,1.25rem)" }}>
            Originación <span>·</span> Underwriting <span>·</span> Estructuración{" "}
            <span>·</span> Desarrollo <span>·</span> Operación <span>·</span> Monetización
          </div>
        </Chapter>

        {/* 04 — CASA NUBA (render en fondo 3D) */}
        <Project
          index={3}
          eyebrow="Casa Nuba · Hotelería"
          title={["Casa Nuba."]}
          location="Punta Lobos, Pichilemu"
          lede="Desarrollo turístico boutique Open Light: 18 unidades, inversión de $1.900 MM, orientado a flujos recurrentes y sostenibles en el largo plazo."
          kpis={[
            { label: "TIR Apalancada", value: 39.4, suffix: "%", decimals: 1 },
            { label: "NOI Año 1", value: 229, prefix: "$", suffix: " MM" },
            { label: "DSCR mínimo", value: 2.81, suffix: "x", decimals: 2 },
            { label: "Ocupación Año 1", value: 55, suffix: "%" },
          ]}
        />

        {/* 05 — BODEFLEX (render en fondo 3D) */}
        <Project
          index={4}
          eyebrow="Bodeflex Valle Grande · Industrial"
          title={["Bodeflex", "Valle Grande."]}
          location="Valle Grande, Lampa"
          lede="Bodegaje flexible institucional: 22.080 m² arrendables, unidades modulares desde 200 m², 6–8 m de altura libre y seguridad 24/7."
          kpis={[
            { label: "TIR Apalancada", value: 25, suffix: "%" },
            { label: "NOI Año 1", value: 40200, suffix: " UF" },
            { label: "DSCR mínimo", value: 1.9, suffix: "x", decimals: 1 },
            { label: "Ocupación estab.", value: 95, suffix: "%" },
          ]}
        />

        {/* 06 — +VALUE */}
        <Chapter index={5} align="center" eyebrow="+Value · Oportunístico">
          <Headline lines={["Valor donde", "otros ven desgaste."]} />
          <div className="glass mini" data-fade>
            <div style={{ textAlign: "left" }}>
              <strong style={{ fontWeight: 500, letterSpacing: "0.06em" }}>
                Strip center · Región Metropolitana
              </strong>
              <p className="lede" style={{ marginTop: "0.6rem", maxWidth: "46ch" }}>
                Adquisición value-add: optimización de rentas, reposicionamiento
                comercial y mejoras físicas selectivas para hacer crecer el NOI.
              </p>
            </div>
            <span className="nda">En negociación · NDA</span>
          </div>
        </Chapter>

        {/* 07 — LIDERAZGO & CONSEJO ASESOR */}
        <Chapter index={6} align="center" eyebrow="Liderazgo & Consejo Asesor">
          <Headline lines={["Quiénes están", "detrás del capital."]} />
          <div className="team">
            <Member
              photo="/team/tomas.jpg"
              name="Tomás Armas Alvear"
              role="Socio Fundador & Managing Partner"
              bio="Desarrollo inmobiliario, originación de oportunidades, inversiones y relación con inversionistas."
            />
            <Member
              photo="/team/cristian.jpg"
              name="Cristián Armas Morel"
              role="Socio Fundador & Strategist Partner"
              bio="Estrategia corporativa, desarrollo de negocios, relaciones institucionales y expansión."
            />
            <Member
              photo="/team/pedro.jpg"
              name="Pedro Cueto"
              role="Consejo Asesor"
              bio="Estrategia corporativa, escalamiento empresarial, gobierno corporativo y evaluación de inversiones."
              prev="Ex Bain & Company · Director de Compañías"
            />
            <Member
              photo="/team/boris.jpg"
              name="Boris Buvinic"
              role="Consejo Asesor"
              bio="Estructuración financiera, relación con banca, levantamiento de capital y gobierno corporativo."
              prev="Ex Gerente General Banco Itaú Chile"
            />
          </div>
        </Chapter>

        {/* 08 — CIERRE + CTA */}
        <Chapter index={7} align="center">
          <div data-fade style={{ marginBottom: "1.8rem" }}>
            <LogoLockup />
          </div>
          <Headline lines={["Originar.", "Desarrollar. Operar."]} />
          <p className="lede" data-reveal style={{ margin: "1.4rem auto 0" }}>
            Capital disciplinado, activos reales, valor durable.
          </p>
          <div className="cta" data-fade>
            <a className="btn btn-primary" href="mailto:invest@gruponv.cl">
              Solicitar el deck de inversión
            </a>
            <a className="btn btn-ghost" href="mailto:invest@gruponv.cl">
              Contactar al equipo
            </a>
          </div>
        </Chapter>
      </main>
    </>
  );
}

/* Conteo animado al entrar en viewport. */
function CountUp({ value, decimals = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: value,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (el)
              el.textContent = obj.v.toLocaleString("es-CL", {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
              });
          },
        }),
    });
    return () => st.kill();
  }, [value, decimals]);
  return <span ref={ref}>0</span>;
}
