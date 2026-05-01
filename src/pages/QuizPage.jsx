import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import { quizData } from "../data/quizData";
import { explainAnswer, generateQuizAnalysis } from "../services/aiService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "./QuizPage.css";

function findTopicInStatic(topicId) {
  for (const catData of Object.values(quizData)) {
    for (const subData of Object.values(catData)) {
      for (const topic of subData.topics || []) {
        if (topic.id === topicId) return topic;
      }
    }
  }
  return null;
}

const SECONDS_PER_QUESTION = 30;

export default function QuizPage() {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [topic, setTopic] = useState(location.state?.topic || findTopicInStatic(topicId));
  const [loading, setLoading] = useState(!topic);
  const [phase, setPhase] = useState("intro"); // intro | quiz | results
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [aiExplanations, setAiExplanations] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [selectedNow, setSelectedNow] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!topic) {
      async function fetchTopic() {
        try {
          const ref = doc(db, "uploaded_topics", topicId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            setTopic({
              id: topicId,
              title: data.topicName,
              description: data.description,
              questions: data.questions
            });
          }
        } catch (err) {
          console.error("Error fetching community topic:", err);
        } finally {
          setLoading(false);
        }
      }
      fetchTopic();
    }
  }, [topicId, topic]);

  useEffect(() => {
    if (topic && phase === "intro") {
      setTimeLeft(topic.questions.length * SECONDS_PER_QUESTION);
    }
  }, [topic, phase]);

  useEffect(() => {
    if (phase !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); finishQuiz(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const finishQuiz = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("results");
  }, []);

  const questions = topic?.questions || [];
  const totalQ = questions.length;
  const TOTAL_TIME = totalQ * SECONDS_PER_QUESTION;

  function startQuiz() {
    setPhase("quiz");
    setCurrentIdx(0);
    setAnswers({});
    setTimeLeft(TOTAL_TIME);
    setSelectedNow(null);
  }

  function handleSelect(optIdx) {
    if (answers[currentIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));
    setSelectedNow(optIdx);

    if (optIdx !== questions[currentIdx].answer) {
      const q = questions[currentIdx];
      explainAnswer({ question: q.question, options: q.options, correctIndex: q.answer, selectedIndex: optIdx })
        .then(exp => setAiExplanations(prev => ({ ...prev, [currentIdx]: exp })))
        .catch(() => {});
    }

    setTimeout(() => {
      setSelectedNow(null);
      if (currentIdx < totalQ - 1) {
        setCurrentIdx(i => i + 1);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        finishQuiz();
      }
    }, 1200);
  }

  useEffect(() => {
    if (phase !== "results" || !topic) return;
    const wrong = questions.filter((q, i) => answers[i] !== undefined && answers[i] !== q.answer)
      .map((q, idx) => ({ ...q, selectedIndex: answers[questions.indexOf(q)] }));

    setLoadingAnalysis(true);
    generateQuizAnalysis({ totalQuestions: totalQ, wrongAnswers: wrong, topicTitle: topic.title })
      .then(txt => setAiAnalysis(txt))
      .catch(() => setAiAnalysis("AI analysis unavailable. Check your API key."))
      .finally(() => setLoadingAnalysis(false));
  }, [phase, topic]);

  if (loading) return (
    <div className="page-container loading-container">
      <span className="spinner"></span>
      <p>Loading quiz questions...</p>
    </div>
  );

  if (!topic) return (
    <div className="page-container">
      <div className="empty-state glass">
        <h2>Topic not found</h2>
        <p>The requested quiz module could not be found.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>← Back</button>
      </div>
    </div>
  );

  const cat = location.state?.cat || { label: "Topic", icon: "🎯", gradient: "linear-gradient(135deg,#7c6ef8,#3ecfcf)" };

  if (phase === "intro") {
    return (
      <div className="page-container quiz-page">
        <div className="quiz-intro glass anim-scale">
          <div className="quiz-intro-icon" style={{ background: cat.gradient }}>🎯</div>
          <h1 className="quiz-intro-title">Ready to Test Yourself?</h1>
          <p className="quiz-intro-sub">{topic.title}</p>
          <div className="quiz-intro-stats">
            <div className="qi-stat"><div className="qi-val">{totalQ}</div><div className="qi-label">Questions</div></div>
            <div className="qi-divider" /><div className="qi-stat"><div className="qi-val">{SECONDS_PER_QUESTION}s</div><div className="qi-label">Per Question</div></div>
            <div className="qi-divider" /><div className="qi-stat"><div className="qi-val">{Math.floor(TOTAL_TIME / 60)}:{String(TOTAL_TIME % 60).padStart(2, "0")}</div><div className="qi-label">Total Time</div></div>
          </div>
          <div className="quiz-rules glass">
            <h3>📋 Quiz Rules</h3>
            <ul>
              <li>⏱️ Timer starts as soon as you click <strong>Start Quiz</strong></li>
              <li>🔒 Once you select an answer, you cannot change it</li>
              <li>⚡ Questions auto-advance after you answer</li>
              <li>🤖 AI analysis is generated at the end</li>
              <li>📊 Unanswered questions are marked wrong</li>
            </ul>
          </div>
          <div className="quiz-intro-actions">
            <button className="btn btn-primary btn-lg" onClick={startQuiz}>🚀 Start Quiz</button>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "results") {
    const correctCount = questions.filter((q, i) => answers[i] === q.answer).length;
    const skipped = questions.filter((_, i) => answers[i] === undefined).length;
    const wrongCount = totalQ - correctCount - skipped;
    const pct = Math.round((correctCount / totalQ) * 100);
    const timeUsed = TOTAL_TIME - timeLeft;
    const grade = pct >= 90 ? { label: "Outstanding! 🏆", color: "#34d399", bg: "rgba(52,211,153,0.1)" } : pct >= 75 ? { label: "Great Job! 🌟", color: "#60a5fa", bg: "rgba(96,165,250,0.1)" } : pct >= 50 ? { label: "Good Effort! 💪", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" } : { label: "Keep Practicing!", color: "#f87171", bg: "rgba(248,113,113,0.1)" };
    const wrongItems = questions.map((q, i) => ({ q, i, selected: answers[i] })).filter(({ q, i }) => answers[i] !== q.answer);

    return (
      <div className="page-container quiz-page">
        <div className="results-container">
          <div className="results-score-card glass anim-scale">
            <div className="results-grade" style={{ color: grade.color, background: grade.bg }}>{grade.label}</div>
            <h2 className="results-title">Quiz Complete!</h2>
            <p className="results-sub">{topic.title}</p>
            <div className="results-ring">
              <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="58" className="ring-bg" /><circle cx="70" cy="70" r="58" className="ring-fill" style={{ strokeDasharray: `${pct * 3.644} 364.4`, stroke: grade.color }} /></svg>
              <div className="results-ring-inner"><div className="results-pct" style={{ color: grade.color }}>{pct}%</div><div className="results-score">{correctCount}/{totalQ}</div></div>
            </div>
            <div className="results-pills">
              <div className="result-pill pill-correct"><span className="pill-icon">✅</span><span className="pill-val">{correctCount}</span><span className="pill-label">Correct</span></div>
              <div className="result-pill pill-wrong"><span className="pill-icon">❌</span><span className="pill-val">{wrongCount}</span><span className="pill-label">Wrong</span></div>
              <div className="result-pill pill-skip"><span className="pill-icon">⏭️</span><span className="pill-val">{skipped}</span><span className="pill-label">Skipped</span></div>
              <div className="result-pill pill-time"><span className="pill-icon">⏱️</span><span className="pill-val">{Math.floor(timeUsed / 60)}:{String(timeUsed % 60).padStart(2, "0")}</span><span className="pill-label">Time Used</span></div>
            </div>
          </div>
          <div className="ai-analysis-card glass anim-fade-up">
            <div className="ai-analysis-header"><div className="ai-analysis-icon">🤖</div><div><h3>AI Coach Analysis</h3><p>Personalized feedback based on your performance</p></div></div>
            {loadingAnalysis ? <div className="ai-loading-row"><span className="spinner" /><span>Generating your personalized analysis…</span></div> : <p className="ai-analysis-text">{aiAnalysis}</p>}
          </div>
          {wrongItems.length > 0 && (
            <div className="results-wrong-section">
              <h3 className="wr-title">📚 Wrong Answers — Review & Learn<span className="wr-count">{wrongItems.length} questions</span></h3>
              {wrongItems.map(({ q, i, selected }) => (
                <div key={q.id || i} className="wr-card glass">
                  <div className="wr-q-header"><span className="wr-num">Q{i + 1}</span><p className="wr-q">{q.question}</p></div>
                  <div className="wr-ans-row">
                    <div className="wr-ans wr-yours"><div className="wr-ans-tag">Your Answer</div><div className="wr-ans-val">{selected !== undefined ? q.options[selected] : "Not answered"}</div></div>
                    <div className="wr-ans wr-correct"><div className="wr-ans-tag">Correct Answer</div><div className="wr-ans-val">{q.options[q.answer]}</div></div>
                  </div>
                  {q.explanation && <div className="static-explanation"><div className="static-exp-header"><span>💡</span> Explanation</div><p>{q.explanation}</p></div>}
                  {aiExplanations[i] && <div className="ai-box"><div className="ai-box-header"><span>🤖</span> AI Deep Explanation</div><p>{aiExplanations[i]}</p></div>}
                </div>
              ))}
            </div>
          )}
          <div className="results-actions">
            <button className="btn btn-secondary btn-lg" onClick={startQuiz}>🔄 Retake Quiz</button>
            <Link to={`/practice/${topicId}`} state={location.state} className="btn btn-primary btn-lg">✏️ Practice Mode</Link>
            <Link to="/" className="btn btn-ghost btn-lg">🏠 Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const answered = answers[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerPct = (timeLeft / TOTAL_TIME) * 100;
  const timerColor = timeLeft < 30 ? "#f87171" : timeLeft < 60 ? "#fbbf24" : "#34d399";

  return (
    <div className="page-container quiz-page" ref={topRef}>
      <div className="quiz-topbar glass anim-fade">
        <div className="quiz-topic-label"><span className="quiz-cat-icon">{cat.icon}</span>{topic.title}</div>
        <div className="quiz-dots">
          {questions.map((_, i) => (
            <div key={i} className={`qdot ${i === currentIdx ? "qdot-current" : ""} ${answers[i] === questions[i].answer ? "qdot-correct" : answers[i] !== undefined ? "qdot-wrong" : ""}`} />
          ))}
        </div>
        <div className="quiz-timer" style={{ color: timerColor }}>
          <div className="timer-ring">
            <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" className="timer-ring-bg" /><circle cx="22" cy="22" r="18" className="timer-ring-fill" style={{ strokeDasharray: `${timerPct * 1.131} 113.1`, stroke: timerColor }} /></svg>
            <span className="timer-text">{minutes}:{String(seconds).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
      <div className="quiz-q-counter anim-fade"><span className="qc-label">Question</span><span className="qc-num">{currentIdx + 1}</span><span className="qc-of">of {totalQ}</span></div>
      <div className="progress-bar" style={{ marginBottom: 32, height: 4 }}><div className="progress-fill" style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }} /></div>
      <div className={`qcard glass quiz-qcard anim-scale ${answered !== undefined ? (answered === q.answer ? "qcard-correct" : "qcard-wrong") : ""}`}>
        <div className="qcard-header"><span className="q-num">Q{currentIdx + 1}</span><p className="q-text">{q.question}</p></div>
        <div className="q-options">
          {q.options.map((opt, oi) => {
            let cls = "q-option";
            if (answered !== undefined) {
              if (oi === q.answer) cls += " opt-correct"; else if (oi === answered) cls += " opt-wrong"; else cls += " opt-muted";
            } else {
              cls += " opt-interactive"; if (selectedNow === oi) cls += " opt-selecting";
            }
            return (
              <button key={oi} className={cls} onClick={() => handleSelect(oi)} disabled={answered !== undefined}>
                <span className="opt-letter">{String.fromCharCode(65 + oi)}</span><span className="opt-text">{opt}</span>
                {answered !== undefined && oi === q.answer && <span className="opt-badge opt-badge-correct">✓</span>}
                {answered !== undefined && oi === answered && oi !== q.answer && <span className="opt-badge opt-badge-wrong">✗</span>}
              </button>
            );
          })}
        </div>
        {answered !== undefined && (
          <div className={`quiz-instant-feedback ${answered === q.answer ? "ifb-correct" : "ifb-wrong"}`}>
            {answered === q.answer ? "✅ Correct!" : `❌ The answer is: ${q.options[q.answer]}`}
          </div>
        )}
      </div>
      {answered === undefined && (
        <div className="quiz-skip">
          <button className="btn btn-ghost btn-sm" onClick={() => { if (currentIdx < totalQ - 1) { setCurrentIdx(i => i + 1); topRef.current?.scrollIntoView({ behavior: "smooth" }); } else { finishQuiz(); } }}>Skip →</button>
        </div>
      )}
    </div>
  );
}
