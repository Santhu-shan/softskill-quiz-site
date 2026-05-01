import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeToTopics } from "../services/dbService";
import { isConfigured } from "../services/firebase";
import "./CommunityPage.css";

export default function CommunityPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(isConfigured);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isConfigured) return;
    const unsub = subscribeToTopics((data) => {
      setTopics(data);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Firestore Subscribe Error:", err);
      setError(err.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (!isConfigured) {
    return (
      <div className="page-container community-page">
        <div className="setup-warning glass anim-scale">
          <div className="sw-icon">⚙️</div>
          <h2>Firebase Not Configured</h2>
          <p>The community library requires Firebase to store and sync data across users.</p>
          <div className="sw-steps">
            <p><strong>To enable this feature:</strong></p>
            <ol>
              <li>Create a project in the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">Firebase Console</a></li>
              <li>Add a <strong>Web App</strong> and copy the credentials</li>
              <li>Paste them into your <code>.env</code> file</li>
              <li>Restart your development server</li>
            </ol>
          </div>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    );
  }

  const filteredTopics = topics.filter(t => 
    t.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container community-page">
      <div className="community-header anim-fade-up">
        <div>
          <h1>Community Library</h1>
          <p>Explore learning modules and quizzes uploaded by students.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          📤 Upload New
        </Link>
      </div>

      <div className="search-bar glass anim-fade-up">
        <span className="search-icon">🔍</span>
        <input 
          type="text" 
          placeholder="Search by topic, course code, or filename..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">
          <span className="spinner"></span>
          <p>Loading community content...</p>
        </div>
      ) : error ? (
        <div className="empty-state glass anim-fade-up" style={{borderColor: 'rgba(248,113,113,0.3)'}}>
          <div className="empty-icon" style={{filter: 'hue-rotate(-50deg)'}}>⚠️</div>
          <h3 style={{color: 'var(--error)'}}>Connection Error</h3>
          <p>{error}</p>
          <div className="sw-steps" style={{marginTop: 20, textAlign: 'left'}}>
            <p><strong>Common Fixes:</strong></p>
            <ul>
              <li>Check your <strong>Firestore Rules</strong> (ensure they allow Read)</li>
              <li>Check your internet connection</li>
              <li>Ensure the <strong>Project ID</strong> in your .env matches exactly</li>
            </ul>
          </div>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>🔄 Retry Connection</button>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="empty-state glass anim-fade-up">
          <div className="empty-icon">📚</div>
          <h3>No topics found</h3>
          <p>{searchTerm ? "Try a different search term" : "Be the first to upload a PDF learning module!"}</p>
          {!searchTerm && <Link to="/upload" className="btn btn-primary" style={{marginTop: 16}}>Upload Now</Link>}
        </div>
      ) : (
        <div className="topics-grid stagger">
          {filteredTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic }) {
  const CATEGORY_LABELS = {
    qual1: "Qualitative 1", quant1: "Quantitative 1",
    qual2: "Qualitative 2", quant2: "Quantitative 2",
  };

  return (
    <div className="topic-card glass anim-fade-up">
      <div className="tc-header">
        <span className="tc-badge">{topic.semester}</span>
        <span className="tc-badge">{topic.year}</span>
      </div>
      
      <h3 className="tc-title">{topic.topicName}</h3>
      <p className="tc-code">{topic.courseCode}</p>
      
      <div className="tc-meta">
        <span className="tc-cat">{CATEGORY_LABELS[topic.mainCategory] || "General"}</span>
        <span className="tc-qcount">{topic.questions?.length || 0} Questions</span>
      </div>

      <p className="tc-desc">{topic.description}</p>

      <div className="tc-actions">
        <Link to={`/community/learn/${topic.id}`} className="btn btn-secondary btn-sm">📖 Learn</Link>
        <Link to={`/practice/${topic.id}`} className="btn btn-primary btn-sm" state={{ isCommunity: true }}>✏️ Practice</Link>
        <Link to={`/quiz/${topic.id}`} className="btn btn-success btn-sm" state={{ isCommunity: true }}>🎯 Quiz</Link>
      </div>
    </div>
  );
}
