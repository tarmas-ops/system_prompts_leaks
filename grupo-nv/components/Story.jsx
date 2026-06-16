"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useJourney, SECTIONS } from "@/lib/store";
import KpiCard from "@/components/KpiCard";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* Split a headline into animatable lines. */
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
      // Staggered line + element reveal as the chapter enters.
      gsap.from(el.querySelectorAll("[data-reveal]"), {
        yPercent: 110,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: "top 72%" },
      });
      // Gentle parallax exit so chapters feel layered.
      gsap.to(el.querySelector(".panel, .stage"), {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="chapter" data-align={align} id={`ch-${index}`}>
      <div className={align === "center" ? "stage" : "panel"}>
        {eyebrow && <div className="eyebrow" data-reveal>{`${String(index + 1).padStart(2, "0")} — ${eyebrow}`}</div>}
        {children}
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
          onClick={() => document.getElementById(`ch-${i}`)?.scrollIntoView({ behavior: "smooth" })}
        />
      ))}
    </nav>
  );
}

export default function Story() {
  return (
    <>
      <div className="brand">
        Grupo NV
        <small>Real Estate Private Equity</small>
      </div>
      <Rail />
      <div className="scroll-cue" data-reveal>
        Scroll to begin
      </div>

      <main className="story">
        {/* 01 — OPENING */}
        <Chapter index={0} align="center">
          <Headline lines={["Value is not found.", "It is created."]} />
          <p className="lede" data-reveal>
            An institutional journey through the full lifecycle of real estate
            value creation.
          </p>
        </Chapter>

        {/* 02 — ORIGINATION */}
        <Chapter index={1} eyebrow="Origination">
          <Headline lines={["We see value", "before the market", "does."]} />
          <p className="lede" data-reveal>
            Off-market opportunities. Market inefficiencies. Hidden value —
            illuminated through disciplined sourcing and underwriting.
          </p>
          <div className="kpi-grid">
            <KpiCard label="Off-Market Deal Flow" value={1.8} suffix="B" prefix="$" decimals={1} />
            <KpiCard label="Markets Screened" value={42} />
            <KpiCard label="Conviction Rate" value={3.2} suffix="%" decimals={1} />
          </div>
        </Chapter>

        {/* 03 — DEVELOPMENT */}
        <Chapter index={2} align="right" eyebrow="Development">
          <Headline lines={["From concept", "to completion."]} />
          <p className="lede" data-reveal>
            Land becomes a masterplan. Structure becomes architecture. We build
            institutional-quality assets in real time.
          </p>
        </Chapter>

        {/* 04 — CASA NUBA */}
        <Chapter index={3} eyebrow="Casa Nuba · Hospitality">
          <Headline lines={["Punta de Lobos.", "Engineered to", "perform."]} />
          <p className="lede" data-reveal>
            A boutique cliffside hotel — where atmosphere meets underwriting.
          </p>
          <div className="kpi-grid">
            <KpiCard label="NOI" value={6.4} prefix="$" suffix="M" decimals={1} delta="▲ stabilized" />
            <KpiCard label="Occupancy" value={82} suffix="%" />
            <KpiCard label="ADR" value={540} prefix="$" />
            <KpiCard label="DSCR" value={1.8} suffix="x" decimals={1} />
          </div>
        </Chapter>

        {/* 05 — BODEFLEX */}
        <Chapter index={4} align="right" eyebrow="Bodeflex · Industrial">
          <Headline lines={["Logistics", "at the speed", "of capital."]} />
          <p className="lede" data-reveal>
            Class-A industrial corridors assembled to spec — steel, throughput,
            and tenancy as a single operating system.
          </p>
          <div className="kpi-grid">
            <KpiCard label="GLA" value={1.2} suffix="M sqft" decimals={1} />
            <KpiCard label="Occupancy" value={96} suffix="%" />
            <KpiCard label="WALT" value={7.4} suffix=" yrs" decimals={1} />
          </div>
        </Chapter>

        {/* 06 — +VALUE */}
        <Chapter index={5} eyebrow="+Value · Retail Repositioning">
          <Headline lines={["We don't buy", "buildings.", "We compound", "NOI."]} />
          <p className="lede" data-reveal>
            Tired retail, repositioned. New facades, new tenants, new traffic —
            value creation you can watch happen.
          </p>
          <div className="kpi-grid">
            <KpiCard label="NOI Growth" value={38} suffix="%" delta="▲ post-repositioning" />
            <KpiCard label="Occupancy" value={94} suffix="%" delta="from 61%" />
            <KpiCard label="Value Created" value={24} prefix="$" suffix="M" />
          </div>
        </Chapter>

        {/* 07 — PLATFORM SCALE */}
        <Chapter index={6} align="center" eyebrow="Platform Scale">
          <Headline lines={["One ecosystem.", "Disciplined", "capital."]} />
          <p className="lede" data-reveal>
            Hospitality, industrial, commercial and retail — a network of assets
            linked by a single allocation discipline.
          </p>
        </Chapter>

        {/* 08 — INVESTMENT PLATFORM */}
        <Chapter index={7} align="center" eyebrow="Investment Platform">
          <Headline lines={["Institutional", "by design."]} />
          <div className="glass dash" data-reveal>
            <div className="col">
              <strong style={{ fontWeight: 400, letterSpacing: "0.04em" }}>
                Portfolio Allocation
              </strong>
              {[
                ["Hospitality", 34],
                ["Industrial", 41],
                ["Retail", 17],
                ["Commercial", 8],
              ].map(([k, v]) => (
                <div className="bar-row" key={k}>
                  <span>{k}</span>
                  <span className="bar-track">
                    <span className="bar-fill" style={{ width: `${v}%` }} />
                  </span>
                  <span>{v}%</span>
                </div>
              ))}
            </div>
            <div className="col">
              <KpiCard label="AUM" value={2.6} prefix="$" suffix="B" decimals={1} />
              <KpiCard label="Net IRR (target)" value={18.5} suffix="%" decimals={1} />
              <KpiCard label="Equity Multiple" value={2.1} suffix="x" decimals={1} />
            </div>
          </div>
        </Chapter>

        {/* 09 — FINAL */}
        <Chapter index={8} align="center">
          <Headline lines={["Originate.", "Develop.", "Operate."]} />
          <p className="lede" data-reveal style={{ margin: "1.8rem auto 0" }}>
            Grupo NV — Real Estate Private Equity
          </p>
        </Chapter>
      </main>
    </>
  );
}
