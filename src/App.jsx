import { useEffect, useRef, useState } from "react";
import VenueSection from "./components/VenueSection";
import ScheduleSection from "./components/ScheduleSection";
import RsvpSection from "./components/RsvpSection";
import Family from "./components/Family";
import Invite from "./components/Invite";
import InvitationSection from "./components/InvitationSection"; // adjust relative path as needed

// Two separate frame sets: the existing mobile sequence, and a new one for
// desktop pulling from /images_d. Adjust `start`/`end`/`fps` per set
// independently — I've assumed images_d is numbered 1 through 240 with the
// same "frame_NN.webp" naming as the mobile set, since that wasn't specified.
// If your actual files are named differently, update `start`/`end` (and the
// filename template in framePath below) to match.
const FRAME_SETS = {
  mobile: {
    folder: "/images",
    start: 20,
    end: 185,
    fps: 30
  },
  desktop: {
    folder: "/images_d",
    start: 1,
    end: 80,
    fps: 30
  }
};

// Matches the breakpoint already used elsewhere on the site (Invite.jsx).
const DESKTOP_QUERY = "(min-width: 900px)";

const framePath = (folder, i) => `${folder}/frame_${String(i).padStart(2, "0")}.webp`;

const STATIC_IMAGES = [
  "/church.webp",
  "/church1.webp",
  "/couple.webp",
  "/floral.webp",
  "/flower.webp",
  "/frame.webp",
  "/frame_186.webp",
  "/frame_d.webp",
  "/rsvp.webp",
  "/s2.webp",
  "/ss.webp",
  "/welcome.webp",
  "/welcome2.webp",
  "/welcomed.webp"
];

// Reusable falling petal component matching the landing stage
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

