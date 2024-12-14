import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import ArgonInput from "../../../components/ArgonInput";
import ArgonButton from "../../../components/ArgonButton";
import ArgonBox from "../../../components/ArgonBox";
import ArgonTypography from "../../../components/ArgonTypography";
import Table from "../../../examples/Tables/Table";
import RoleTable from "./data";
import RolesService from "../../../services/RoleServices";
import { toast } from "react-toastify";
import Footer from "../../../examples/Footer";

function Role() {
  const [formData, setFormData] = useState({
    name: "",
  });

  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [errors, setErrors] = useState({ name: false }); // State to track validation errors

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RolesService.getAllRoles();
        console.log(response.data);
        setRoles(response.data || []);
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

  const validateForm = () => {
    const name = formData.name.trim();
    const hasNumbers = /\d/;
    let isValid = true;
    const newErrors = { name: false };

    if (!name) {
      newErrors.name = "Role name is required.";
      isValid = false;
    } else if (hasNumbers.test(name)) {
      newErrors.name = "Role name cannot contain numbers.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);

    try {
      let result;
      if (editingRole) {
        result = await RolesService.updateRole(formData.name, data);
        setRoles(roles.map(role => role.name === result.data.name ? result.data : role));
      } else {
        result = await RolesService.createRole(data);
        setRoles([...roles, result.data]);
      }
      toast.success("Role saved successfully");
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error.response ? error.response.data : error.message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
    });
    setErrors({ name: false });
  };

  const handleEditClick = (role) => {
    setFormData(role);
    setEditingRole(role);
  };

  const handleDeleteClick = async (name) => {
    try {
      await RolesService.deleteRole(name);
      setRoles(roles.filter(role => role.name !== name));
    } catch (error) {
      console.error("Error deleting role", error);
    }
  };

  const { columns, rows } = RoleTable({ onEditClick: handleEditClick, onDeleteClick: handleDeleteClick });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" p={3}>
              <ArgonTypography variant="h6">Danh sách vai trò</ArgonTypography>
            </ArgonBox>
            <ArgonBox
              sx={{
                "& .MuiTableRow-root:not(:last-child)": {
                  "& td": {
                    borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                      `${borderWidth[1]} solid ${borderColor}`,
                  },
                },
              }}
            >
              <Table columns={columns} rows={rows} />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Role;
