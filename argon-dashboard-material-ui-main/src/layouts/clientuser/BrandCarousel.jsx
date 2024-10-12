import React, { useEffect, useState, useRef } from "react";
import aboutImage3 from "layouts/assets/img/cat-1.jpg";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai"; 
import ShopService from "services/ShopServices";

const BrandCarousel = () => {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const scrollRef = useRef(null); 
    const itemWidth = 350;

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await ShopService.getBrandHome();
                setBrands(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error("Error fetching brands:", error);
                setBrands([]);
            }
        };
        fetchBrands();

        setTimeout(() => {
            setIsLoading(false);
        }, 700);
    }, []);

    const scroll = (scrollOffset) => {
        scrollRef.current.scrollLeft += scrollOffset;
    };

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
                    {/* Left arrow */}
                    <AiOutlineLeft
                        onClick={() => scroll(-itemWidth / 2)} 
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "36px", 
                            cursor: "pointer",
                            zIndex: 1,
                        }}
                    />

                    <div
                        ref={scrollRef}
                        style={{
                            display: "flex",
                            gap: "20px",
                            overflowX: "scroll",
                            scrollBehavior: "smooth", // Smooth scroll effect
                            padding: "20px 0",
                            scrollbarWidth: "none", // Hide scrollbar (Firefox)
                            msOverflowStyle: "none", // Hide scrollbar (IE)
                        }}
                    >
                        {brands.length > 0 ? (
                            brands.map((brand, index) => (
                                <div
                                    key={index}
                                    style={{
                                        minWidth: `${itemWidth}px`, // Increase minWidth to match larger item size
                                        maxWidth: `${itemWidth}px`,
                                        textAlign: "center",
                                        perspective: "1000px", // To enable 3D tilt
                                    }}
                                >
                                    <img
                                        src={brand.image || aboutImage3}
                                        alt="brand"
                                        style={{
                                            width: "100%",
                                            height: "300px", // Larger images
                                            objectFit: "cover",
                                            borderRadius: "15px",
                                            transition: "transform 0.3s ease, box-shadow 0.3s ease, filter 0.3s ease",
                                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Default shadow
                                            filter: "brightness(0.95)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = "scale(1.08) rotate(2deg)"; // Zoom and rotate slightly
                                            e.target.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.3)"; // Larger shadow on hover
                                            e.target.style.border = "3px solid rgba(255, 165, 0, 0.7)"; // Glowing border
                                            e.target.style.filter = "brightness(1.1)"; // Brighten image
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = "scale(1) rotate(0deg)"; // Reset transform
                                            e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.1)"; // Reset shadow
                                            e.target.style.border = "none"; // Remove glowing border
                                            e.target.style.filter = "brightness(0.95)"; // Reset brightness
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div>No brands available</div>
                        )}
                    </div>

                    {/* Right arrow */}
                    <AiOutlineRight
                        onClick={() => scroll(itemWidth / 2)} // Scroll by half the width
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            fontSize: "36px", // Larger arrows for bigger images
                            cursor: "pointer",
                            zIndex: 1,
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default BrandCarousel;
