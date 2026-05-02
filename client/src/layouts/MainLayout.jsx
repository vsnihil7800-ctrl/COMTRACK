import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VoiceCommandButton from "../components/VoiceCommandButton";
import { socket } from "../services/socket";

export default function MainLayout() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    if (dark) {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  }, [dark]);

  useEffect(() => {
    const onNotification = (payload) => {
      toast(payload.title ? `${payload.title}: ${payload.message}` : payload.message || "New update");
    };
    const onBooking = () => toast.success("New ambulance booking event");
    const onComplaint = () => toast.success("New complaint routed");
    const onSos = () => toast.error("New SOS event received");
    socket.on("notification", onNotification);
    socket.on("booking:new", onBooking);
    socket.on("complaint:new", onComplaint);
    socket.on("sos:new", onSos);
    return () => {
      socket.off("notification", onNotification);
      socket.off("booking:new", onBooking);
      socket.off("complaint:new", onComplaint);
      socket.off("sos:new", onSos);
    };
  }, []);

  return (
    <div className={dark ? "dark" : "light"}>
      <Navbar dark={dark} setDark={setDark} lang={lang} setLang={setLang} />
      <main className="container-app py-8">
        <Outlet context={{ lang }} />
      </main>
      <Footer />
      <VoiceCommandButton />
    </div>
  );
}