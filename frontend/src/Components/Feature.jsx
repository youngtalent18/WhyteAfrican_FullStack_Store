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
    green: "bg-green-500/20 text-green-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    orange: "bg-orange-500/20 text-orange-400",
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        {features.map((f, i) => {
          const Icon = f.icon;

          return (
            <div
              key={i}
              className="
                flex items-center gap-4
                p-4 sm:p-5
                rounded-2xl
                bg-slate-800/80
                border border-slate-700
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                transition-all duration-300
              "
            >
              {/* ICON */}
              <div className={`p-3 rounded-full ${colorMap[f.color]}`}>
                <Icon size={22} />
              </div>

              {/* TEXT */}
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm truncate">
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