/* eslint-disable react/prop-types */
// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";



function Author({ image, name, email }) {
    return (
        <ArgonBox display="flex" alignItems="center" px={1} py={0.5}>
            <ArgonBox mr={2}>
                <ArgonAvatar src={image} alt={name} size="sm" variant="rounded" />
            </ArgonBox>
            <ArgonBox display="flex" flexDirection="column">
                <ArgonTypography variant="button" fontWeight="medium">
                    {name}
                </ArgonTypography>
                <ArgonTypography variant="caption" color="secondary">
                    {email}
                </ArgonTypography>
            </ArgonBox>
        </ArgonBox>
    );
}

function Function({ job, org }) {
    return (
        <ArgonBox display="flex" flexDirection="column">
            <ArgonTypography variant="caption" fontWeight="medium" color="text">
                {job}
            </ArgonTypography>
            <ArgonTypography variant="caption" color="secondary">
                {org}
            </ArgonTypography>
        </ArgonBox>
    );
}

const authorsTableData = {
    columns: [
        { name: "productname", align: "left" },
        { name: "color", align: "left" },
        { name: "size", align: "center" },
        { name: "image", align: "center" },
        { name: "quantity", align: "center" },
    ],

    rows: [

    ]
};

export default authorsTableData;
