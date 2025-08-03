import React from "react";
import "keen-slider/keen-slider.min.css";

import Header from "@/app/_components/common/header";
import Footer from "../_components/common/footer";

const Layout = ({ children }) => {
  return (
    <>
      <main>
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
};

export default Layout;
