import React, { useEffect, useRef } from "react";
import "./Carousel.css";
import image from '../../../assets/post.jpg'
const Carousel = () => {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;

    const handleMouseMove = (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;

      const rotateY = (clientX / innerWidth) * 360;
      const translateZ = (clientY / innerHeight) * 200 - 100;

      carousel.style.transform = `rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
      carousel.style.transition = "transform 0.1s ease";
    };

    const handleMouseEnterCarousel = () => {
      carousel.style.animation = "none"; // Stop default animation
    };

    const handleMouseLeaveCarousel = () => {
      carousel.style.transform = "rotateY(0deg) translateZ(0px)";
      carousel.style.transition = "transform 0.5s ease";
      carousel.style.animation = "rotate 20s infinite linear"; // Resume default animation
    };

    const handleMouseEnterImage = () => {
      carousel.style.animation = "none"; // Stop default animation
    };

    const handleMouseLeaveImage = () => {
      carousel.style.animation = "rotate 20s infinite linear"; // Resume default animation
    };

    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer.addEventListener("mousemove", handleMouseMove);
    carouselContainer.addEventListener("mouseenter", handleMouseEnterCarousel);
    carouselContainer.addEventListener("mouseleave", handleMouseLeaveCarousel);

    const carouselImages = document.querySelectorAll(".carousel__image");
    carouselImages.forEach((image) => {
      image.addEventListener("mouseenter", handleMouseEnterImage);
      image.addEventListener("mouseleave", handleMouseLeaveImage);
    });

    return () => {
      carouselContainer.removeEventListener("mousemove", handleMouseMove);
      carouselContainer.removeEventListener(
        "mouseenter",
        handleMouseEnterCarousel
      );
      carouselContainer.removeEventListener(
        "mouseleave",
        handleMouseLeaveCarousel
      );

      carouselImages.forEach((image) => {
        image.removeEventListener("mouseenter", handleMouseEnterImage);
        image.removeEventListener("mouseleave", handleMouseLeaveImage);
      });
    };
  }, []);

  return (
    <div className="carousel-container w-auto p-4 mt-3">
      <div className="carousel" ref={carouselRef}>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="1"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src=""
            alt="2"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src={image}
            alt="3"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="4"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
        <div className="carousel__face">
          <img
            src="https://i.pinimg.com/564x/33/e1/cc/33e1cc97ea4cf9f119e5873def4658a7.jpg"
            alt="5"
            className="carousel__image w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
