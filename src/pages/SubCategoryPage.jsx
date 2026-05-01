import { useParams, Link } from "react-router-dom";
import { CATEGORIES, quizData, SUB_CATEGORY_LABELS } from "../data/quizData";
import "./SubCategoryPage.css";

export default function SubCategoryPage() {
  const { catId, subCat } = useParams();
  const cat = CATEGORIES[catId?.toUpperCase()];
  const subData = quizData[catId]?.[subCat];

  if (!cat || !subData) {
    return (
      <div className="page-container">
        <h2>Not found</h2>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: 16 }}>Go Home</Link>
      </div>
    );
  }

  const topics = subData.topics || [];

  return (
    <div className="page-container subcat-page">
      {/* Breadcrumb */}
      <div className="breadcrumb anim-fade">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to={`/category/${catId}`}>{cat.label}</Link>
        <span>›</span>
        <span>{SUB_CATEGORY_LABELS[subCat]}</span>
      </div>

      {/* Header */}
      <div className="subcat-ph anim-fade-up">
        <div className="subcat-ph-icon" style={{ background: cat.gradient }}>{cat.icon}</div>
        <div>
          <div className="badge badge-purple" style={{ marginBottom: 10 }}>
            {cat.label} · {SUB_CATEGORY_LABELS[subCat]}
          </div>
          <h1>{SUB_CATEGORY_LABELS[subCat]} Topics</h1>
          <p>{topics.length} topics available for practice and assessment</p>
        </div>
      </div>

      {/* Topics grid */}
      {topics.length === 0 ? (
        <div className="empty-state glass anim-fade-up">
          <div className="empty-icon">📭</div>
          <h3>No topics yet</h3>
          <p>Content for this sub-category will be added soon. Check back later!</p>
        </div>
      ) : (
        <div className="topics-grid stagger">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} catId={catId} cat={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

function TopicCard({ topic, catId, cat }) {
  const qCount = topic.questions?.length || 0;

  return (
    <div className="topic-card glass anim-fade-up">
      <div className="topic-card-header" style={{ background: cat.gradient }}>
        <span className="topic-emoji">📌</span>
        <span className="topic-count">{qCount} Questions</span>
      </div>
      <div className="topic-card-body">
        <h3 className="topic-title">{topic.title}</h3>
        <p className="topic-desc">{topic.description}</p>

        <div className="topic-actions">
          <Link
            to={`/learn/${topic.id}`}
            state={{ topic, catId, cat: { label: cat.label, icon: cat.icon, gradient: cat.gradient } }}
            className="topic-btn topic-btn-learn"
          >
            <span>📖</span> Learn
          </Link>
          <Link
            to={`/practice/${topic.id}`}
            state={{ topic, catId, cat: { label: cat.label, icon: cat.icon, gradient: cat.gradient } }}
            className="topic-btn topic-btn-practice"
          >
            <span>✏️</span> Practice
          </Link>
          <Link
            to={`/quiz/${topic.id}`}
            state={{ topic, catId, cat: { label: cat.label, icon: cat.icon, gradient: cat.gradient } }}
            className="topic-btn topic-btn-quiz"
          >
            <span>🎯</span> Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
