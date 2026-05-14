import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col items-end gap-3">

      {/* ACTION MENU */}
      <div
        className={`
          flex flex-col gap-3
          transition-all duration-300
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
      >

        {/* CALL */}
        <a
          href="tel:+233550753373"
          className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-slate-900 border border-slate-800
            text-slate-200
            shadow-lg
            hover:bg-slate-800
            transition
          "
        >
          <Phone size={18} />
          Call Us
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/+233550753373"
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center gap-2
            px-4 py-2 rounded-lg
            bg-slate-900 border border-slate-800
            text-slate-200
            shadow-lg
            hover:bg-slate-800
            transition
          "
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>

      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="
          relative group
          p-4 rounded-full
          bg-indigo-600 hover:bg-indigo-500
          text-white
          shadow-lg
          hover:shadow-xl
          hover:scale-105 active:scale-95
          transition
        "
      >
        <span className="absolute inset-0 rounded-full bg-indigo-500 animate-ping opacity-20"></span>
        <span className="relative z-10">
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </span>
      </button>
    </div>
  );
};

export default FloatingContact;