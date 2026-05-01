import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, isConfigured } from "../services/firebase";
import "./CommunityLearningPage.css";

export default function CommunityLearningPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isConfigured) return;
    async function fetchTopic() {
      try {
        const ref = doc(db, "uploaded_topics", topicId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setTopic(snap.data());
        } else {
          setError("Module not found.");
        }
      } catch (err) {
        console.error("Error fetching topic:", err);
        setError(err.message || "Failed to load content.");
      } finally {
        setLoading(false);
      }
    }
    fetchTopic();
  }, [topicId]);

  if (!isConfigured) {
    return (
      <div className="page-container comm-learn-page">
        <div className="setup-warning glass anim-scale">
          <div className="sw-icon">⚙️</div>
          <h2>Access Denied</h2>
          <p>Community modules require a configured Firebase connection to view.</p>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container loading-container">
        <span className="spinner"></span>
        <p>Analyzing learning module...</p>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="page-container">
        <div className="empty-state glass">
          <h2>{error ? "Oops!" : "Module not found"}</h2>
          <p>{error || "The requested community module could not be found."}</p>
          <button className="btn btn-primary" onClick={() => navigate("/community")}>Back to Library</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container comm-learn-page">
      <div className="comm-learn-nav anim-fade">
        <Link to="/community">← Community Library</Link>
      </div>

      <header className="comm-learn-header anim-fade-up">
        <div className="cl-meta">
          <span className="badge badge-teal">{topic.courseCode}</span>
          <span className="badge badge-purple">{topic.semester} {topic.year}</span>
        </div>
        <h1>{topic.topicName}</h1>
        <p className="cl-desc">{topic.description}</p>
        
        <div className="cl-stats glass">
          <div className="cl-stat">
            <span className="cl-stat-val">{topic.questions?.length || 0}</span>
            <span className="cl-stat-label">Quiz Questions</span>
          </div>
          <div className="cl-stat">
            <span className="cl-stat-val">{topic.learningContent?.length || 0}</span>
            <span className="cl-stat-label">Key Concepts</span>
          </div>
        </div>
      </header>

      <div className="comm-learn-content stagger">
        <h2 className="section-title">📖 Learning Modules</h2>
        {topic.learningContent?.length > 0 ? (
          topic.learningContent.map((item, idx) => (
            <div key={item.id || idx} className="learn-block glass anim-fade-up">
              <div className="lb-num">{idx + 1}</div>
              <div className="lb-body">
                <h3>{item.heading}</h3>
                <p>{item.content}</p>
                {item.keyPoints?.length > 0 && (
                  <ul className="lb-points">
                    {item.keyPoints.map((pt, pi) => (
                      <li key={pi}>{pt}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="glass empty-content">
            <p>No specific learning concepts were extracted from this document.</p>
          </div>
        )}
      </div>

      <footer className="comm-learn-footer anim-fade-up">
        <h3>Ready to test your knowledge?</h3>
        <p>Take the AI-generated quiz or practice session based on this material.</p>
        <div className="cl-footer-actions">
          <Link to={`/practice/${topicId}`} className="btn btn-primary" state={{ isCommunity: true }}>
            ✏️ Start Practice
          </Link>
          <Link to={`/quiz/${topicId}`} className="btn btn-success" state={{ isCommunity: true }}>
            🎯 Start Timed Quiz
          </Link>
        </div>
      </footer>
    </div>
  );
}
