import { useParams } from "react-router-dom";
import { HotelDetailView } from "../features/services/components/hotel/HotelDetailView";

export function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  return <HotelDetailView id={id} />;
}

export default HotelDetail;
