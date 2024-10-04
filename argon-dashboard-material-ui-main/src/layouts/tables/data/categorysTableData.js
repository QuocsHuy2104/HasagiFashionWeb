/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";

// Icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShirtIcon from '@mui/icons-material/Watch'; // Ví dụ: biểu tượng áo
import PantsIcon from '@mui/icons-material/AccountBox'; // Ví dụ: biểu tượng quần
import ShoesIcon from '@mui/icons-material/LocalMall'; // Ví dụ: biểu tượng giày
import DressIcon from '@mui/icons-material/Star'; // Ví dụ: biểu tượng đầm
import SkirtIcon from '@mui/icons-material/Star'; // Ví dụ: biểu tượng váy
import BagIcon from '@mui/icons-material/ShoppingBag'; // Ví dụ: biểu tượng túi xách
import { colors } from "@mui/material";


function Category({ name, role }) {
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

const categorysTableData = {
    columns: [
        { name: "", align: "center" },
        { name: "categoryname", align: "left" },
        { name: "createdate", align: "center" },
        { name: "createby", align: "left" },
        { name: "action", align: "center" },
    ],

    rows: [
        {

            categoryname: <Category icon="ShirtIcon" name="SHIRT" ms={5} />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Lê Tuấn Kiệt" role="Admin" />,

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

            categoryname: <Category name="PTROUSERS" org="Developer" />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Nguyễn Vũ Đầy" role="Admin" />,

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

            categoryname: <Category name="DRESS" org="Projects" />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Đặng Vĩnh Kỳ" role="Admin" />,

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

            categoryname: <Category name="SKIRT" org="Developer" />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Nguyễn Hoàng Khang" role="User" />,

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

            categoryname: <Category name="SHOES" org="Executive" />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Nguyễn Minh Khanh" role="User" />,

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

            categoryname: <Category name="HANDBAG" org="Developer" />,
            createdate: (
                <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                    23/04/19
                </ArgonTypography>
            ),

            createby: <Category name="Dương Công Lập" role="User" />,

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

export default categorysTableData;

