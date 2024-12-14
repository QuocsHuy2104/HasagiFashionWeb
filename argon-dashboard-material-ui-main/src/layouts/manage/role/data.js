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

    const rows = roles.map(role => ({
        VaiTro: (
            <Role
                name={role.name}
            />
        ),
    }));

    const roleTableData = {
        columns: [
            { name: "VaiTro", align: "left" },
        ],
        rows,
    };

    return roleTableData;
};

RoleTable.propTypes = {
    onEditClick: PropTypes.func.isRequired,
};

export default RoleTable;
