import { useEffect, useRef, useState } from "react";

// Reusable falling petal component
function FallingParticle() {
  const [style, setStyle] = useState({});

  useEffect(() => {
    const randomLeft = Math.random() * 100;
    const randomDelay = Math.random() * 8;
    const randomDuration = 6 + Math.random() * 6;
    const randomScale = 0.4 + Math.random() * 0.7;

    setStyle({
      left: `${randomLeft}%`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
      transform: `scale(${randomScale})`,
    });
  }, []);

  return (
    <svg
      className="wc-global-petal"
      style={style}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 5 C22 12 25 18 15 25 C5 18 8 12 15 5 Z"
        fill="#b8874f"
        fillOpacity="0.25"
      />
    </svg>
  );
}

// Family members data
const BRIDE_FAMILY = [
  { name: "Thomas Mathew", wish: "Wishing you boundless joy." },
  { name: "Mary Thomas", wish: "May love guide your days." },
  { name: "Anna Thomas", wish: "So happy for you both!" },
  { name: "Jacob Thomas", wish: "Endless happiness ahead." }
];

const GROOM_FAMILY = [
  { name: "George Joseph", wish: "Welcome to our family." },
  { name: "Elizabeth George", wish: "Wishing you a blessed life." },
  { name: "Simon George", wish: "Cheers to forever." },
  { name: "Ruth George", wish: "Love and light, always." }
];

function HeaderFlourish({ className = "", isOpen }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className={`wc-family-flourish ${className}`}>
      <path
        pathLength="1"
        d="M10 10 C 20 2, 25 18, 30 10 C 35 2, 40 18, 50 10"
        stroke="#b8874f"
        strokeWidth="1"
        strokeLinecap="round"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: isOpen ? 0 : 1,
          transition: "stroke-dashoffset 1.1s ease"
        }}
      />
      <circle cx="5" cy="10" r="1.5" fill="#b8874f" style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.4s ease 1s" }} />
      <circle cx="55" cy="10" r="1.5" fill="#b8874f" style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.4s ease 1s" }} />
    </svg>
  );
}

// Two overlapping rings
function UnionIcon({ isOpen }) {
  return (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      fill="none"
      className="wc-family-union"
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "scale(1)" : "scale(0.5)",
        transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s, opacity 0.5s ease 0.9s"
      }}
    >
      <circle cx="9" cy="8" r="6.2" stroke="#b8874f" strokeWidth="1.1" />
      <circle cx="15" cy="8" r="6.2" stroke="#b8874f" strokeWidth="1.1" />
    </svg>
  );
}

// Four-petal bloom
function BloomMark({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="1.4" fill="#b8874f" />
      <path d="M0,-1.2 C -1.6,-3.2 -1.6,-6 0,-7.4 C 1.6,-6 1.6,-3.2 0,-1.2 Z" fill="none" stroke="#b8874f" strokeWidth="0.8" />
      <path d="M1.2,0 C 3.2,-1.6 6,-1.6 7.4,0 C 6,1.6 3.2,1.6 1.2,0 Z" fill="none" stroke="#b8874f" strokeWidth="0.8" />
      <path d="M0,1.2 C 1.6,3.2 1.6,6 0,7.4 C -1.6,6 -1.6,3.2 0,1.2 Z" fill="none" stroke="#b8874f" strokeWidth="0.8" />
      <path d="M-1.2,0 C -3.2,-1.6 -6,-1.6 -7.4,0 C -6,1.6 -3.2,1.6 -1.2,0 Z" fill="none" stroke="#b8874f" strokeWidth="0.8" />
    </g>
  );
}

