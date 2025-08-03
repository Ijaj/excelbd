import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, InputAdornment, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import Straighten from '@mui/icons-material/Straighten';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import PaymentsIcon from '@mui/icons-material/Payments';

const ParcelDetailsForm = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    console.log(e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      packageDetails: { ...prev.packageDetails, [name]: value }
    }));
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Parcel Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            name="weight"
            label="Weight (kg)"
            type="number"
            value={formData.packageDetails.weight}
            onChange={handleChange}
            error={!!errors.weight}
            helperText={errors.weight}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <ScaleIcon color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="dimensions"
            label="Dimensions (L x W x H cm)"
            value={formData.packageDetails.dimensions}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Straighten color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            name="value"
            label="Declared Value ($)"
            type="number"
            value={formData.packageDetails.value}
            onChange={handleChange}
            error={!!errors.value}
            helperText={errors.value}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Priority Level</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Priority Level"
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PriorityHighIcon color="primary" />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="urgent">Urgent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              label="Payment Method"
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentsIcon color="primary" />
                    </InputAdornment>
                  )
                }
              }}
            >
              <MenuItem value="cod">Cash on Delivery</MenuItem>
              <MenuItem value="pre-paid">Pre-paid</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            name="description"
            label="Package Description"
            multiline
            value={formData.packageDetails.description}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

ParcelDetailsForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ParcelDetailsForm;
