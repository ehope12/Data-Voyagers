import React, { useState, useEffect } from 'react';
import carouselImg from "../assets/carouselImages/carouselImg2.jpg";
import USGSImg from "../assets/carouselImages/USGSImg.jpg";

// Sample images for the carousel
const images = [
    carouselImg,
    USGSImg,
    // 'https://via.placeholder.com/600x300?text=Image+3',
    // 'https://via.placeholder.com/600x300?text=Image+4',
];

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []); // Empty dependency array means this runs once when the component mounts

    return (
        <div className="w-full bg-slate-100">
        <div className="relative p-10 w-full max-w-md mx-auto">
            <div className="overflow-hidden rounded-lg shadow-lg">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="w-full h-64 object-cover"
                />
            </div>
            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-gray-800 font-bold p-2 rounded-l-lg hover:bg-gray-200"
            >
                &#10094; {/* Left Arrow */}
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-gray-800 font-bold p-2 rounded-r-lg hover:bg-gray-200"
            >
                &#10095; {/* Right Arrow */}
            </button>
        </div>
        </div>
    );
};

export default ImageCarousel;
