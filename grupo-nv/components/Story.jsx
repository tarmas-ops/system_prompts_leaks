"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useJourney, SECTIONS } from "@/lib/store";
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

function Chapter({ index, eyebrow, children }) {
  return (
    <section className="chapter" data-align="center" id={`ch-${index}`}>
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

/* Business line — brand logo, render (optional) and its characteristics. */
function BusinessLine({ index, logo, badge, subtitle, name, image, description, features, nda }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section ref={ref} className="chapter proj" id={`ch-${index}`}>
      {image && (
        <motion.div className="proj-bg" style={{ y }}>
          <motion.img
            // eslint-disable-next-line @next/next/no-img-element
            src={image}
            alt=""
            initial={{ opacity: 0, scale: 1.16, filter: "blur(12px)", clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ opacity: 1, scale: 1.04, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ margin: "-14% 0px" }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="proj-scrim" />
        </motion.div>
      )}

      <div className="proj-content" data-center={image ? undefined : "true"}>
        <div className="proj-top">
          <Reveal>
            <span className={`logo-chip ${badge ? "badge" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt={name} />
            </span>
          </Reveal>
          <Reveal className="eyebrow">{`${String(index + 1).padStart(2, "0")} — ${subtitle}`}</Reveal>
          <Headline lines={[name]} style={{ fontSize: "clamp(2.1rem,4.6vw,3.6rem)" }} />
        </div>
        <div className="proj-bottom">
          <Reveal className="lede" delay={0.05}>
            {description}
          </Reveal>
          {nda && (
            <Reveal delay={0.1}>
              <span className="nda">En negociación · NDA</span>
            </Reveal>
          )}
          <div className="feature-grid">
            {features.map((f, i) => (
              <Reveal key={f} className="glass feature" delay={i * 0.06}>
                <span className="fdot" />
                <span className="ftext">{f}</span>
              </Reveal>
            ))}
          </div>
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

        {/* 02 — TESIS + EXPERIENCIA (resumen) */}
        <Chapter index={1} eyebrow="La Disciplina">
          <Headline lines={["Construimos plataformas", "inmobiliarias de largo plazo."]} />
          <Reveal className="pillars" delay={0.1}>
            Desarrollamos <span>·</span> Invertimos <span>·</span> Operamos
          </Reveal>
          <div className="stats">
            <Reveal className="stat">
              <div className="n">+<Counter value={150} /></div>
              <div className="k">Proyectos desarrollados</div>
            </Reveal>
            <Reveal className="stat" delay={0.08}>
              <div className="n">+<Counter value={1.5} decimals={1} />M</div>
              <div className="k">m² construidos</div>
            </Reveal>
            <Reveal className="stat" delay={0.16}>
              <div className="n">+US$<Counter value={3} />B</div>
              <div className="k">Inversión gestionada</div>
            </Reveal>
            <Reveal className="stat" delay={0.24}>
              <div className="n">+<Counter value={60} /></div>
              <div className="k">Años de experiencia</div>
            </Reveal>
          </div>
        </Chapter>

        {/* 03 — LÍNEAS DE NEGOCIO (pilares) */}
        <Chapter index={2} eyebrow="Líneas de negocio">
          <Headline lines={["Tres plataformas.", "Una filosofía."]} />
          <Reveal className="lede" delay={0.06}>
            Tres líneas complementarias bajo una misma disciplina de inversión de
            largo plazo.
          </Reveal>
          <div className="lines-grid">
            {[
              { logo: "/lines/casanuba.png", badge: true, name: "Hotelería & Lifestyle", desc: "Activos turísticos boutique en destinos exclusivos." },
              { logo: "/lines/bodeflex.png", name: "Industrial & Flex Storage", desc: "Parques de bodegaje flexible en ubicaciones estratégicas." },
              { logo: "/lines/value.png", name: "Opportunistic Real Estate", desc: "Oportunidades off-market con alto potencial de valor." },
            ].map((l, i) => (
              <Reveal className="line-item" key={l.logo} delay={i * 0.1}>
                <span className={`logo-chip ${l.badge ? "badge" : ""}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.logo} alt={l.name} />
                </span>
                <span className="line-name">{l.name}</span>
                <span className="line-desc">{l.desc}</span>
              </Reveal>
            ))}
          </div>
        </Chapter>

        {/* 04 — CASA NUBA */}
        <BusinessLine
          index={3}
          logo="/lines/casanuba.png"
          badge
          subtitle="Open Light Hospitality"
          name="Casa Nuba."
          image="/projects/casa-nuba-cut.png"
          description="Desarrollo y operación de activos turísticos orientados a experiencias premium en destinos exclusivos."
          features={["Experiencias únicas", "Arquitectura de alto nivel", "Sostenibilidad y entorno"]}
        />

        {/* 05 — BODEFLEX */}
        <BusinessLine
          index={4}
          logo="/lines/bodeflex.png"
          subtitle="Industrial & Flex Storage"
          name="Bodeflex Valle Grande."
          image="/projects/bodeflex-cut.png"
          description="Desarrollo y operación de parques de bodegaje flexible para pymes y empresas en ubicaciones estratégicas."
          features={["Bodegas flexibles", "Oficina integrada", "Seguridad y control 24/7"]}
        />

        {/* 06 — +VALUE */}
        <BusinessLine
          index={5}
          logo="/lines/value.png"
          subtitle="Opportunistic Real Estate"
          name="+Value."
          description="Adquisición y estructuración de oportunidades inmobiliarias fuera de mercado con alto potencial de creación de valor."
          features={["Originación off-market", "Creación de valor", "Red selecta de inversores"]}
          nda
        />

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
