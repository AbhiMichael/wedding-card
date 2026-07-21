import { useEffect, useState } from "react";

// Reusable falling petal component matching the custom venue aesthetic
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

// Simple hand-drawn style cross, matches the brown accent color
function CrossIcon() {
  return (
    <svg
      className="wc-cross"
      viewBox="0 0 60 90"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="26" y="0" width="8" height="90" fill="#6b4a2b" />
      <rect x="6" y="22" width="48" height="8" fill="#6b4a2b" />
    </svg>
  );
}

export default function Invite() {
  const particles = Array.from({ length: 25 }, (_, i) => i);

  return (
    <section className="wc-invite-section">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:wght@600;700&display=swap');

        html, body {
          margin: 0;
          padding: 0;
        }

        .wc-invite-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background: #f6efe3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Frame fills the full viewport — no letterboxing. The image is
           applied as a CSS background (not an <img> tag) so we can swap
           the source at a breakpoint: frame.webp on mobile, frame_d.webp
           on desktop. background-size: cover crops to fill either way, so
           there's never blank space at the top/bottom or sides. */
        .wc-frame {
          position: relative;
          width: 100vw;
          height: 100vh;
          container-type: inline-size;
          background-image: url('/frame.webp');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /* Swap to the desktop artwork at wider viewports. Adjust this
           breakpoint if you'd rather switch at a different width. */
        @media (min-width: 900px) {
          .wc-frame {
            background-image: url('/frame_d.webp');
          }
        }

        /* ---------- Text overlay layer ---------- */
        .wc-text-layer {
          position: absolute;
          inset: 0; 
          z-index: 10;
          color: #5b3f26;
        }

        .wc-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 82%;
          text-align: center;
        }

        .wc-cross {
          position: absolute;
          top: 6%;
          left: 50%;
          transform: translateX(-50%);
          width: 7cqw;
          height: auto;
        }

        .wc-invited {
          top: 14.2%;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 3.3cqw;
          letter-spacing: 0.04em;
          color: #6b4a2b;
        }

        .wc-ceremony {
          top: 17.3%;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 4.4cqw;
          letter-spacing: 0.06em;
          color: #4a3220;
        }

        .wc-parent-line {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.7cqw;
          letter-spacing: 0.02em;
          color: #5b3f26;
        }

        .wc-bride-parents { top: 21.3%; }
        .wc-groom-parents { top: 45.3%; }

        .wc-name {
          font-family: 'Great Vibes', cursive;
          font-size: 9.5cqw;
          line-height: 1;
          color: #4a3220;
        }

        .wc-groom-name { top: 25.5%; }
        .wc-bride-name { top: 37%; }

        .wc-role-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7cqw;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #8a6d3f;
        }

        .wc-groom-role { top: 30.7%; }
        .wc-bride-role { top: 42.2%; }

        .wc-amp {
          top: 32.5%;
          font-family: 'Great Vibes', cursive;
          font-size: 6cqw;
          color: #6b4a2b;
        }

        .wc-divider {
          top: 48.6%;
          font-size: 2.4cqw;
          color: #8a6d3f;
        }
        .wc-divider::before,
        .wc-divider::after {
          content: "";
          display: inline-block;
          width: 18cqw;
          height: 1px;
          background: #b8874f;
          vertical-align: middle;
          margin: 0 0.8em;
        }

        .wc-date {
          top: 51.5%;
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 3.6cqw;
          color: #4a3220;
        }

        .wc-time {
          top: 54.3%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6cqw;
          color: #5b3f26;
        }

        .wc-lunch {
          top: 56.6%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.6cqw;
          color: #5b3f26;
        }

        .wc-compliments {
          top: 58%;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 600;
          font-size: 3cqw;
          letter-spacing: 0.03em;
          color: #6b4a2b;
        }

        /* ---------- Desktop overrides ----------
           cqw scales directly with viewport width, which looks right on a
           phone-width frame but would make text enormous at 1400px+ wide.
           These overrides swap to clamp()-based sizes with sane min/max
           bounds instead. The "top" percentages below start as a straight
           copy of the mobile values — I don't have frame_d.webp to check
           against, so once you drop that image in, nudge these percentages
           to line up with its actual artwork (names, date block, etc. may
           sit in different spots on a desktop-oriented layout). */
        @media (min-width: 900px) {
          .wc-cross {
            top: 6%;
            width: clamp(28px, 2.2vw, 42px);
          }

          .wc-invited {
            top: 14.2%;
            font-size: clamp(14px, 1vw, 18px);
          }

          .wc-ceremony {
            top: 17.3%;
            font-size: clamp(20px, 1.4vw, 26px);
          }

          .wc-parent-line {
            font-size: clamp(12px, 0.9vw, 16px);
          }
          .wc-bride-parents { top: 21.3%; }
          .wc-groom-parents { top: 45.3%; }

          .wc-name {
            font-size: clamp(48px, 4vw, 72px);
          }
          .wc-groom-name { top: 25.5%; }
          .wc-bride-name { top: 37%; }

          .wc-role-label {
            font-size: clamp(10px, 0.7vw, 13px);
          }
          .wc-groom-role { top: 30.7%; }
          .wc-bride-role { top: 42.2%; }

          .wc-amp {
            top: 32.5%;
            font-size: clamp(30px, 2.4vw, 44px);
          }

          .wc-divider {
            top: 48.6%;
            font-size: clamp(12px, 0.8vw, 15px);
          }
          .wc-divider::before,
          .wc-divider::after {
            width: clamp(80px, 6vw, 160px);
          }

          .wc-date {
            top: 51.5%;
            font-size: clamp(18px, 1.3vw, 24px);
          }

          .wc-time {
            top: 54.3%;
            font-size: clamp(13px, 0.9vw, 17px);
          }

          .wc-lunch {
            top: 56.6%;
            font-size: clamp(13px, 0.9vw, 17px);
          }

          .wc-compliments {
            top: 58%;
            font-size: clamp(15px, 1vw, 19px);
          }
        }

        /* Falling Petal Particle Container & Animation */
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
      `}</style>

      <div
        className="wc-frame"
        role="img"
        aria-label="Wedding invitation for Joel and Jismy — Saturday, 29th August 2026"
      >
        {/* Animated Falling Petals Layer */}
        <div className="wc-global-particle-field">
          {particles.map((id) => (
            <FallingParticle key={`invite-petal-${id}`} />
          ))}
        </div>

        {/* Text overlay */}
        <div className="wc-text-layer">
          <CrossIcon />

          <p className="wc-line wc-invited">You are Cordially Invited to the</p>
          <p className="wc-line wc-ceremony">WEDDING CEREMONY OF</p>

          <p className="wc-line wc-parent-line wc-bride-parents">
            S/o Late Mr. Joseph P.J &amp; Dr. Lalimma Joseph, Puthiyedath House
          </p>

          <p className="wc-line wc-name wc-groom-name">Joel</p>
          <p className="wc-line wc-role-label wc-groom-role"></p>

          <p className="wc-line wc-amp">&amp;</p>

          <p className="wc-line wc-name wc-bride-name">Jismy</p>
          <p className="wc-line wc-role-label wc-bride-role"></p>

          <p className="wc-line wc-parent-line wc-groom-parents">
            D/o Mr. Saji Joseph &amp; Mrs. Reji Saji, Thaimattathil House
          </p>

          <p className="wc-line wc-divider" />

          <p className="wc-line wc-date">On Saturday, 29th August, 2026</p>
          <p className="wc-line wc-time">at 11:00 am</p>
          {/* <p className="wc-line wc-lunch">Followed By Lunch</p> */}

          <p className="wc-line wc-compliments">
            Best compliments from family members
          </p>
        </div>
      </div>
    </section>
  );
}