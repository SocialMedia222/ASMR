import React from "react";
import Carousel from "./Carousel/Carousel";
import ImageGrid from "./ImageGrid/ImageGrid";
import "./Explore.css";
function Explore() {
  return (
    <div className="w-full h-screen overflow-hidden px-4">
      <div className="mx-auto h-full overflow-y-scroll no-scrollbar">
        <Carousel />
        <ImageGrid
          imageUrls={[
            "https://source.unsplash.com/random/6",
            "https://source.unsplash.com/random/7",
            "https://source.unsplash.com/random/8",
            "https://source.unsplash.com/random/9",
            "https://source.unsplash.com/random/10",
            "https://source.unsplash.com/random/11",
            "https://source.unsplash.com/random/12",
            "https://source.unsplash.com/random/13",
            "https://source.unsplash.com/random/15",
          ]}
        />
      </div>
    </div>
  );
}

export default Explore;
