import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import BrandsService from "../../../services/BrandServices";

function Brand({ image, name }) {
    const imageUrl = image || "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/330px-No-Image-Placeholder.svg.png?20200912122019";

    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            <ArgonBox mr={2}>
                <ArgonAvatar src={imageUrl} alt={name} size="sm" variant="rounded" />
            </ArgonBox>
            <ArgonBox display="flex" flexDirection="column">
                <ArgonTypography variant="button" fontWeight="medium" color="textPrimary">
                    {name}
                </ArgonTypography>
            </ArgonBox>
        </ArgonBox>
    );
}


Brand.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
};

const BrandTable = ({ onEditClick }) => {
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await BrandsService.getAllBrands();
                setBrands(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (brand) => {
        onEditClick(brand);
    };

    const deleteItem = async (id) => {
        try {
            await BrandsService.deleteBrand(id);
            setBrands(brands.filter(brand => brand.id !== id));
            toast.success("Xóa thương hiệu thành công");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
            toast.error("Xóa thương hiệu thất bại!!!");
        }
    };

    const rows = brands.map(brand => ({
        brand: (
            <Brand
                image={brand.image} // Image từ API, có thể undefined
                name={brand.name}
            />
        ),
        action: (
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="info"
                    fontWeight="medium"
                    onClick={() => handleEditClick(brand)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-pencil-square"></i> Sửa
                </ArgonTypography>
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="error"
                    fontWeight="medium"
                    onClick={() => deleteItem(brand.id)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-trash3"></i> Xóa
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const brandTableData = {
        columns: [
            { name: "brand", align: "left" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return brandTableData;
};

BrandTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default BrandTable;