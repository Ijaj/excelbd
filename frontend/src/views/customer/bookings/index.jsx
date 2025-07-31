import { useState, useMemo } from 'react';
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
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import {
  Search,
  FilterList,
  MoreVert,
  Add,
  LocalShipping,
  Schedule,
  LocationOn,
  Person,
  Phone,
  Email,
  Edit,
  Delete,
  Visibility,
  Cancel,
  CheckCircle,
  Warning,
  Info,
  Download,
  Print,
  Share,
  Refresh
} from '@mui/icons-material';
import { statusConfig, priorityConfig } from 'utils/constants';
import BookingDialog from 'shared/booking-modal';

const BookingsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // modal state
  const [modalOpen, setModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookingForMenu, setSelectedBookingForMenu] = useState(null);

  // dummy data
  const bookings = useMemo(
    () => [
      {
        id: 'BK001',
        trackingNumber: 'TRK123456789',
        status: 'in-transit',
        priority: 'high',
        sender: {
          name: 'John Smith',
          company: 'Tech Solutions Ltd',
          phone: '+1234567890',
          email: 'john@techsolutions.com',
          address: '123 Main St, New York, NY 10001'
        },
        recipient: {
          name: 'Sarah Johnson',
          company: 'Design Studio Inc',
          phone: '+0987654321',
          email: 'sarah@designstudio.com',
          address: '456 Oak Ave, Los Angeles, CA 90210'
        },
        packageDetails: {
          weight: '2.5 kg',
          dimensions: '30x20x15 cm',
          value: '$250',
          description: 'Electronics Equipment'
        },
        dates: {
          created: '2024-01-15T10:30:00Z',
          pickup: '2024-01-15T14:00:00Z',
          estimated: '2024-01-17T16:00:00Z'
        },
        timeline: [
          { status: 'created', timestamp: '2024-01-15T10:30:00Z', location: 'New York Hub' },
          { status: 'picked-up', timestamp: '2024-01-15T14:00:00Z', location: 'New York Hub' },
          { status: 'in-transit', timestamp: '2024-01-16T08:00:00Z', location: 'Chicago Hub' }
        ],
        cost: 45.99
      },
      {
        id: 'BK002',
        trackingNumber: 'TRK987654321',
        status: 'delivered',
        priority: 'normal',
        sender: {
          name: 'Mike Davis',
          company: 'Fashion Retail Co',
          phone: '+1122334455',
          email: 'mike@fashionretail.com',
          address: '789 Fashion St, Miami, FL 33101'
        },
        recipient: {
          name: 'Emily Chen',
          company: 'Personal',
          phone: '+5566778899',
          email: 'emily.chen@email.com',
          address: '321 Pine St, Seattle, WA 98101'
        },
        packageDetails: {
          weight: '1.2 kg',
          dimensions: '25x15x10 cm',
          value: '$120',
          description: 'Clothing Items'
        },
        dates: {
          created: '2024-01-10T09:15:00Z',
          pickup: '2024-01-10T11:30:00Z',
          delivered: '2024-01-12T15:45:00Z'
        },
        timeline: [
          { status: 'created', timestamp: '2024-01-10T09:15:00Z', location: 'Miami Hub' },
          { status: 'picked-up', timestamp: '2024-01-10T11:30:00Z', location: 'Miami Hub' },
          { status: 'in-transit', timestamp: '2024-01-11T07:00:00Z', location: 'Atlanta Hub' },
          { status: 'delivered', timestamp: '2024-01-12T15:45:00Z', location: 'Seattle Hub' }
        ],
        cost: 29.99
      },
      {
        id: 'BK003',
        trackingNumber: 'TRK456789123',
        status: 'pending',
        priority: 'urgent',
        sender: {
          name: 'Lisa Wang',
          company: 'Medical Supplies Inc',
          phone: '+2233445566',
          email: 'lisa@medicalsupplies.com',
          address: '555 Health Blvd, Boston, MA 02101'
        },
        recipient: {
          name: 'Dr. Robert Brown',
          company: 'City Hospital',
          phone: '+6677889900',
          email: 'r.brown@cityhospital.com',
          address: '100 Hospital Way, Philadelphia, PA 19101'
        },
        packageDetails: {
          weight: '5.0 kg',
          dimensions: '40x30x25 cm',
          value: '$800',
          description: 'Medical Equipment'
        },
        dates: {
          created: '2024-01-16T08:00:00Z',
          pickup: '2024-01-16T12:00:00Z',
          estimated: '2024-01-17T10:00:00Z'
        },
        timeline: [{ status: 'created', timestamp: '2024-01-16T08:00:00Z', location: 'Boston Hub' }],
        cost: 89.99
      }
    ],
    []
  );

  // search and sort server e korbo pore
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        !searchQuery ||
        booking.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.recipient.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Event handlers
  const handleMenuOpen = (event, booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBookingForMenu(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBookingForMenu(null);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleAction = (action, booking) => {
    console.log(`${action} booking:`, booking.id);
    handleMenuClose();
  };

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

  function handlenNewBooking(formData) {
    console.log(formData);
  }

  function openBookingModal() {
    setModalOpen(true);
  }

  function closeBookingModal() {
    setModalOpen(false);
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <BookingDialog open={modalOpen} onClose={closeBookingModal} onSubmit={handlenNewBooking} />
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
                <Button variant="outlined" startIcon={<Download />}>
                  Export
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Bookings Grid */}
        <Grid container spacing={3}>
          {filteredBookings.map((booking) => (
            <Grid size={{ xs: 12, lg: 6 }} key={booking.id}>
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
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {booking.trackingNumber}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip
                          icon={statusConfig[booking.status].icon}
                          label={statusConfig[booking.status].label}
                          color={statusConfig[booking.status].color}
                          size="small"
                        />
                        <Chip
                          label={priorityConfig[booking.priority].label}
                          color={priorityConfig[booking.priority].color}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    <IconButton onClick={(e) => handleMenuOpen(e, booking)} size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getStatusProgress(booking.status)}
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
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>S</Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          From
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.primary">
                        {booking.sender.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.sender.company}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main', fontSize: '0.75rem' }}>R</Avatar>
                        <Typography variant="body2" fontWeight={600}>
                          To
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.primary">
                        {booking.recipient.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {booking.recipient.company}
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
                        {booking.packageDetails.weight} • {booking.packageDetails.description}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={600} color="primary.main">
                      ${booking.cost}
                    </Typography>
                  </Box>

                  {/* Dates */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Created
                      </Typography>
                      <Typography variant="body2">{formatDate(booking.dates.created)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">
                        {booking.dates.delivered ? 'Delivered' : 'Estimated'}
                      </Typography>
                      <Typography variant="body2">{formatDate(booking.dates.delivered || booking.dates.estimated)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleViewDetails(selectedBookingForMenu)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('edit', selectedBookingForMenu)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Booking</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('share', selectedBookingForMenu)}>
            <ListItemIcon>
              <Share fontSize="small" />
            </ListItemIcon>
            <ListItemText>Share Tracking</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleAction('print', selectedBookingForMenu)}>
            <ListItemIcon>
              <Print fontSize="small" />
            </ListItemIcon>
            <ListItemText>Print Label</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleAction('cancel', selectedBookingForMenu)}>
            <ListItemIcon>
              <Cancel fontSize="small" />
            </ListItemIcon>
            <ListItemText>Cancel Booking</ListItemText>
          </MenuItem>
        </Menu>

        {/* Booking Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3 }
          }}
        >
          {selectedBooking && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>
                    Booking Details - {selectedBooking.trackingNumber}
                  </Typography>
                  <Chip
                    icon={statusConfig[selectedBooking.status].icon}
                    label={statusConfig[selectedBooking.status].label}
                    color={statusConfig[selectedBooking.status].color}
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
                        <Typography variant="body2">{selectedBooking.sender.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.sender.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.sender.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.sender.address}</Typography>
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
                        <Typography variant="body2">{selectedBooking.recipient.name}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.recipient.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.recipient.phone}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2">{selectedBooking.recipient.address}</Typography>
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
                        <Typography variant="body2">{selectedBooking.packageDetails.weight}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Dimensions
                        </Typography>
                        <Typography variant="body2">{selectedBooking.packageDetails.dimensions}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Value
                        </Typography>
                        <Typography variant="body2">{selectedBooking.packageDetails.value}</Typography>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 3 }}>
                        <Typography variant="caption" color="text.secondary">
                          Cost
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          ${selectedBooking.cost}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Tracking Timeline
                    </Typography>
                    <Timeline>
                      {selectedBooking.timeline.map((event, index) => (
                        <TimelineItem key={index}>
                          <TimelineSeparator>
                            <TimelineDot color="primary" />
                            {index < selectedBooking.timeline.length - 1 && <TimelineConnector />}
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
                <Button variant="contained" startIcon={<Edit />}>
                  Edit Booking
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default BookingsPage;
