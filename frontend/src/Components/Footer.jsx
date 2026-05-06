import React from 'react'
import { FaInstagram, FaSnapchat, FaWhatsapp, FaTiktok } from "react-icons/fa";
import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-16 py-10 border-t border-slate-500 mt-6">

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">

        {/* Brand */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-xl font-md text-white">WhyteAfrican</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Ghana's fastest-growing <br /> online marketplace.  <br />
            Shop with confidence, <br /> quality products,<br /> best prices, fast delivery.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            {[{href: "men", "name" : "T-Shirts"}, {href: "bags","name":"Bags"}, {href: "jackets","name":"Jackets & Hoodies"}, {href:"pefumes","name":"Perfumes"}, {href:"shoes","name":"Footwears"},{href: "caps" ,"name":"Caps"}].map((item, i) => (
              <Link to={`/category/${item.href}`} key={i} className="flex flex-col hover:text-white cursor-pointer transition">
                {item.name}
              </Link>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Our Socials</h4>
          <ul className="space-y-2 text-sm">
            {[{"name": "Instagram", color: " bg-linear-to-tr from-pink-600 to-blue-700", link: "https://www.instagram.com/whyte_african_clothing?igsh=MWRpbXFheTl4b3ZreQ==", 
            icon: <FaInstagram />}, {"name": "SnapChat",color: "text-amber-300", link: "https://snapchat.com/t/6WCCNDxm", icon: <FaSnapchat />}, {"name": "WhatSapp",
               color: "text-green-500", link: "https://wa.me/+233550753373", icon: <FaWhatsapp />},
             {"name": "Tiktok", link: "https://www.tiktok.com/@thewhyteafricanemporium?_r=1&_t=ZS-9655JfpzdXF", icon: <FaTiktok />}].map((item, i) => (
              <li key={i} className="hover:text-white cursor-pointer transition">
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <span className={` text-lg ${item.color} || "" `}>{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment */}
        <div>
          <h4 className="text-white font-semibold mb-3">Payment Method</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>Mobile Money (MTN, Vodafone, AirtelTigo)</li>
          </ul>

          <div className="mt-4">
            <p className="text-sm text-gray-300">Need help? Call Us</p>
            <p className="text-green-500 font-semibold text-md">+233 55 437 3790</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-slate-700 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">

        <p>© 2026 WhyteAfrican. All rights reserved.</p>

        <p className="text-gray-500">
          Built with <span className="text-red-400">❤</span> Codecraze
        </p>

      </div>

    </footer>
  )
}

export default Footer