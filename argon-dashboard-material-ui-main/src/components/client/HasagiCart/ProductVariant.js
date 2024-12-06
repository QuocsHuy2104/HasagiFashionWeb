import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProductVariant.css"; // Để tùy chỉnh CSS
import CartService from "../../../services/CartService";
import axios from "axios";
const ProductVariant = ({ onClose, cartDetailId, productId, colorId, sizeId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [Error, setError] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    setSelectedColor(colorId || null);
    setSelectedSize(sizeId || null);
  }, [colorId, sizeId]);

  const fetchProductOptionsById = async (productId, selectedSizeId, selectedColorId) => {
    try {
      const params = new URLSearchParams();
      if (selectedSizeId) params.append("selectedSizeId", selectedSizeId);
      if (selectedColorId) params.append("selectedColorId", selectedColorId);

      const optionsUrl = `http://localhost:3000/api/cart/option/${productId}?${params.toString()}`;
      const imagesUrl = `http://localhost:3000/api/public/webShopDetail/product-detail/${productId}`;

      const [optionsResponse, imagesResponse] = await Promise.all([
        fetch(optionsUrl).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch options");
          return res.json();
        }),
        axios.get(imagesUrl),
      ]);

      const uniqueColors = [
        ...new Map(optionsResponse.colors.map((color) => [color.id, color])).values(),
      ];
      const uniqueSizes = [
        ...new Map(optionsResponse.sizes.map((size) => [size.id, size])).values(),
      ];

      setColors(uniqueColors);
      setSizes(uniqueSizes);

      if (imagesResponse.data) {
        setImages(imagesResponse.data);
      } else {
        console.error("Product detail not found or no images available");
      }
      const checkedItems =
        JSON.parse(localStorage.getItem("checkedItems" + productId + colorId + sizeId)) || [];

      if (checkedItems && checkedItems.length > 0) {
        localStorage.setItem(
          "checkedItems" + productId + colorId + sizeId,
          JSON.stringify([Number(productId), selectedColor, selectedSize])
        );
      }
    } catch (error) {
      console.error("Error fetching product options or images:", error);
      setError("Failed to fetch product options or images. Please try again later.");
    }
  };

  useEffect(() => {
    fetchProductOptionsById(productId, selectedSize, selectedColor);
  }, [productId, selectedSize, selectedColor]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedColor && selectedSize) {
      try {
        await CartService.getCartUpdate(cartDetailId, selectedColor, selectedSize, productId);
        const checkedItemsKey = `checkedItems${productId}${colorId}${sizeId}`;
        const newCheckedItemsKey = `checkedItems${productId}${selectedColor}${selectedSize}`;
        const checkedItems = JSON.parse(localStorage.getItem(checkedItemsKey)) || [];
        if (checkedItems.length > 0) {
          localStorage.removeItem(checkedItemsKey);
          localStorage.setItem(
            newCheckedItemsKey,
            JSON.stringify([Number(productId), selectedColor, selectedSize])
          );
        }
        onClose();
      } catch (error) {
        setError(error.message || "Failed to update product option");
        console.error("Error during cart update:", error);
      }
    } else {
      setError("Please select both color and size before submitting");
    }
  };

  return (
    <div className="variant-modal">
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Màu sắc:</h4>
        </div>
        {colors.map((variant) => {
          const matchingImage = images?.find((image) => image?.colorsDTO?.id === variant?.id);
          return (
            <button
              key={variant.id}
              className={`variant-button ${selectedColor === variant.id ? "selected" : ""} ${
                !variant.check ? "disabled" : ""
              }`}
              onClick={() =>
                setSelectedColor((prevSelected) =>
                  prevSelected === variant.id ? null : variant.id
                )
              }
              disabled={!variant.check}
              style={{
                marginRight: "10px",
                cursor: !variant.check ? "not-allowed" : "pointer",
                opacity: !variant.check ? 0.5 : 1,
              }}
            >
              {matchingImage && (
                <img
                  key={matchingImage?.colorsDTO?.id}
                  src={matchingImage?.imageDTOResponse[0]?.url}
                  alt={variant.name}
                  style={{
                    width: "25px", // Kích thước ảnh nhỏ
                    height: "25px", // Kích thước ảnh nhỏ
                    marginRight: "10px", // Khoảng cách giữa ảnh và tên màu
                  }}
                />
              )}
              {variant.name}
            </button>
          );
        })}
      </div>
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Kích thước:</h4>
        </div>
        {sizes.map((variant) => (
          <button
            key={variant.id}
            className={`variant-button ${selectedSize === variant.id ? "selected" : ""} ${
              !variant.check ? "disabled" : ""
            }`}
            onClick={() =>
              setSelectedSize((prevSelected) => (prevSelected === variant.id ? null : variant.id))
            }
            disabled={!variant.check}
            style={{
              marginRight: "10px",
              cursor: !variant.check ? "not-allowed" : "pointer",
              opacity: !variant.check ? 0.5 : 1,
            }}
          >
            {variant.name}
          </button>
        ))}
      </div>

      <div className="variant-footer">
        <button className="back-button" onClick={onClose} style={{ marginRight: "10px" }}>
          Trở lại
        </button>
        <button
          className="confirm-button btn-warning"
          onClick={handleFormSubmit} // Gắn sự kiện onClick
        >
          Xác nhận
        </button>
      </div>
    </div>
  );
};

ProductVariant.propTypes = {
  onClose: PropTypes.func.isRequired,
  cartDetailId: PropTypes.number.isRequired,
  productId: PropTypes.number.isRequired,
  colorId: PropTypes.number.isRequired,
  sizeId: PropTypes.number.isRequired,
};

export default ProductVariant;