// pages/infinite-path.tsx
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the Scene component with no SSR
const Scene = dynamic(() => import("@/components/infinity-symbol"), {
  ssr: false,
});

const InfinitePathPage = () => {
  return (
    <div style={{ height: "100vh", backgroundColor: "#000" }}>
      <Scene />
    </div>
  );
};

export default InfinitePathPage;
