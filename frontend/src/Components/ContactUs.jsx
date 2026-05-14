import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3">

      {/* ACTION MENU */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >

        {/* CALL BUTTON */}
        <a
          href="tel:+233550753373"
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-white/90 backdrop-blur-md text-black font-medium
          shadow-lg hover:shadow-xl hover:scale-105
          transition-all duration-200"
        >
          <Phone size={18} />
          Call Us
        </a>

        {/* WHATSAPP BUTTON */}
        <a
          href="https://wa.me/+233550753373"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl
          bg-green-500 text-white font-medium
          shadow-lg shadow-green-500/30
          hover:scale-105 hover:shadow-xl
          transition-all duration-200"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>

      {/* MAIN FLOAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group p-4 rounded-full
        bg-linear-to-br from-green-500 to-green-700
        text-white shadow-2xl shadow-green-500/40
        hover:scale-110 active:scale-95
        transition-all duration-300 cursor-pointer"
      >
        <span className="absolute inset-0 rounded-full bg-green-700 animate-ping opacity-50"></span>
        <span className="relative z-10">
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </span>
      </button>
    </div>
  );
};

export default FloatingContact;