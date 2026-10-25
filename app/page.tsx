import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Machinery from "@/components/landing/Machinery";
import Reception from "@/components/landing/Reception";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <About />
        <Services />
        <Machinery />
        <Reception />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
