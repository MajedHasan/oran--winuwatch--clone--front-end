import React from "react";
import Header from "../_components/common/Header";

const layout = ({ children }) => {
  return (
    <>
      <main>
        <Header />
        {children}
      </main>
    </>
  );
};

export default layout;
