import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useNavigate } from 'react-router-dom';
import { Dashboard, People } from '@mui/icons-material';
import { Toolbar } from '@mui/material';
import { drawerWidth } from 'utils/constants';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
  { label: 'Agents', path: '/dashboard/agents', icon: <People /> }
];

export default function SideMenu() {
  const navigate = useNavigate();
  function handleNavigate(route = '/') {
    navigate(route, { replace: true });
  }

  const DrawerList = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <List sx={{ transition: 'all 0.2s' }}>
        {menuItems.map((item) => (
          <ListItem key={item.label}>
            <ListItemButton selected={window.location.pathname === item.path} onClick={() => handleNavigate(item.path)}>
              <ListItemIcon sx={{ paddingRight: 1, minWidth: 4 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
      }}
      variant="permanent"
    >
      <Toolbar />
      {DrawerList}
    </Drawer>
  );
}
