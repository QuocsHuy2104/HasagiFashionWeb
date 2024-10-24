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

  useEffect(() => {
    AccountService.getAllAccounts()
      .then((resp) => setAccounts(resp.data || []))
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          window.location.href = "/authentication/sign-in";
        } else {
          console.error(err);
        }
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
    // Optimistically update the account's status in the UI
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === account.id) {
        return { ...acc, delete: !acc.delete };
      }
      return acc;
    });

    setAccounts(updatedAccounts);

    // Log account details
    console.log("Account ID:", account.id);
    console.log("Delete status:", account.delete);

    // Make API call to update dismissal status
    AccountService.dismissalAccount(account.id)
      .then((res) => {
        console.log(`Account ${account.id} updated successfully`);
      })
      .catch((err) => {
        console.log(`Error updating account ${account.id}`, err);

        // Revert optimistic UI change in case of error
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
      author: (
        <Author
          image={account.avatar ? account.avatar : team2}
          name={account.fullName}
          email={account.email}
        />
      ),
      function: <Function job={accountRoles} org="Organization" />,
      status: (
        <ArgonBadge
          variant="gradient"
          badgeContent={account.delete ? "inactive" : "active"}
          color={account.delete ? "secondary" : "success"}
          size="xs"
        />
      ),
      dismissal: (
        <Switch
          checked={!account.delete}
          onChange={() => handleSwitchChange(account)}
        />
      ),
      action: (
        <ArgonBox display="flex" justifyContent="space-between" alignItems="center">
          <ArgonTypography
            px={1}
            component="span"
            variant="caption"
            color="info"
            fontWeight="medium"
            onClick={() => handleEditClick(account)}
          >
            <i className="bi bi-pencil-square"></i> Edit
          </ArgonTypography>
          <ArgonTypography
            px={1}
            component="span"
            variant="caption"
            color="error"
            fontWeight="medium"
            onClick={() => deleteItem(account.id)}
          >
            <i className="bi bi-trash3"></i> Remove
          </ArgonTypography>
        </ArgonBox>
      ),
    };
  });

  const authorsTableData = {
    columns: [
      { name: "author", align: "left" },
      { name: "function", align: "left" },
      { name: "status", align: "center" },
      { name: "dismissal", align: "center" },
      { name: "action", align: "center" },
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