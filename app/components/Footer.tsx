"use client";

import Image from "next/image";

export default function Footer({ onContact }: { onContact: () => void }) {
  return (
    <footer id="contacts" className="w-full mt-16 md:mt-28 border-t border-white/10 pt-8 md:pt-10 pb-6 flex flex-col scroll-mt-24 md:scroll-mt-28">
      <div className="mx-auto max-w-[1366px] w-full px-4 sm:px-6">
        <div className="flex flex-row items-center justify-between w-full">
          {/* Left: Get in Touch */}
          <div className="flex justify-start">
            <h2 className="text-lg min-[360px]:text-xl sm:text-3xl font-semibold text-white whitespace-nowrap">Get in Touch</h2>
          </div>

          {/* Right: Social Icons */}
          <div className="flex justify-end">
            <div className="flex items-center gap-0 min-[360px]:gap-1 sm:gap-3 -mr-2">
              <button onClick={onContact} className="flex items-center justify-center w-11 h-11 transition-opacity hover:opacity-80" aria-label="Email Maulana">
                <Image src="/assets/footer/mail.svg" alt="Email Logo" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
              <a href="https://github.com/ajimolana" target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 transition-opacity hover:opacity-80" aria-label="GitHub Profile">
                <Image src="/assets/footer/github.svg" alt="GitHub Logo" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://linkedin.com/in/maulanaraji/" target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 transition-opacity hover:opacity-80" aria-label="LinkedIn Profile">
                <Image src="/assets/footer/linkedin.svg" alt="LinkedIn Logo" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
              <a href="https://instagram.com/ajimolana/" target="_blank" rel="noreferrer" className="flex items-center justify-center w-11 h-11 transition-opacity hover:opacity-80" aria-label="Instagram Profile">
                <Image src="/assets/footer/instagram.svg" alt="Instagram Logo" width={28} height={28} className="w-6 h-6 sm:w-7 sm:h-7" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-16 w-full text-center">
          <p className="text-xs sm:text-sm text-[#dfdfdf] px-4 whitespace-nowrap">
            &copy; {new Date().getFullYear()}, Maulana Raji Shofil Fuadi.
          </p>
        </div>
      </div>
    </footer>
  );
}
