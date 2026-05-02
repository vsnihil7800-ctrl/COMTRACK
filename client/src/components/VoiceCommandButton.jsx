import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VoiceCommandButton() {
  const navigate = useNavigate();
  const onVoice = () => {
    const speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!speech) return;
    const rec = new speech();
    rec.lang = "en-US";
    rec.onresult = (e) => {
      const command = e.results[0][0].transcript.toLowerCase();
      if (command.includes("book ambulance")) navigate("/ambulance");
      else if (command.includes("send sos") || command.includes("help me")) navigate("/sos");
      else if (command.includes("open complaints")) navigate("/complaints");
    };
    rec.start();
  };
  return (
    <button onClick={onVoice} className="fixed bottom-6 right-6 rounded-full bg-brand-emergency p-4 text-white shadow-xl">
      <Mic />
    </button>
  );
}
