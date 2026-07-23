import { useEffect, useState, useRef } from "react";

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

// Trimmed to end at /exec — double-check this matches your Apps Script deployment URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzy5ynUlgPHiv3dawVu1EFEew-WdlCb8Tq9WzmG1x5NqOkMmbdxfCYzSrWi4nwF_ldO8w/exec";

const EMPTY_FORM = {
  name: "",
  attendance: "Yes",
  guests: "1",
  message: ""
};

// Target Date Setup: August 29, 11:00 AM
const getTargetDate = () => {
  const now = new Date();
  let targetYear = now.getFullYear();
  let target = new Date(`August 29, ${targetYear} 11:00:00`);

  // If August 29 11:00 AM has already passed this year, point to next year
  if (now > target) {
    target = new Date(`August 29, ${targetYear + 1} 11:00:00`);
  }
  return target;
};

export default function RsvpSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null | "success" | "error"
  const upperParticles = Array.from({ length: 25 }, (_, i) => i);

  // Live Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Timer Calculation Logic
  useEffect(() => {
    const targetDate = getTargetDate();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Lock page scroll while the modal is open.
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  const openModal = () => {
    setForm(EMPTY_FORM);
    setSubmitStatus(null);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(form)
      });
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRsvpClick = () => {
    openModal();
  };

  return (
    <section className="wc-rsvp-section" ref={sectionRef}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@400;500;600&display=swap');

        .wc-rsvp-section {
          position: relative;
          width: 100vw;
          min-height: 100vh;
          background-color: #fcfaf6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 24px;
          overflow: hidden;
        }

        /* Falling Petal Container & Keyframe Animations */
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

        .wc-rsvp-bg-decor {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 180px;
          pointer-events: none;
          opacity: 0.45;
          background-image: radial-gradient(circle at 10% 20%, rgba(184, 135, 79, 0.15) 0%, transparent 60%);
          z-index: 2;
        }

        .wc-rsvp-card {
          position: relative;
          z-index: 3;
          width: 100%;
          max-width: 520px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: ${isVisible ? 1 : 0};
          transform: translateY(${isVisible ? 0 : "25px"});
          transition: opacity 1s cubic-bezier(0.25, 1, 0.5, 1), transform 1s cubic-bezier(0.25, 1, 0.5, 1);
        }

        /* Typography Styling */
        .wc-rsvp__title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          color: #9c836c;
          font-weight: 400;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .wc-rsvp__subtitle {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: clamp(0.95rem, 2.2vw, 1.2rem);
          color: #615a50;
          font-weight: 400;
          line-height: 1.5;
          max-width: 460px;
          margin-bottom: 32px;
          letter-spacing: 0.01em;
        }

        /* ---------- Live Countdown Timer Styling ---------- */
        .wc-timer-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-bottom: 40px;
          width: 100%;
        }

        .wc-timer-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(184, 135, 79, 0.3);
          border-radius: 8px;
          padding: 12px 14px;
          min-width: 68px;
          box-shadow: 0 4px 15px rgba(156, 131, 108, 0.08);
          backdrop-filter: blur(4px);
        }

        .wc-timer-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 600;
          color: #9c836c;
          line-height: 1;
        }

        .wc-timer-label {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8c7a63;
          margin-top: 4px;
        }

        .wc-timer-colon {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #b8874f;
          font-weight: 400;
          margin-top: -12px;
        }

        /* RSVP Interactive Wax Seal Image Wrapper */
        .wc-rsvp-seal-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 40px;
        }

        .wc-rsvp-seal-btn {
          cursor: pointer;
          width: 110px;
          height: 110px;
          border: none;
          background: none;
          padding: 0;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.12));
        }

        .wc-rsvp-seal-btn:hover {
          transform: scale(1.08);
        }

        .wc-rsvp-seal-btn:active {
          transform: scale(0.96);
        }

        .wc-rsvp-seal-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        /* Chevron indicator line styling */
        .wc-rsvp-chevron {
          width: 12px;
          height: 12px;
          border-left: 1px solid #c5b6a7;
          border-top: 1px solid #c5b6a7;
          transform: rotate(45deg);
          margin-bottom: 8px;
          opacity: 0.8;
          animation: wc-bounce-up 2s infinite ease-in-out;
        }

        @keyframes wc-bounce-up {
          0%, 100% { transform: rotate(45deg) translate(0, 0); }
          50% { transform: rotate(45deg) translate(-3px, -3px); }
        }

        .wc-rsvp__action-text {
          font-family: 'Great Vibes', cursive;
          font-size: 1.5rem;
          color: #9c836c;
          margin-top: 6px;
        }

        .wc-rsvp__closing {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          color: #9c836c;
          margin-top: 24px;
          margin-bottom: 6px;
        }

        .wc-rsvp__signature {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.85rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #8c7a63;
          font-weight: 500;
        }

        /* ---------- Desktop Media Query Overrides ---------- */
        @media (min-width: 900px) {
          .wc-rsvp-card {
            max-width: 850px;
          }

          .wc-rsvp__title {
            font-size: 4rem;
            margin-bottom: 12px;
          }

          .wc-rsvp__subtitle {
            font-size: 1.35rem;
            max-width: 640px;
            margin-bottom: 44px;
          }

          .wc-timer-container {
            gap: 20px;
            margin-bottom: 52px;
          }

          .wc-timer-box {
            padding: 16px 24px;
            min-width: 95px;
            border-radius: 10px;
          }

          .wc-timer-number {
            font-size: 3rem;
          }

          .wc-timer-label {
            font-size: 0.75rem;
            letter-spacing: 0.22em;
          }

          .wc-timer-colon {
            font-size: 2.2rem;
          }

          .wc-rsvp-seal-container {
            margin-bottom: 56px;
          }

          .wc-rsvp-seal-btn {
            width: 140px;
            height: 140px;
          }

          .wc-rsvp-chevron {
            width: 16px;
            height: 16px;
            margin-bottom: 12px;
          }

          .wc-rsvp__action-text {
            font-size: 2rem;
            margin-top: 10px;
          }

          .wc-rsvp__closing {
            font-size: 3.4rem;
            margin-top: 32px;
          }

          .wc-rsvp__signature {
            font-size: 1.05rem;
            letter-spacing: 0.3em;
          }
        }

        /* ---------- RSVP Modal ---------- */

        .wc-rsvp-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(74, 69, 61, 0.45);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
          animation: wc-modal-fade-in 0.25s ease;
        }

        @keyframes wc-modal-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .wc-rsvp-modal-card {
          position: relative;
          width: 100%;
          max-width: 420px;
          max-height: 88vh;
          overflow-y: auto;
          background: #fcfaf6;
          border: 1px solid rgba(184, 135, 79, 0.35);
          border-radius: 6px;
          padding: 44px 32px 32px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
          text-align: center;
          animation: wc-modal-scale-in 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @media (min-width: 900px) {
          .wc-rsvp-modal-card {
            max-width: 520px;
            padding: 52px 44px 40px;
          }
        }

        @keyframes wc-modal-scale-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .wc-rsvp-modal-close {
          position: absolute;
          top: 12px;
          right: 14px;
          background: none;
          border: none;
          font-size: 1.6rem;
          line-height: 1;
          color: #9c836c;
          cursor: pointer;
          padding: 6px 10px;
        }

        .wc-rsvp-modal-close:hover {
          color: #7c6a54;
        }

        .wc-rsvp-modal-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2rem, 4vw, 2.8rem);
          color: #9c836c;
          font-weight: 400;
          margin-bottom: 4px;
        }

        .wc-rsvp-modal-subtitle {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.95rem;
          color: #615a50;
          margin-bottom: 28px;
        }

        .wc-rsvp-modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .wc-rsvp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .wc-rsvp-field label {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8c7a63;
          font-weight: 500;
        }

        .wc-rsvp-field input,
        .wc-rsvp-field select,
        .wc-rsvp-field textarea {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 1rem;
          color: #4a453d;
          background: #ffffff;
          border: 1px solid #c5b6a7;
          border-radius: 4px;
          padding: 12px 14px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .wc-rsvp-field input:focus,
        .wc-rsvp-field select:focus,
        .wc-rsvp-field textarea:focus {
          border-color: #b8874f;
        }

        .wc-rsvp-field textarea {
          resize: vertical;
          min-height: 80px;
        }

        .wc-rsvp-modal-error {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.85rem;
          color: #a34b3f;
          margin: 0;
        }

        .wc-rsvp-modal-submit {
          margin-top: 6px;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 0.88rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #fcfaf6;
          background: #9c836c;
          border: none;
          border-radius: 4px;
          padding: 14px 24px;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.2s ease;
        }

        .wc-rsvp-modal-submit:hover:not(:disabled) {
          background: #8c7458;
        }

        .wc-rsvp-modal-submit:active:not(:disabled) {
          transform: scale(0.98);
        }

        .wc-rsvp-modal-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .wc-rsvp-modal-success-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.2rem, 4.5vw, 3rem);
          color: #9c836c;
          margin-bottom: 12px;
        }

        .wc-rsvp-modal-success-text {
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 1rem;
          color: #615a50;
          line-height: 1.6;
          margin-bottom: 28px;
        }
      `}</style>

      {/* Animated Falling Petals Layer */}
      <div className="wc-global-particle-field">
        {upperParticles.map((id) => (
          <FallingParticle key={`rsvp-petal-${id}`} />
        ))}
      </div>

      {/* Decorative top ambient layout accents */}
      <div className="wc-rsvp-bg-decor" />

      <div className="wc-rsvp-card">
        {/* Top Segment */}
        <h2 className="wc-rsvp__title">Confirm Your Attendance</h2>
        <p className="wc-rsvp__subtitle">
          To help us prepare for a joyful celebration, kindly confirm your attendance.
        </p>

        {/* Live Aesthetic Countdown Timer */}
        <div className="wc-timer-container">
          <div className="wc-timer-box">
            <span className="wc-timer-number">{String(timeLeft.days).padStart(2, "0")}</span>
            <span className="wc-timer-label">Days</span>
          </div>
          <span className="wc-timer-colon">:</span>
          <div className="wc-timer-box">
            <span className="wc-timer-number">{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="wc-timer-label">Hours</span>
          </div>
          <span className="wc-timer-colon">:</span>
          <div className="wc-timer-box">
            <span className="wc-timer-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="wc-timer-label">Mins</span>
          </div>
          <span className="wc-timer-colon">:</span>
          <div className="wc-timer-box">
            <span className="wc-timer-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="wc-timer-label">Secs</span>
          </div>
        </div>

        {/* Interactive Wax Seal Trigger */}
        <div className="wc-rsvp-seal-container">
          <div className="wc-rsvp-chevron" />
          <button
            className="wc-rsvp-seal-btn"
            onClick={handleRsvpClick}
            aria-label="Open RSVP form"
          >
            <img src="/rsvp.webp" alt="RSVP Wax Seal Logo Asset" className="wc-rsvp-seal-img" />
          </button>
          <span className="wc-rsvp__action-text">Click to open</span>
        </div>

        {/* Bottom Closing Signature Segment */}
        <p className="wc-rsvp__closing">Hope to see you there!</p>
        <span className="wc-rsvp__signature">Joel and Jismy</span>
      </div>

      {isModalOpen && (
        <div className="wc-rsvp-modal-backdrop" onClick={closeModal} role="presentation">
          <div
            className="wc-rsvp-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wc-rsvp-modal-title"
          >
            <button className="wc-rsvp-modal-close" onClick={closeModal} aria-label="Close RSVP form">
              &times;
            </button>

            {submitStatus === "success" ? (
              <div className="wc-rsvp-modal-success">
                <h3 className="wc-rsvp-modal-success-title">Thank You!</h3>
                <p className="wc-rsvp-modal-success-text">
                  Your RSVP has been received. We can&apos;t wait to celebrate with you.
                </p>
                <button className="wc-rsvp-modal-submit" onClick={closeModal}>
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 id="wc-rsvp-modal-title" className="wc-rsvp-modal-title">
                  RSVP
                </h3>
                <p className="wc-rsvp-modal-subtitle">Kindly fill in your details below.</p>

                <form className="wc-rsvp-modal-form" onSubmit={handleSubmit}>
                  <div className="wc-rsvp-field">
                    <label htmlFor="wc-rsvp-name">Full Name</label>
                    <input
                      id="wc-rsvp-name"
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="wc-rsvp-field">
                    <label htmlFor="wc-rsvp-attendance">Will You Attend?</label>
                    <select
                      id="wc-rsvp-attendance"
                      value={form.attendance}
                      onChange={(e) => updateField("attendance", e.target.value)}
                    >
                      <option value="Yes">Joyfully Accept</option>
                      <option value="No">Regretfully Decline</option>
                    </select>
                  </div>

                  {form.attendance === "Yes" && (
                    <div className="wc-rsvp-field">
                      <label htmlFor="wc-rsvp-guests">Number of Guests</label>
                      <select
                        id="wc-rsvp-guests"
                        value={form.guests}
                        onChange={(e) => updateField("guests", e.target.value)}
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5+">5+ Persons</option>
                      </select>
                    </div>
                  )}

                  <div className="wc-rsvp-field">
                    <label htmlFor="wc-rsvp-message">Message (optional)</label>
                    <textarea
                      id="wc-rsvp-message"
                      rows={3}
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Leave a note for the couple"
                    />
                  </div>

                  {submitStatus === "error" && (
                    <p className="wc-rsvp-modal-error">
                      Something went wrong sending your RSVP. Please try again.
                    </p>
                  )}

                  <button type="submit" className="wc-rsvp-modal-submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Submit RSVP"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}