/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { colors } from "@mui/material";


function Color({ name, role }) {
    return (
        <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography variant="caption" fontWeight="medium" color="text">
                {name}
            </ArgonTypography>
            <ArgonTypography variant="caption" color="secondary">
                {role}
            </ArgonTypography>
        </ArgonBox>

    );
}

const colorsTableData = {
    columns: [
        { name: "colorname", align: "left" },
        { name: "action", align: "center" },
    ],

    rows: [
        {

            colorname: <Color icon="ShirtIcon" name="SHIRT" ms={5} />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            colorname: <Color name="PTROUSERS" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            colorname: <Color name="DRESS" org="Projects" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            colorname: <Color name="SKIRT" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            colorname: <Color name="SHOES" org="Executive" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            colorname: <Color name="HANDBAG" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        color="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', color: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
    ],
};

export default colorsTableData;

