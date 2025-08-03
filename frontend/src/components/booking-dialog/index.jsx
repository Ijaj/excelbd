/* eslint-disable react/prop-types */
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Stack, Chip } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent } from '@mui/lab';

import { Person, Email, Phone, LocationOn } from '@mui/icons-material';
import { statusConfig } from 'utils/constants';
import { memo, useEffect, useState } from 'react';
import { service_parcelByTrackingNumber } from 'services/parcel-services';

// Helper function to format date
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

function BookingDetailDialog({ detailsOpen, setDetailsOpen, selectedBooking }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (detailsOpen && selectedBooking) {
        const bookingDetails = await service_parcelByTrackingNumber(selectedBooking.trackingNumber);
        setDetails(bookingDetails);
      }
    };

    fetchDetails();
  }, [detailsOpen, selectedBooking]);
  return (
    <Dialog
      open={detailsOpen}
      onClose={() => setDetailsOpen(false)}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 }
        }
      }}
    >
      {details && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight={600}>
                Booking Details - {details.trackingNumber}
              </Typography>
              <Chip
                icon={statusConfig[details.status].icon}
                label={statusConfig[details.status].label}
                color={statusConfig[details.status].color}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Sender Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">{details.sender.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{details.sender.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{details.sender.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{details.sender.address}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Recipient Information
                </Typography>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">{details.recipient.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email fontSize="small" color="action" />
                    <Typography variant="body2">{details.recipient.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{details.recipient.phone}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2">{details.recipient.address}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Package Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Weight
                    </Typography>
                    <Typography variant="body2">{details.packageDetails.weight}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Dimensions
                    </Typography>
                    <Typography variant="body2">{details.packageDetails.dimensions}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Value
                    </Typography>
                    <Typography variant="body2">{details.packageDetails.value}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cost
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ${details.cost}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Tracking Timeline
                </Typography>
                <Timeline>
                  {details.timeline.map((event, index) => (
                    <TimelineItem key={index}>
                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        {index < details.timeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="body2" fontWeight={600}>
                          {statusConfig[event.status]?.label || event.status}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.timestamp)} • {event.location}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}

export default memo(BookingDetailDialog);
