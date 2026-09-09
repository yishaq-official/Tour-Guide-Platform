import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface RoomImageLightboxProps {
  selectedRoomImage: { src: string; name: string } | null;
  onClose: () => void;
}

export function RoomImageLightbox({
  selectedRoomImage,
  onClose,
}: RoomImageLightboxProps) {
  return (
    <AnimatePresence>
      {selectedRoomImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-4xl w-full bg-transparent overflow-hidden z-10 flex flex-col items-center justify-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-white/10 p-2.5 rounded-full z-20 backdrop-blur-sm border border-white/15"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedRoomImage.src}
              alt={selectedRoomImage.name}
              className="max-h-[80vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-white font-bold text-lg text-center backdrop-blur-md bg-black/45 px-6 py-2.5 rounded-full border border-white/10">
              {selectedRoomImage.name}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
