import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { catalogApi } from "../services/catalogApi";
import { itineraryApi } from "../../itinerary/services/itineraryApi";
import { useSession } from "../../../lib/auth-client";
import { useToast } from "../../../context/ToastContext";
import { SkeletonCard } from "../../../components/SkeletonCard";
import type { Heritage } from "../types/catalog.types";
import { HeritageHero } from "./HeritageHero";
import { AudioNarrationBanner } from "./AudioNarrationBanner";
import { HeritageQuickFacts } from "./HeritageQuickFacts";
import { HeritageHighlights } from "./HeritageHighlights";
import { HeritageSidebar } from "./HeritageSidebar";

export function HeritageDetailView({ id }: { id?: string }) {
  const [heritage, setHeritage] = useState<Heritage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const { showToast } = useToast();

  const toggleAudioGuide = () => {
    if (!("speechSynthesis" in window) || !heritage) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${heritage.name}. Located in ${heritage.location}. ${heritage.history?.replace(/\*/g, "") || ""}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    catalogApi
      .getHeritageById(id)
      .then((data) => {
        setHeritage(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch heritage details", err);
        setError("Failed to load heritage details. Please check your connection and try again.");
        setLoading(false);
      });

    if (session) {
      itineraryApi
        .getFavorites()
        .then((data) => {
          if (Array.isArray(data)) {
            setIsFavorite(
              data.some(
                (f: any) =>
                  (f.itemId && (f.itemId._id === id || f.itemId === id)) || f.itemId?._id === id
              )
            );
          }
        })
        .catch(console.error);
    }
  }, [id, session]);

  const toggleFavorite = async () => {
    if (!id) return;
    if (!session) {
      showToast("Please sign in to save places to your favorites", "info", "Authentication Required");
      return;
    }
    setIsTogglingFavorite(true);
    try {
      await itineraryApi.toggleFavorite(id, "Heritage");
      const nextState = !isFavorite;
      setIsFavorite(nextState);
      showToast(
        nextState
          ? `${heritage?.name || "Item"} added to favorites!`
          : `${heritage?.name || "Item"} removed from favorites`,
        nextState ? "success" : "info",
        nextState ? "Favorite Saved" : "Favorite Removed"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to update favorites", "error", "Error");
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-16">
        <SkeletonCard type="detail" />
      </div>
    );
  }

  if (error || !heritage) {
    return (
      <div className="text-center py-32 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-red-600 mb-4">{error || "Heritage not found"}</h2>
        <div className="mt-4">
          <Link to="/explore?tab=heritages" className="text-green-600 hover:underline text-lg">
            Return to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white pb-24">
      {/* Hero Showcase */}
      <HeritageHero
        heritage={heritage}
        session={session}
        isFavorite={isFavorite}
        isTogglingFavorite={isTogglingFavorite}
        onToggleFavorite={toggleFavorite}
        isPlayingAudio={isPlayingAudio}
        onToggleAudioGuide={toggleAudioGuide}
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Audio Player Banner */}
        <AudioNarrationBanner
          name={heritage.name}
          isPlayingAudio={isPlayingAudio}
          onToggleAudioGuide={toggleAudioGuide}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Quick Facts */}
            <HeritageQuickFacts quickFacts={heritage.quickFacts} />

            {/* History Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Compass className="w-8 h-8 text-gray-900 mr-3" />
                History & Significance
              </h2>
              <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-loose">
                {heritage.history?.split("\n\n").map((paragraph, idx) => (
                  <p
                    key={idx}
                    dangerouslySetInnerHTML={{
                      __html: paragraph
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/\*/g, ""),
                    }}
                  />
                ))}
              </div>
            </motion.section>

            {/* Tourist Highlights & Experience */}
            <HeritageHighlights
              touristHighlights={heritage.touristHighlights}
              travelerExperience={heritage.travelerExperience}
            />
          </div>

          {/* Interactive Sidebar */}
          <HeritageSidebar
            name={heritage.name}
            location={heritage.location}
            coordinates={heritage.coordinates}
          />
        </div>
      </div>
    </div>
  );
}

export default HeritageDetailView;
