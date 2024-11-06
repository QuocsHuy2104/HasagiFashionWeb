import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import ArgonBox from 'components/ArgonBox';
import ArgonSelect from '../../../components/ArgonSelect';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProductFormDialog({ open, onClose, colors, sizes, initialData }) {
  const [formData, setFormData] = React.useState({
    price: '',
    description: '',
    colorId: '',
    sizeId: '',
  });

  // Update formData whenever initialData changes
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        price: initialData.price || '',
        description: initialData.subDescription || '',
        colorId: initialData.colorId || '',
        sizeId: initialData.sizeId || '',
      });
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="product-form-dialog-title"
    >
      <DialogTitle id="product-form-dialog-title">Product Details</DialogTitle>
      <DialogContent>
        <ArgonBox component="form" role="form" onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            label="Price"
            name="price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <ArgonBox
            mb={3}
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
              <ArgonSelect
                aria-label="Color"
                name="colorId"
                value={formData.colorId}
                options={colors.map((color) => ({ value: color.id, label: color.name }))}
                onChange={(e) => handleChange({ target: { name: "colorId", value: e.value } })}
                style={{
                  height: "60px",
                  borderRadius: "10px",
                  borderColor: 'Gainsboro',
                  borderWidth: '0.5px',
                  padding: '10px',
                  backgroundColor: 'white',
                  width: '100%',
                }}
              />
            </ArgonBox>

            <ArgonBox width="100%" maxWidth={{ xs: '100%', sm: '48%' }}>
              <ArgonSelect
                aria-label="Size"
                name="sizeId"
                value={formData.sizeId}
                options={sizes.map((size) => ({ value: size.id, label: size.name }))}
                onChange={(e) => handleChange({ target: { name: "sizeId", value: e.value } })}
                style={{
                  height: "60px",
                  borderRadius: "10px",
                  borderColor: 'Gainsboro',
                  borderWidth: '0.5px',
                  padding: '10px',
                  backgroundColor: 'white',
                  width: '100%',
                }}
              />
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
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subDescription: PropTypes.string,
    colorId: PropTypes.string,
    sizeId: PropTypes.string,
  }),
};
