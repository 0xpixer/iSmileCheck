import Image from "next/image";
import { SmileSimulator } from "@/components/SmileSimulator";

const TERMS_URL = "https://thebrightark.com/pages/terms";
const PRIVACY_URL = "https://thebrightark.com/pages/privacy-policy";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex flex-1 w-full max-w-4xl flex-col">
        <div className="flex items-center gap-4 pb-6">
          <a
            href="https://www.thebrightark.com"
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:ring-2 focus:ring-[#F75202] focus:ring-offset-2 rounded shrink-0"
          >
            <Image
              src="/logo.png"
              alt="iSmile Check"
              width={280}
              height={140}
              className="h-auto max-w-[140px] object-contain"
            />
          </a>
          <h1 className="text-[16px] font-semibold tracking-tight text-slate-900">
            iSmile Check
          </h1>
        </div>
        <SmileSimulator />
      </div>
      <footer className="mt-auto border-t border-slate-200 px-4 py-6 text-center text-xs text-slate-500 sm:px-6">
        <p>© 2026 BRIGHTARK PTE. LTD. All Rights Reserved.</p>
        <p className="mt-1">
          <a href={TERMS_URL} target="_blank" rel="noopener noreferrer" className="text-[#F75202] hover:underline">
            Terms and Conditions
          </a>
          {" | "}
          <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-[#F75202] hover:underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </main>
  );
}
