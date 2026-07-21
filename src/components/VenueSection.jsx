import { useEffect, useState, useRef } from "react";

// Minimalist single petal/leaf animation particle generator
function FallingParticle({ id }) {
  const [style, setStyle] = useState({});

  useEffect(() => {
    // Generate organic drifting behavior properties
    const randomLeft = Math.random() * 100; // start position cross-width %
    const randomDelay = Math.random() * 8; // staggered entries
    const randomDuration = 6 + Math.random() * 6; // flight time variance
    const randomScale = 0.4 + Math.random() * 0.7; // size variance

    setStyle({
      left: `${randomLeft}%`,
      animationDelay: `${randomDelay}s`,
      animationDuration: `${randomDuration}s`,
      transform: `scale(${randomScale})`,
    });
  }, []);

  return (
    <svg
      className="wc-petal"
      style={style}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Delicate floating organic leaf outline path structure */}
      <path
        d="M15 5 C22 12 25 18 15 25 C5 18 8 12 15 5 Z"
        fill="#b8874f"
        fillOpacity="0.25"
      />
    </svg>
  );
}

// Aesthetic geometric separator element mirroring traditional line-drawings
function CornerFlourish({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5,95 L5,5 L95,5" stroke="#b8874f" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" />
      <circle cx="5" cy="5" r="3" fill="#b8874f" />
    </svg>
  );
}

