import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Table from 'react-bootstrap/Table';
import Button from '@mui/material/Button';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination } from "@mui/material";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ImageService from "services/ImageServices"; 
import Footer from "../../../examples/Footer";

function Image() {
  const [images, setImages] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null); // State for preview
  const [editingImage, setEditingImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productDetailId, setProductDetailId] = useState(""); // State for productDetailId
  const sizesPerPage = 5;

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedImageFile) {
      setSelectedImagePreview(URL.createObjectURL(selectedImageFile));
    } else {
      setSelectedImagePreview(null);
    }

    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImageFile]);

  const fetchImages = async () => {
    try {
      const response = await ImageService.getAllImages();
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images", error);
    }
  };


  const handleSave = async () => {
    if (!selectedImageFile) {
      alert("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("url", selectedImageFile);
    formData.append("productDetailId", productDetailId);

    try {
      if (editingImage) {
        await ImageService.updateImage(editingImage.id, formData);
        console.log('Image updated successfully');
        setImages(prevImages =>
          prevImages.map(image => image.id === editingImage.id ? { ...image, url: selectedImageFile.name, productDetailId } : image)
        );
        setEditingImage(null);
      } else {
        const response = await ImageService.createImage(formData);
        console.log('Image created successfully', response.data);
        setImages(prevImages => [response.data, ...prevImages]);
      }
      setSelectedImageFile(null);
      setSelectedImagePreview(null);
      setProductDetailId("");
    } catch (error) {
      console.error("Error saving image", error);
    }
  };



  const handleEdit = (image) => {
    setEditingImage(image);
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
    setProductDetailId(image.productDetailId || ""); // Set productDetailId for editing
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this image?',
      customUI: ({ onClose }) => (
        <div style={{
          width: '400px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{ marginBottom: '15px', fontSize: '24px', color: '#333' }}>Confirm</h1>
          <p style={{ marginBottom: '20px', fontSize: '18px', color: '#666' }}>Are you sure you want to delete this image?</p>
          <div>
            <button
              onClick={() => {
                ImageService.deleteImage(id)
                  .then(() => {
                    setImages(prevImages => prevImages.filter(image => image.id !== id));
                  })
                  .catch(err => console.error("Error deleting image", err));
                onClose();
              }}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#4caf50',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease'
              }}
            >
              Yes
            </button>
            <button
              onClick={onClose}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#f44336',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s ease'
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
    });
  };


  const indexOfLastImage = currentPage * sizesPerPage;
  const indexOfFirstImage = indexOfLastImage - sizesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ArgonBox py={3}>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox p={3}>
              <ArgonTypography variant="h6" mb={3}>Manage Image</ArgonTypography>
              <ArgonBox display="flex" flexDirection="column">
                <ArgonBox mb={3} mx={3} width={720}>
                  <ArgonInput
                    type="text"
                    value={productDetailId}
                    onChange={(e) => setProductDetailId(e.target.value)}
                    placeholder="Enter Product Detail ID"
                    size="large"
                  />
                </ArgonBox>
                <ArgonBox mb={3} mx={3} width={720}>
                  <ArgonInput
                    type="file"
                    onChange={(e) => setSelectedImageFile(e.target.files[0])}
                    size="large"
                  />
                </ArgonBox>
                {selectedImagePreview && (
                  <ArgonBox mb={3} mx={3} width={720}>
                    <img
                      src={selectedImagePreview}
                      alt="Selected"
                      width={200}
                      height={200}
                      style={{ objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </ArgonBox>
                )}
                <ArgonBox mb={3} mx={3} width={720}>
                  <ArgonButton
                    type="button"
                    onClick={handleSave}
                    size="large"
                    color="info"
                    disabled={!selectedImageFile}
                  >
                    {editingImage ? "Update" : "Save"}
                  </ArgonButton>
                </ArgonBox>
              </ArgonBox>
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>

      <ArgonBox>
        <ArgonBox mb={3}>
          <Card>
            <ArgonBox p={3}>
              <Table
                striped
                bordered
                hover
                variant="outlined"
                size="sm"
                style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}
              >
                <thead style={{ borderBottom: '1px solid #dee2e6' }}>
                  <tr align="center">
                    <th style={{ width: '20%', color: 'gray' }}>#</th>
                    <th style={{ width: '20%', color: 'gray' }}>Product Detail ID</th>
                    <th style={{ width: '30%', color: 'gray' }}>Image</th>
                    <th style={{ width: '30%', color: 'gray' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentImages.map((image, index) => (
                    <tr key={image.id}>
                      <td align="center">{indexOfFirstImage + index + 1}</td>
                      <td align="center">{image.productDetailId}</td>
                      <td align="center">
                        <img
                          src={image.url}
                          alt={`Image ${image.id}`}
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </td>
                      <td align="center">
                        <Button
                          variant="contained"
                          color="info"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(image)}
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(image.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination
                count={Math.ceil(images.length / sizesPerPage)}
                page={currentPage}
                onChange={handlePageChange}
              />
            </ArgonBox>
          </Card>
        </ArgonBox>
      </ArgonBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Image;
