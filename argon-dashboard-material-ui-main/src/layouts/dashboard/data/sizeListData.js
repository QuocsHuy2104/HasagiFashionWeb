import { Link } from "react-router-dom";
import ArgonTypography from "components/ArgonTypography";
import React from "react";

const sizeTableData = {
  columns: [
    { name: "Size Name", align: "left" },
    { name: "Action", align: "center" },
  ],
  rows: [
    {
      "Size Name": "XL",
      Action: (
        <ArgonTypography
          component={Link}
          to="/manage/size/edit"
          variant="button"
          color="dark"
          fontWeight="bold"
          textGradient
        >
          Edit
        </ArgonTypography>
      ),
    },
  ],
};

export default sizeTableData;
