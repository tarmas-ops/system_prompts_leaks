"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourney, SECTIONS } from "@/lib/store";
import KpiCard from "@/components/KpiCard";
import { Monogram, LogoLockup } from "@/components/Logo";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

function Headline({ lines, className = "" }) {
  return (
    <h1 className={`headline ${className}`}>
      {lines.map((l, i) => (
        <span className="line" key={i}>
          <span data-reveal>{l}</span>
        </span>
      ))}
    </h1>
  );
}

function Chapter({ index, align = "left", eyebrow, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        yPercent: 110,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
      gsap.from(el.querySelectorAll("[data-fade]"), {
        opacity: 0,
        y: 30,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

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

/* Project showcase using a real render. */
function Project({ index, eyebrow, image, alt, title, lede, kpis }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 74%" },
      });
      gsap.from(el.querySelector(".frame"), {
        opacity: 0,
        scale: 1.06,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 76%" },
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
          <h2 className="headline" style={{ fontSize: "clamp(2rem,4vw,3.4rem)" }}>
            <span className="line">
              <span data-reveal>{title}</span>
            </span>
          </h2>
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

function Rail() {
  const section = useJourney((s) => s.section);
  return (
    <nav className="rail" aria-label="Chapters">
      {Array.from({ length: SECTIONS }).map((_, i) => (
        <button
          key={i}
          data-active={i === section}
          aria-label={`Go to chapter ${i + 1}`}
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
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Monogram size={26} />
          <span>Grupo NV</span>
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
          <div data-fade>
            <LogoLockup />
          </div>
          <Headline
            lines={["Value is not found.", "It is created."]}
            className=""
          />
        </Chapter>

        {/* 02 — THESIS + TRACK RECORD */}
        <Chapter index={1} align="center" eyebrow="The Discipline">
          <Headline lines={["Originate.", "Develop. Operate."]} />
          <p className="lede" data-reveal style={{ margin: "1.6rem auto 0" }}>
            A vertically integrated private equity platform that creates
            institutional-quality real estate — from raw land to operating asset.
          </p>
          <div className="stats">
            <div className="stat" data-fade>
              <div className="n">
                $<CountUpInline value={2.6} decimals={1} />B
              </div>
              <div className="k">Assets Under Management</div>
            </div>
            <div className="stat" data-fade>
              <div className="n">
                <CountUpInline value={18.5} decimals={1} />%
              </div>
              <div className="k">Target Net IRR</div>
            </div>
            <div className="stat" data-fade>
              <div className="n">
                <CountUpInline value={2.1} decimals={1} />x
              </div>
              <div className="k">Equity Multiple</div>
            </div>
          </div>
        </Chapter>

        {/* 03 — LIFECYCLE (3D build, reveals Casa Nuba) */}
        <Chapter index={2} eyebrow="The Value Lifecycle">
          <Headline lines={["From land", "to landmark."]} />
          <p className="lede" data-reveal>
            Watch capital become real estate. Terrain becomes masterplan,
            structure becomes architecture — built in real time as you scroll.
          </p>
          <div className="pillars" data-fade>
            Land <span>·</span> Concept <span>·</span> Construction{" "}
            <span>·</span> Operation
          </div>
        </Chapter>

        {/* 04 — CASA NUBA */}
        <Project
          index={3}
          eyebrow="Casa Nuba · Hospitality"
          image="/projects/casa-nuba.png"
          alt="Casa Nuba — boutique cliffside hotel in Punta de Lobos"
          title="Casa Nuba, Punta de Lobos."
          lede="A boutique cliffside hotel where atmosphere meets underwriting — engineered to perform."
          kpis={[
            { label: "Stabilized NOI", value: 6.4, prefix: "$", suffix: "M", decimals: 1 },
            { label: "Occupancy", value: 82, suffix: "%" },
            { label: "ADR", value: 540, prefix: "$" },
            { label: "DSCR", value: 1.8, suffix: "x", decimals: 1 },
          ]}
        />

        {/* 05 — BODEFLEX */}
        <Project
          index={4}
          eyebrow="Bodeflex Valle Grande · Industrial"
          image="/projects/bodeflex.png"
          alt="Bodeflex Valle Grande — flexible industrial warehousing in Lampa"
          title="Bodeflex Valle Grande."
          lede="Class-A flexible warehousing in Lampa. Modular units from 100 m², 6–8 m clear height, 24/7 security — logistics at the speed of capital."
          kpis={[
            { label: "GLA", value: 1.2, suffix: "M sqft", decimals: 1 },
            { label: "Occupancy", value: 96, suffix: "%" },
            { label: "Units from", value: 100, suffix: " m²" },
            { label: "WALT", value: 7.4, suffix: " yrs", decimals: 1 },
          ]}
        />

        {/* 06 — CLOSE + CTA */}
        <Chapter index={5} align="center">
          <div data-fade style={{ marginBottom: "1.4rem" }}>
            <Monogram size={64} />
          </div>
          <Headline lines={["Originate.", "Develop. Operate."]} />
          <p className="lede" data-reveal style={{ margin: "1.6rem auto 0" }}>
            Grupo NV — disciplined capital, real assets, durable value.
          </p>
          <div className="cta" data-fade>
            <a className="btn btn-primary" href="mailto:invest@gruponv.cl">
              Request the investor deck
            </a>
            <a className="btn btn-ghost" href="mailto:invest@gruponv.cl">
              Contact the team
            </a>
          </div>
        </Chapter>
      </main>
    </>
  );
}

/* Lightweight inline count-up for the thesis stats. */
function CountUpInline({ value, decimals = 0 }) {
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
            if (el) el.textContent = obj.v.toFixed(decimals);
          },
        }),
    });
    return () => st.kill();
  }, [value, decimals]);
  return <span ref={ref}>0</span>;
}
