import { Twitter, Linkedin, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-[#1A1A1A] pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="font-heading text-2xl font-bold text-white tracking-wider">NIG</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              The ecosystem for the future. Connecting humanity through safety, truth, and potential.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-[#DAA520] text-xs uppercase tracking-widest mb-6">Divisions</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">C.A.R.E.N.</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">Real Pulse</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">The Remedy Club</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">Eternal Chase</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[#DAA520] text-xs uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">Investor Relations</li>
              <li className="hover:text-[#14C1D7] cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[#DAA520] text-xs uppercase tracking-widest mb-6">Connect</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7] transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7] transition-all cursor-pointer">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-full border border-[#1A1A1A] flex items-center justify-center text-gray-400 hover:border-[#14C1D7] hover:text-[#14C1D7] transition-all cursor-pointer">
                <Instagram className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1A1A1A] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs font-mono">© 2025 Nexus Impact Group. All Rights Reserved.</p>
          <div className="flex gap-6 text-gray-600 text-xs font-mono">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}