/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Grid, Box, Chip, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentsIcon from '@mui/icons-material/Payments';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const ReviewForm = ({ formData }) => {
  const InfoSection = ({ title, icon, data }) => (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" sx={{ ml: 1 }}>
          {title}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6 }} key={key}>
            <Typography variant="caption" color="text.secondary" display="block">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Typography>
            <Typography variant="body1">{value || 'N/A'}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Review Booking Details
      </Typography>

      <InfoSection title="Sender Information" icon={<PersonIcon color="primary" />} data={formData.sender} />

      <InfoSection title="Receiver Information" icon={<PersonIcon color="primary" />} data={formData.recipient} />

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalShippingIcon color="primary" />
          <Typography variant="h6" sx={{ ml: 1 }}>
            Parcel Details
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Weight
            </Typography>
            <Typography variant="body1">{formData.packageDetails.weight} kg</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Dimensions
            </Typography>
            <Typography variant="body1">{formData.packageDetails.dimensions}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Description
            </Typography>
            <Typography variant="body1">{formData.packageDetails.description || '(No description provided)'}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<PriorityHighIcon />} label={`Priority: ${formData.priority}`} color="primary" variant="outlined" />
          <Chip icon={<PaymentsIcon />} label={`Payment: ${formData.paymentMethod}`} color="primary" variant="outlined" />
          {formData.packageDetails.value && (
            <Chip icon={<AttachMoneyIcon />} label={`Value: $${formData.packageDetails.value}`} color="primary" variant="outlined" />
          )}
        </Box>
      </Paper>
    </Box>
  );
};

ReviewForm.propTypes = {
  formData: PropTypes.object.isRequired
};

export default ReviewForm;
