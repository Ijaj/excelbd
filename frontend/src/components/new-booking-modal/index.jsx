import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Button,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import SenderForm from './SenderForm';
import ReceiverForm from './ReceiverForm';
import ParcelDetailsForm from './ParcelDetailsForm';
import ReviewForm from './ReviewForm';

const steps = [
  { label: 'Sender Details', icon: <PersonIcon /> },
  { label: 'Receiver Details', icon: <GroupIcon /> },
  { label: 'Parcel Information', icon: <LocalShippingIcon /> },
  { label: 'Review & Submit', icon: <AssignmentTurnedInIcon /> }
];

const initialFormState = {
  priority: 'normal',
  sender: {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  },
  recipient: {
    name: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  },
  packageDetails: {
    weight: '',
    dimensions: '',
    value: '',
    description: ''
  },
  paymentMethod: 'cod'
};

const NewBookingModal = ({ open, onClose, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Sender validation
        if (!formData.sender.name) newErrors.senderName = 'Name is required';
        if (!formData.sender.phone) newErrors.senderPhone = 'Phone is required';
        if (!formData.sender.address) newErrors.senderAddress = 'Address is required';
        if (!formData.sender.email && !/\S+@\S+\.\S+/.test(formData.sender.email)) {
          newErrors.senderEmail = 'Invalid email format';
        }
        break;

      case 1: // Receiver validation
        if (!formData.recipient.name) newErrors.receiverName = 'Name is required';
        if (!formData.recipient.phone) newErrors.receiverPhone = 'Phone is required';
        if (!formData.recipient.address) newErrors.receiverAddress = 'Address is required';
        if (!formData.recipient.email && !/\S+@\S+\.\S+/.test(formData.recipient.email)) {
          newErrors.receiverEmail = 'Invalid email format';
        }
        break;

      case 2: // Parcel validation
        if (!formData.packageDetails.weight) newErrors.weight = 'Weight is required';
        if (!formData.packageDetails.value) newErrors.value = 'Value is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(activeStep)) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData(initialFormState);
    setErrors({});
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <SenderForm formData={formData} setFormData={setFormData} errors={errors} />;
      case 1:
        return <ReceiverForm formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <ParcelDetailsForm formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <ReviewForm formData={formData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle component={'div'} sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center' }}>
        <LocalShippingIcon sx={{ mr: 1 }} />
        <Typography variant="h6">New Booking</Typography>
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel
                  slotProps={{
                    stepIcon: () => (
                      <Box
                        sx={{
                          color: activeStep >= index ? 'primary.main' : 'grey.400',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {step.icon}
                      </Box>
                    )
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4, mb: 2 }}>
            {activeStep === steps.length ? (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Booking Complete!
                </Typography>
                <Button onClick={() => setActiveStep(0)} startIcon={<LocalShippingIcon />}>
                  Create New Booking
                </Button>
              </Box>
            ) : (
              <Box>{getStepContent(activeStep)}</Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          endIcon={activeStep === steps.length - 1 ? <SendIcon /> : <ArrowForwardIcon />}
        >
          {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

NewBookingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default NewBookingModal;
