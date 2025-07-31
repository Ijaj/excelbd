/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Box, Grid, Typography, Avatar, Chip, LinearProgress, Stack } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { drawerWidth, mockAgents, mockParcels, priorityConfig, statusConfig } from 'utils/constants';

import SideMenu from '../components/SideBar';

export default function AllAgents() {
  /** === Agents Table Columns === */
  const agentColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Agent',
        Cell: ({ row }) => (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Avatar>{row.original.name.charAt(0)}</Avatar>
            <Typography>{row.original.name}</Typography>
          </Stack>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => <Chip size="small" color={cell.getValue() === 'available' ? 'success' : 'warning'} label={cell.getValue()} />
      },
      {
        accessorKey: 'currentParcels',
        header: 'Capacity',
        Cell: ({ row }) => {
          const { currentParcels, maxCapacity } = row.original;
          const percent = (currentParcels / maxCapacity) * 100;
          return (
            <Box sx={{ minWidth: 100 }}>
              <LinearProgress
                variant="determinate"
                value={percent}
                color={currentParcels >= maxCapacity ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 5 }}
              />
              <Typography variant="caption">
                {currentParcels}/{maxCapacity}
              </Typography>
            </Box>
          );
        }
      }
    ],
    []
  );

  const agentTable = useMaterialReactTable({
    columns: agentColumns,
    data: mockAgents,
    enableSorting: false,
    enableColumnFilters: false,
    enablePagination: false,
    muiTablePaperProps: { sx: { borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 400 } }
  });

  /** === Parcels Table Columns === */
  const parcelColumns = useMemo(
    () => [
      {
        accessorKey: 'trackingNumber',
        header: 'Tracking #',
        enableClickToCopy: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ cell }) => {
          const status = cell.getValue();
          const conf = statusConfig[status];
          return <Chip size="small" color={conf.color} icon={conf.icon} label={conf.label} />;
        }
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        Cell: ({ cell }) => {
          const prio = cell.getValue();
          const conf = priorityConfig[prio];
          return <Chip size="small" color={conf.color} label={conf.label} variant="outlined" />;
        }
      },
      { accessorKey: 'location', header: 'Location' }
    ],
    []
  );

  const parcelTable = useMaterialReactTable({
    columns: parcelColumns,
    data: mockParcels.slice(0, 8),
    enableSorting: false,
    enableColumnFilters: false,
    enablePagination: false,
    muiTablePaperProps: { sx: { borderRadius: 2 } },
    muiTableContainerProps: { sx: { maxHeight: 400 } }
  });

  return (
    <Box p={3} sx={{ marginLeft: `${drawerWidth}px` }}>
      <SideMenu />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Agent Dashboard
      </Typography>

      {/* === Tables === */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h6" mb={1}>
            Active Agents
          </Typography>
          <MaterialReactTable table={agentTable} />
        </Grid>

        <Grid size={{ xs: 12, md: 12 }}>
          <Typography variant="h6" mb={1}>
            Recent Parcels
          </Typography>
          <MaterialReactTable table={parcelTable} />
        </Grid>
      </Grid>
    </Box>
  );
}
