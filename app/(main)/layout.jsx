import React from "react";
import Header from "../_components/common/Header.jsx";
import Footer from "../_components/common/Footer.jsx";

const layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default layout;
