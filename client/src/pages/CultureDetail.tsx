import { useParams } from "react-router-dom";
import { CultureDetailView } from "../features/catalog/components/CultureDetailView";

export function CultureDetail() {
  const { id } = useParams<{ id: string }>();
  return <CultureDetailView id={id} />;
}

export default CultureDetail;
