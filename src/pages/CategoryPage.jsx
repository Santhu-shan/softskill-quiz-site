import { useParams, Link } from "react-router-dom";
import { CATEGORIES, SUB_CATEGORIES, SUB_CATEGORY_LABELS } from "../data/quizData";
import "./CategoryPage.css";

const SUB_CAT_ICONS = { face: "🎭", ethuns: "🌐", six_phase: "⚡" };
const SUB_CAT_DESC = {
  face: "Foundation & Core Evaluation – Essential skills for daily professional interaction",
  ethuns: "Ethical & Human-Centric Skills – Building meaningful workplace relationships",
  six_phase: "Six-Phase Advanced Module – Mastering advanced professional competencies",
};

const GRADIENT_MAPS = {
  qual1: { face: "linear-gradient(135deg,#7c6ef8,#a78bfa)", ethuns: "linear-gradient(135deg,#3ecfcf,#67e8f9)", six_phase: "linear-gradient(135deg,#6366f1,#4f46e5)" },
  quant1: { face: "linear-gradient(135deg,#f06595,#fb7185)", ethuns: "linear-gradient(135deg,#ffb347,#fcd34d)", six_phase: "linear-gradient(135deg,#ef4444,#f97316)" },
  qual2: { face: "linear-gradient(135deg,#43b89c,#34d399)", ethuns: "linear-gradient(135deg,#4facfe,#60a5fa)", six_phase: "linear-gradient(135deg,#10b981,#059669)" },
  quant2: { face: "linear-gradient(135deg,#f7971e,#ffd200)", ethuns: "linear-gradient(135deg,#f59e0b,#fbbf24)", six_phase: "linear-gradient(135deg,#d97706,#f59e0b)" },
};

export default function CategoryPage() {
  const { catId } = useParams();
  const cat = CATEGORIES[catId?.toUpperCase()];
  if (!cat) return <div className="page-container"><h2>Category not found</h2></div>;

  const gradients = GRADIENT_MAPS[catId] || {};

  return (
    <div className="page-container cat-page">
      {/* Breadcrumb */}
      <div className="breadcrumb anim-fade">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{cat.label}</span>
      </div>

      {/* Header */}
      <div className="cat-page-header anim-fade-up">
        <div className="cat-page-icon" style={{ background: cat.gradient }}>
          {cat.icon}
        </div>
        <div>
          <h1>{cat.label}</h1>
          <p>Select a sub-category to explore topics and start practicing</p>
        </div>
      </div>

      {/* Sub-categories */}
      <div className="subcat-grid stagger">
        {SUB_CATEGORIES.map((sub) => (
          <Link key={sub} to={`/category/${catId}/${sub}`} className="subcat-card glass">
            <div className="subcat-card-inner">
              <div className="subcat-icon-wrap" style={{ background: gradients[sub] || cat.gradient }}>
                <span className="subcat-icon">{SUB_CAT_ICONS[sub]}</span>
              </div>
              <div className="subcat-content">
                <h2 className="subcat-title">{SUB_CATEGORY_LABELS[sub]}</h2>
                <p className="subcat-desc">{SUB_CAT_DESC[sub]}</p>
                <div className="subcat-meta">
                  <span className="badge badge-purple">Multiple Topics</span>
                  <span className="badge badge-teal">Practice + Quiz</span>
                </div>
              </div>
              <div className="subcat-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="cat-info-row anim-fade-up glass">
        <div className="info-item">
          <span className="info-icon">📚</span>
          <div>
            <strong>Structured Learning</strong>
            <p>Topics organized from fundamentals to advanced concepts</p>
          </div>
        </div>
        <div className="info-divider" />
        <div className="info-item">
          <span className="info-icon">🤖</span>
          <div>
            <strong>AI Explanations</strong>
            <p>Every wrong answer explained by your personal AI tutor</p>
          </div>
        </div>
        <div className="info-divider" />
        <div className="info-item">
          <span className="info-icon">📊</span>
          <div>
            <strong>Performance Analysis</strong>
            <p>Detailed post-quiz analysis with improvement tips</p>
          </div>
        </div>
      </div>
    </div>
  );
}
