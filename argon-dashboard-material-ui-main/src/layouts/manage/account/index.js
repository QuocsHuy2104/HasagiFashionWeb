import React, { useState, useEffect } from "react";

import { Card } from "@mui/material";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Table from "examples/Tables/Table";
import Footer from "examples/Footer";

import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";

import AuthorsTableData from "./data";
import MultipleSelectChip from "./chip";
import MultipleSelectCheckmarks from "./selectTag";
import UploadPhoto from "./uploadPhoto";

import RoleService from "../../../services/RoleServices";
import AccountService from "../../../services/AccountServices";
import PermissionService from "../../../services/PermissionServices";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Account() {
  const generateRandomPassword = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  };

  const [formData, setFormData] = useState({
    id: "",
    username: "",
    numberPhone: "",
    tabernacle: "",
    avatar: "",
    fullName: "",
    email: "",
    password: generateRandomPassword(12),
    roleId: [],
    permissionNames: [],
  });

  const [roles, setRoles] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState([]);

  const fetchAccounts = async () => {
    try {
      const accountsResp = await AccountService.getAllAccounts();
      setAccounts(accountsResp.data || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [rolesResp, permissionsResp] = await Promise.all([
          RoleService.getAllRoles(),
          PermissionService.getAllPermissions(),
        ]);

        setRoles(rolesResp.data || []);
        setPermissions(Array.isArray(permissionsResp.data) ? permissionsResp.data : []);
        fetchAccounts();
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          window.location.href = "/authentication/sign-in";
        } else {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleRoleChange = (selectedRoles) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      roleId: selectedRoles,
    }));
  };

  // const handlePermissionChange = (permissionName) => {
  //   setFormData((prevFormData) => {
  //     const newPermissions = prevFormData.permissionNames.includes(permissionName)
  //       ? prevFormData.permissionNames.filter((name) => name !== permissionName)
  //       : [...prevFormData.permissionNames, permissionName];
  //     return {
  //       ...prevFormData,
  //       permissionNames: newPermissions,
  //     };
  //   });
  // };

  const handleEditClick = (account) => {
    setFormData({
      id: account.id,
      username: account.username,
      numberPhone: account.numberPhone,
      tabernacle: account.tabernacle,
      avatar: account.avatar,
      fullName: account.fullName,
      email: account.email,
      roleId: account.roleName ? account.roleName.map((role) => role.name) : [],
      permissionNames: account.permissionNames || [],
    });
  };

  const handleFileUpload = (downloadURL) => {
    setFormData((prevData) => ({
      ...prevData,
      avatar: downloadURL,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AccountService.saveAccount(formData);
      setFormData({
        id: "",
        username: "",
        numberPhone: "",
        tabernacle: "",
        avatar: "",
        fullName: "",
        email: "",
        password: generateRandomPassword(12),
        roleId: [],
        permissionNames: [],
      });

      toast.success('Thêm nhân viên thành công')
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  const { columns, rows } = AuthorsTableData({
    onEditClick: handleEditClick,
    accounts: accounts || [],
    roles: roles || [],
    searchTerm,
    selectedRoles,
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchRoleChange = (newSelectedRoles) => {
    setSelectedRoles(newSelectedRoles);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <ArgonTypography variant="h6">Quản lý nhân viên</ArgonTypography>
            </ArgonBox>

            <ArgonBox
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="flex-start"
              m={3}
              component="form"
              role="form"
              onSubmit={handleSubmit}
            >
              <ArgonBox
                maxWidth={{ xs: "100%", md: 270 }}
                mx={4}
                mt={{ xs: 3, md: 0 }}
                mb={3}
                display="flex"
                justifyContent={{ xs: "center", md: "center" }}
              >
                <UploadPhoto onFileUpload={handleFileUpload} />
              </ArgonBox>

              <ArgonBox width={{ xs: "100%", md: "70%" }}>
                <ArgonBox mb={3} mx={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ArgonInput
                        type="text"
                        placeholder="Tên đăng nhập"
                        name="username"
                        size="large"
                        value={formData.username}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ArgonInput
                        type="text"
                        placeholder="Họ và Tên"
                        name="fullName"
                        size="large"
                        value={formData.fullName}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </ArgonBox>

                {/* Second row with Email and Tabernacle */}
                <ArgonBox mb={3} mx={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <ArgonInput
                        type="email"
                        placeholder="Email"
                        name="email"
                        size="large"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ArgonInput
                        type="text"
                        placeholder="Thường Trú"
                        name="tabernacle"
                        size="large"
                        value={formData.tabernacle}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </ArgonBox>

                <ArgonBox mb={3} mx={3}>
                  <ArgonInput
                    type="text"
                    placeholder="Số điện thoại"
                    name="numberPhone"
                    size="large"
                    value={formData.numberPhone}
                    onChange={handleChange}
                    fullWidth
                  />
                </ArgonBox>

                <ArgonBox mb={3} mx={3}>
                  <MultipleSelectChip
                    roles={roles}
                    selectedRoles={formData.roleId}
                    onChange={handleRoleChange}
                    fullWidth
                  />
                </ArgonBox>

                {/* <ArgonBox mb={3} mx={3}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      {permissions.length > 0 ? (
                        permissions.map((permission) => (
                          <Grid key={permission.name} item xs={6} sm={3}>
                            <ArgonBox>
                              <Checkbox
                                checked={formData.permissionNames.includes(permission.name)}
                                onChange={() => handlePermissionChange(permission.name)}
                                sx={{
                                  color: pink[800],
                                  "&.Mui-checked": {
                                    color: pink[500],
                                  },
                                }}
                              />
                              <ArgonTypography variant="caption" color="secondary" fontWeight="medium">
                                {permission.name}
                              </ArgonTypography>
                            </ArgonBox>
                          </Grid>
                        ))
                      ) : (
                        <ArgonBox mx={3}>
                          <ArgonTypography variant="caption" color="textSecondary">
                            No permissions available
                          </ArgonTypography>
                        </ArgonBox>
                      )}
                    </Grid>
                  </Box>
                </ArgonBox> */}

                <ArgonBox mb={3} mx={3} sx={{ width: { sm: "50%", md: "20%" } }}>
                  <ArgonButton type="submit" size="large" color="info" fullWidth>
                    {formData.id ? "Cập Nhật" : "Thêm"}
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>

        <ArgonBox mb={3}>
          <Card>
            <ArgonBox p={3} lineHeight={1}>
              <ArgonTypography variant="h6" fontWeight="medium">
                Danh sách nhân viên
              </ArgonTypography>
            </ArgonBox>
            <ArgonBox>
              <ArgonBox mx={6}>
                <Box sx={{ flexGrow: 1, m: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={4}>
                      <MultipleSelectCheckmarks
                        roles={roles}
                        selectedRoles={selectedRoles}
                        onRoleChange={handleSearchRoleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={8} md={8}>
                      <ArgonBox mx={{ xs: 0, sm: 2 }}>
                        <ArgonInput
                          type="search"
                          size="large"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          fullWidth
                          placeholder="Tìm kiếm"
                        />
                      </ArgonBox>
                    </Grid>
                  </Grid>
                </Box>
              </ArgonBox>
              {rows.length > 0 ? (
                <Table columns={columns} rows={rows} />
              ) : (
                <ArgonBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column"
                  sx={{
                    padding: "80px 24px",
                    borderRadius: "16px",
                    backgroundColor: "light",
                  }}
                >
                  <Box
                    component="img"
                    sx={{ height: 180, width: 180 }}
                    alt="Empty icon"
                    src="https://assets.minimals.cc/public/assets/icons/empty/ic-content.svg"
                  />
                  <ArgonTypography variant="h6" fontWeight="medium" color="secondary">
                    No Data
                  </ArgonTypography>
                </ArgonBox>
              )}
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Account;
