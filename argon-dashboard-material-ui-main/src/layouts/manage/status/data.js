import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer  } from "react-toastify";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import StatussService from "../../../services/StatusServices";


const slugify = (text) => {
  if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d") 
      .replace(/Đ/g, "d") 
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  

function Status({ name }) {
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

Status.propTypes = {
  name: PropTypes.string.isRequired,
};

const StatusTable = ({ onEditClick, onDeleteClick }) => {
  const [statuss, setStatuss] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StatussService.getAllStatuses();
        setStatuss(response.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (status) => {
    onEditClick(status);
  };

  const handleDeleteClick = async (id) => {
    try {
      await StatussService.deleteStatus(id);
      setStatuss(statuss.filter((status) => status.id !== id));
      toast.success("Delete status successful");
    } catch (error) {
      console.error("Error deleting status", error);
      toast.error("Error deleting status");
    }
  };

  const rows = statuss.map((status) => ({
    status: <Status name={status.status} />,
    slug: slugify(status.status), // Generate slug from status name
    action: (
      <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
        <ArgonTypography
          px={1}
          component="span"
          variant="caption"
          color="info"
          fontWeight="medium"
          onClick={() => handleEditClick(status)}
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
          onClick={() => handleDeleteClick(status.id)}
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

  const statusTableData = {
    columns: [
      { name: "status", align: "left", flex: 8 },
      { name: "slug", align: "left", flex: 8 }, // Add the slug column
      { name: "action", align: "center", flex: 2 },
    ],
    rows,
  };

  return statusTableData;
};

StatusTable.propTypes = {
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default StatusTable;
