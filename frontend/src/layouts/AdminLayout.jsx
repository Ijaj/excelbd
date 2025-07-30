import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <Box>
      Admin Layout
      <Outlet />
    </Box>
  );
}
