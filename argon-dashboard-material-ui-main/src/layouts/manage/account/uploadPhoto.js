import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// Custom styles for the upload container
const UploadContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    borderRadius: "50%",
    border: "2px dashed #D3D3D3",
    backgroundColor: "#F8F9FA",
    height: "250px",
    width: "250px",
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",
    "&:hover .overlay": {
        opacity: 1,
    },
}));

const HiddenInput = styled("input")({
    display: "none",
});

const Overlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    color: "#fff",
    borderRadius: "50%",
    opacity: 0, // Initially hidden
    transition: "opacity 0.3s ease",
}));

const UploadPhoto = ({ onFileUpload }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false); 

    const handleUpload = (event) => {
        const file = event.target.files[0];
        const fileSizeLimit = 3 * 1024 * 1024; 

        if (file) {
            if (file.size > fileSizeLimit) {
                setError("File size should not exceed 3 MB");
                return;
            }

            setError("");
            setUploading(true);

            // Display the image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload the file to Firebase
            const storage = getStorage();
            const storageRef = ref(storage, `avatars/${file.name}`); // Use avatars folder
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  console.log(`Upload is ${progress}% done`);
              },
              (error) => {
                  console.error("Error uploading file:", error);
                  setError("Error uploading file.");
                  setUploading(false);
              },
              async () => {
                  try {
                      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                      setUploading(false);
                      console.log("File available at:", downloadURL);

                      onFileUpload(downloadURL); 
                  } catch (error) {
                      console.error("Error getting download URL:", error);
                      setError("Error getting the download URL.");
                      setUploading(false);
                  }
              }
            );
        }
    };

    return (
      <Box textAlign="center">
          <UploadContainer component="label">
              <HiddenInput
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/gif"
                onChange={handleUpload}
              />
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Selected Image"
                  sx={{
                      objectFit: "cover",
                      borderRadius: "50%",
                  }}
                />
              ) : (
                <CloudUploadIcon style={{ fontSize: 50, color: "#9E9E9E" }} />
              )}

              <Overlay className="overlay">
                  <CloudUploadIcon style={{ fontSize: 50, marginBottom: 8 }} />
                  <Typography variant="body1">Tải lên ảnh</Typography>
              </Overlay>
          </UploadContainer>

          {uploading && (
            <Typography variant="caption" sx={{ color: "blue", mt: 1, display: "block" }}>
                Đang tải lên...
            </Typography>
          )}

          {error && (
            <Typography variant="caption" sx={{ color: "red", mt: 1, display: "block" }}>
                {error}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{ color: "#9E9E9E", mt: 1, display: "block" }}
          >
              chọn ảnh *.jpeg, *.jpg, *.png, *.gif <br />
              tối đa of 3 Mb
          </Typography>
      </Box>
    );
};

UploadPhoto.propTypes = {
    onFileUpload: PropTypes.func.isRequired, // Call parent function when upload is complete
};

export default UploadPhoto;