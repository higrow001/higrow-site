import Footer from "@/components/footer/footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      
      {children}
      <Footer/>
    </>
  );
}
