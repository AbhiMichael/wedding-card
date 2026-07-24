import { useEffect, useRef, useState } from "react";
import VenueSection from "./components/VenueSection";
import ScheduleSection from "./components/ScheduleSection";
import RsvpSection from "./components/RsvpSection";
import Family from "./components/Family";
import Invite from "./components/Invite";
import InvitationSection from "./components/InvitationSection";

const FRAME_SETS = {
  mobile: {
    folder: "/images",
    start: 20,
    end: 185,
    fps: 30,
  },
  desktop: {
    folder: "/images_d",
    start: 1,
    end: 80,
    fps: 30,
  },
};

const DESKTOP_QUERY = "(min-width: 900px)";

const framePath = (folder, i) =>
  `${folder}/frame_${String(i).padStart(2, "0")}.webp`;

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
  "/welcomed.webp",
];

// Any of these count as "the visitor did something" and unlock real (unmuted) audio.
const UNLOCK_EVENTS = [
  "pointerdown",
  "touchstart",
  "keydown",
  "scroll",
  "wheel",
];

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

function SpeakerOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" fill="#8c6a41" />
      <path
        d="M15.8 8.2a5 5 0 0 1 0 7.6"
        stroke="#8c6a41"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M18.3 5.6a9 9 0 0 1 0 12.8"
        stroke="#8c6a41"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpeakerOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" fill="#8c6a41" />
      <line
        x1="16.2"
        y1="9"
        x2="21.5"
        y2="15"
        stroke="#8c6a41"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <line
        x1="21.5"
        y1="9"
        x2="16.2"
        y2="15"
        stroke="#8c6a41"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const loaderRef = useRef(null);
  const loaderTextRef = useRef(null);
  const musicHintRef = useRef(null);
  const contentRef = useRef(null);
  const hasAutoScrolledRef = useRef(false);

  // Background music: Default state is Speaker ON (isMuted = false)
  const audioRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Loading-screen hint only: starts as "off" and flips to "on" the moment
  // the visitor interacts with the page (click/tap/scroll/key), independent
  // of the real toggle button above.
  const [hintUnlocked, setHintUnlocked] = useState(false);

  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  const upperParticles = Array.from({ length: 25 }, (_, i) => i);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // ---- Music: warm it up muted immediately, unlock real sound on first interaction ----
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    // Keep the icon truthful: reflect what the <audio> element is actually doing,
    // instead of guessing based on which call we *tried* to make.
    const markPlaying = () => setIsMuted(false);
    const markPaused = () => setIsMuted(true);
    audio.addEventListener("playing", markPlaying);
    audio.addEventListener("pause", markPaused);

    const tryUnmutedPlay = () => {
      audio.muted = false;
      const p = audio.play();
      if (p !== undefined) p.catch(() => {});
    };

    const cleanupListeners = () => {
      UNLOCK_EVENTS.forEach((evt) => window.removeEventListener(evt, unlock));
    };

    const unlock = () => {
      tryUnmutedPlay();
      cleanupListeners();
      setHintUnlocked(true);
    };

    // 1. Silent autoplay is allowed by every browser - start it muted right away so
    //    it's already running (not stalled) the instant sound gets unlocked.
    audio.muted = true;
    audio.play().catch(() => {});

    // 2. Try for real immediately too, in case this browser/session already has
    //    autoplay permission (e.g. user has interacted with the site before).
    tryUnmutedPlay();

    // 3. The very first interaction of ANY kind - not just the speaker button -
    //    unmutes and plays. On mobile this is usually the first scroll/swipe,
    //    so in practice sound starts within moments of the page loading.
    UNLOCK_EVENTS.forEach((evt) =>
      window.addEventListener(evt, unlock, { once: true, passive: true }),
    );

    return () => {
      cleanupListeners();
      audio.removeEventListener("playing", markPlaying);
      audio.removeEventListener("pause", markPaused);
    };
  }, []);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.muted) {
      audio.muted = false;
      audio.play().catch(() => {});
    } else {
      audio.muted = true;
      audio.pause();
    }
  };

  useEffect(() => {
    const { folder, start, end, fps } = isDesktop
      ? FRAME_SETS.desktop
      : FRAME_SETS.mobile;
    const frameCount = end - start + 1;
    const frameDurationMs = 1000 / fps;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const images = {};
    let canvasSized = false;
    let rafId = null;
    let playbackStart = null;
    let cancelled = false;

    hasAutoScrolledRef.current = false;
    if (musicHintRef.current) {
      musicHintRef.current.classList.remove("is-visible");
    }

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

    // Preload the music itself as part of the loading-screen progress,
    // so it's fully buffered and ready the instant content is revealed.
    function loadAudio() {
      return new Promise((resolve) => {
        const audio = audioRef.current;
        if (!audio) return resolve();
        if (audio.readyState >= 3) return resolve(); // HAVE_FUTURE_DATA or better
        const cleanup = () => {
          audio.removeEventListener("canplaythrough", onReady);
          audio.removeEventListener("error", onReady);
        };
        const onReady = () => {
          cleanup();
          resolve();
        };
        audio.addEventListener("canplaythrough", onReady, { once: true });
        audio.addEventListener("error", onReady, { once: true });
        audio.load();
      });
    }

    async function loadAll() {
      let loaded = 0;
      const jobs = [];
      const totalToLoad = frameCount + STATIC_IMAGES.length + 1; // +1 for audio

      const updateProgress = () => {
        loaded++;
        const pct = Math.round((loaded / totalToLoad) * 100);
        if (loaderTextRef.current) {
          loaderTextRef.current.textContent = `Loading ${pct}%`;
        }
        if (musicHintRef.current && pct >= 15) {
          musicHintRef.current.classList.add("is-visible");
        }
      };

      // 1. Load the music FIRST, on its own, before anything else starts loading.
      await loadAudio();
      updateProgress();

      // 2. Only now start loading frames + static images in the background.
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
          }).then(updateProgress),
        );
      }

      await Promise.all(jobs);
    }

    function scrollToContent() {
      if (hasAutoScrolledRef.current) return;
      if (window.scrollY > 50) return;
      if (!contentRef.current) return;
      hasAutoScrolledRef.current = true;
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function playback(timestamp) {
      if (cancelled) return;
      if (playbackStart === null) playbackStart = timestamp;
      const elapsed = timestamp - playbackStart;
      const frameOffset = Math.min(
        frameCount - 1,
        Math.floor(elapsed / frameDurationMs),
      );
      drawFrame(start + frameOffset);
      if (heroRef.current) {
        const progress = frameOffset / (frameCount - 1);
        heroRef.current.style.opacity = String(1 - Math.min(progress / 0.3, 1));
      }
      if (frameOffset < frameCount - 1) {
        rafId = requestAnimationFrame(playback);
      } else {
        scrollToContent();
      }
    }

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
        .wc-loader__music-hint{
          font-family: var(--serif);
          font-style: italic;
          font-size: .68rem;
          letter-spacing: .03em;
          color: var(--gold);
          opacity: 0;
          transition: opacity .6s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: none;
        }
        .wc-loader__music-hint.is-visible{
          opacity: .85;
        }
        .wc-loader__music-hint svg{
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .wc-loader__music-hint svg polygon,
        .wc-loader__music-hint svg path{
          fill: var(--gold);
          stroke: var(--gold);
        }
        
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

        /* ---- Transparent Sound Toggle ---- */
        .wc-sound-toggle{
          position: fixed;
          left: 16px;
          bottom: 16px;
          z-index: 1000;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          cursor: pointer;
          transition: transform .2s ease;
        }
        .wc-sound-toggle:hover{ transform: scale(1.15); }
        .wc-sound-toggle:active{ transform: scale(0.9); }
        .wc-sound-toggle:focus-visible{ outline: 2px solid var(--gold); outline-offset: 4px; border-radius: 4px; }
        .wc-sound-toggle svg{ width: 24px; height: 24px; display: block; }

        /* ---- Scroll text ticker ---- */
        .wc-scroll-ticker{
          position: relative;
          z-index: 4;
          overflow: hidden;
          width: 100%;
          max-width: 320px;
          margin: 32px auto 0;
          padding: 7px 0;
          border-top: 1px solid rgba(140, 122, 99, 0.25);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }
        .wc-scroll-ticker__track{
          display: inline-flex;
          gap: 48px;
          white-space: nowrap;
          animation: wc-ticker-scroll 16s linear infinite;
        }
        .wc-scroll-ticker__track span{
          font-family: var(--serif);
          font-style: italic;
          font-size: .68rem;
          letter-spacing: .06em;
          color: #8c7a63;
        }
        @keyframes wc-ticker-scroll{
          from{ transform: translateX(0); }
          to{ transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce){
          .wc-scroll-ticker__track{ animation: none; }
        }
      `}</style>

      {/* HTML5 audio element with autoplay attribute set */}
      <audio ref={audioRef} src="/music.mp3" loop autoPlay preload="auto" />

      <button
        type="button"
        className="wc-sound-toggle"
        onClick={toggleMute}
        aria-pressed={!isMuted}
        aria-label={
          isMuted ? "Unmute background music" : "Mute background music"
        }
        title={isMuted ? "Unmute music" : "Mute music"}
      >
        {!isLoaded ? (
          hintUnlocked ? (
            <SpeakerOnIcon />
          ) : (
            <SpeakerOffIcon />
          )
        ) : isMuted ? (
          <SpeakerOffIcon />
        ) : (
          <SpeakerOnIcon />
        )}
      </button>

      <div className="wc-loader" ref={loaderRef}>
        <div className="wc-loader__ring" />
        <p className="wc-loader__text" ref={loaderTextRef}>
          Loading
        </p>
        <p className="wc-loader__music-hint" ref={musicHintRef}>
          <span>click here to start music</span>
          <SpeakerOnIcon />
        </p>
      </div>

      {/* Main Landing Video Stage */}
      <div className="wc-stage">
        <div className="wc-global-particle-field">
          {upperParticles.map((id) => (
            <FallingParticle key={`stage-${id}`} />
          ))}
        </div>
        <canvas
          className="wc-canvas"
          ref={canvasRef}
          aria-label="Animated photo sequence"
        />
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
