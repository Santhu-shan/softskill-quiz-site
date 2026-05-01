import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { quizData } from "../data/quizData";
import { generateLearningExplanation } from "../services/aiService";
import "./LearningPage.css";

function findTopic(topicId) {
  for (const catData of Object.values(quizData)) {
    for (const subData of Object.values(catData)) {
      for (const topic of subData.topics || []) {
        if (topic.id === topicId) return topic;
      }
    }
  }
  return null;
}

export default function LearningPage() {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const topic = location.state?.topic || findTopic(topicId);
  const cat = location.state?.cat || { label: "Topic", icon: "📚", gradient: "linear-gradient(135deg,#7c6ef8,#3ecfcf)" };

  const [mode, setMode] = useState("one"); // "one" | "all"
  const [currentIdx, setCurrentIdx] = useState(0);
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingAi, setLoadingAi] = useState({});
  const [revealed, setRevealed] = useState({});
  const topRef = useRef(null);

  if (!topic) return (
    <div className="page-container">
      <h2>Topic not found</h2>
      <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>← Back</button>
    </div>
  );

  const questions = topic.questions || [];
  const currentQ = questions[currentIdx];
  const totalQ = questions.length;
  const progress = ((currentIdx + 1) / totalQ) * 100;

  async function fetchAI(idx) {
    const q = questions[idx];
    if (aiExplanations[idx] || loadingAi[idx]) return;
    setLoadingAi(prev => ({ ...prev, [idx]: true }));
    try {
      const explanation = await generateLearningExplanation({
        question: q.question,
        options: q.options,
        correctIndex: q.answer,
      });
      setAiExplanations(prev => ({ ...prev, [idx]: explanation }));
    } catch {
      setAiExplanations(prev => ({ ...prev, [idx]: "AI explanation unavailable. Please check your API key." }));
    } finally {
      setLoadingAi(prev => ({ ...prev, [idx]: false }));
    }
  }

  function revealAnswer(idx) {
    setRevealed(prev => ({ ...prev, [idx]: true }));
    fetchAI(idx);
  }

  function goNext() {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(currentIdx + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function jumpTo(idx) {
    setCurrentIdx(idx);
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="page-container learn-page" ref={topRef}>
      {/* Breadcrumb */}
      <div className="breadcrumb anim-fade">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{cat.label}</span>
        <span>›</span>
        <span>{topic.title}</span>
        <span>›</span>
        <span>Learn</span>
      </div>

      {/* Header */}
      <div className="learn-header anim-fade-up">
        <div className="learn-header-left">
          <div className="learn-icon" style={{ background: cat.gradient }}>📖</div>
          <div>
            <div className="badge badge-teal" style={{ marginBottom: 8 }}>Learning Mode</div>
            <h1>{topic.title}</h1>
            <p>{topic.description}</p>
          </div>
        </div>
        <div className="learn-mode-toggle">
          <button
            className={`mode-btn ${mode === "one" ? "active" : ""}`}
            onClick={() => setMode("one")}
          >
            🔍 One by One
          </button>
          <button
            className={`mode-btn ${mode === "all" ? "active" : ""}`}
            onClick={() => setMode("all")}
          >
            📋 Complete View
          </button>
        </div>
      </div>

      {mode === "one" ? (
        /* ── SINGLE QUESTION MODE ── */
        <div className="learn-single">
          {/* Progress */}
          <div className="learn-progress">
            <div className="learn-progress-info">
              <span>Question {currentIdx + 1} of {totalQ}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>

          {/* Question card */}
          <QuestionCard
            q={currentQ}
            idx={currentIdx}
            revealed={revealed[currentIdx]}
            onReveal={() => revealAnswer(currentIdx)}
            aiExplanation={aiExplanations[currentIdx]}
            loadingAi={loadingAi[currentIdx]}
            mode="learn"
          />

          {/* Navigation */}
          <div className="learn-nav">
            <button
              className="btn btn-secondary"
              onClick={goPrev}
              disabled={currentIdx === 0}
            >
              ← Previous
            </button>

            {/* Dot navigation */}
            <div className="dot-nav">
              {questions.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentIdx ? "dot-active" : ""} ${revealed[i] ? "dot-done" : ""}`}
                  onClick={() => jumpTo(i)}
                  title={`Q${i + 1}`}
                />
              ))}
            </div>

            {currentIdx < totalQ - 1 ? (
              <button className="btn btn-primary" onClick={goNext}>
                Next →
              </button>
            ) : (
              <Link
                to={`/practice/${topicId}`}
                state={location.state}
                className="btn btn-success"
              >
                ✏️ Practice Now
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* ── COMPLETE VIEW MODE ── */
        <div className="learn-all stagger">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              q={q}
              idx={idx}
              revealed={revealed[idx]}
              onReveal={() => revealAnswer(idx)}
              aiExplanation={aiExplanations[idx]}
              loadingAi={loadingAi[idx]}
              mode="learn"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Shared Question Card ── */
export function QuestionCard({ q, idx, revealed, onReveal, aiExplanation, loadingAi, mode, selectedAnswer, onSelect, isCorrect, showResult }) {
  return (
    <div className={`qcard glass anim-fade-up ${showResult ? (isCorrect ? "qcard-correct" : "qcard-wrong") : ""}`}>
      {/* Question number + text */}
      <div className="qcard-header">
        <span className="q-num">Q{idx + 1}</span>
        <p className="q-text">{q.question}</p>
      </div>

      {/* Options */}
      <div className="q-options">
        {q.options.map((opt, oi) => {
          let cls = "q-option";
          if (mode === "learn") {
            if (revealed) {
              cls += oi === q.answer ? " opt-correct" : " opt-muted";
            }
          } else {
            // practice/quiz mode
            if (selectedAnswer !== undefined && selectedAnswer !== null) {
              if (oi === q.answer) cls += " opt-correct";
              else if (oi === selectedAnswer) cls += " opt-wrong";
              else cls += " opt-muted";
            } else {
              cls += " opt-interactive";
            }
          }
          return (
            <button
              key={oi}
              className={cls}
              onClick={() => {
                if (mode !== "learn" && (selectedAnswer === undefined || selectedAnswer === null)) {
                  onSelect && onSelect(oi);
                }
              }}
              disabled={mode === "learn" ? true : (selectedAnswer !== undefined && selectedAnswer !== null)}
            >
              <span className="opt-letter">{String.fromCharCode(65 + oi)}</span>
              <span className="opt-text">{opt}</span>
              {mode !== "learn" && selectedAnswer !== undefined && selectedAnswer !== null && oi === q.answer && (
                <span className="opt-badge opt-badge-correct">✓ Correct</span>
              )}
              {mode !== "learn" && selectedAnswer !== undefined && selectedAnswer !== null && oi === selectedAnswer && oi !== q.answer && (
                <span className="opt-badge opt-badge-wrong">✗ Wrong</span>
              )}
              {mode === "learn" && revealed && oi === q.answer && (
                <span className="opt-badge opt-badge-correct">✓ Correct</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Learn mode: reveal button */}
      {mode === "learn" && !revealed && (
        <button className="btn btn-primary reveal-btn" onClick={onReveal}>
          👁️ Reveal Answer & Explanation
        </button>
      )}

      {/* Static explanation (from data) */}
      {(revealed || (mode !== "learn" && selectedAnswer !== undefined && selectedAnswer !== null)) && q.explanation && (
        <div className="static-explanation">
          <div className="static-exp-header">
            <span>💡</span> Quick Explanation
          </div>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* AI Explanation */}
      {(revealed || (mode !== "learn" && selectedAnswer !== undefined && selectedAnswer !== null)) && (
        <div className="ai-box">
          <div className="ai-box-header">
            <span>🤖</span> AI Deep Explanation
            {loadingAi && <span className="spinner spinner-sm" style={{ marginLeft: 8 }} />}
          </div>
          {loadingAi ? (
            <p style={{ color: "var(--text-muted)" }}>Generating AI explanation…</p>
          ) : (
            <p>{aiExplanation || "Click 'Reveal Answer' to load the AI explanation."}</p>
          )}
        </div>
      )}
    </div>
  );
}
