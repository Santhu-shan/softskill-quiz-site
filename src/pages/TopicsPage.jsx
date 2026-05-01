// TopicsPage acts as an alias/redirect to SubCategoryPage
// (The sub-category page already shows all topics)
import { useParams, Navigate } from "react-router-dom";
export default function TopicsPage() {
  const { catId, subCat } = useParams();
  return <Navigate to={`/category/${catId}/${subCat}`} replace />;
}
