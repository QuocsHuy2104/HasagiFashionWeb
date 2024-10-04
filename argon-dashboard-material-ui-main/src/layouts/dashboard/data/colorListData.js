import { Link } from "react-router-dom";
import ArgonTypography from "components/ArgonTypography";
import React from "react";

const colorTableData = {
  columns: [
    { name: "Color Name", align: "left" },
    { name: "Action", align: "center" },
  ],
  rows: [
    {
      "Color Name": "Red",
      Action: (
        <ArgonTypography
          component={Link}
          to="/manage/color/edit"
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

export default colorTableData;
