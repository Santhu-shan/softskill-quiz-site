import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { quizData } from "../data/quizData";
import { explainAnswer } from "../services/aiService";
import { QuestionCard } from "./LearningPage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "./PracticePage.css";

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

export default function PracticePage() {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [topic, setTopic] = useState(location.state?.topic || findTopicInStatic(topicId));
  const [loading, setLoading] = useState(!topic);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingAi, setLoadingAi] = useState({});
  const [finished, setFinished] = useState(false);

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

  const cat = location.state?.cat || { label: "Topic", icon: "✏️", gradient: "linear-gradient(135deg,#7c6ef8,#3ecfcf)" };

  if (loading) return (
    <div className="page-container loading-container">
      <span className="spinner"></span>
      <p>Loading questions...</p>
    </div>
  );

  if (!topic) return (
    <div className="page-container">
      <div className="empty-state glass">
        <h2>Topic not found</h2>
        <p>The requested practice module could not be found.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>← Back</button>
      </div>
    </div>
  );

  const questions = topic.questions || [];
  const totalQ = questions.length;
  const q = questions[currentIdx];
  const selected = selectedAnswers[currentIdx];
  const progress = ((currentIdx + 1) / totalQ) * 100;
  const isCorrect = selected === q?.answer;

  async function handleSelect(optIdx) {
    if (selected !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIdx]: optIdx }));

    if (optIdx !== q.answer) {
      setLoadingAi(prev => ({ ...prev, [currentIdx]: true }));
      try {
        const explanation = await explainAnswer({
          question: q.question,
          options: q.options,
          correctIndex: q.answer,
          selectedIndex: optIdx,
        });
        setAiExplanations(prev => ({ ...prev, [currentIdx]: explanation }));
      } catch {
        setAiExplanations(prev => ({ ...prev, [currentIdx]: "AI explanation unavailable. Please check your API key." }));
      } finally {
        setLoadingAi(prev => ({ ...prev, [currentIdx]: false }));
      }
    }
  }

  function goNext() {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx(currentIdx + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setFinished(true);
    }
  }

  function restart() {
    setCurrentIdx(0);
    setSelectedAnswers({});
    setAiExplanations({});
    setLoadingAi({});
    setFinished(false);
  }

  const correctCount = questions.filter((_, i) => selectedAnswers[i] === questions[i].answer).length;
  const wrongList = questions.filter((_, i) => selectedAnswers[i] !== undefined && selectedAnswers[i] !== questions[i].answer);

  if (finished) {
    const pct = Math.round((correctCount / totalQ) * 100);
    const grade = pct >= 90 ? { label: "Excellent! 🏆", color: "#34d399" } : pct >= 70 ? { label: "Good Job! 👍", color: "#60a5fa" } : pct >= 50 ? { label: "Keep Going! 💪", color: "#fbbf24" } : { label: "Needs More Practice", color: "#f87171" };

    return (
      <div className="page-container practice-page">
        <div className="summary-container anim-scale">
          <div className="summary-header glass">
            <div className="summary-grade-badge" style={{ color: grade.color }}>{grade.label}</div>
            <h2 className="summary-title">Practice Complete!</h2>
            <p className="summary-sub">{topic.title}</p>
            <div className="summary-score-ring">
              <svg viewBox="0 0 120 120" className="ring-svg">
                <circle cx="60" cy="60" r="50" className="ring-bg" />
                <circle cx="60" cy="60" r="50" className="ring-fill" style={{ strokeDasharray: `${pct * 3.14} 314`, stroke: grade.color }} />
              </svg>
              <div className="ring-text">
                <div className="ring-pct" style={{ color: grade.color }}>{pct}%</div>
                <div className="ring-label">{correctCount}/{totalQ}</div>
              </div>
            </div>
            <div className="summary-stats-row">
              <div className="sum-stat"><div className="sum-stat-val sum-correct">{correctCount}</div><div className="sum-stat-label">✅ Correct</div></div>
              <div className="sum-stat"><div className="sum-stat-val sum-wrong">{wrongList.length}</div><div className="sum-stat-label">❌ Wrong</div></div>
              <div className="sum-stat"><div className="sum-stat-val">{totalQ}</div><div className="sum-stat-label">📝 Total</div></div>
            </div>
          </div>
          {wrongList.length > 0 && (
            <div className="wrong-review">
              <h3 className="wrong-title">📚 Review Incorrect Answers</h3>
              {wrongList.map((wq) => {
                const wi = questions.indexOf(wq);
                return (
                  <div key={wq.id || wi} className="wrong-card glass">
                    <div className="wrong-q-header">
                      <span className="wrong-q-num">Q{wi + 1}</span>
                      <p className="wrong-q-text">{wq.question}</p>
                    </div>
                    <div className="wrong-answers-row">
                      <div className="wrong-ans wrong-yours">
                        <span className="wrong-ans-label">Your Answer</span>
                        <span className="wrong-ans-text">{wq.options[selectedAnswers[wi]]}</span>
                      </div>
                      <div className="wrong-ans wrong-correct">
                        <span className="wrong-ans-label">Correct Answer</span>
                        <span className="wrong-ans-text">{wq.options[wq.answer]}</span>
                      </div>
                    </div>
                    {wq.explanation && <div className="static-explanation"><div className="static-exp-header"><span>💡</span> Explanation</div><p>{wq.explanation}</p></div>}
                    {aiExplanations[wi] && <div className="ai-box"><div className="ai-box-header"><span>🤖</span> AI Explanation</div><p>{aiExplanations[wi]}</p></div>}
                  </div>
                );
              })}
            </div>
          )}
          <div className="summary-actions">
            <button className="btn btn-secondary btn-lg" onClick={restart}>🔄 Practice Again</button>
            <Link to={`/quiz/${topicId}`} state={location.state} className="btn btn-primary btn-lg">🎯 Take Timed Quiz</Link>
            <button className="btn btn-ghost btn-lg" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container practice-page" ref={topRef}>
      <div className="breadcrumb anim-fade">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{cat.label}</span>
        <span>›</span>
        <span>{topic.title}</span>
        <span>›</span>
        <span>Practice</span>
      </div>
      <div className="practice-header anim-fade-up">
        <div className="practice-header-icon" style={{ background: cat.gradient }}>✏️</div>
        <div className="practice-header-content">
          <div className="badge badge-purple" style={{ marginBottom: 8 }}>
            {topic.courseCode ? `${topic.courseCode} | ${topic.semester}` : "Practice Mode"}
          </div>
          <h1>{topic.title}</h1>
          <p>Select an answer. Wrong answers get AI-powered explanations.</p>
        </div>
        <div className="practice-progress-pill">
          <span>{currentIdx + 1}</span><span className="ppp-sep">/</span><span>{totalQ}</span>
        </div>
      </div>
      <div className="progress-bar" style={{ marginBottom: 32 }}><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <QuestionCard
        q={q} idx={currentIdx} mode="practice"
        selectedAnswer={selected} onSelect={handleSelect} isCorrect={isCorrect}
        showResult={selected !== undefined} aiExplanation={aiExplanations[currentIdx]}
        loadingAi={loadingAi[currentIdx]} revealed={selected !== undefined}
      />
      {selected !== undefined && (
        <div className="practice-next anim-fade-up">
          <div className={`answer-status ${isCorrect ? "status-correct" : "status-wrong"}`}>
            {isCorrect ? "✅ Correct! Well done!" : "❌ Not quite right. Review the explanation above."}
          </div>
          <button className="btn btn-primary btn-lg" onClick={goNext}>{currentIdx < totalQ - 1 ? "Next Question →" : "View Results 🎉"}</button>
        </div>
      )}
    </div>
  );
}
