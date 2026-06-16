"use client";

import { useJourney, SECTIONS } from "@/lib/store";
import KpiCard from "@/components/KpiCard";
import { Monogram, LogoLockup } from "@/components/Logo";
import { Reveal, Counter } from "@/components/Motion";

function Headline({ lines, style }) {
  return (
    <h1 className="headline" style={style}>
      {lines.map((l, i) => (
        <Reveal as="span" key={i} className="line-block" delay={i * 0.08}>
          {l}
        </Reveal>
      ))}
    </h1>
  );
}

function Chapter({ index, eyebrow, className = "", children }) {
  return (
    <section className={`chapter ${className}`} data-align="center" id={`ch-${index}`}>
      <div className="stage">
        {eyebrow && (
          <Reveal className="eyebrow">
            {`${String(index + 1).padStart(2, "0")} — ${eyebrow}`}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* Project chapter — floating, centered text over the 3D render background. */
function Project({ index, eyebrow, title, location, lede, kpis }) {
  return (
    <section className="chapter proj" data-align="center" id={`ch-${index}`}>
      <div className="stage">
        <Reveal className="eyebrow">
          {`${String(index + 1).padStart(2, "0")} — ${eyebrow}`}
        </Reveal>
        <Headline lines={title} style={{ fontSize: "clamp(2.2rem,5vw,4rem)" }} />
        {location && <Reveal className="loc">◐ {location}</Reveal>}
        <Reveal className="lede" delay={0.05}>
          {lede}
        </Reveal>
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <KpiCard key={k.label} {...k} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Member({ photo, name, role, bio, prev }) {
  return (
    <Reveal className="glass member">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ph" src={photo} alt={name} loading="lazy" />
      <div>
        <h3>{name}</h3>
        <div className="role">{role}</div>
        <div className="bio">{bio}</div>
        {prev && <div className="prev">{prev}</div>}
      </div>
    </Reveal>
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
      <div className="scroll-cue">Desliza</div>

      <main className="story">
        {/* 01 — MANIFIESTO */}
        <Chapter index={0}>
          <Reveal>
            <LogoLockup />
          </Reveal>
          <Headline lines={["El valor no se encuentra.", "Se crea."]} style={{ marginTop: "2.4rem" }} />
          <Reveal className="lede" delay={0.1} style={{ letterSpacing: "0.04em" }}>
            Capital. Disciplina. Diseño. Ejecución.
          </Reveal>
        </Chapter>

        {/* 02 — TESIS + TRACK RECORD REAL */}
        <Chapter index={1} eyebrow="La Disciplina">
          <Headline lines={["Construimos plataformas", "inmobiliarias de largo plazo."]} />
          <Reveal className="pillars" delay={0.1}>
            Desarrollamos <span>·</span> Invertimos <span>·</span> Operamos
          </Reveal>
          <div className="stats">
            <Reveal className="stat">
              <div className="n">
                +<Counter value={150} />
              </div>
              <div className="k">Proyectos desarrollados</div>
            </Reveal>
            <Reveal className="stat" delay={0.08}>
              <div className="n">
                +<Counter value={1.5} decimals={1} />M
              </div>
              <div className="k">m² construidos</div>
            </Reveal>
            <Reveal className="stat" delay={0.16}>
              <div className="n">
                +US$<Counter value={3} />B
              </div>
              <div className="k">Inversión gestionada</div>
            </Reveal>
            <Reveal className="stat" delay={0.24}>
              <div className="n">
                +<Counter value={60} />
              </div>
              <div className="k">Años de experiencia</div>
            </Reveal>
          </div>
        </Chapter>

        {/* 03 — CÓMO CREAMOS VALOR */}
        <Chapter index={2} eyebrow="Cómo creamos valor">
          <Headline lines={["De la tierra", "al hito."]} />
          <Reveal className="lede" delay={0.05}>
            Un proceso disciplinado para transformar oportunidades en activos
            generadores de valor — construido en tiempo real mientras navegas.
          </Reveal>
          <Reveal className="pillars" delay={0.12} style={{ fontSize: "clamp(0.85rem,1.6vw,1.2rem)" }}>
            Originación <span>·</span> Underwriting <span>·</span> Estructuración{" "}
            <span>·</span> Desarrollo <span>·</span> Operación <span>·</span> Monetización
          </Reveal>
        </Chapter>

        {/* 04 — CASA NUBA */}
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

        {/* 05 — BODEFLEX */}
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
        <Chapter index={5} eyebrow="+Value · Oportunístico">
          <Headline lines={["Valor donde", "otros ven desgaste."]} />
          <Reveal className="glass mini" delay={0.1}>
            <div>
              <strong style={{ fontWeight: 500, letterSpacing: "0.06em" }}>
                Strip center · Región Metropolitana
              </strong>
              <p className="lede" style={{ marginTop: "0.6rem" }}>
                Adquisición value-add: optimización de rentas, reposicionamiento
                comercial y mejoras físicas selectivas para hacer crecer el NOI.
              </p>
            </div>
            <span className="nda">En negociación · NDA</span>
          </Reveal>
        </Chapter>

        {/* 07 — LIDERAZGO & CONSEJO ASESOR */}
        <Chapter index={6} eyebrow="Liderazgo & Consejo Asesor">
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
        <Chapter index={7}>
          <Reveal style={{ marginBottom: "1.8rem" }}>
            <LogoLockup />
          </Reveal>
          <Headline lines={["Originar.", "Desarrollar. Operar."]} />
          <Reveal className="lede" delay={0.1}>
            Capital disciplinado, activos reales, valor durable.
          </Reveal>
          <Reveal className="cta" delay={0.18}>
            <a className="btn btn-primary" href="mailto:invest@gruponv.cl">
              Solicitar el deck de inversión
            </a>
            <a className="btn btn-ghost" href="mailto:invest@gruponv.cl">
              Contactar al equipo
            </a>
          </Reveal>
        </Chapter>
      </main>
    </>
  );
}
