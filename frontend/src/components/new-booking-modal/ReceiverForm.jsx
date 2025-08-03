import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, InputAdornment, Typography, Paper } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';

const ReceiverForm = ({ formData, setFormData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recipient: { ...prev.recipient, [name]: value }
    }));
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Receiver Information
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            name="name"
            label="Full Name"
            value={formData.recipient.name}
            onChange={handleChange}
            error={!!errors.receiverName}
            helperText={errors.receiverName}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="company"
            label="Company Name"
            value={formData.recipient.company}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="primary" />
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
            name="email"
            label="Email"
            type="email"
            value={formData.recipient.email}
            onChange={handleChange}
            error={!!errors.receiverEmail}
            helperText={errors.receiverEmail}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
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
            name="phone"
            label="Phone Number"
            value={formData.recipient.phone}
            onChange={handleChange}
            error={!!errors.receiverPhone}
            helperText={errors.receiverPhone}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="primary" />
                  </InputAdornment>
                )
              }
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            fullWidth
            name="address"
            label="Address"
            multiline
            value={formData.recipient.address}
            onChange={handleChange}
            error={!!errors.receiverAddress}
            helperText={errors.receiverAddress}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <HomeIcon color="primary" />
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

ReceiverForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ReceiverForm;
