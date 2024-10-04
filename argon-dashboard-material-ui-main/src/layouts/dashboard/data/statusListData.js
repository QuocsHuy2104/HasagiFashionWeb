import { Link } from "react-router-dom";
import ArgonTypography from "components/ArgonTypography";
import React from "react";

const statusTableData = {
  columns: [
    { name: "Color Name", align: "left" },
    { name: "Action", align: "center" },
  ],
  rows: [
    {
      "Color Name": "Ordering",
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

export default statusTableData;
