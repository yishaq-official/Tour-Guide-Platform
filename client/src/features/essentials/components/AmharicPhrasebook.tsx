import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquareQuote, Volume2, Heart } from "lucide-react";

interface Phrase {
  amharic: string;
  script: string;
  phonetic: string;
  english: string;
  category: "greetings" | "dining" | "directions";
}

const PHRASES: Phrase[] = [
  // Greetings
  { amharic: "ሰላም", script: "Selam", phonetic: "Seh-lahm", english: "Hello / Peace", category: "greetings" },
  { amharic: "አመሰግናለሁ", script: "Ameseginalehu", phonetic: "Ah-meh-seh-gih-nah-leh-hoo", english: "Thank you", category: "greetings" },
  { amharic: "እሺ", script: "Ishi", phonetic: "Ee-shee", english: "Okay / Yes", category: "greetings" },
  { amharic: "ደህና ሁን", script: "Dehna Hun", phonetic: "Deh-nah Hoon", english: "Goodbye (to a male)", category: "greetings" },
  { amharic: "ደህና ሁኚ", script: "Dehna Huni", phonetic: "Deh-nah Hoo-nee", english: "Goodbye (to a female)", category: "greetings" },
  { amharic: "እንዴት ነህ?", script: "Indet Neh?", phonetic: "In-date Neh?", english: "How are you? (to a male)", category: "greetings" },
  { amharic: "እንዴት ነሽ?", script: "Indet Nesh?", phonetic: "In-date Nesh?", english: "How are you? (to a female)", category: "greetings" },

  // Dining & Shopping
  { amharic: "ስንት ነው?", script: "Sint Now?", phonetic: "Sin-t Now?", english: "How much is it?", category: "dining" },
  { amharic: "ቆንጆ", script: "Konjo", phonetic: "Kohn-joh", english: "Beautiful / Delicious", category: "dining" },
  { amharic: "ውሃ አምጣልኝ", script: "Wuha Amtalign", phonetic: "Woo-hah Ahm-tah-leen", english: "Bring me water", category: "dining" },
  { amharic: "ቡና", script: "Buna", phonetic: "Boo-nah", english: "Coffee", category: "dining" },
  { amharic: "ሒሳብ አምጣልኝ", script: "Hisab Amtalign", phonetic: "Hee-sahb Ahm-tah-leen", english: "Bring the bill", category: "dining" },

  // Directions & Emergencies
  { amharic: "የት ነው?", script: "Yet Now?", phonetic: "Yeh-t Now?", english: "Where is it?", category: "directions" },
  { amharic: "እባክህ እርዳኝ", script: "Ebakih Irdagn", phonetic: "Eh-bah-keeh Ihr-dahn-y", english: "Please help me", category: "directions" },
  { amharic: "ታክሲ", script: "Taxi", phonetic: "Tahk-see", english: "Taxi", category: "directions" },
  { amharic: "ሆቴል", script: "Hotel", phonetic: "Hoh-tehl", english: "Hotel", category: "directions" },
];

export function AmharicPhrasebook() {
  const [activePhraseTab, setActivePhraseTab] = useState<"all" | "greetings" | "dining" | "directions">("all");
  const [playedPhrase, setPlayedPhrase] = useState<string | null>(null);

  const speakPhrase = (text: string) => {
    setPlayedPhrase(text);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.lang = "am-ET";
      window.speechSynthesis.speak(utterance);
    }
    setTimeout(() => setPlayedPhrase(null), 1500);
  };

  const filteredPhrases =
    activePhraseTab === "all" ? PHRASES : PHRASES.filter((p) => p.category === activePhraseTab);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-150 p-8 sm:p-10"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
            <MessageSquareQuote className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">5. Interactive Amharic Phrasebook</h2>
            <p className="text-sm text-gray-500">
              Learn key words, pronunciation, and cultural etiquette for your journey.
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-xl border border-gray-200">
          <button
            onClick={() => setActivePhraseTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePhraseTab === "all" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            All Words
          </button>
          <button
            onClick={() => setActivePhraseTab("greetings")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePhraseTab === "greetings" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            Greetings
          </button>
          <button
            onClick={() => setActivePhraseTab("dining")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePhraseTab === "dining" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            Shopping & Dining
          </button>
          <button
            onClick={() => setActivePhraseTab("directions")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activePhraseTab === "directions" ? "bg-white text-green-700 shadow-sm" : "text-gray-500"
            }`}
          >
            Directions
          </button>
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {filteredPhrases.map((phrase, idx) => (
          <div
            key={idx}
            className="bg-gray-50 hover:bg-green-50/50 p-4 rounded-2xl border border-gray-150 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-2xl font-bold text-gray-900 font-serif">{phrase.amharic}</div>
              <div className="text-sm font-bold text-green-700 mt-0.5">
                {phrase.script} <span className="text-xs font-normal text-gray-400">({phrase.phonetic})</span>
              </div>
              <div className="text-xs font-medium text-gray-600 mt-1">{phrase.english}</div>
            </div>

            <button
              onClick={() => speakPhrase(phrase.script)}
              className={`p-3 rounded-xl transition-colors ${
                playedPhrase === phrase.script
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-500 group-hover:text-green-600 shadow-sm border border-gray-150"
              }`}
              title="Listen Pronunciation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Cultural Etiquette & Tipping Guide */}
      <div className="bg-gradient-to-br from-emerald-950 via-gray-900 to-green-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/40 shadow-xl">
        <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2.5 text-emerald-400">
          <Heart className="w-5 h-5 text-emerald-400 animate-pulse" /> Tipping Customs & Cultural Etiquette
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <h4 className="font-bold text-sm text-white mb-2">Restaurant Tipping</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Tipping 5% to 10% of the total bill is customary at sit-down restaurants and cafes. A small cash tip of 50-100 ETB for hotel porters is appreciated.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <h4 className="font-bold text-sm text-white mb-2">Coffee Ceremony Ritual</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              If invited to a traditional Ethiopian coffee ceremony (Buna), it is respectful to accept at least the first round (*Abol*). It is customary to compliment the hostess.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
            <h4 className="font-bold text-sm text-white mb-2">Greetings & Handshakes</h4>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Light shoulder-bumping (*Gursha* / shoulder touch) during handshakes is a common sign of warm friendship and respect between acquaintances.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
