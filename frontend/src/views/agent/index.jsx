/* eslint-disable react/prop-types */
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { MaterialReactTable, MRT_ActionMenuItem, useMaterialReactTable } from 'material-react-table';
import { statusConfig, priorityConfig, paymentMethods } from 'utils/constants';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { service_parcelsByAgent, service_updateParcel } from 'services/parcel-services';
import { useAlert } from 'hooks/Alart';
import { useAuth } from 'hooks/AuthProvider';
import BookingDetailDialog from 'components/booking-dialog';

export default function AgentDashboard() {
  const { user } = useAuth();
  const notify = useAlert();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [note, setNote] = useState(''); // Add notes state near other state declarations
  const [agentParcels, setAgentParcels] = useState([]);
  const [stats, setStats] = useState({
    totalParcels: 0,
    pending: 0,
    picked: 0,
    delivered: 0
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMenuParcel, setSelectedMenuParcel] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchAgentParcels = useCallback(async () => {
    const parcels = await service_parcelsByAgent(user._id);
    if (parcels && Array.isArray(parcels)) {
      setAgentParcels(parcels);
    } else {
      notify({ message: 'Failed to fetch parcels. ' + parcels.message, severity: 'error', duration: 6 });
    }
  }, [user._id, notify]);

  useEffect(() => {
    fetchAgentParcels();
  }, [fetchAgentParcels]);

  useEffect(() => {
    setStats({
      totalParcels: agentParcels.length,
      pending: agentParcels.filter((p) => p.status === 'pending').length,
      picked: agentParcels.filter((p) => p.status === 'picked-up').length,
      delivered: agentParcels.filter((p) => p.status === 'delivered').length
    });
  }, [agentParcels]);

  const handleOpenDialog = (parcel) => {
    setSelectedParcel(parcel);
    setNewStatus(parcel.status);
    setNote(''); // Reset notes when opening dialog
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedParcel(null);
    setNewStatus('');
    setNote(''); // Reset notes when closing dialog
  };

  const handleStatusUpdate = async () => {
    if (selectedParcel && newStatus) {
      const result = await service_updateParcel(selectedParcel.trackingNumber, {
        status: newStatus,
        note: note.trim() // Include notes in the update
      });
      if (!result) {
        notify({ message: 'Failed to update parcel status', severity: 'error', duration: 6 });
        return;
      }
      notify({ message: 'Parcel status updated successfully', severity: 'success', duration: 6 });
      fetchAgentParcels();
      setAgentParcels((prevParcels) =>
        prevParcels.map((parcel) => (parcel._id === selectedParcel._id ? { ...parcel, status: newStatus } : parcel))
      );
      handleCloseDialog();
    }
  };

  const handleViewParcel = (parcel) => {
    setSelectedMenuParcel(parcel);
    setDetailsOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking Number',
        size: 150
      },
      {
        accessorKey: 'recipient.name',
        header: 'Recipient',
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.original.recipient.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.original.recipient.company}
            </Typography>
          </Box>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            color={statusConfig[cell.getValue()].color}
            icon={statusConfig[cell.getValue()].icon}
            label={statusConfig[cell.getValue()].label}
          />
        )
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100,
        Cell: ({ cell }) => (
          <Chip
            size="small"
            color={priorityConfig[cell.getValue()].color}
            label={priorityConfig[cell.getValue()].label}
            variant="outlined"
          />
        )
      },
      {
        accessorKey: 'location',
        header: 'Location',
        size: 120
      },
      {
        accessorKey: 'cost',
        header: 'Amount',
        size: 120
      },
      {
        accessorKey: 'paymentMethod',
        header: 'Payment Method',
        size: 120,
        Cell: ({ cell }) => <Typography>{paymentMethods[cell.getValue()].label}</Typography>
      },
      {
        accessorKey: 'dates.estimated',
        header: 'Est. Delivery',
        size: 120,
        Cell: ({ cell }) => <Typography variant="body2">{new Date(cell.getValue()).toLocaleDateString()}</Typography>
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 80,
        enableSorting: false,
        Cell: ({ row }) => (
          <Box>
            <IconButton size="small" onClick={(e) => handleMenuOpen(e, row.original)} disabled={row.original.status === 'cancelled'}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        )
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: agentParcels,
    enableColumnFilterModes: true,
    enableFacetedValues: true,
    enableRowSelection: false,
    enableFullScreenToggle: true,
    enableDensityToggle: true,
    initialState: {
      density: 'compact',
      showColumnFilters: false,
      showGlobalFilter: true
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    renderRowActionMenuItems: ({ table, row, closeMenu }) => [
      <MRT_ActionMenuItem
        table={table}
        icon={<VisibilityIcon />}
        key="view"
        label="View Details"
        onClick={() => {
          handleViewParcel(row.original);
          closeMenu();
        }}
      />,
      <MRT_ActionMenuItem
        table={table}
        icon={<EditIcon />}
        key="edit"
        label="Edit Status"
        onClick={() => {
          handleEditParcel(row.original);
          closeMenu();
        }}
      />
    ]
  });

  const handleMenuOpen = (event, parcel) => {
    setAnchorEl(event.currentTarget);
    setSelectedMenuParcel(parcel);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // setSelectedMenuParcel(null);
  };

  const handleViewDetails = () => {
    setDetailsOpen(true);
    handleMenuClose();
  };

  const handleStatusClick = () => {
    handleOpenDialog(selectedMenuParcel);
    handleMenuClose();
  };

  console.log(selectedMenuParcel);

  if (!user || user.role !== 'agent') {
    return (
      <Box p={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">You do not have permission to view this page. Please contact your administrator.</Typography>
      </Box>
    );
  }
  return (
    <Box p={3}>
      <BookingDetailDialog
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedBooking={selectedMenuParcel}
      />

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Agent Dashboard
      </Typography>

      {/* === Stats Cards === */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.totalParcels}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Total Parcels
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <PendingActionsIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.pending}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Pending Pickup
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <LocalShippingIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.picked}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Picked Up
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">{stats.delivered}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Delivered
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* === My Assigned Parcels Table === */}
      <Card>
        <CardContent>
          <Typography variant="h6" mb={2}>
            My Assigned Parcels
          </Typography>
          <MaterialReactTable table={table} />
        </CardContent>
      </Card>

      {/* === Status Update Modal === */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Parcel Status</DialogTitle>
        <DialogContent>
          {selectedParcel && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Tracking Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {selectedParcel.trackingNumber}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Recipient
                </Typography>
                <Typography variant="body2">
                  {selectedParcel.recipient.name} - {selectedParcel.recipient.address}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Status
                </Typography>
                <Chip
                  size="small"
                  color={statusConfig[selectedParcel.status].color}
                  icon={statusConfig[selectedParcel.status].icon}
                  label={statusConfig[selectedParcel.status].label}
                  sx={{ mt: 0.5 }}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>New Status</InputLabel>
                <Select value={newStatus} label="New Status" onChange={(e) => setNewStatus(e.target.value)}>
                  {Object.keys(statusConfig).map((status) => (
                    <MenuItem key={status} value={status}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {statusConfig[status].icon}
                        <Typography>{statusConfig[status].label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Status Notes"
                multiline
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional notes."
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate} disabled={!newStatus || newStatus === selectedParcel?.status}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* === Action Menu === */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleStatusClick}
          disabled={selectedMenuParcel?.status === 'delivered' || selectedMenuParcel?.status === 'cancelled'}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Update Status</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
