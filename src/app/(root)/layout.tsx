import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default RootLayout;
