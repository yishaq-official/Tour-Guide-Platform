import { useParams } from "react-router-dom";
import { VehicleDetailView } from "../features/services/components/vehicle/VehicleDetailView";

export function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  return <VehicleDetailView id={id} />;
}

export default VehicleDetail;
