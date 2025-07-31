import React from "react";
import Header from "../_components/common/Header";
import Footer from "../_components/common/Footer";

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