// Line-drawn cross
function CrossIcon({ isOpen }) {
  return (
    <svg
      width="22"
      height="30"
      viewBox="0 0 22 30"
      className="wc-family-cross"
      style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.6s ease 0.3s" }}
    >
      <line x1="11" y1="1" x2="11" y2="29" stroke="#9c836c" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="2" y1="10" x2="20" y2="10" stroke="#9c836c" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// Bird in flight
function BirdIcon({ mirrored, className = "", style }) {
  return (
    <svg
      width="22"
      height="13"
      viewBox="0 0 24 14"
      className={`wc-family-bird-svg ${className}`}
      style={{ ...style, transform: `${style?.transform || ""} ${mirrored ? "scaleX(-1)" : ""}` }}
    >
      <path
        d="M0,10 C4,2 8,8 12,4 C16,8 20,2 24,10"
        fill="none"
        stroke="#b8874f"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Arced floral garland
function GarlandArc({ isOpen }) {
  return (
    <svg viewBox="0 0 300 60" preserveAspectRatio="none" className="wc-family-garland-svg">
      <path
        pathLength="1"
        d="M8,52 Q150,-6 292,52"
        fill="none"
        stroke="#b8874f"
        strokeWidth="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: isOpen ? 0 : 1,
          transition: "stroke-dashoffset 1.4s ease 0.2s"
        }}
      />
      <g style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.7s ease 1.1s" }}>
        <BloomMark x={55} y={34} scale={0.75} />
        <BloomMark x={150} y={4} scale={0.85} />
        <BloomMark x={245} y={34} scale={0.75} />
      </g>
    </svg>
  );
}

// Side vine artwork
function SideVine({ isOpen }) {
  const leaves = [
    { y: 130, side: 1 },
    { y: 300, side: -1 },
    { y: 470, side: 1 },
    { y: 640, side: -1 },
    { y: 780, side: 1 }
  ];
  return (
    <svg viewBox="0 0 60 900" preserveAspectRatio="none" className="wc-family-vine-svg">
      <path
        pathLength="1"
        d="M30,6 C14,90 46,180 30,268 C14,356 46,446 30,534 C14,622 46,712 30,800 C22,838 30,868 30,894"
        fill="none"
        stroke="#b8874f"
        strokeWidth="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: isOpen ? 0 : 1,
          transition: "stroke-dashoffset 1.8s ease"
        }}
      />
      <g style={{ opacity: isOpen ? 1 : 0, transition: "opacity 0.9s ease 1s" }}>
        {leaves.map((leaf, i) => (
          <g key={i} transform={`translate(30, ${leaf.y}) rotate(${leaf.side * 35})`}>
            <path
              d={`M0,0 C ${6 * leaf.side},-5 ${12 * leaf.side},0 ${6 * leaf.side},7 C 0,11 ${-2 * leaf.side},4 0,0 Z`}
              fill="none"
              stroke="#b8874f"
              strokeWidth="0.9"
            />
          </g>
        ))}
        <BloomMark x={30} y={60} scale={1} />
        <BloomMark x={30} y={830} scale={0.85} />
      </g>
    </svg>
  );
}

// Background palm-frond accent
function PalmFrond({ mirrored }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="100"
      height="100"
      className="wc-family-palm-svg"
      style={{ transform: mirrored ? "scaleX(-1)" : "none" }}
    >
      <g stroke="#c9a877" strokeWidth="1" fill="none">
        <path d="M0,120 C 20,90 10,60 30,20" />
        <path d="M0,120 C 30,100 30,70 55,35" />
        <path d="M0,120 C 40,110 50,85 75,55" />
        <path d="M0,120 C 50,118 65,100 90,80" />
      </g>
    </svg>
  );
}

function FamilyList({ members, align, isOpen, delayBase }) {
  return (
    <ul className={`wc-family-list wc-family-list--${align}`}>
      {members.map((member, i) => (
        <li
          key={member.name}
          className={`wc-family-entry ${isOpen ? "wc-family-entry--visible" : ""}`}
          style={{ animationDelay: `${delayBase + i * 0.1}s` }}
        >
          <p className="wc-family-name">{member.name}</p>
          <p className="wc-family-wish">{member.wish}</p>
        </li>
      ))}
    </ul>
  );
}

