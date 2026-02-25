import Image from "next/image";
import { SmileSimulator } from "@/components/SmileSimulator";

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto flex justify-center pb-6">
        <Image
          src="/logo.png"
          alt="iSmile Check"
          width={280}
          height={140}
          className="h-auto max-w-[140px] object-contain"
        />
      </div>
      <SmileSimulator />
    </main>
  );
}
