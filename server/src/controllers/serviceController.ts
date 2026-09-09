/**
 * Service Controller Facade
 * 
 * Re-exports modularized domain controllers (Hotels, Vehicles, and Bookings)
 * ensuring full backwards compatibility with any existing imports.
 */

export {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  getPartnerHotels,
  createPartnerHotel,
  updatePartnerHotel,
  deletePartnerHotel,
} from "../core/services/hotel.controller.js";

export {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getPartnerVehicles,
  createPartnerVehicle,
  updatePartnerVehicle,
  deletePartnerVehicle,
} from "../core/services/vehicle.controller.js";

export {
  createBooking,
  getPartnerBookings,
  getPartnerVehicleBookings,
  updateBookingStatus,
} from "../core/bookings/booking.controller.js";
