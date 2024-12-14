import React, { useState } from "react";
import { Volume2, StopCircle, Loader2 } from "lucide-react";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("en-US");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speech, setSpeech] = useState(null);

  const voices = [
    { id: "en-US", name: "English (US)" },
    { id: "en-GB", name: "English (UK)" },
    { id: "en-IN", name: "English (Indian)" },
    { id: "hi-IN", name: "Hindi" },
  ];

  const handleSpeak = async () => {
    if (!text) return;

    setIsLoading(true);

    // Using the free VoiceRSS API
    const API_KEY = import.meta.env.VITE_API_KEY;
    const API_URL = `${import.meta.env.VITE_API_URL}/?key=${API_KEY}&hl=${voice}&src=${encodeURIComponent(
      text
    )}`;

    try {
      const audio = new Audio(API_URL);
      setSpeech(audio);

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        alert("Error playing audio. Please check your API key and try again.");
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Failed to convert text to speech. Please try again.");
    }

    setIsLoading(false);
  };

  const handleStop = () => {
    if (speech) {
      speech.pause();
      speech.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const getPlaceholderText = () => {
    switch (voice) {
      case "hi-IN":
        return "बोलने के लिए टेक्स्ट यहाँ लिखें...";
      default:
        return "Enter text to convert to speech...";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Text to Speech by PRINCE
        </h1>

        <div className="space-y-4">
          <select
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
                     text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
          >
            {voices.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>

          <textarea
            className="w-full min-h-[120px] p-3 rounded-lg bg-gray-700 border border-gray-600 
                     text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500"
            placeholder={getPlaceholderText()}
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir={voice === "hi-IN" ? "auto" : "ltr"}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            className={`flex items-center px-4 py-2 rounded-lg font-medium
                     ${
                       isLoading || isPlaying || !text
                         ? "bg-gray-600 cursor-not-allowed"
                         : "bg-blue-600 hover:bg-blue-700"
                     } 
                     text-white transition-colors`}
            onClick={handleSpeak}
            disabled={isLoading || isPlaying || !text}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4 mr-2" />
            )}
            {voice === "hi-IN" ? "बोलें" : "Speak"}
          </button>

          {isPlaying && (
            <button
              className="flex items-center px-4 py-2 rounded-lg font-medium
                       bg-red-600 hover:bg-red-700 text-white transition-colors"
              onClick={handleStop}
            >
              <StopCircle className="w-4 h-4 mr-2" />
              {voice === "hi-IN" ? "रोकें" : "Stop"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
