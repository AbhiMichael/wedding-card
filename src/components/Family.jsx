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

export default function WelcomeSection() {
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
    <section className="wc-welcome-section" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');

        /* Default (Mobile) styles specifically for the Welcome section */
        .wc-welcome-section {
          position: relative;
          z-index: 3;
          background-image: url('/welcome.webp'), linear-gradient(180deg, #f8f2e6 0%, #efe1c9 100%);
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          box-shadow: inset 0 80px 60px -60px rgba(0, 0, 0, 0);
          padding: 80px 24px 100px;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        /* Desktop view override for background image */
        @media (min-width: 900px) {
          .wc-welcome-section {
            background-image: url('/welcomed.webp'), linear-gradient(180deg, #f8f2e6 0%, #efe1c9 100%);
          }
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

        /* Main Welcome Content Container */
        .wc-welcome-content {
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
        .wc-welcome-content.is-open {
          opacity: 1;
          transform: translateY(0);
        }

        /* Top Hero Image */
        .wc-welcome-hero-wrapper {
          position: relative;
          display: inline-block;
          margin: 16px auto 28px;
        }
        .wc-welcome-hero-img {
          width: 100%;
          max-width: 210px;
          height: auto;
          display: block;
          border-radius: 120px 120px 8px 8px;
          padding: 6px;
          border: 1px solid rgba(184, 135, 79, 0);
          background: rgba(255, 255, 255, 0);
          box-shadow: 0 12px 30px -10px rgba(74, 60, 46, 0);
          transition: transform 0.8s ease;
        }
        .wc-welcome-hero-img:hover {
          transform: scale(1.02);
        }

        /* Titles & Flourishes */
        .wc-welcome-section .wc-family-title-area {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 8px 0 12px;
        }
        .wc-welcome-section .wc-family-title-area h2 {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.4rem, 5.5vw, 3.6rem);
          color: #9c836c;
          font-weight: 400;
          line-height: 1.1;
        }
        .wc-welcome-section .wc-family-flourish-right { transform: scaleX(-1); }

        /* Welcome Message Paragraph */
        .wc-welcome-card {
          background: rgba(252, 250, 246, 0.65);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(184, 135, 79, 0.25);
          border-radius: 12px;
          padding: 28px 22px;
          margin-top: 18px;
          box-shadow: 0 8px 24px -8px rgba(140, 122, 99, 0.15);
        }

        .wc-welcome-paragraph {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.05rem, 2.8vw, 1.25rem);
          color: #4a453d;
          line-height: 1.7;
          letter-spacing: 0.01em;
          margin-bottom: 20px;
        }

        .wc-welcome-signature {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(1.8rem, 4vw, 2.5rem);
          color: #b8874f;
          margin-top: 10px;
        }

        .wc-welcome-sub-signature {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8c7a63;
          margin-top: 4px;
        }
      `}</style>

      {/* Animated Falling Petals Layer */}
      <div className="wc-global-particle-field">
        {upperParticles.map((id) => (
          <FallingParticle key={`welcome-petal-${id}`} />
        ))}
      </div>

      {/* Content Body */}
      <div className={`wc-welcome-content ${isOpen ? "is-open" : ""}`}>
        {/* Top Couple Image */}
        <div className="wc-welcome-hero-wrapper">
          <img src="/couple.webp" alt="Joyal and Jismy" className="wc-welcome-hero-img" />
        </div>

        {/* Section Heading */}
        <div className="wc-family-title-area">
          <HeaderFlourish isOpen={isOpen} />
          <h2>Welcome & Thank You</h2>
          <HeaderFlourish className="wc-family-flourish-right" isOpen={isOpen} />
        </div>

        {/* Heartfelt Message Box */}
        <div className="wc-welcome-card">
          <p className="wc-welcome-paragraph">
            As we step into this beautiful new chapter of our lives, we are overwhelmingly grateful for your love, support, and presence. Having you here to witness our union fills our hearts with immense joy. Thank you for being a part of our story and celebrating this unforgettable milestone with us.
          </p>

          <div className="wc-welcome-signature">Joel & Jismy</div>
          <div className="wc-welcome-sub-signature">With love & gratitude</div>
        </div>
      </div>
    </section>
  );
}