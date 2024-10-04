/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { colors } from "@mui/material";


function Size({ name, role }) {
    return (
        <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography variant="caption" fontWeight="medium" size="text">
                {name}
            </ArgonTypography>
            <ArgonTypography variant="caption" size="secondary">
                {role}
            </ArgonTypography>
        </ArgonBox>

    );
}

const colorsTableData = {
    columns: [
        { name: "sizename", align: "left" },
        { name: "action", align: "center" },
    ],

    rows: [
        {

            sizename: <Size icon="ShirtIcon" name="SHIRT" ms={5} />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            sizename: <Size name="PTROUSERS" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            sizename: <Size name="DRESS" org="Projects" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            sizename: <Size name="SKIRT" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            sizename: <Size name="SHOES" org="Executive" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
        {

            sizename: <Size name="HANDBAG" org="Developer" />,



            action: (
                <ArgonBox display="flex" alignItems="center" gap={1}>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'green' }}
                    >
                        <EditIcon sx={{ mr: 0.5 }} /> Edit
                    </ArgonTypography>
                    <ArgonTypography
                        component="a"
                        href="#"
                        variant="caption"
                        size="secondary"
                        fontWeight="medium"
                        sx={{ display: 'flex', alignItems: 'center', size: 'red' }}
                    >
                        <DeleteIcon sx={{ mr: 0.5 }} /> Delete
                    </ArgonTypography>
                </ArgonBox>
            ),
        },
    ],
};

export default colorsTableData;

