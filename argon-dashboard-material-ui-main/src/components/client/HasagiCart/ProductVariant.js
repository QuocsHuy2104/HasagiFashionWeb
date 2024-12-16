import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ProductVariant.css"; // Để tùy chỉnh CSS
import CartService from "../../../services/CartService";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const ProductVariant = ({ onClose, cartDetailId, productId, colorId, sizeId }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [Error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [colorName, setColorName] = useState("");
  const [sizename, setSizeName] = useState("");
  const [tooltip, setTooltip] = useState(null);

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
          JSON.stringify([Number(productId), colorId, sizeId])
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
    if (selectedColor ) {
      try {
        if (selectedSize) {
          // Nếu có kích thước, gọi API với color và size
          await CartService.getCartUpdate(cartDetailId, selectedColor, selectedSize, productId);
      } else {
          // Nếu không có kích thước, gọi API với chỉ color và sizeId = null
          await CartService.getCartUpdatePK(cartDetailId, selectedColor, productId);
      }
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

  useEffect(() => {
    setError("");
    if (selectedColor && selectedSize) {
      const disabledVariantColor = colors.find((variant) => !variant.check);
      const disabledVariantSize = sizes.find((variant) => !variant.check);
      const selectedVariantColor = colors.find((variant) => variant.id === selectedColor);
      const selectedVariantSize = sizes.find((variant) => variant.id === selectedSize);
      if (disabledVariantSize) {
        setColorName(selectedVariantColor.name);
      } else {
        setColorName("");
      }

      if (disabledVariantColor) {
        setSizeName(selectedVariantSize.name);
      } else {
        setSizeName("");
      }
    }
  }, [selectedColor, sizes]); // Chạy khi selectedColor hoặc sizes thay đổi

  return (
    <div className="variant-modal">
      <ToastContainer />
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Màu sắc:</h4>
        </div>
        {colors.map((variant) => {
          const matchingImage = images?.find((image) => image?.colorsDTO?.id === variant?.id);
          return (
            <div
              key={variant.id}
              style={{
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                if (!variant.check) {
                  setTooltip({
                    message: `Màu ${variant.name} của kích thước ${sizename} đã hết, vui lòng chọn màu khác.`,
                    x: e.pageX,
                    y: e.pageY,
                  });
                }
              }}
              onMouseMove={(e) => {
                if (tooltip) {
                  setTooltip({
                    ...tooltip,
                    x: e.pageX,
                    y: e.pageY,
                  });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <button
                className={`variant-button ${selectedColor === variant.id ? "selected" : ""} ${
                  !variant.check ? "disabled" : ""
                }`}
                onClick={() => {
                  setSelectedColor((prevSelected) => {
                    const newSelectedColor = prevSelected === variant.id ? null : variant.id;
                    prevSelected === variant.id ? setColorName("") : setColorName(variant.name);
                    return newSelectedColor;
                  });
                }}
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
                      width: "25px",
                      height: "25px",
                      marginRight: "10px",
                    }}
                  />
                )}
                {variant.name}
              </button>
            </div>
          );
        })}
      </div>
      {sizeId && (
      <div className="variant-options">
        <div className="variant-header mt-2">
          <h4>Kích thước:</h4>
        </div>
        {sizes.map((variant) => (
          <div
            key={variant.id}
            style={{
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              if (!variant.check) {
                setTooltip({
                  message: `Kích thước ${variant.name} của màu ${colorName} đã hết, vui lòng chọn kích thước khác.`,
                  x: e.pageX,
                  y: e.pageY,
                });
              }
            }}
            onMouseMove={(e) => {
              if (tooltip) {
                setTooltip({
                  ...tooltip,
                  x: e.pageX,
                  y: e.pageY,
                });
              }
            }}
            onMouseLeave={() => setTooltip(null)}
          >
            <button
              key={variant.id}
              className={`variant-button ${selectedSize === variant.id ? "selected" : ""} ${
                !variant.check ? "disabled" : ""
              }`}
              onClick={() => {
                if (variant.check) {
                  setSelectedSize((prevSelected) => {
                    const newSelectedSize = prevSelected === variant.id ? null : variant.id;
                    prevSelected === variant.id ? setSizeName("") : setSizeName(variant.name);
                    return newSelectedSize;
                  });
                }
              }}
              disabled={!variant.check}
              style={{
                cursor: !variant.check ? "not-allowed" : "pointer",
                opacity: !variant.check ? 0.5 : 1,
              }}
            >
              {variant.name}
            </button>
          </div>
        ))}
        {tooltip && (
          <div
            style={{
              position: "fixed",
              top: tooltip.y - 310,
              left: tooltip.x - 600,
              backgroundColor: "#333",
              color: "#fff",
              padding: "5px 10px",
              borderRadius: "0px",
              fontSize: "12px",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              zIndex: 1000,
            }}
          >
            {tooltip.message}
          </div>
        )}
      </div>
      )}
      {Error && <p style={{ fontSize: "14px", color: "red" }}>{Error.message}</p>}
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
