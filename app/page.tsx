import { Background } from "@/components/background";
import { Footer } from "@/components/footer";
import { Newsletter } from "@/components/newsletter";

export default function Home() {
  return (
    <main className="h-[100dvh] w-full">
      <div className="relative h-full w-full">
        <Background src="/background.mp4" />
        <Newsletter />
        <Footer />
      </div>
    </main>
  );
}
