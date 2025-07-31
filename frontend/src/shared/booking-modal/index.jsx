/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Fade,
  Box,
  Typography,
  useTheme,
  Divider,
  LinearProgress,
  IconButton
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventIcon from '@mui/icons-material/Event';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const steps = [
  { label: 'Sender', icon: <PersonIcon /> },
  { label: 'Recipient', icon: <LocalShippingIcon /> },
  { label: 'Package', icon: <InventoryIcon /> },
  { label: 'Dates', icon: <EventIcon /> }
];

const BookingDialog = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [newPareclData, setNewParcelData] = useState({
    sender: { name: '', company: '', phone: '', email: '', address: '' },
    recipient: { name: '', company: '', phone: '', email: '', address: '' },
    packageDetails: { weight: '', dimensions: '', value: '', description: '' },
    dates: { pickup: '', estimated: '' },
    priority: 'normal'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (section, field, value) => {
    setNewParcelData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
    setErrors((prev) => ({ ...prev, [`${section}.${field}`]: '' }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (activeStep === 0) {
      if (!newPareclData.sender.name) newErrors['sender.name'] = 'Name is required';

      if (!newPareclData.sender.phone) newErrors['sender.phone'] = 'Phone is required';
      else if (!/^\d{10,15}$/.test(newPareclData.sender.phone)) newErrors['sender.phone'] = 'Invalid Phone Number';

      if (!newPareclData.sender.email) newErrors['sender.email'] = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newPareclData.sender.email)) newErrors['sender.email'] = 'Invalid Email';

      if (!newPareclData.sender.address) newErrors['sender.address'] = 'Address is required';
    } else if (activeStep === 1) {
      if (!newPareclData.recipient.name) newErrors['recipient.name'] = 'Name is required';

      if (!newPareclData.recipient.phone) newErrors['recipient.phone'] = 'Phone is required';
      else if (!/^\d{10,15}$/.test(newPareclData.recipient.phone)) newErrors['recipient.phone'] = 'Invalid Phone Number';

      if (!newPareclData.recipient.email) newErrors['recipient.email'] = 'Email is required';
      else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newPareclData.recipient.email)) newErrors['recipient.email'] = 'Invalid Email';

      if (!newPareclData.recipient.address) newErrors['recipient.address'] = 'Address is required';
    } else if (activeStep === 2) {
      if (!newPareclData.packageDetails.weight) newErrors['packageDetails.weight'] = 'Weight is required';
      if (!newPareclData.packageDetails.value) newErrors['packageDetails.value'] = 'Value is required';
    } else if (activeStep === 3) {
      if (!newPareclData.dates.pickup) newErrors['dates.pickup'] = 'Pickup date is required';
      if (!newPareclData.dates.estimated) newErrors['dates.estimated'] = 'Estimated date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (activeStep === steps.length - 1) {
      onSubmit(newPareclData);
      onClose();
      setActiveStep(0);
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Sender Information
            </Typography>
            <Divider />
            &nbsp;
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Name"
                  fullWidth
                  error={!!errors['sender.name']}
                  helperText={errors['sender.name']}
                  value={newPareclData.sender.name}
                  onChange={(e) => handleChange('sender', 'name', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Company (Optional)"
                  fullWidth
                  value={newPareclData.sender.company}
                  onChange={(e) => handleChange('sender', 'company', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone"
                  fullWidth
                  error={!!errors['sender.phone']}
                  helperText={errors['sender.phone']}
                  value={newPareclData.sender.phone}
                  onChange={(e) => handleChange('sender', 'phone', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  fullWidth
                  error={!!errors['sender.email']}
                  helperText={errors['sender.email']}
                  value={newPareclData.sender.email}
                  onChange={(e) => handleChange('sender', 'email', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  fullWidth
                  error={!!errors['sender.address']}
                  helperText={errors['sender.address']}
                  value={newPareclData.sender.address}
                  onChange={(e) => handleChange('sender', 'address', e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Recipient Information
            </Typography>
            <Divider />
            &nbsp;
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Name"
                  fullWidth
                  error={!!errors['recipient.name']}
                  helperText={errors['recipient.name']}
                  value={newPareclData.recipient.name}
                  onChange={(e) => handleChange('recipient', 'name', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Company (Optional)"
                  fullWidth
                  value={newPareclData.recipient.company}
                  onChange={(e) => handleChange('recipient', 'company', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone"
                  fullWidth
                  error={!!errors['recipient.phone']}
                  helperText={errors['recipient.phone']}
                  value={newPareclData.recipient.phone}
                  onChange={(e) => handleChange('recipient', 'phone', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Email"
                  fullWidth
                  error={!!errors['recipient.email']}
                  helperText={errors['recipient.email']}
                  value={newPareclData.recipient.email}
                  onChange={(e) => handleChange('recipient', 'email', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  fullWidth
                  error={!!errors['recipient.address']}
                  helperText={errors['recipient.address']}
                  value={newPareclData.recipient.address}
                  onChange={(e) => handleChange('recipient', 'address', e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Package Details
            </Typography>
            <Divider />
            &nbsp;
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Weight (KG)"
                  fullWidth
                  error={!!errors['packageDetails.weight']}
                  helperText={errors['packageDetails.weight']}
                  value={newPareclData.packageDetails.weight}
                  onChange={(e) => handleChange('packageDetails', 'weight', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Dimensions"
                  fullWidth
                  value={newPareclData.packageDetails.dimensions}
                  onChange={(e) => handleChange('packageDetails', 'dimensions', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Value"
                  fullWidth
                  error={!!errors['packageDetails.value']}
                  helperText={errors['packageDetails.value']}
                  value={newPareclData.packageDetails.value}
                  onChange={(e) => handleChange('packageDetails', 'value', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Description"
                  fullWidth
                  value={newPareclData.packageDetails.description}
                  onChange={(e) => handleChange('packageDetails', 'description', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newPareclData.priority}
                    label="Priority"
                    onChange={(e) => setNewParcelData((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </>
        );
      case 3:
        return (
          <>
            <Typography variant="h6" gutterBottom>
              Schedule Dates
            </Typography>
            <Divider />
            &nbsp;
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  type="datetime-local"
                  label="Pickup Date"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                  error={!!errors['dates.pickup']}
                  helperText={errors['dates.pickup']}
                  value={newPareclData.dates.pickup}
                  onChange={(e) => handleChange('dates', 'pickup', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  type="datetime-local"
                  label="Estimated Delivery"
                  slotProps={{
                    inputLabel: { shrink: true }
                  }}
                  fullWidth
                  error={!!errors['dates.estimated']}
                  helperText={errors['dates.estimated']}
                  value={newPareclData.dates.estimated}
                  onChange={(e) => handleChange('dates', 'estimated', e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  const currentStepLabel = steps[activeStep].label;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography variant="h5" fontWeight="300">
            Add New Parcel
          </Typography>
          <IconButton onClick={onClose}>
            {' '}
            <CloseIcon />{' '}
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                icon={step.icon}
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === activeStep ? 'bold' : 'normal',
                    color: index === activeStep ? 'primary.main' : 'text.secondary'
                  }
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Progress Bar */}
        <LinearProgress variant="determinate" value={((activeStep + 1) / steps.length) * 100} sx={{ mb: 2 }} />

        {/* Current Step Title */}
        <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 2, textAlign: 'center' }}>
          {currentStepLabel} Details
        </Typography>

        {/* Animated Form Container */}
        <Fade in key={activeStep} timeout={400}>
          <Box
            sx={{
              // p: 2,
              // borderRadius: 2,
              // backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f5f5f5'),
              // boxShadow: 3,
              transition: 'all 0.3s ease'
            }}
          >
            {renderStepContent()}
          </Box>
        </Fade>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'inherit'
          }}
        >
          Back
        </Button>
        <Box>
          <Button
            onClick={handleNext}
            variant="contained"
            color="primary"
            endIcon={activeStep === steps.length - 1 ? <CheckCircleIcon /> : <NavigateNextIcon />}
          >
            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
