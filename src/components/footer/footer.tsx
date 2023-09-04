import Link from "next/link"
import React from "react"

export default function Footer() {
  return (
    <footer className="bg-[#333] text-white py-24">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
          {/* Brand section */}
          <div className="md:col-span-1">
            <h2 className="text-3xl md:text-5xl font-archivo font-bold mb-4">HiGrow.</h2>
            <p className="text-sm text-gray-200 md:text-lg font-light tracking-wider md:w-[120%]">
              Empowering minds worldwide to Learn, Compete and grow together
            </p>
          </div>


          <div className="md:col-span-1 grid justify-start md:justify-center">
            <h3 className="text-2xl font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Dashboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Workshops</a></li>
            </ul>
          </div>

          {/* Links section 2 */}
          <div className="md:col-span-1 grid md:justify-center">
            <h3 className="text-2xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition duration-300">Refund Policy</a></li>
            </ul>
          </div>

          
        </div>
      </div>
    </footer>
  )
}
