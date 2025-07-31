import React from "react";
import Header from "@/app/_components/common/header";

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
