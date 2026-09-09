import { Users, Maximize2 } from "lucide-react";
import type { RoomType } from "../../types/service.types";

interface HotelRoomTypesProps {
  roomTypes: RoomType[];
  onSelectRoom: (roomName: string) => void;
  onViewImage: (image: { src: string; name: string }) => void;
}

export function HotelRoomTypes({
  roomTypes,
  onSelectRoom,
  onViewImage,
}: HotelRoomTypesProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Room Types</h2>
      <div className="space-y-6">
        {roomTypes &&
          roomTypes.map((room, idx) => {
            const roomImg =
              room.image ||
              "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=600";
            return (
              <div
                key={idx}
                className="flex flex-col md:flex-row border border-gray-200 rounded-3xl hover:border-green-500 transition-all bg-white overflow-hidden shadow-sm hover:shadow-md"
              >
                <div
                  className="md:w-64 h-48 md:h-auto relative group cursor-pointer overflow-hidden shrink-0"
                  onClick={() => onViewImage({ src: roomImg, name: room.name })}
                >
                  <img
                    src={roomImg}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-2 rounded-full flex items-center shadow-md">
                      <Maximize2 className="w-3.5 h-3.5 mr-1" /> View Image
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                      <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center shrink-0">
                        <Users className="w-3 h-3 mr-1" /> Up to {room.capacity} Guests
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      Enjoy a spacious, modern room layout complete with luxury bedding, high-speed Wi-Fi,
                      air conditioning, and beautiful interior details.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-500">Price per night</span>
                      <div className="text-2xl font-extrabold text-green-700">
                        ${room.pricePerNight}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectRoom(room.name)}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-md shadow-green-600/10 whitespace-nowrap text-center"
                    >
                      Select Room
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
