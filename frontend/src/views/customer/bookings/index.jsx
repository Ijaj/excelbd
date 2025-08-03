import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  Fab,
  LinearProgress,
  CardActionArea
} from '@mui/material';
import { Search, Add, LocalShipping, Download, Refresh } from '@mui/icons-material';
import { statusConfig, priorityConfig } from 'utils/constants';
import BookingDetailDialog from 'components/booking-dialog';
import NewBookingModal from 'components/new-booking-modal';
import { service_createParcel, service_parcelsByEmail } from 'services/parcel-services';

import { useAuth } from 'hooks/AuthProvider';
import { useAlert } from 'hooks/Alart';
import { useConfirm } from 'hooks/Confirm ';
import { generateCustomerReport } from 'utils/customer-report';

const BookingsPage = () => {
  const { user } = useAuth();
  const notify = useAlert();
  const confirm = useConfirm();
  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // modal state
  const [modalOpen, setModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [parcels, setParcels] = useState([]); // This should be fetched from your API

  // fetch bookings for current user
  const fetchBookings = useCallback(async () => {
    try {
      const userParcels = await service_parcelsByEmail(user.email);
      if (!userParcels) {
        notify({
          message: 'Failed to fetch bookings. Please try again later.',
          type: 'error',
          duration: 6
        });
        return;
      }
      setParcels(userParcels);
    } catch (error) {
      notify({
        message: 'Failed to fetch bookings.' + error.message,
        type: 'error',
        duration: 6
      });
    }
  }, [notify, user.email]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, user.email]);

  useEffect(() => {
    if (!detailsOpen) {
      setSelectedParcel(null);
    }
  }, [detailsOpen]);

  function openDetailsDialog(event, parcel) {
    event.stopPropagation();
    setSelectedParcel(parcel);
    setDetailsOpen(true);
  }

  // search and sort server e korbo pore
  const filteredParcels = useMemo(() => {
    console.log(parcels);
    return parcels.filter((parcel) => {
      const matchesSearch =
        !searchQuery ||
        parcel.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parcel.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || parcel.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchQuery, statusFilter]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusProgress = (status) => {
    const progressMap = {
      pending: 10,
      'in-transit': 60,
      delivered: 100,
      cancelled: 0
    };
    return progressMap[status] || 0;
  };

  async function handleNewBooking(formData) {
    console.log(formData);
    const result = await service_createParcel(formData);
    if (result) {
      notify({
        message: 'Booking created successfully!',
        type: 'success',
        duration: 6
      });
      confirm({
        title: 'Booking Created',
        body: 'Your booking has been successfully created. Your Tracking number is ' + result.trackingNumber,
        buttons: 'ok',
        type: 'success',
        onPositive: () => {
          fetchBookings();
        }
      });
    } else {
      notify({
        message: 'Failed to create booking. Please try again.',
        type: 'error',
        duration: 6
      });
    }
    closeBookingModal();
  }

  function openBookingModal() {
    setModalOpen(true);
  }

  function closeBookingModal() {
    setModalOpen(false);
  }

  if (!user) {
    return (
      <Typography variant="h6" color="text.secondary">
        Please log in to view your bookings.
      </Typography>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <NewBookingModal open={modalOpen} onClose={closeBookingModal} onSubmit={handleNewBooking} />
      <Container
        maxWidth="xl"
        sx={{
          background: theme.palette.mode === 'dark' ? '#272727ff' : '#efefef',
          py: 2,
          borderRadius: theme.shape.borderRadius
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Bookings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your courier bookings in one place
          </Typography>
        </Box>

        {/* Filters and Search */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                placeholder="Search by tracking number, sender, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-transit">In Transit</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select value={dateFilter} label="Date Range" onChange={(e) => setDateFilter(e.target.value)} sx={{ borderRadius: 2 }}>
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" startIcon={<Refresh />} onClick={() => window.location.reload()}>
                  Refresh
                </Button>
                <Button variant="outlined" startIcon={<Download />} onClick={() => generateCustomerReport(filteredParcels)}>
                  Export
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Bookings Grid */}
        <Grid container spacing={3}>
          {filteredParcels.map((parcel) => (
            <Grid size={{ xs: 12, lg: 6 }} key={parcel.id}>
              <Card
                elevation={2}
                sx={{
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <CardActionArea onClick={(e) => openDetailsDialog(e, parcel)}>
                  <CardContent sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {parcel.trackingNumber}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            icon={statusConfig[parcel.status].icon}
                            label={statusConfig[parcel.status].label}
                            color={statusConfig[parcel.status].color}
                            size="small"
                          />
                          <Chip
                            label={priorityConfig[parcel.priority].label}
                            color={priorityConfig[parcel.priority].color}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Progress Bar */}
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress
                        variant="determinate"
                        value={getStatusProgress(parcel.status)}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          }
                        }}
                      />
                    </Box>

                    {/* Sender & Recipient */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>S</Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            From
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          {parcel.sender.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {parcel.sender.company}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main', fontSize: '0.75rem' }}>R</Avatar>
                          <Typography variant="body2" fontWeight={600}>
                            To
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.primary">
                          {parcel.recipient.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {parcel.recipient.company}
                        </Typography>
                      </Grid>
                    </Grid>

                    {/* Package Details */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Package Details
                        </Typography>
                        <Typography variant="body2">
                          {parcel.packageDetails.weight} • {parcel.packageDetails.description}
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        ${parcel.cost}
                      </Typography>
                    </Box>

                    {/* Dates */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Created
                        </Typography>
                        <Typography variant="body2">{formatDate(parcel.dates.created)}</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                          {parcel.dates.delivered ? 'Delivered' : 'Estimated'}
                        </Typography>
                        <Typography variant="body2">{formatDate(parcel.dates.delivered || parcel.dates.estimated)}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredParcels.length === 0 && (
          <Paper
            elevation={1}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'background.paper'
            }}
          >
            <LocalShipping sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first booking to get started'}
            </Typography>
            <Button variant="contained" startIcon={<Add />}>
              Create New Booking
            </Button>
          </Paper>
        )}

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
          }}
          onClick={openBookingModal}
        >
          <Add />
        </Fab>

        {/* Booking Details Dialog */}
        <BookingDetailDialog detailsOpen={detailsOpen} setDetailsOpen={setDetailsOpen} selectedBooking={selectedParcel} />
      </Container>
    </Box>
  );
};

export default BookingsPage;
