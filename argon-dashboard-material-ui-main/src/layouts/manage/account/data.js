import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AccountService from "services/AccountServices";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";
import team2 from "assets/images/team-2.jpg";
import Switch from "@mui/material/Switch";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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

Author.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

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

Function.propTypes = {
  job: PropTypes.string.isRequired,
  org: PropTypes.string.isRequired,
};

const AuthorsTableData = ({ onEditClick, searchTerm = "", selectedRoles = [] }) => {
  const [accounts, setAccounts] = useState([]);

  const [author, setAuthor] = useState("");

  const getAuthor = async () => {
    try {
      const response = await AccountService.getAuthor();
      setAuthor(response.data);
    } catch (err) {
      console.error("Failed to fetch author:", err);
    }
  };

  const fetchAccounts = async () => {
    try {
      if (!author) return;

      const response = await AccountService.getAllAccounts();
      const accounts = response.data || [];
      const filteredAccounts = accounts.filter((account) => {
        const isUser = account.roleName?.some((role) => role.name === "USER");
        const isCurrentUser = String(account.id) === String(author.id);

        return !(isUser || isCurrentUser);
      });
      setAccounts(filteredAccounts);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        window.location.href = "/authentication/sign-in";
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getAuthor();
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [author]);

  const deleteItem = async (id) => {
    try {
      const res = await AccountService.deleteAccount(id);
      fetchAccounts();
      toast.success(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredBySearch = accounts.filter(
    (account) =>
      (account.fullName && account.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (account) => {
    onEditClick(account);
  };

  const handleSwitchChange = (account) => {
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === account.id) {
        return { ...acc, delete: !acc.delete };
      }
      return acc;
    });

    setAccounts(updatedAccounts);

    AccountService.dismissalAccount(account.id)
      .then((res) => {
        console.log(`Account ${account.id} updated successfully`);
      })
      .catch((err) => {
        console.log(`Error updating account ${account.id}`, err);

        const revertedAccounts = accounts.map((acc) => {
          if (acc.id === account.id) {
            return { ...acc, delete: !acc.delete }; // Revert the change
          }
          return acc;
        });

        setAccounts(revertedAccounts);
      });
  };

  const filteredAccounts =
    selectedRoles.length > 0
      ? filteredBySearch.filter((account) =>
          (account.roleName || []).some((role) => selectedRoles.includes(role.name))
        )
      : filteredBySearch;

  const rows = filteredAccounts.map((account) => {
    const accountRoles = (account.roleName || []).map((role) => role.name).join(", ") || "No Roles";

    return {
      "Thông tin": (
        <Author
          image={account.avatar ? account.avatar : team2}
          name={account.fullName}
          email={account.email}
        />
      ),
      "Chức vụ": <Function job={accountRoles} org="Organization" />,
      "Trạng thái": (
        <ArgonBadge
          variant="gradient"
          badgeContent={account.delete ? "inactive" : "active"}
          color={account.delete ? "secondary" : "success"}
          size="xs"
        />
      ),
      "Nghỉ việc": (
        <Switch checked={!account.delete} onChange={() => handleSwitchChange(account)} />
      ),
      "Thao tác": (
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
          <ArgonTypography
            px={1}
            component="span"
            variant="caption"
            color="info"
            fontWeight="medium"
            onClick={() => handleEditClick(account)}
          >
            <i className="bi bi-pencil-square"></i> Cập nhật
          </ArgonTypography>
          <ArgonTypography
            px={1}
            component="span"
            variant="caption"
            color="error"
            fontWeight="medium"
            onClick={() => deleteItem(account.id)}
          >
            <FontAwesomeIcon icon={faTrash} /> Xóa
          </ArgonTypography>
        </ArgonBox>
      ),
    };
  });

  const authorsTableData = {
    columns: [
      { name: "Thông tin", align: "left" },
      { name: "Chức vụ", align: "left" },
      { name: "Trạng thái", align: "center" },
      { name: "Nghỉ việc", align: "center" },
      { name: "Thao tác", align: "center" },
    ],
    rows,
  };

  return authorsTableData;
};

AuthorsTableData.propTypes = {
  onEditClick: PropTypes.func.isRequired,
  searchTerm: PropTypes.string,
  selectedRoles: PropTypes.array,
};

export default AuthorsTableData;
