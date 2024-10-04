import React from "react";
import PropTypes from "prop-types";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";

const AuthorModal = ({ show, onClose, author, onSave }) => {
  if (!show) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <ArgonBox display="flex" flexDirection="column" p={2}>
          <ArgonTypography variant="h5">Edit Author</ArgonTypography>
          <ArgonBox my={2}>
            <label>Name:</label>
            <input type="text" defaultValue={author.name} />
          </ArgonBox>
          <ArgonBox my={2}>
            <label>Email:</label>
            <input type="email" defaultValue={author.email} />
          </ArgonBox>
          <ArgonBox display="flex" justifyContent="space-between" mt={2}>
            <ArgonButton onClick={onSave} color="success">Save</ArgonButton>
            <ArgonButton onClick={onClose} color="error">Cancel</ArgonButton>
          </ArgonBox>
        </ArgonBox>
      </div>
    </div>
  );
};

AuthorModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  author: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AuthorModal;