// Soft pastel botanical line-art (long stem leaves + a couple of small
// blooms) used along the desktop right margin.
function PastelSideDecor({ mirrored }) {
  return (
    <svg
      viewBox="0 0 100 900"
      preserveAspectRatio="none"
      className="wc-venue-pastel-decor-svg"
      style={mirrored ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M50,10 C35,120 65,220 50,330 C35,440 65,540 50,650 C38,740 55,820 50,890"
        fill="none"
        stroke="#a9bd9c"
        strokeWidth="1.2"
        opacity="0.7"
      />
      <g fill="#c3d4b6" stroke="#8fa580" strokeWidth="0.8" opacity="0.85">
        <path d="M50,120 C20,110 5,90 8,60 C35,68 52,90 50,120 Z" />
        <path d="M50,260 C82,250 96,228 92,198 C64,206 48,230 50,260 Z" />
        <path d="M50,420 C18,412 4,388 8,358 C36,366 52,392 50,420 Z" />
        <path d="M50,580 C82,572 96,548 92,518 C64,526 48,552 50,580 Z" />
        <path d="M50,740 C22,732 8,708 12,680 C38,688 52,712 50,740 Z" />
      </g>
      <g fill="#f1e3da" stroke="#d9b9ab" strokeWidth="0.7" opacity="0.9">
        <circle cx="50" cy="190" r="9" />
        <circle cx="50" cy="490" r="7" />
      </g>
    </svg>
  );
}

export default function VenueSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Creates an array of 20 elements for falling particles
  const particles = Array.from({ length: 20 }, (_, i) => i);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMapRedirect = () => {
    window.open("https://maps.app.goo.gl/Het3WCiPber8ocNn6", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="wc-venue-redesign" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        .wc-venue-redesign {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          background-color: #dad4c7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          overflow: hidden;
        }

        /* Ambient organic falling leaves graphics adjustments */
        .wc-petal-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }
        .wc-petal {
          position: absolute;
          top: -30px;
          width: 18px;
          height: 18px;
          opacity: 0;
          animation: wc-fall-drift linear infinite;
        }
        @keyframes wc-fall-drift {
          0% { top: -5%; opacity: 0; transform: translateX(0) rotate(0deg); }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { top: 105%; opacity: 0; transform: translateX(60px) rotate(360deg); }
        }

        /* Corner line layouts */
        .wc-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          z-index: 2;
          pointer-events: none;
          opacity: 0.6;
        }
        .wc-corner-tl { top: 30px; left: 30px; }
        .wc-corner-tr { top: 30px; right: 30px; transform: rotate(90deg); }
        .wc-corner-bl { bottom: 30px; left: 30px; transform: rotate(-90deg); }
        .wc-corner-br { bottom: 30px; right: 30px; transform: rotate(180deg); }

        /* Main Content Grid */
        .wc-venue-card {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 580px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? 0 : "30px"});
          transition: opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .wc-venue-media {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .wc-venue-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        /* Desktop layout overrides */
        @media (min-width: 900px) {
          .wc-venue-card {
            max-width: 1600px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            text-align: left;
          }

          .wc-venue-media {
            flex: 1.5; /* Gives extra space priority to image container */
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: visible;
          }

          .wc-church-frame {
            max-width: 900px !important; /* Expanded frame bounds */
            width: 100%;
            margin-bottom: 0;
          }

          .wc-church-frame__img {
            width: 100%;
            height: auto;
            transform: scale(1); /* Significantly increased desktop image size */
            transform-origin: center;
          }

          .wc-venue-text {
            flex: 1;
            align-items: flex-start;
            text-align: left;
            padding-left: 20px;
          }

          .wc-venue__title,
          .wc-venue__quote {
            text-align: left;
          }

          .wc-venue__quote {
            max-width: 520px;
          }

          .wc-venue__time-block,
          .wc-map-anchor-box {
            width: 100%;
            max-width: 520px;
          }
        }

        /* ---------- Desktop-only decorations ---------- */

        .wc-venue-corner-floral {
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 260px;
          height: auto;
          z-index: 2;
          pointer-events: none;
        }

        .wc-venue-pastel-decor-wrap {
          display: none;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 70px;
          z-index: 1;
          opacity: 0.85;
          pointer-events: none;
        }
        .wc-venue-pastel-decor-wrap--right { right: 10px; }
        .wc-venue-pastel-decor-svg { width: 100%; height: 100%; display: block; }

        @media (min-width: 900px) {
          .wc-venue-corner-floral,
          .wc-venue-pastel-decor-wrap {
            display: block;
          }
        }

        .wc-venue__eyebrow {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #5c5545;
          margin-bottom: 8px;
        }

        .wc-venue__title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          color: #4a3f2c;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        /* Framed Church Miniature Layout Frame */
        .wc-church-frame {
          position: relative;
          width: 100%;
          max-width: 400px;
          height: auto;
          margin-bottom: 28px;
          padding: 8px;
          border: 1px solid rgba(184, 135, 79, 0.01);
          background: rgba(255, 255, 255, 0);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0);
          transition: transform 0.4s ease;
        }
        .wc-church-frame:hover {
          transform: scale(1.03);
        }
        .wc-church-frame__img {
          width: 100%;
          height: auto;
          display: block;
        }

        .wc-venue__quote {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(1.4rem, 3vw, 1.8rem);
          color: #70634e;
          max-width: 440px;
          line-height: 1.4;
          margin-bottom: 32px;
          font-style: italic;
        }

        .wc-venue__time-block {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.95rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a3f2c;
          font-weight: 500;
          margin-bottom: 40px;
          border-top: 1px solid rgba(184, 135, 79, 0.3);
          border-bottom: 1px solid rgba(184, 135, 79, 0.3);
          padding: 12px 24px;
        }

        /* Map Box Call To Action Container */
        .wc-map-anchor-box {
          cursor: pointer;
          width: 100%;
          max-width: 400px;
          padding: 20px;
          background: #fdfbf7;
          border: 1px solid rgba(184, 135, 79, 0.35);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
          transition: all 0.3s ease;
        }
        .wc-map-anchor-box:hover {
          background: #f7f3e8;
          border-color: #b8874f;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(184, 135, 79, 0.15);
        }

        .wc-map-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(184, 135, 79, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .wc-map-details h4 {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4a3f2c;
          letter-spacing: 0.02em;
          margin-bottom: 2px;
        }
        .wc-map-details p {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.75rem;
          color: #7c725e;
        }
      `}</style>

      {/* Falling Leaf Elements Layer */}
      <div className="wc-petal-container">
        {particles.map((id) => (
          <FallingParticle key={id} id={id} />
        ))}
      </div>

      {/* Linear Border Elements Framework */}
      <CornerFlourish className="wc-corner wc-corner-tl" />
      <CornerFlourish className="wc-corner wc-corner-tr" />
      <CornerFlourish className="wc-corner wc-corner-bl" />
      <CornerFlourish className="wc-corner wc-corner-br" />

      {/* Desktop-only decorations */}
      <img
        src="/corner-floral.webp"
        alt=""
        aria-hidden="true"
        className="wc-venue-corner-floral"
      />
      
      {/* Right side decor only */}
      <div className="wc-venue-pastel-decor-wrap wc-venue-pastel-decor-wrap--right" aria-hidden="true">
        <PastelSideDecor mirrored />
      </div>

      {/* Main Structural Typography Grid Frame */}
      <div className="wc-venue-card">
        <div className="wc-venue-media">
          <div className="wc-church-frame">
            <img className="wc-church-frame__img" src="/church.webp" alt="St. Jude's Church" />
          </div>
        </div>

        <div className="wc-venue-text">
          <p className="wc-venue__eyebrow">Venue</p>
          <h3 className="wc-venue__title">St. Mary's Syro-Malabar Church, Kodanchery</h3>

          <p className="wc-venue__quote">
            "Two paths crossing in silence, bound forever by love, built upon grace, and blessed under the eye of Heaven."
          </p>

          <div className="wc-venue__time-block">
            Solemn Ceremony at 11:00 AM Sharp • All Are Welcome
          </div>

          {/* Mapbox Trigger Interface Container */}
          <div className="wc-map-anchor-box" onClick={handleMapRedirect} role="button" tabIndex={0}>
            <div className="wc-map-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b8874f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="wc-map-details">
              <h4>View Location on Maps</h4>
              <p>C2M4+628, Kannoth Rd, Punnakkadu, Kodenchery, Kerala 673580</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}