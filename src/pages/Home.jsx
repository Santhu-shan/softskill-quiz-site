import { useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/quizData";
import { askSoftSkillsQuestion } from "../services/aiService";
import "./Home.css";

const STATS = [
  { label: "Questions", value: "1000+", icon: "❓" },
  { label: "Topics", value: "50+", icon: "📚" },
  { label: "Community", value: "Cloud", icon: "🌐" },
  { label: "AI Powered", value: "100%", icon: "🤖" },
];

const FEATURES = [
  { icon: "🎯", title: "Smart Practice", desc: "Practice mode with AI-powered wrong-answer explanations in real time." },
  { icon: "🧪", title: "Quiz & Test", desc: "Timed quizzes with comprehensive end-of-quiz AI analysis." },
  { icon: "📖", title: "Deep Learning", desc: "One question at a time with full AI explanations, or see all at once." },
  { icon: "🤖", title: "AI Tutor", desc: "Ask any soft skills question and get instant expert guidance." },
  { icon: "📤", title: "AI Upload", desc: "Upload PDFs and let AI generate full learning modules and quizzes for you." },
  { icon: "🌐", title: "Community", desc: "Share your learning materials with other students and study together." },
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);

  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setAiAnswer("");
    setAsked(true);
    try {
      const ans = await askSoftSkillsQuestion(question);
      setAiAnswer(ans);
    } catch {
      setAiAnswer("Sorry, AI is unavailable right now. Please check your API key in the .env file.");
    } finally {
      setLoading(false);
    }
  }

  const catEntries = Object.values(CATEGORIES);

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-orb orb1" />
        <div className="hero-bg-orb orb2" />
        <div className="hero-bg-orb orb3" />
        <div className="hero-content">
          <div className="hero-badge badge badge-purple anim-fade">
            <span className="badge-dot" /> AI-Powered Learning Platform
          </div>
          <h1 className="hero-title anim-fade-up">
            Master <span className="grad-purple">Soft Skills</span>
            <br />With Community Power
          </h1>
          <p className="hero-subtitle anim-fade-up">
            The world's first AI-driven student library. Upload your syllabus PDFs, 
            and let AI create interactive quizzes and learning modules instantly.
          </p>
          <div className="hero-actions anim-fade-up">
            <Link to="/community" className="btn btn-primary btn-lg">
              📚 Browse Library
            </Link>
            <Link to="/upload" className="btn btn-secondary btn-lg">
              📤 Upload PDF
            </Link>
          </div>
        </div>

        <div className="stats-row stagger">
          {STATS.map((s) => (
            <div className="stat-card glass" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMUNITY CALLOUT ── */}
      <section className="community-cta">
        <div className="community-cta-card glass anim-fade-up">
          <div className="cta-body">
            <span className="badge badge-teal">NEW FEATURE</span>
            <h2>Crowdsourced Learning</h2>
            <p>Don't have content for a specific topic? Search the <strong>Community Library</strong> to see what other students have uploaded, or upload your own PDF to generate a quiz in seconds.</p>
            <div className="cta-buttons">
              <Link to="/community" className="btn btn-primary">Go to Library</Link>
              <Link to="/upload" className="btn btn-secondary">Upload Now</Link>
            </div>
          </div>
          <div className="cta-icon">🌍</div>
        </div>
      </section>

      {/* ── ASK AI BAR ── */}
      <section className="ask-section">
        <div className="ask-card glass">
          <div className="ask-header">
            <div className="ask-icon">🤖</div>
            <div>
              <h2 className="ask-title">Ask Your AI Soft Skills Coach</h2>
              <p className="ask-sub">Ask anything about communication, leadership, teamwork, or career growth</p>
            </div>
          </div>
          <form className="ask-form" onSubmit={handleAsk}>
            <div className="ask-input-wrap">
              <span className="ask-input-icon">💬</span>
              <input
                className="ask-input"
                type="text"
                placeholder="e.g. How can I improve my public speaking confidence?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <span className="spinner spinner-sm" /> : "Ask AI →"}
              </button>
            </div>
          </form>
          {asked && (
            <div className="ask-answer anim-fade-up">
              {loading ? (
                <div className="ask-loading"><span className="spinner" /><span>AI is thinking…</span></div>
              ) : (
                <div className="ai-box">
                  <div className="ai-box-header"><span>🤖</span> AI Coach Response</div>
                  <p>{aiAnswer}</p>
                </div>
              )}
            </div>
          )}
          <div className="quick-questions">
            <span className="quick-label">Try:</span>
            {["How to handle workplace conflicts?", "Tips for active listening", "What is growth mindset?", "How to improve time management?"].map((q) => (
              <button key={q} className="quick-chip" onClick={() => setQuestion(q)} type="button">{q}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="section-header">
          <h2>Core <span className="grad-purple">Skill Path</span></h2>
          <p>Choose a domain and dive deep into structured learning paths</p>
        </div>
        <div className="categories-grid stagger">
          {catEntries.map((cat) => (
            <Link key={cat.id} to={`/category/${cat.id}`} className="cat-card">
              <div className="cat-glow" style={{ background: cat.gradient }} />
              <div className="cat-inner glass">
                <div className="cat-icon-wrap" style={{ background: cat.gradient }}><span className="cat-icon">{cat.icon}</span></div>
                <div className="cat-body">
                  <h3 className="cat-title">{cat.label}</h3>
                  <p className="cat-desc">Structured curriculums with AI coaching.</p>
                  <div className="cat-tags">
                    <span className="cat-tag">FACE</span><span className="cat-tag">ETHUNS</span><span className="cat-tag">Six Phase</span>
                  </div>
                </div>
                <div className="cat-arrow">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why <span className="grad-teal">SoftSkills Pro</span>?</h2>
          <p>A complete ecosystem for mastering professional skills</p>
        </div>
        <div className="features-grid stagger">
          {FEATURES.map((f) => (
            <div className="feature-card glass" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
