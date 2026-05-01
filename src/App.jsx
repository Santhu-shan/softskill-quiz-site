import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import TopicsPage from "./pages/TopicsPage";
import PracticePage from "./pages/PracticePage";
import LearningPage from "./pages/LearningPage";
import QuizPage from "./pages/QuizPage";
import UploadPage from "./pages/UploadPage";
import CommunityPage from "./pages/CommunityPage";
import CommunityLearningPage from "./pages/CommunityLearningPage";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">🎯</div>
          SoftSkills Pro
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/community">Library</NavLink></li>
          <li><NavLink to="/upload">Upload</NavLink></li>
          <li className="nav-divider">|</li>
          <li><NavLink to="/category/qual1">Qual I</NavLink></li>
          <li><NavLink to="/category/quant1">Quant I</NavLink></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:catId" element={<CategoryPage />} />
        <Route path="/category/:catId/:subCat" element={<SubCategoryPage />} />
        <Route path="/topics/:catId/:subCat" element={<TopicsPage />} />
        <Route path="/practice/:topicId" element={<PracticePage />} />
        <Route path="/quiz/:topicId" element={<QuizPage />} />
        <Route path="/learn/:topicId" element={<LearningPage />} />
        
        {/* Community Routes */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/learn/:topicId" element={<CommunityLearningPage />} />
      </Routes>
    </BrowserRouter>
  );
}