export default function InvitationSection() {
  const sectionRef = useRef(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const upperParticles = Array.from({ length: 25 }, (_, i) => i);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    const timer = setTimeout(() => setIsOpen(true), 150);
    return () => clearTimeout(timer);
  }, [hasEntered]);

  return (
    <section className="wc-invite" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap');

        /* Background image intact from original section */
        .wc-invite {
          position: relative;
          z-index: 3;
          background-image: url('/s2.webp'), linear-gradient(180deg, #f8f2e6 0%, #efe1c9 100%);
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          box-shadow: inset 0 80px 60px -60px rgba(0,0,0,0.28);
          padding: 70px 20px 90px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Falling Petal Container & Keyframe Animations */
        .wc-global-particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 4;
          overflow: hidden;
        }

        .wc-global-petal {
          position: absolute;
          top: -30px;
          width: 16px;
          height: 16px;
          opacity: 0;
          animation: wc-global-fall linear infinite;
        }

        @keyframes wc-global-fall {
          0% { top: -5%; opacity: 0; transform: translateX(0) rotate(0deg); }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { top: 105%; opacity: 0; transform: translateX(70px) rotate(360deg); }
        }

        /* Corner palm accents */
        .wc-family-corner {
          position: absolute;
          bottom: 0;
          z-index: 1;
          opacity: 0.3;
          pointer-events: none;
        }
        .wc-family-corner--left { left: 0; }
        .wc-family-corner--right { right: 0; }
        .wc-family-palm-svg { display: block; }

        /* Side vines */
        .wc-family-vine {
          position: absolute;
          top: 4%;
          bottom: 4%;
          width: 42px;
          z-index: 1;
          opacity: 0.55;
          pointer-events: none;
        }
        .wc-family-vine--left { left: 2px; }
        .wc-family-vine--right { right: 2px; transform: scaleX(-1); }
        .wc-family-vine-svg { width: 100%; height: 100%; display: block; }

        /* Top decoration */
        .wc-family-top-decor {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 8px;
        }
        .wc-family-garland-row {
          position: relative;
          width: 100%;
          max-width: 260px;
          margin-top: 2px;
        }
        .wc-family-garland-svg {
          width: 100%;
          height: 44px;
          display: block;
        }
        .wc-family-bird {
          position: absolute;
          top: 2px;
        }
        .wc-family-bird--left { left: -6px; }
        .wc-family-bird--right { right: -6px; }

        /* Content container */
        .wc-family-content {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 580px;
          margin: 0 auto;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1s ease, transform 1s ease;
        }
        .wc-family-content.is-open {
          opacity: 1;
          transform: translateY(0);
        }

        .wc-family-title-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 10px 0 10px;
        }
        .wc-family-title-area h2 {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.1rem, 4.8vw, 3.1rem);
          color: #9c836c;
          font-weight: 400;
        }
        .wc-family-flourish-right { transform: scaleX(-1); }

        .wc-family-subtitle {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.9rem;
          color: #615a50;
          letter-spacing: 0.02em;
          margin-bottom: 46px;
        }

        /* Two-column layout */
        .wc-family-columns {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: start;
          gap: 14px;
        }

        .wc-family-col-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(1.3rem, 3.2vw, 1.6rem);
          color: #9c836c;
          font-weight: 400;
          margin-bottom: 18px;
        }

        .wc-family-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
        .wc-family-list--right { text-align: right; align-items: flex-end; }
        .wc-family-list--left { text-align: left; align-items: flex-start; }

        .wc-family-entry {
          padding: 13px 0;
          opacity: 0;
          transform: translateY(10px);
        }
        .wc-family-entry:not(:first-child) {
          border-top: 1px solid rgba(184, 135, 79, 0.16);
        }
        .wc-family-entry--visible {
          animation: wc-entry-in 0.6s ease forwards;
        }
        @keyframes wc-entry-in {
          to { opacity: 1; transform: translateY(0); }
        }

        .wc-family-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: clamp(0.98rem, 3vw, 1.15rem);
          color: #4a453d;
          letter-spacing: 0.01em;
          margin-bottom: 3px;
        }

        .wc-family-wish {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.8rem, 2.4vw, 0.9rem);
          color: #8c7a63;
          line-height: 1.4;
        }

        .wc-family-center-divider {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          align-self: stretch;
          padding-top: 6px;
        }
        .wc-family-center-line {
          flex: 1;
          width: 1px;
          min-height: 16px;
          background: linear-gradient(to bottom, transparent, rgba(184, 135, 79, 0.4), transparent);
        }
      `}</style>

      {/* Animated Falling Petals Layer */}
      <div className="wc-global-particle-field">
        {upperParticles.map((id) => (
          <FallingParticle key={`invitation-petal-${id}`} />
        ))}
      </div>

      {/* Decorative background palm accents */}
      <div className="wc-family-corner wc-family-corner--left" aria-hidden="true">
        <PalmFrond />
      </div>
      <div className="wc-family-corner wc-family-corner--right" aria-hidden="true">
        <PalmFrond mirrored />
      </div>

      {/* Side vine art */}
      <div className="wc-family-vine wc-family-vine--left" aria-hidden="true">
        <SideVine isOpen={isOpen} />
      </div>
      <div className="wc-family-vine wc-family-vine--right" aria-hidden="true">
        <SideVine isOpen={isOpen} />
      </div>

      {/* Family content block */}
      <div className={`wc-family-content ${isOpen ? "is-open" : ""}`}>
        <div className="wc-family-top-decor">
          <CrossIcon isOpen={isOpen} />
          <div className="wc-family-garland-row">
            <GarlandArc isOpen={isOpen} />
            <BirdIcon
              className="wc-family-bird wc-family-bird--left"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: "opacity 0.6s ease 0.8s"
              }}
            />
            <BirdIcon
              mirrored
              className="wc-family-bird wc-family-bird--right"
              style={{
                opacity: isOpen ? 1 : 0,
                transition: "opacity 0.6s ease 1s"
              }}
            />
          </div>
        </div>

        <div className="wc-family-title-area">
          <HeaderFlourish isOpen={isOpen} />
          <h2>With Love, Our Families</h2>
          <HeaderFlourish className="wc-family-flourish-right" isOpen={isOpen} />
        </div>
        <p className="wc-family-subtitle">Blessing us with their love and best wishes</p>

        <div className="wc-family-columns">
          <div>
            <h3 className="wc-family-col-title">Bride&apos;s Family</h3>
            <FamilyList members={BRIDE_FAMILY} align="right" isOpen={isOpen} delayBase={0.5} />
          </div>

          <div className="wc-family-center-divider">
            <span className="wc-family-center-line" />
            <UnionIcon isOpen={isOpen} />
            <span className="wc-family-center-line" />
          </div>

          <div>
            <h3 className="wc-family-col-title">Groom&apos;s Family</h3>
            <FamilyList members={GROOM_FAMILY} align="left" isOpen={isOpen} delayBase={0.5} />
          </div>
        </div>
      </div>
    </section>
  );
}