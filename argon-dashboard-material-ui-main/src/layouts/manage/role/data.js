import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import RolesService from "../../../services/RoleServices";

function Role({ name }) {
    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            <ArgonBox display="flex" flexDirection="column">
                <ArgonTypography variant="button" fontWeight="medium" color="textPrimary">
                    {name}
                </ArgonTypography>
            </ArgonBox>
        </ArgonBox>
    );
}


Role.propTypes = {
    name: PropTypes.string.isRequired,
};

const RoleTable = ({ onEditClick }) => {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await RolesService.getAllRoles();
                setRoles(response.data || []);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (role) => {
        onEditClick(role);
    };

    const deleteItem = async (name) => {
        try {
            await RolesService.deleteRole(name);
            setRoles(roles.filter(role => role.name !== name));
            toast.success("Delete role successful");
        } catch (error) {
            console.error("There was an error deleting the item!", error);
            toast.error("Error deleting role");
        }
    };

    const rows = roles.map(role => ({
        role: (
            <Role
                name={role.name}
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
                    onClick={() => handleEditClick(role)}
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
                    onClick={() => deleteItem(role.name)}
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

    const roleTableData = {
        columns: [
            { name: "role", align: "left" },
            { name: "action", align: "center" },
        ],
        rows,
    };

    return roleTableData;
};

RoleTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default RoleTable;
