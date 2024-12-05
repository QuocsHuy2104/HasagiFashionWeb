
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import AccountService from 'services/AccountServices';

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonAvatar from "components/ArgonAvatar";
import ArgonBadge from "components/ArgonBadge";

import team2 from "assets/images/team-2.jpg";

import Switch from '@mui/material/Switch';

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

function Function({ job }) {
  return (
    <ArgonBox display="flex" flexDirection="column">
      <ArgonTypography variant="caption" fontWeight="medium" color="text">
        {job}
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

  useEffect(() => {
    AccountService.getAllAccounts()
      .then((resp) => setAccounts(resp.data || []))
      .catch((err) => {
        console.error(err);
      });
  }, []);

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
            return { ...acc, delete: !acc.delete };  // Revert the change
          }
          return acc;
        });

        setAccounts(revertedAccounts);
      });
  };

  const filteredAccounts = selectedRoles.length > 0
    ? filteredBySearch.filter((account) =>
      account.roleName.some((role) => selectedRoles.includes(role.name))
    )
    : filteredBySearch;

  const rows = filteredAccounts.map((account) => {
    const accountRoles = (account.roleName || [])
      .map((role) => role.name)
      .join(", ") || "No Roles";

    return {
      TaiKhoan: (
        <Author
          image={account.avatar ? account.avatar : team2}
          name={account.fullName}
          email={account.email}
        />
      ),
      VaiTro: <Function job={accountRoles} />,
      TrangThai: (
        <ArgonBadge
          variant="gradient"
          badgeContent={account.delete ? "Đã nghỉ" : "Còn làm"}
          color={account.delete ? "secondary" : "success"}
          size="xs"
        />
      ),
      ChinhSuaTrangThai: (
        <Switch
          checked={!account.delete}
          onChange={() => handleSwitchChange(account)}
        />
      ),
      ThaoTac: (
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
          <ArgonTypography
            px={1}
            component="span"
            variant="caption"
            color="info"
            fontWeight="medium"
            onClick={() => handleEditClick(account)}
          >
            <i className="bi bi-pencil-square"></i> Chỉnh sửa
          </ArgonTypography>
        </ArgonBox>
      ),
    };
  });

  const authorsTableData = {
    columns: [
      { name: "TaiKhoan", align: "left" },
      { name: "VaiTro", align: "left" },
      { name: "TrangThai", align: "center" },
      { name: "ChinhSuaTrangThai", align: "center" },
      { name: "ThaoTac", align: "center" },
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
