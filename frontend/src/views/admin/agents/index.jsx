/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Grid, Typography, Avatar, Chip, LinearProgress, Stack } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { drawerWidth } from 'utils/constants';

import SideMenu from '../components/SideBar';
import { useAlert } from 'hooks/Alart';
import { service_allAgents } from 'services/user-service';

export default function AllAgents() {
  const notify = useAlert();
  const [agents, setAgents] = useState([]);

  const fetchAgents = useCallback(async () => {
    const result = await service_allAgents();
    if (result) {
      setAgents(result);
    } else {
      notify({ message: 'Failed to fetch agents', severity: 'error', duration: 6 });
    }
  }, [notify]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

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
    data: agents,
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
      </Grid>
    </Box>
  );
}
