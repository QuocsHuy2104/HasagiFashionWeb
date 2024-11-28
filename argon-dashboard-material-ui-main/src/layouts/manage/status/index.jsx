import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import StatusTable from "./data";
import StatussService from "../../../services/StatusServices";
import { toast, ToastContainer } from "react-toastify";

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


function Status() {
  const [formData, setFormData] = useState({
    id: "",
    status: "",
    slug: "",
  });

  const [statuss, setStatuss] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StatussService.getAllStatuss();
        setStatuss(response.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      status: formData.status,
      slug: slugify(formData.status),  // Generate slug
    };

    console.log("Slug being submitted:", data.slug);

    try {
      let result;
      if (formData.id) {
        result = await StatussService.updateStatus(formData.id, data);
        setStatuss(statuss.map((status) => (status.id === result.data.id ? result.data : status)));
      } else {
        result = await StatussService.createStatus(data);
        setStatuss([...statuss, result.data]);
      }
      toast.success("Status saved successfully");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };


  const resetForm = () => {
    setFormData({
      id: "",
      status: "",
      slug: "",
    });
  };

  const handleEditClick = (status) => {
    setFormData({
      id: status.id,
      status: status.status,
      slug: status.slug,
    });
  };

  const handleDeleteClick = async (id) => {
    try {
      await StatussService.deleteStatus(id);
      setStatuss(statuss.filter((status) => status.id !== id));
      toast.success("Status deleted successfully");
    } catch (error) {
      console.error("Error deleting status", error);
    }
  };

  const { columns, rows } = StatusTable({
    statuss,
    onEditClick: handleEditClick,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <ArgonBox mb={3}>
        <Card style={{ borderRadius: "100px" }}>
          <ArgonBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            component="form"
            role="form"
            onSubmit={handleSubmit}
          >
            <ArgonBox display="flex" justifyContent="flex-start" alignItems="center" width="100%">
              <ArgonBox mx={0.1} display="flex" alignItems="center" flexGrow={1}>
                <ArgonInput
                  type="text"
                  placeholder="Tên trạng thái"
                  size="large"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ marginRight: "16px", flexBasis: "300px", flexGrow: 1, borderRadius: "100px" }}
                />
                <ArgonButton
                  type="submit"
                  size="large"
                  color="info"
                  style={{ borderRadius: "100px", whiteSpace: "nowrap" }}
                >
                  {formData.id ? "Sửa" : "Thêm"}
                </ArgonButton>
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </Card>
      </ArgonBox>

      <ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderStatus } }) =>
                      `${borderWidth[1]} solid ${borderStatus}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
    </DashboardLayout>
  );
}

export default Status;
