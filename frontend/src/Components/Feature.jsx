import { Truck, ShieldCheck, Headphones, Zap } from "lucide-react";

const Feature = () => {
  const features = [
    {
      icon: Truck,
      title: "Nationwide Delivery",
      desc: "Fast & reliable shipping",
      color: "green",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payments",
      desc: "Protected transactions",
      color: "blue",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "We’re always here to help",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Flash Deals",
      desc: "New offers daily",
      color: "orange",
    },
  ];

  const colorMap = {
    green: "bg-green-500/15 text-green-400 ring-green-500/30",
    blue: "bg-blue-500/15 text-blue-400 ring-blue-500/30",
    purple: "bg-purple-500/15 text-purple-400 ring-purple-500/30",
    orange: "bg-orange-500/15 text-orange-400 ring-orange-500/30",
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <div
              key={i}
              className="
                group relative
                flex items-center gap-4
                p-4 sm:p-5
                rounded-2xl
                bg-linear-to-b from-slate-850 to-slate-900
                border border-slate-800/70
                shadow-md
                hover:shadow-2xl hover:shadow-black/40
                hover:-translate-y-1
                transition-all duration-300
                overflow-hidden
              "
            >
              {/* subtle glow background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-linear-to-r from-white/4 to-transparent" />

              {/* ICON */}
              <div
                className={`
                  relative z-10
                  p-3 rounded-xl
                  ring-1
                  ${colorMap[f.color]}
                `}
              >
                <Icon size={22} />
              </div>

              {/* TEXT */}
              <div className="relative z-10 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base tracking-tight">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                  {f.desc}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
};

export default Feature;