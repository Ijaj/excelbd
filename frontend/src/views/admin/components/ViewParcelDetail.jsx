/* eslint-disable react/prop-types */
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function ViewParcelDetails({ viewDialogOpen, setViewDialogOpen, selectedParcel, getStatusChip, getPriorityChip }) {
  return (
    <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DialogTitle>Parcel Details</DialogTitle>
      </Box>
      <DialogContent>
        {selectedParcel && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Tracking Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Tracking Number:</strong> {selectedParcel.trackingNumber}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Parcel ID:</strong> {selectedParcel.id}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Status:</strong> {getStatusChip(selectedParcel.status)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Priority:</strong> {getPriorityChip(selectedParcel.priority)}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Current Location:</strong> {selectedParcel.location}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="secondary">
                  Package Details
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Weight:</strong> {selectedParcel.packageDetails.weight}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Dimensions:</strong> {selectedParcel.packageDetails.dimensions}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Value:</strong> {selectedParcel.packageDetails.value}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {selectedParcel.packageDetails.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Shipping Cost:</strong> ${selectedParcel.cost}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="success.main">
                  Sender Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedParcel.sender.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Company:</strong> {selectedParcel.sender.company}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedParcel.sender.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {selectedParcel.sender.phone}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom color="info.main">
                  Recipient Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Name:</strong> {selectedParcel.recipient.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Company:</strong> {selectedParcel.recipient.company}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Email:</strong> {selectedParcel.recipient.email}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {selectedParcel.recipient.phone}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
