/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Fab,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  FlightTakeoff as TransitIcon,
  CheckCircle as DeliveredIcon,
  People as PeopleIcon,
  SmsFailed,
  AttachMoney,
  Add
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';

import { statusConfig, priorityConfig, drawerWidth } from 'utils/constants';
import SideMenu from './components/SideBar';
import { dayjs } from 'utils/helper';
import BookingDetailDialog from 'components/booking-dialog';
import { useAlert } from 'hooks/Alart';
import { service_allParcels, service_updateParcel } from 'services/parcel-services';
import BookingDialog from 'components/booking-dialog';
import { service_allAgents } from 'services/user-service';

function AdminDashboard() {
  const notify = useAlert();
  const theme = useTheme();
  const [parcels, setParcels] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newParcelModalOpen, setNewParcelModalOpen] = useState(false);
  const [availableAgents, setAvailableAgents] = useState(agents.filter((agent) => agent.currentParcels < agent.maxCapacity));
  const [dashboardStats, setDashboardStats] = useState({
    total: 0,
    pending: 0,
    inTransit: 0,
    delivered: 0,
    failed: 0,
    availableAgents: 0,
    parcelsToday: 0,
    cod: 0
  });

  useEffect(() => {
    setDashboardStats({
      total: parcels.length,
      pending: parcels.filter((p) => p.status === 'pending').length,
      inTransit: parcels.filter((p) => p.status === 'in-transit').length,
      delivered: parcels.filter((p) => p.status === 'delivered').length,
      failed: parcels.filter((p) => p.status === 'failed' || p.status === 'cancelled').length,
      availableAgents: availableAgents.length,
      parcelsToday: parcels.filter((p) => p.dates.created === dayjs().format('YYYY-MM-DD')).length,
      cod: parcels.filter((p) => p.paymentMethod === 'cod').reduce((total, curr) => total + parseFloat(curr.cost), 0)
    });
  }, [availableAgents.length, parcels]);

  const fetchParcels = useCallback(async () => {
    const result = await service_allParcels();
    if (result) {
      setParcels(result);
    } else {
      // Handle error case
      notify({ message: 'Failed to fetch parcels', severity: 'error', duration: 6 });
    }
  }, [notify]);

  const fetchAgents = useCallback(async () => {
    const result = await service_allAgents();
    if (result) {
      setAgents(result);
    } else {
      notify({ message: 'Failed to fetch agents', severity: 'error', duration: 6 });
    }
  }, [notify]);

  useEffect(() => {
    fetchParcels();
    fetchAgents();
  }, [fetchAgents, fetchParcels]);

  useEffect(() => {
    if (agents.length > 0) {
      setAvailableAgents(agents.filter((agent) => agent.currentParcels < agent.maxCapacity));
    }
  }, [agents]);

  // Available agents (not at capacity)

  const handleEditParcel = (parcel) => {
    setSelectedParcel({ ...parcel });
    setEditDialogOpen(true);
  };

  const handleViewParcel = (parcel) => {
    setSelectedParcel(parcel);
    setViewDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    // make api call first, if successful, update state
    const result = await service_updateParcel(selectedParcel.trackingNumber, {
      status: selectedParcel.status,
      priority: selectedParcel.priority,
      assignedAgent: selectedParcel.assignedAgent
    });
    setParcels((prevParcels) => prevParcels.map((p) => (p._id === selectedParcel._id ? selectedParcel : p)));
    setEditDialogOpen(false);
    if (result) {
      notify({ message: 'Parcel status updated successfully', severity: 'success', duration: 6 });
      handleAgentAssignment();
    } else {
      notify({ message: 'Failed to update parcel status', severity: 'error', duration: 6 });
    }
    setSelectedParcel(null);
    setEditDialogOpen(false);
    setViewDialogOpen(false);
    setNewParcelModalOpen(false);
  };

  const handleAgentAssignment = () => {
    // Remove parcel from previous agent if reassigning
    if (selectedParcel.assignedAgent && selectedParcel.assignedAgent !== selectedParcel.originalAgent) {
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === selectedParcel.originalAgent
            ? { ...agent, currentParcels: Math.max(0, agent.currentParcels - 1) }
            : agent.id === selectedParcel.assignedAgent
              ? { ...agent, currentParcels: agent.currentParcels + 1 }
              : agent
        )
      );
    } else if (selectedParcel.assignedAgent && !selectedParcel.originalAgent) {
      // New assignment
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent.id === selectedParcel.assignedAgent ? { ...agent, currentParcels: agent.currentParcels + 1 } : agent
        )
      );
    }

    setParcels((prevParcels) => prevParcels.map((p) => (p.id === selectedParcel.id ? selectedParcel : p)));
    // TODO: show alert('Agent assigned successfully', 'success');
  };

  const getStatusChip = (status) => (
    <Chip label={status.replace('-', ' ').toUpperCase()} color={statusConfig[status].color} size="small" variant="filled" />
  );

  const getPriorityChip = (priority) => (
    <Chip label={priority.toUpperCase()} color={priorityConfig[priority].color} size="small" variant="outlined" />
  );

  function openBookingModal() {
    setNewParcelModalOpen(true);
  }

  function closeBookingModal() {
    setNewParcelModalOpen(false);
  }

  function handlenNewBooking(formData) {
    console.log(formData);
  }

  // Material React Table columns configuration
  const columns = useMemo(
    () => [
      {
        accessorKey: 'trackingNumber',
        header: 'TN',
        size: 150,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {row.original.trackingNumber}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {row.original.id}
            </Typography>
          </Box>
        )
      },
      {
        accessorKey: 'sender.name',
        header: 'Sender',
        size: 180,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2">{row.original.sender.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {row.original.sender.company}
            </Typography>
          </Box>
        )
      },
      {
        accessorKey: 'recipient.name',
        header: 'Recipient',
        size: 180,
        Cell: ({ row }) => (
          <Box>
            <Typography variant="body2">{row.original.recipient.name}</Typography>
            <Typography variant="caption" color="textSecondary">
              {row.original.recipient.company}
            </Typography>
          </Box>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        Cell: ({ cell }) => getStatusChip(cell.getValue()),
        filterVariant: 'select',
        filterSelectOptions: [
          { text: 'Pending', value: 'pending' },
          { text: 'Picked Up', value: 'picked-up' },
          { text: 'In Transit', value: 'in-transit' },
          { text: 'Delivered', value: 'delivered' },
          { text: 'Failed', value: 'failed' },
          { text: 'Cancelled', value: 'cancelled' }
        ]
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100,
        Cell: ({ cell }) => getPriorityChip(cell.getValue()),
        filterVariant: 'select',
        filterSelectOptions: [
          { text: 'Normal', value: 'normal' },
          { text: 'High', value: 'high' },
          { text: 'Urgent', value: 'urgent' }
        ]
      },
      {
        accessorKey: 'assignedAgent',
        header: 'Agent',
        size: 150,
        Cell: ({ row }) => {
          const agent = agents.find((a) => a._id === row.original.assignedAgent);
          return agent ? (
            <Chip label={agent.name} size="small" color="info" variant="outlined" />
          ) : (
            <Typography variant="caption" color="textSecondary">
              Not assigned
            </Typography>
          );
        }
      },
      {
        accessorKey: 'location',
        header: 'Current Location',
        size: 130
      },
      {
        accessorKey: 'dates.created',
        header: 'Created Date',
        size: 120,
        Cell: ({ cell }) => new Date(cell.getValue()).toLocaleDateString()
      },
      {
        accessorKey: 'packageDetails.value',
        header: 'Value',
        size: 100,
        Cell: ({ cell }) => (
          <Typography variant="body2" fontWeight="medium">
            {cell.getValue()}
          </Typography>
        )
      },
      {
        accessorKey: 'packageDetails.weight',
        header: 'Weight',
        size: 100
      }
    ],
    [agents]
  );

  const table = useMaterialReactTable({
    columns,
    data: parcels,
    enableColumnFilterModes: true,
    enableFacetedValues: true,
    enableRowActions: true,
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
        icon={<ViewIcon />}
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
      />,
    ],
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '0.5rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          color="primary"
          onClick={() => {
            // TODO: show alert('Data refreshed', 'success');
          }}
          variant="contained"
          size="small"
        >
          Refresh Data
        </Button>
      </Box>
    )
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <SideMenu />
      <Box sx={{ mt: 0, mb: 4, px: 2, marginLeft: `${drawerWidth}px` }}>
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Total Parcels
                    </Typography>
                    <Typography variant="h4" component="div">
                      {dashboardStats.total}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  All registered parcels
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Parcels Today
                    </Typography>
                    <Typography variant="h4" component="div">
                      {dashboardStats.parcelsToday}
                    </Typography>
                  </Box>
                  <InventoryIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Registered Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      COD
                    </Typography>
                    <Typography variant="h4" component="div">
                      {dashboardStats.cod}
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: 'green.400' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Total COD Amount
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Pending
                    </Typography>
                    <Typography variant="h4" component="div" color="warning.main">
                      {dashboardStats.pending}
                    </Typography>
                  </Box>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'warning.light' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Awaiting pickup
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      In Transit
                    </Typography>
                    <Typography variant="h4" component="div" color="primary.light">
                      {dashboardStats.inTransit}
                    </Typography>
                  </Box>
                  <TransitIcon sx={{ fontSize: 40, color: 'primary.light' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Currently shipping
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Delivered
                    </Typography>
                    <Typography variant="h4" component="div" color="success.main">
                      {dashboardStats.delivered}
                    </Typography>
                  </Box>
                  <DeliveredIcon sx={{ fontSize: 40, color: 'success.light' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Successfully delivered
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Failed
                    </Typography>
                    <Typography variant="h4" component="div" color="error.main">
                      {dashboardStats.failed}
                    </Typography>
                  </Box>
                  <SmsFailed sx={{ fontSize: 40, color: 'error.main' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Failed Deliveries
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%' }} elevation={6}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="overline">
                      Agents
                    </Typography>
                    <Typography variant="h4" component="div" color="info.main">
                      {dashboardStats.availableAgents}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Available Agents
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Material React Table */}
        <MaterialReactTable table={table} />
      </Box>

      {/* Floating Action Button to open booking dialog */}
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
      <BookingDialog open={newParcelModalOpen} onClose={closeBookingModal} onSubmit={handlenNewBooking} />

      <BookingDetailDialog detailsOpen={viewDialogOpen} selectedBooking={selectedParcel} setDetailsOpen={setViewDialogOpen} />

      {/* Edit Status Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            Update Parcel Status
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }} sx={{ display: 'flex' }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Tracking Number:&nbsp;
              </Typography>
              <Typography variant="h6" fontWeight="medium" color="info.main">
                {selectedParcel?.trackingNumber}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedParcel?.status || ''}
                  label="Status"
                  onChange={(e) => setSelectedParcel({ ...selectedParcel, status: e.target.value })}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="picked-up">Picked Up</MenuItem>
                  <MenuItem value="in-transit">In Transit</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={selectedParcel?.priority || ''}
                  label="Priority"
                  onChange={(e) => setSelectedParcel({ ...selectedParcel, priority: e.target.value })}
                >
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Available Agents</InputLabel>
                <Select
                  value={selectedParcel?.assignedAgent || ''}
                  label="Available Agents"
                  onChange={(e) => {
                    console.log(selectedParcel);
                    console.log(e.target);
                    setSelectedParcel({
                      ...selectedParcel,
                      assignedAgent: e.target.value,
                      originalAgent: selectedParcel?.assignedAgent
                    });
                  }}
                >
                  <MenuItem key={'agent._id'} value={null}>
                    <Box>
                      <Typography>Un-Assign</Typography>
                    </Box>
                  </MenuItem>
                  {availableAgents.map((agent) => (
                    <MenuItem key={agent._id} value={agent._id}>
                      <Box>
                        <Typography>{agent.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          Current: {agent.currentParcels}/{agent.maxCapacity} parcels
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {availableAgents.length === 0 && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="warning">No agents are currently available. All agents are at capacity.</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminDashboard;
