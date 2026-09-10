import { useParams } from "react-router-dom";
import { HeritageDetailView } from "../features/catalog/components/HeritageDetailView";

export function HeritageDetail() {
  const { id } = useParams<{ id: string }>();
  return <HeritageDetailView id={id} />;
}

export default HeritageDetail;
