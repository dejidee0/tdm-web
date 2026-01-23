import LoadMoreAndRecommended from "@/components/shared/project/more";
import MasterpiecesGallery from "@/components/shared/project/product";
import Title from "@/components/shared/project/title";
import React from "react";

const Project = () => {
  return (
    <div>
      <Title />
      <MasterpiecesGallery />
      <LoadMoreAndRecommended />
    </div>
  );
};

export default Project;
