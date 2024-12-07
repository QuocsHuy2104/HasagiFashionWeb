import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types';
import ArgonBox from 'components/ArgonBox';
import ArgonSelect from '../../../components/ArgonSelect';
import ArgonInput from "../../../components/ArgonInput";
import Typography from "@mui/material/Typography";
import { Button } from '@mui/material';
import { InputAdornment } from "@mui/material";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ProductDetailService from 'services/ProductDetailServices';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductFormDialog({ open, onClose, colors, sizes, initialData, productID, refreshData, updateQuantity, updatePrice }) {

  const [formData, setFormData] = React.useState({
    id: '',
    price: '',
    subDescription: '',
    colorId: '',
    sizeId: '',
    quantity: '',
    priceSize: '',
    productId: '',
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        price: initialData.price || '',
        subDescription: initialData.subDescription || '',
        colorId: initialData.colorId || '',
        sizeId: initialData.sizeId || '',
        quantity: initialData.quantity || '',
        priceSize: initialData.priceSize || '',
        productId: productID,
      });
    }
  }, [initialData, productID]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.subDescription) newErrors.subDescription = 'Description is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.priceSize) newErrors.priceSize = 'Price size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      colorId: Number(formData.colorId),
      sizeId: Number(formData.sizeId),
    };

    console.log('request form', payload)

    try {
      const resp = await ProductDetailService.updateDetail(payload.id, payload);
      if (resp && resp.data) {
        console.log('Update successful:', resp.data);
        refreshData();
        updateQuantity();
        updatePrice()
        onClose();
      } else {
        console.error('Unexpected response:', resp);
      }
    } catch (err) {
      console.error('Error during update:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-hidden={!open}
      aria-labelledby="product-form-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="product-form-dialog-title">Product Details</DialogTitle>
      <DialogContent>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit}>

          {/* Quantity & Pricing */}
          <ArgonBox display="flex" flexDirection="column" mt={3} p={2} mb={3} border="1px solid #ccc" borderRadius="8px">
            <Typography variant="h6" component="h2" fontWeight="bold" mb={3}>
              Quantity & Pricing
            </Typography>

            {/* Quantity Input */}
            <ArgonBox mb={3}>
              <ArgonInput
                type="number"
                placeholder="Quantity"
                name="quantity"
                size="large"
                fullWidth
                value={formData.quantity}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{
                  borderColor: errors.quantity ? 'red' : 'Gainsboro',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                }}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
              />
            </ArgonBox>

            {/* Price Input */}
            <ArgonBox display="flex" flexDirection="column" gap={3} mb={3}>
              <ArgonInput
                type="number"
                placeholder="Update price"
                name="price"
                size="large"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{
                  borderColor: errors.price ? 'red' : 'Gainsboro',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                error={Boolean(errors.price)}
                helperText={errors.price}
              />
            </ArgonBox>

            {/* Price Size Input */}
            <ArgonBox display="flex" flexDirection="column" gap={3} mb={3}>
              <ArgonInput
                type="number"
                placeholder="Update price size"
                name="priceSize"
                size="large"
                fullWidth
                value={formData.priceSize}
                onChange={handleChange}
                inputProps={{ min: 0 }}
                sx={{
                  borderColor: errors.priceSize ? 'red' : 'Gainsboro',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                error={Boolean(errors.priceSize)}
                helperText={errors.priceSize}
              />
            </ArgonBox>
          </ArgonBox>

          {/* Sub Description */}
          <ArgonBox mb={3}>
            <div className="custom-editor" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #ccc', padding: '8px' }}>
              <CKEditor
                editor={ClassicEditor}
                data={formData.subDescription}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setFormData(prevFormData => ({
                    ...prevFormData,
                    subDescription: data
                  }));
                }}
                config={{
                  placeholder: errors.subDescription || "Description",
                }}
                onReady={(editor) => {
                  const editorElement = editor.ui.view.editable.element;
                  editorElement.setAttribute('style', 'min-height: 100px');
                }}
              />
            </div>
          </ArgonBox>

          {/* Color and Size Selection */}
          <ArgonBox display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} my={3}>
            <ArgonBox width="100%">
              <ArgonSelect
                aria-label="Color"
                name="colorId"
                onChange={handleChange}
                value={formData.colorId}
                options={[
                  { value: "", label: errors.colorId ? errors.colorId : "Color" },
                  ...colors.map(color => ({ value: color.id, label: color.name }))
                ]}
                style={{
                  height: "60px",
                  borderRadius: "10px",
                  borderColor: errors.colorId ? 'red' : 'Gainsboro',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                  padding: '10px',
                  backgroundColor: 'white',
                  width: '100%',  // Ensure full width
                }}
              />
              {errors.colorId && <Typography color="error" variant="caption">{errors.colorId}</Typography>}
            </ArgonBox>

            <ArgonBox width="100%">
              <ArgonSelect
                aria-label="Size"
                name="sizeId"
                onChange={handleChange}
                value={formData.sizeId}
                options={[
                  { value: "", label: errors.sizeId ? errors.sizeId : "Size" },
                  ...sizes.map(size => ({ value: size.id, label: size.name }))
                ]}
                style={{
                  height: "60px",
                  borderRadius: "10px",
                  borderColor: errors.sizeId ? 'red' : 'Gainsboro',
                  borderWidth: '0.5px',
                  borderStyle: 'solid',
                  padding: '10px',
                  backgroundColor: 'white',
                  width: '100%',  // Ensure full width
                }}
              />
              {errors.sizeId && <Typography color="error" variant="caption">{errors.sizeId}</Typography>}
            </ArgonBox>
          </ArgonBox>

        </ArgonBox>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

ProductFormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  colors: PropTypes.array.isRequired,
  sizes: PropTypes.array.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    quantity: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priceSize: PropTypes.number,
    subDescription: PropTypes.string,
    colorId: PropTypes.number,
    sizeId: PropTypes.number,
    productId: PropTypes.number,
  }),
  productID: PropTypes.number.isRequired,
  refreshData: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  updatePrice: PropTypes.func.isRequired,
};
