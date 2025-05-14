import Image from 'next/image';
import Link from 'next/link'; // Import Link for navigation

// Simple ChevronLeft and ChevronRight icons as SVG components
const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

const LightningIcon = () => ( // Simple lightning icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-dark text-brand-text-light">
      {/* Navbar */}
      <nav className="bg-brand-nav py-4 px-6 md:px-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.svg" alt=" Logo" width={40} height={40} className="mr-3" />
            <span className="text-xl font-semibold text-white">Clinivue</span>
          </div>
          <div className="hidden md:flex space-x-6 text-sm text-brand-text-dim">
            <a href="#" className="hover:text-white">Customer Segments</a>
            <a href="#" className="hover:text-white">Technology</a>
            <a href="#" className="hover:text-white">Clinivue for Stroke</a>
            <a href="#" className="hover:text-white">News</a>
            <a href="#" className="hover:text-white">Blogs</a>
            <a href="#" className="hover:text-white">Support</a>
            <a href="#" className="hover:text-white">About Us</a>
            <a href="#" className="hover:text-white">Get in Touch</a>
          </div>
          {/* Mobile menu button can be added here if needed */}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        {/* In the News Bar */}
        <div className="bg-gray-800/50  py-2 px-4 rounded-lg flex items-center justify-between max-w-2xl w-full mb-10 mt-10">
          <div className="flex items-center text-sm">
            <LightningIcon />
            <span className="font-semibold mr-2">In the News</span>
            <span className="text-brand-text-dim">Clinivue featured as key Co Pilot Partner by Satya Nadella at Keynote</span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-brand-text-dim hover:text-white"><ChevronLeftIcon /></button>
            <button className="text-brand-text-dim hover:text-white"><ChevronRightIcon /></button>
          </div>
        </div>

        {/* Hero Section */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="text-brand-blue-light">Remote Health</span> Monitoring & Camera
          <br />
          Based Digital Health Screening at scale
        </h1>
        <p className="text-lg md:text-xl text-brand-text-dim max-w-3xl mb-10">
          Get real-time <span className="text-white font-semibold">health data remotely</span> using our camera based digital health screening tool. Our non-invasive technology is a <span className="text-white font-semibold">video-based vital signs monitoring</span> App/SDK that uses <span className="text-white font-semibold">PPG technology</span> to remotely assess the health and wellness of users at scale.
        </p>

        <div className="flex space-x-4">
          {/* Updated to use Link for internal navigation and standard <a> for external or placeholder */}
          <Link href="/use-cases" legacyBehavior>
            <a className="bg-brand-blue hover:bg-brand-blue-light text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300">
              Use Cases
            </a>
          </Link>
          <Link href="/learn-more" legacyBehavior>
            <a className="border border-brand-blue text-brand-blue-light hover:bg-brand-blue hover:text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300">
              Learn More
            </a>
          </Link>
        </div>
         {/* Placeholder for the actual vitals scanning app link */}
        <div className="mt-12">
          <Link href="/browser/webcam_widget.html" legacyBehavior>
            <a className="text-brand-blue-light hover:underline">
              Proceed to Vital Signs Scan &rarr;
            </a>
          </Link>
        </div>
      </main>

      {/* Footer (optional) */}
      <footer className="py-6 text-center text-sm text-brand-text-dim">
        &copy; {new Date().getFullYear()} Clinivue. All rights reserved.
      </footer>
    </div>
  );
}
