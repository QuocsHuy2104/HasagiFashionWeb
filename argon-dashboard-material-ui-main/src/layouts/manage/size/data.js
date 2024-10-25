import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import SizesService from "../../../services/SizeServices";

// Component to display size information
function Size({ name }) {
    return (
        <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography variant="button" fontWeight="medium" size="textPrimary">
                {name}
            </ArgonTypography>
        </ArgonBox>
    );
}

Size.propTypes = {
    name: PropTypes.string.isRequired,
};


// Main SizeTable component
const SizeTable = ({ onEditClick }) => {
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SizesService.getAllSizes();
                setSizes(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const deleteItem = async (id) => {
        try {
            await SizesService.deleteSize(id);
            setSizes(sizes.filter(size => size.id !== id));
            toast.success("Delete size successful");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
            toast.error("Error deleting size");
        }
    };

    const rows = sizes.map(size => ({
        size: <Size name={size.name} />,
        action: (
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
                <ArgonTypography
                    px={1}
                    component="span"
                    variant="caption"
                    color="info"
                    fontWeight="medium"
                    onClick={() => onEditClick(size)} // Directly use onEditClick from props
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
                    onClick={() => deleteItem(size.id)}
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

    const sizeTableData = {
        columns: [
            { name: "size", align: "left" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return sizeTableData;
};

SizeTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default SizeTable;
