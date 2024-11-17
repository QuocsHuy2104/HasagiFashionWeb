import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import CategoriesService from "../../../services/CategoryServices";

function Category({ image, name }) {
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


Category.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
};

const CategoryTable = ({ onEditClick }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await CategoriesService.getAllCategories();
                setCategories(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (category) => {
        onEditClick(category);
    };

    const deleteItem = async (id) => {
        try {
            await CategoriesService.deleteCategory(id);
            setCategories(categories.filter(cate => cate.id !== id));
            toast.success("Delete category successful");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
            toast.error("Error deleting category");
        }
    };

    const rows = categories.map(cate => ({
        category: (
            <Category
                image={cate.image} // Image từ API, có thể undefined
                name={cate.name}
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
                    onClick={() => handleEditClick(cate)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-pencil-square"></i> Edit
                </ArgonTypography>
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="error"
                    fontWeight="medium"
                    onClick={() => deleteItem(cate.id)}
                    sx={{
                        cursor: "pointer",
                        "&:hover": {
                            textDecoration: "underline",
                        },
                    }}
                >
                    <i className="bi bi-trash3"></i> Remove
                </ArgonTypography>
            </ArgonBox>
        ),
    }));

    const categoryTableData = {
        columns: [
            { name: "category", align: "left" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return categoryTableData;
};

CategoryTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default CategoryTable;
