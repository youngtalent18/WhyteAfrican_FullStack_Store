import React from "react";
import { FaInstagram, FaSnapchat, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const socials = [
    {
      name: "Instagram",
      link: "https://www.instagram.com/whyte_african_clothing?igsh=MWRpbXFheTl4b3ZreQ==",
      icon: FaInstagram,
      color: "hover:text-pink-400",
    },
    {
      name: "Snapchat",
      link: "https://snapchat.com/t/6WCCNDxm",
      icon: FaSnapchat,
      color: "hover:text-yellow-300",
    },
    {
      name: "WhatsApp",
      link: "https://wa.me/+233550753373",
      icon: FaWhatsapp,
      color: "hover:text-green-400",
    },
    {
      name: "TikTok",
      link: "https://www.tiktok.com/@thewhyteafricanemporium?_r=1&_t=ZS-9655JfpzdXF",
      icon: FaTiktok,
      color: "hover:text-white",
    },
  ];

  const shopLinks = [
    { href: "men", name: "Men" },
    { href: "bags", name: "Bags" },
    { href: "jackets", name: "Jackets & Hoodies" },
    { href: "perfumes", name: "Perfumes" },
    { href: "shoes", name: "Footwear" },
    { href: "caps", name: "Caps" },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-12">
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* BRAND */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white tracking-tight">
              WhyteAfrican
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed">
              Ghana's fast-growing <br /> online marketplace.
              <br />
              Quality products, <br /> fair prices, fast delivery.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">
              Shop
            </h4>

            <div className="space-y-2">
              {shopLinks.map((item, i) => (
                <Link
                  key={i}
                  to={`/category/${item.href}`}
                  className="block text-sm text-slate-400 hover:text-white transition"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* SOCIALS */}
          <div>
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">
              Socials
            </h4>

            <div className="space-y-3">
              {socials.map((item, i) => {
                const Icon = item.icon;

                return (
                  <a
                    key={i}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm text-slate-400 ${item.color} transition`}
                  >
                    <Icon className="text-base" />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>

          {/* PAYMENT */}
          <div className="space-y-4">
            <h4 className="text-white font-medium mb-4 text-sm uppercase tracking-wide">
              Payment
            </h4>

            <p className="text-sm text-slate-400">
              Mobile Money (MTN, Vodafone, AirtelTigo)
            </p>

            <div className="pt-2">
              <p className="text-xs text-slate-500">Need help?</p>
              <p className="text-emerald-400 font-semibold">
                +233 55 437 3790
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2026 WhyteAfrican. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;