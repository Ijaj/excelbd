/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
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
  Snackbar
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  FlightTakeoff as TransitIcon,
  CheckCircle as DeliveredIcon,
  People as PeopleIcon,
  SmsFailed,
  AttachMoney
} from '@mui/icons-material';
import { MaterialReactTable, useMaterialReactTable, MRT_ActionMenuItem } from 'material-react-table';

import { statusConfig, priorityConfig, mockAgents, mockParcels, drawerWidth } from 'utils/constants';
import SideMenu from './components/SideBar';
import { dayjs } from 'utils/helper';

function AdminDashboard() {
  const [parcels, setParcels] = useState(mockParcels);
  const [agents, setAgents] = useState(mockAgents);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [availableAgents] = useState(agents.filter((agent) => agent.currentParcels < agent.maxCapacity));
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

  // Available agents (not at capacity)
  // const availableAgents = agents.filter((agent) => agent.currentParcels < agent.maxCapacity);

  const handleEditParcel = (parcel) => {
    setSelectedParcel({ ...parcel });
    setEditDialogOpen(true);
  };

  const handleViewParcel = (parcel) => {
    setSelectedParcel(parcel);
    setViewDialogOpen(true);
  };

  const handleAssignAgent = (parcel) => {
    setSelectedParcel({ ...parcel });
    setAssignDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    setParcels((prevParcels) => prevParcels.map((p) => (p.id === selectedParcel.id ? selectedParcel : p)));
    setEditDialogOpen(false);
    showSnackbar('Parcel status updated successfully', 'success');
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

    setAssignDialogOpen(false);
    showSnackbar('Agent assigned successfully', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status) => (
    <Chip label={status.replace('-', ' ').toUpperCase()} color={statusConfig[status].color} size="small" variant="filled" />
  );

  const getPriorityChip = (priority) => (
    <Chip label={priority.toUpperCase()} color={priorityConfig[priority].color} size="small" variant="outlined" />
  );

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
          const agent = agents.find((a) => a.id === row.original.assignedAgent);
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
      <MRT_ActionMenuItem
        table={table}
        icon={<PersonAddIcon />}
        key="assign"
        label="Assign Agent"
        onClick={() => {
          handleAssignAgent(row.original);
          closeMenu();
        }}
        disabled={availableAgents.length === 0}
      />
    ],
    renderTopToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '0.5rem', p: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          color="primary"
          onClick={() => {
            // Refresh data logic here
            showSnackbar('Data refreshed', 'success');
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
      <Box sx={{ mt: 4, mb: 4, px: 2, marginLeft: `${drawerWidth}px` }}>
        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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
          <Grid size={{ xs: 12, sm: 6, md: 1.5 }}>
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

      {/* View Parcel Details Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewIcon color="primary" />
            Parcel Details
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedParcel && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
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

              <Grid item xs={12} md={6}>
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

              <Grid item xs={12} md={6}>
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

              <Grid item xs={12} md={6}>
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
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Tracking Number: {selectedParcel?.trackingNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Agent Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="secondary" />
            Assign Agent
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Tracking Number: {selectedParcel?.trackingNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Available Agents</InputLabel>
                <Select
                  value={selectedParcel?.assignedAgent || ''}
                  label="Available Agents"
                  onChange={(e) =>
                    setSelectedParcel({
                      ...selectedParcel,
                      assignedAgent: e.target.value,
                      originalAgent: selectedParcel?.assignedAgent
                    })
                  }
                >
                  {availableAgents.map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
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
              <Grid item xs={12}>
                <Alert severity="warning">No agents are currently available. All agents are at capacity.</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAgentAssignment} variant="contained" disabled={!selectedParcel?.assignedAgent}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AdminDashboard;