export default function App() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderTextRef = useRef(null);
  // Marks the start of the content that follows the hero animation stage
  // (Invite + everything after it), so we can scroll to it once the
  // frame sequence finishes playing.
  const contentRef = useRef(null);
  // Guards against re-triggering the auto-scroll more than once per
  // playback run (e.g. if the effect re-fires from a breakpoint change).
  const hasAutoScrolledRef = useRef(false);

  // Lazy-init so the very first render (and therefore the first frame load)
  // already targets the right asset set instead of loading mobile frames
  // first and then re-loading desktop ones a moment later.
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const upperParticles = Array.from({ length: 25 }, (_, i) => i);

  // Keep isDesktop in sync if the viewport crosses the breakpoint later
  // (window resize, devtools, folding a tablet, etc.).
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const { folder, start, end, fps } = isDesktop ? FRAME_SETS.desktop : FRAME_SETS.mobile;
    const frameCount = end - start + 1;
    const frameDurationMs = 1000 / fps;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const images = {};
    let canvasSized = false;
    let rafId = null;
    let playbackStart = null;
    let cancelled = false;

    // Reset the auto-scroll guard each time this effect (re)runs, e.g.
    // when switching between mobile/desktop frame sets.
    hasAutoScrolledRef.current = false;

    function drawFrame(frameNum) {
      const img = images[frameNum];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      if (!canvasSized) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvasSized = true;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    function loadFrame(frameNum) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = framePath(folder, frameNum);
        images[frameNum] = img;
      });
    }

    async function loadAll() {
      let loaded = 0;
      const jobs = [];
      const totalToLoad = frameCount + STATIC_IMAGES.length;

      const updateProgress = () => {
        loaded++;
        if (loaderTextRef.current) {
          const pct = Math.round((loaded / totalToLoad) * 100);
          loaderTextRef.current.textContent = `Loading ${pct}%`;
        }
      };

      for (let f = start; f <= end; f++) {
        jobs.push(loadFrame(f).then(updateProgress));
      }

      for (const src of STATIC_IMAGES) {
        jobs.push(
          new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve;
            img.src = src;
          }).then(updateProgress)
        );
      }

      await Promise.all(jobs);
    }

    // Auto-scrolls to the content that follows the hero stage, once the
    // frame animation has finished playing. Only fires if the visitor
    // is still near the top (hasn't already scrolled away on their own),
    // and only fires once per playback run.
    function scrollToContent() {
      if (hasAutoScrolledRef.current) return;
      if (window.scrollY > 50) return; // respect manual scrolling
      if (!contentRef.current) return;
      hasAutoScrolledRef.current = true;
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function playback(timestamp) {
      if (cancelled) return;
      if (playbackStart === null) playbackStart = timestamp;
      const elapsed = timestamp - playbackStart;
      const frameOffset = Math.min(frameCount - 1, Math.floor(elapsed / frameDurationMs));
      drawFrame(start + frameOffset);
      if (heroRef.current) {
        const progress = frameOffset / (frameCount - 1);
        heroRef.current.style.opacity = String(1 - Math.min(progress / 0.3, 1));
      }
      if (frameOffset < frameCount - 1) {
        rafId = requestAnimationFrame(playback);
      } else {
        // Last frame has been drawn — the sequence is complete.
        scrollToContent();
      }
    }

    // Switching frame sets (e.g. resizing across the breakpoint) should
    // show the loader again while the new set streams in.
    canvasSized = false;
    if (loaderRef.current) {
      loaderRef.current.classList.remove("is-hidden");
    }

    loadAll().then(() => {
      if (cancelled) return;
      drawFrame(start);
      if (loaderRef.current) loaderRef.current.classList.add("is-hidden");
      setIsLoaded(true);
      rafId = requestAnimationFrame(playback);
    });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDesktop]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');

        :root{
          --bg:       #c9c2ad;
          --ivory:    #f4efe6;
          --gold:     #c9a66b;
          --grey:     #8c8579;
          --line:     rgba(244, 239, 230, 0.14);
          --serif:    'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, 'Times New Roman', serif;
          --sans:     -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
          --great:    'Great Vibes', cursive;
        }
        *{ margin:0; padding:0; box-sizing:border-box; }
        html, body, #root{ background:var(--bg); overflow-x:hidden; }
        body{ color:var(--ivory); font-family:var(--sans); -webkit-font-smoothing:antialiased; }
        
        .wc-global-particle-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5; 
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

        .wc-loader{
          position:fixed; inset:0; background:var(--bg);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:18px; z-index:999; transition:opacity .7s ease;
        }
        .wc-loader.is-hidden{ opacity:0; pointer-events:none; }
        .wc-loader__ring{
          width:34px; height:34px; border-radius:50%;
          border:1px solid var(--line); border-top-color:var(--gold);
          animation:wc-spin 1s linear infinite;
        }
        @keyframes wc-spin{ to{ transform:rotate(360deg); } }
        .wc-loader__text{ font-size:.7rem; letter-spacing:.25em; text-transform:uppercase; color:var(--grey); }
        
        .wc-stage{
          position:relative; height:100vh; height:100svh; width:100%;
          overflow:hidden; background:var(--bg);
          display:flex; align-items:center; justify-content:center;
        }
        .wc-canvas{
          display:block; width:100vw; height:100vh; height:100svh;
          object-fit:cover; object-position:center center;
        }
        .wc-hero{
          position:absolute; inset:0; z-index:2;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          text-align:center; padding:0 24px; pointer-events:none;
        }
        .wc-hero__eyebrow{ font-size:.68rem; letter-spacing:.35em; text-transform:uppercase; color:var(--gold); margin-bottom:18px; }
        .wc-hero__names{ font-family:var(--serif); font-weight:500; font-size:clamp(2.4rem, 8vw, 5.5rem); line-height:1.05; }
        .wc-hero__amp{ color:var(--gold); font-style:italic; padding:0 .15em; }
        .wc-hero__date{ margin-top:22px; font-size:.75rem; letter-spacing:.3em; text-transform:uppercase; color:var(--grey); }
        
        .wc-invite{
          position:relative; z-index:3;
          background-image: url('/s2.webp'), linear-gradient(180deg, #f8f2e6 0%, #efe1c9 100%);
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          box-shadow: inset 0 80px 60px -60px rgba(0,0,0,0.28);
          padding: 90px 24px 100px;
        }
        .wc-invite__grid{
          display:grid;
          grid-template-columns: 1fr;
          gap:12px;
          max-width:900px;
          margin:0 auto;
        }
        .wc-invite__pillar{ display:none; width:clamp(48px, 6vw, 72px); aspect-ratio: 1 / 5; align-self:center; }
        @media (min-width:768px){
          .wc-invite__grid{ grid-template-columns: 70px 1fr 70px; align-items:stretch; }
          .wc-invite__pillar{ display:block; }
        }
        .wc-invite__pillar--right{ transform:scaleX(-1); }
        .wc-invite__card{ text-align:center; padding:12px 8px; position: relative; z-index: 4; }
        .wc-invite__top-flourish, .wc-invite__bottom-flourish{
          width:clamp(180px, 40vw, 280px); height:auto; display:block;
        }
        .wc-invite__top-flourish{ margin:0 auto 28px; }
        .wc-invite__bottom-flourish{ margin:36px auto 0; transform:rotate(180deg); }
        .wc-invite__eyebrow{ font-family:var(--sans); font-size:.68rem; letter-spacing:.35em; text-transform:uppercase; color:#b8874f; margin-bottom:16px; }
        .wc-invite__subheading{ margin-top:14px; font-family:var(--serif); font-style:italic; font-size:.85rem; letter-spacing:.04em; color:#8c7a63; }
        
        .wc-invite__couple-img {
          width: 100%;
          max-width: 180px;
          height: auto;
          margin: 24px auto;
          display: block;
          border-radius: 4px;
        }
        .wc-invite__rsvp{ margin-top:8px; font-family:var(--sans); font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:#8c7a63; }

        /* ---- Aesthetic Countdown Module Styles ---- */
        .wc-countdown-stage {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 2vw, 14px);
          margin: 18px 0;
          padding: 8px 12px;
          min-height: 80px;
        }
        .wc-countdown__unit {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .wc-countdown__digit {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #4a3c2e;
          line-height: 1;
          transition: transform 0.2s ease-in-out;
        }
        .wc-countdown__digit--live {
          color: #b8874f;
        }
        .wc-countdown__label {
          font-family: var(--sans);
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8c7a63;
          margin-top: 6px;
        }
        .wc-countdown__separator {
          font-family: var(--serif);
          font-size: clamp(1.4rem, 4vw, 2.2rem);
          color: rgba(184, 135, 79, 0.4);
          transform: translateY(-8px);
        }
      `}</style>

      <div className="wc-loader" ref={loaderRef}>
        <div className="wc-loader__ring" />
        <p className="wc-loader__text" ref={loaderTextRef}>Loading</p>
      </div>

      {/* Main Landing Video Stage */}
      <div className="wc-stage">
        <div className="wc-global-particle-field">
          {upperParticles.map((id) => <FallingParticle key={`stage-${id}`} />)}
        </div>
        <canvas className="wc-canvas" ref={canvasRef} aria-label="Animated photo sequence" />
        <div className="wc-hero" ref={heroRef} />
      </div>

      {isLoaded && (
        <div ref={contentRef}>
          <Invite />
          <VenueSection />
          <ScheduleSection />
          <Family />
          <RsvpSection />
        </div>
      )}
      
    </>
  );
}