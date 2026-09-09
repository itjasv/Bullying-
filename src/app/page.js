import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BullyingWeb from "@/components/home/BullyingWeb";
import TextCycle from "@/components/home/TextCycle";
import Voices from "@/components/home/Voices";
import PrivacyLedger from "@/components/home/PrivacyLedger";
import Mechanism from "@/components/home/HowItWorks";
import AfterReport from "@/components/home/AfterReport";
import EmergencyRouting from "@/components/home/EmergencyRouting";
import Museum from "@/components/home/Museum";
import ClosingCTA from "@/components/home/ClosingCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BullyingWeb />
        <TextCycle />
        <Voices />
        <PrivacyLedger />
        <Mechanism />
        <AfterReport />
        <EmergencyRouting />
        <Museum />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  );
}
