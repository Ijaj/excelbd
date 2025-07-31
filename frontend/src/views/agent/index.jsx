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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton
} from '@mui/material';
import { useState, useMemo, useRef, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { mockParcels, statusConfig, priorityConfig, paymentMethods } from 'utils/constants';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import EditIcon from '@mui/icons-material/Edit';

export default function AgentDashboard({ agentCode = 'AG003' }) {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const renders = useRef(0);
  const [agentParcels, setAgentParcels] = useState(mockParcels.filter((p) => p.assignedAgent === agentCode));
  const [stats, setStats] = useState({
    totalParcels: 0,
    pending: 0,
    picked: 0,
    delivered: 0
  });

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
    setNotes('');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedParcel(null);
    setNewStatus('');
    setNotes('');
  };

  const handleStatusUpdate = () => {
    if (selectedParcel && newStatus) {
      setAgentParcels((prevParcels) =>
        prevParcels.map((parcel) => (parcel.id === selectedParcel.id ? { ...parcel, status: newStatus } : parcel))
      );
      handleCloseDialog();
    }
  };

  const getStatusMenuItems = (currentStatus) => {
    const statusFlow = {
      pending: ['picked-up', 'cancelled'],
      'picked-up': ['in-transit', 'failed'],
      'in-transit': ['delivered', 'failed'],
      delivered: [],
      failed: ['picked-up', 'cancelled'],
      cancelled: []
    };

    return statusFlow[currentStatus] || [];
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
          <Tooltip title="Update Status">
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(row.original)}
              disabled={row.original.status === 'delivered' || row.original.status === 'cancelled'}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )
      }
    ],
    []
  );

  useEffect(() => {
    renders.current += 1;
  });

  console.log(renders.current);

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
  });

  return (
    <Box p={3}>
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
          <MaterialReactTable
            table={table}
            // columns={columns}
            // data={agentParcels}
            // enableSorting={true}
            // enablePagination={true}
            // enableDensityToggle={true}
            // initialState={{
            //   pagination: {
            //     pageSize: 10
            //   },
            //   sorting: [
            //     {
            //       id: 'dates.estimated',
            //       desc: false
            //     }
            //   ]
            // }}
            // enableColumnFilters={true}
          />
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
                  {getStatusMenuItems(selectedParcel.status).map((status) => (
                    <MenuItem key={status} value={status}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {statusConfig[status].icon}
                        <Typography>{statusConfig[status].label}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Recipient
                </Typography>
                <Typography variant="body2">
                  {selectedParcel.recipient.name} - {selectedParcel.recipient.company}
                </Typography>
              </Box>
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
    </Box>
  );
}
