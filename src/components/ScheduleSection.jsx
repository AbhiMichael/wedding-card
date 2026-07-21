import { useLayoutEffect, useRef, useState, useEffect } from "react";

const TIMELINE_EVENTS = [
  { time: "5 PM", name: "Guest Arrival" },
  { time: "6 PM", name: " Madhuram Veppu" },
  { time: "7 PM", name: "Party Time" },
  { time: "11 AM", name: "Wedding Ceremony" },
  { time: "1 PM", name: "Reception" }
];

const ROSE_IMAGE_SRC = "/flower.webp";

// Matches the breakpoint used elsewhere on the site (Invite.jsx, VenueSection.jsx).
const DESKTOP_QUERY = "(min-width: 900px)";

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

function HeaderFlourish({ className = "" }) {
  return (
    <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className={`wc-timeline-flourish ${className}`}>
      <path d="M10 10 C 20 2, 25 18, 30 10 C 35 2, 40 18, 50 10" stroke="#b8874f" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="5" cy="10" r="1.5" fill="#b8874f" />
      <circle cx="55" cy="10" r="1.5" fill="#b8874f" />
    </svg>
  );
}

export default function ScheduleSection() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const dotRefs = useRef([]);
  const rafRef = useRef(null);

  const [roseX, setRoseX] = useState(0);
  const [roseY, setRoseY] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);
  const upperParticles = Array.from({ length: 25 }, (_, i) => i);

  // Lazy-init so the very first calculation already uses the right mode
  // instead of assuming mobile and correcting a moment later.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );

  // Keep isDesktop in sync if the viewport crosses the breakpoint later.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Progress (0 -> 1) is calculated differently depending on layout:
    //
    // - Mobile (vertical): dots move up the screen as you scroll normally,
    //   so progress comes from how close a dot is to the vertical center
    //   of the viewport (exactly as before).
    //
    // - Desktop (horizontal): the row is pinned in place with
    //   `position: sticky` while the section scrolls underneath it, so
    //   the dots never move on screen — there's nothing to "cross". Instead
    //   progress comes from how far you've scrolled through the section's
    //   extra height while it's pinned.
    const calculateRosePosition = () => {
      const grid = gridRef.current;
      const firstDot = dotRefs.current[0];
      const lastDot = dotRefs.current[dotRefs.current.length - 1];
      if (!grid || !firstDot || !lastDot) return;

      const gridRect = grid.getBoundingClientRect();
      const firstDotRect = firstDot.getBoundingClientRect();
      const lastDotRect = lastDot.getBoundingClientRect();

      if (isDesktop) {
        let progress = 0;
        const scrollableDistance = container.offsetHeight - window.innerHeight;
        if (scrollableDistance > 0) {
          const scrolled = -container.getBoundingClientRect().top;
          progress = scrolled / scrollableDistance;
        }
        progress = Math.min(1, Math.max(0, progress));

        const firstDotX = firstDotRect.left - gridRect.left;
        const lastDotX = lastDotRect.left - gridRect.left;
        const targetX = firstDotX + progress * (lastDotX - firstDotX);

        setRoseX(targetX);
        setRoseY(gridRect.height / 2);
      } else {
        const referenceLine = window.innerHeight / 2;
        const totalSpan = lastDotRect.top - firstDotRect.top;

        let progress = 0;
        if (totalSpan > 0) {
          progress = (referenceLine - firstDotRect.top) / totalSpan;
        }
        progress = Math.min(1, Math.max(0, progress));

        const firstDotY = firstDotRect.top - gridRect.top;
        const lastDotY = lastDotRect.top - gridRect.top;
        const targetY = firstDotY + progress * (lastDotY - firstDotY);

        setRoseX(gridRect.width / 2);
        setRoseY(targetY);
      }
    };

    const onScrollOrResize = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        calculateRosePosition();
        rafRef.current = null;
      });
    };

    calculateRosePosition();

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop]);

  return (
    <section className="wc-timeline-section" ref={containerRef}>
      <style>{`
        .wc-timeline-section {
          position: relative;
          width: 100vw;
          min-height: 130vh;
          background: #fcfaf6; 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 24px;
          overflow: hidden;
        }

        /* Falling Petals Particle Field */
        .wc-global-particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
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

        .wc-timeline-pin {
          width: 100%;
        }

        .wc-timeline-title-area {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 60px;
        }
        .wc-timeline-title-area h2 {
          font-family: var(--great);
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          color: #9c836c; 
          font-weight: 400;
        }
        .wc-timeline-flourish-right {
          transform: scaleX(-1);
        }

        .wc-timeline-grid {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 110px;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        .wc-timeline-axis-line {
          position: absolute;
          left: 50%;
          top: 25px; 
          bottom: 25px; 
          width: 1px;
          background: #c5b6a7;
          transform: translateX(-50%);
          pointer-events: none;
        }

        .wc-timeline-rose-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: clamp(58px, 10vw, 68px);
          height: clamp(58px, 10vw, 68px);
          z-index: 10;
          pointer-events: none;
          will-change: transform, opacity;
          transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
        }
        
        .wc-timeline-rose-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .wc-timeline-row {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 40px 1fr;
          align-items: center;
          width: 100%;
        }

        .wc-timeline-time-col {
          text-align: right;
          font-family: var(--serif);
          font-size: clamp(1.4rem, 3.5vw, 2rem);
          color: #4a453d;
          font-weight: 400;
          padding-right: 10px;
        }

        .wc-timeline-center-col {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }

        .wc-timeline-node-dot {
          width: 8px;
          height: 8px;
          background: #fcfaf6;
          border: 1px solid #7c7267;
          transform: rotate(45deg);
          z-index: 5;
          margin: 0 auto;
        }

        .wc-timeline-text-col {
          text-align: left;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: clamp(1rem, 2.4vw, 1.3rem);
          line-height: 1.2;
          color: #615a50;
          font-weight: 400;
          padding-left: 10px;
          letter-spacing: 0.02em;
        }

        /* ---------- Desktop: horizontal, sticky-pinned timeline ----------
           The section stays tall (scroll runway for the pin), but the
           title + row get pinned to the middle of the viewport while the
           section scrolls underneath. The rose's X position is driven by
           how far you've scrolled through that runway (see the JS above),
           not by dot position on screen — the dots don't move while
           pinned, so there's nothing for them to "cross". */
        @media (min-width: 900px) {
          .wc-timeline-section {
            display: block;
            min-height: 115vh;
            padding: 0 40px;
          }

          .wc-timeline-pin {
            position: sticky;
            top: 0;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 5;
          }

          .wc-timeline-grid {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            max-width: 1080px;
            gap: 0;
          }

          .wc-timeline-axis-line {
            left: 4%;
            right: 4%;
            top: 50%;
            bottom: auto;
            width: auto;
            height: 1px;
            transform: translateY(-50%);
          }

          .wc-timeline-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: auto;
          }

          .wc-timeline-time-col,
          .wc-timeline-text-col {
            text-align: center;
            padding: 0;
          }

          .wc-timeline-text-col {
            white-space: nowrap;
          }
        }
      `}</style>

      {/* Falling Petals Background Layer */}
      <div className="wc-global-particle-field">
        {upperParticles.map((id) => (
          <FallingParticle key={`schedule-petal-${id}`} />
        ))}
      </div>

      <div className="wc-timeline-pin">
        <div className="wc-timeline-title-area">
          <HeaderFlourish />
          <h2>Schedule of Events</h2>
          <HeaderFlourish className="wc-timeline-flourish-right" />
        </div>

        <div className="wc-timeline-grid" ref={gridRef}>
          <div className="wc-timeline-axis-line" />

          <div
            className="wc-timeline-rose-wrapper"
            style={{
              transform: `translate(calc(${roseX}px - 50%), calc(${roseY}px - 50%))`,
              opacity: hasEntered ? 1 : 0
            }}
          >
            {hasEntered && (
              <img src={ROSE_IMAGE_SRC} alt="" className="wc-timeline-rose-img" />
            )}
          </div>

          {TIMELINE_EVENTS.map((event, index) => (
            <div key={index} className="wc-timeline-row">
              <div className="wc-timeline-time-col">{event.time}</div>

              <div className="wc-timeline-center-col">
                <div
                  className="wc-timeline-node-dot"
                  ref={(el) => (dotRefs.current[index] = el)}
                />
              </div>

              <div className="wc-timeline-text-col">{event.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}