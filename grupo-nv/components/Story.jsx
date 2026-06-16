"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourney, SECTIONS } from "@/lib/store";
import KpiCard from "@/components/KpiCard";

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

function Chapter({ index, align = "left", eyebrow, children }) {
  const ref = useReveal();
  return (
    <section ref={ref} className="chapter" data-align={align} id={`ch-${index}`}>
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

function Project({ index, eyebrow, image, alt, title, location, lede, kpis }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 76%" },
      });
      gsap.from(el.querySelector(".frame"), {
        opacity: 0,
        scale: 1.08,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="chapter" data-align="center" id={`ch-${index}`}>
      <div className="project">
        <div className="frame">
          <span className="glass tag">{`${String(index + 1).padStart(2, "0")} · ${eyebrow}`}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={alt} loading="lazy" />
        </div>
        <div className="info" style={{ textAlign: "left" }}>
          <h2 className="headline" style={{ fontSize: "clamp(1.9rem,4vw,3.2rem)" }}>
            <span className="line">
              <span data-reveal>{title}</span>
            </span>
          </h2>
          {location && (
            <div className="loc" data-reveal>
              ◐ {location}
            </div>
          )}
          <p className="lede" data-reveal>
            {lede}
          </p>
          <div className="kpi-grid" style={{ maxWidth: "none" }}>
            {kpis.map((k) => (
              <KpiCard key={k.label} {...k} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Member({ initials, name, role, bio, prev }) {
  return (
    <div className="glass member" data-fade>
      <div className="ph">{initials}</div>
      <div>
        <h3>{name}</h3>
        <div className="role">{role}</div>
        <div className="bio">{bio}</div>
        <div className="prev">{prev}</div>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mark" src="/projects/logo-mark.png" alt="Grupo NV" />
          <span>GRUPO NV</span>
        </div>
        <small>Real Estate Private Equity</small>
      </div>
      <Rail />
      <div className="scroll-cue" data-reveal>
        Scroll
      </div>

      <main className="story">
        {/* 01 — MANIFESTO */}
        <Chapter index={0} align="center">
          <div className="logo-plate" data-fade>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/projects/logo-grupo-nv.jpeg" alt="Grupo NV — Real Estate Private Equity" />
          </div>
          <Headline
            lines={["Value is not found.", "It is created."]}
            style={{ marginTop: "2.4rem" }}
          />
          <p className="lede" data-reveal style={{ margin: "1.4rem auto 0", letterSpacing: "0.04em" }}>
            Capital. Disciplina. Diseño. Ejecución.
          </p>
        </Chapter>

        {/* 02 — THESIS + REAL TRACK RECORD */}
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

        {/* 03 — VALUE LIFECYCLE (3D build → dissolves into reality) */}
        <Chapter index={2} eyebrow="Cómo creamos valor">
          <Headline lines={["From land", "to landmark."]} />
          <p className="lede" data-reveal>
            Un proceso disciplinado para transformar oportunidades en activos
            generadores de valor — construido en tiempo real mientras haces scroll.
          </p>
          <div className="pillars" data-fade style={{ fontSize: "clamp(0.95rem,1.8vw,1.3rem)" }}>
            Originación <span>·</span> Underwriting <span>·</span> Estructuración{" "}
            <span>·</span> Desarrollo <span>·</span> Operación <span>·</span> Monetización
          </div>
        </Chapter>

        {/* 04 — CASA NUBA */}
        <Project
          index={3}
          eyebrow="Casa Nuba · Hospitality"
          image="/projects/casa-nuba.png"
          alt="Casa Nuba — desarrollo turístico boutique en Punta Lobos"
          title="Casa Nuba."
          location="Punta Lobos, Pichilemu"
          lede="Desarrollo turístico boutique Open Light: 18 unidades, inversión de $1.900 MM, orientado a la generación de flujos recurrentes y sostenibles."
          kpis={[
            { label: "TIR Apalancada", value: 39.4, suffix: "%", decimals: 1 },
            { label: "NOI Año 1", value: 229, prefix: "$", suffix: " MM" },
            { label: "DSCR mínimo", value: 2.81, suffix: "x", decimals: 2 },
            { label: "Ocupación Año 1", value: 55, suffix: "%" },
          ]}
        />

        {/* 05 — BODEFLEX */}
        <Project
          index={4}
          eyebrow="Bodeflex Valle Grande · Industrial"
          image="/projects/bodeflex.png"
          alt="Bodeflex Valle Grande — bodegaje flexible en Lampa"
          title="Bodeflex Valle Grande."
          location="Valle Grande, Lampa"
          lede="Bodegaje flexible institucional: 22.080 m² arrendables, unidades modulares desde 200 m², 6–8 m de altura libre y seguridad 24/7."
          kpis={[
            { label: "TIR Apalancada", value: 25, suffix: "%" },
            { label: "NOI Año 1", value: 40200, suffix: " UF" },
            { label: "DSCR mínimo", value: 1.9, suffix: "x", decimals: 1 },
            { label: "Ocupación estab.", value: 95, suffix: "%" },
          ]}
        />

        {/* 06 — +VALUE (teaser) */}
        <Chapter index={5} align="center" eyebrow="+Value · Opportunistic">
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

        {/* 07 — LEADERSHIP & ADVISORY */}
        <Chapter index={6} align="center" eyebrow="Liderazgo & Advisory Board">
          <Headline lines={["Quién está", "detrás del capital."]} />
          <div className="team">
            <Member
              initials="TA"
              name="Tomás Armas Alvear"
              role="Founder & Managing Partner"
              bio="Desarrollo inmobiliario, originación de oportunidades, inversiones y relación con inversionistas."
            />
            <Member
              initials="CA"
              name="Cristián Armas Morel"
              role="Founder & Strategist Partner"
              bio="Estrategia corporativa, desarrollo de negocios, relaciones institucionales y expansión."
            />
            <Member
              initials="PC"
              name="Pedro Cueto"
              role="Advisory Board"
              bio="Estrategia corporativa, escalamiento empresarial, gobierno corporativo y evaluación de inversiones."
              prev="Ex Bain & Company · Director de Compañías"
            />
            <Member
              initials="BB"
              name="Boris Buvinic"
              role="Advisory Board"
              bio="Estructuración financiera, relación con banca, levantamiento de capital y gobierno corporativo."
              prev="Ex Gerente General Banco Itaú Chile"
            />
          </div>
        </Chapter>

        {/* 08 — CLOSE + CTA */}
        <Chapter index={7} align="center">
          <div className="logo-plate" data-fade style={{ marginBottom: "2rem" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/projects/logo-grupo-nv.jpeg" alt="Grupo NV" />
          </div>
          <Headline lines={["Originate.", "Develop. Operate."]} />
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

/* Scroll-triggered count-up. */
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
            if (el) el.textContent = obj.v.toLocaleString("es-CL", {
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
