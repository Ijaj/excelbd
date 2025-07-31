/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import { Box, Avatar, Menu, MenuItem, IconButton, Typography, Divider, Tooltip, ListItemIcon } from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Bookings icon
import { Dashboard } from '@mui/icons-material';

const UserMenu = ({ name = 'John Doe', role = '', onLogout, onNagivate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // role based menu items
  const menuItems = useMemo(
    () => ({
      admin: [{ label: 'Dashboard', route: '/dashboard', icon: <Dashboard fontSize="small" /> }],
      agent: [{ label: 'Dashboard', route: '/dashboard', icon: <Dashboard fontSize="small" /> }],
      customer: [{ label: 'Bookings', route: '/bookings', icon: <AssignmentTurnedInIcon fontSize="small" /> }]
    }),
    []
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Show user name */}
      <Typography variant="subtitle1" fontWeight="500" sx={{ display: { xs: 'none', sm: 'block' } }}>
        {name}
      </Typography>

      {/* Avatar button */}
      <Tooltip title="Account menu">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.dark' },
            width: 40,
            height: 40
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'transparent',
              width: 36,
              height: 36,
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {initials}
          </Avatar>
        </IconButton>
      </Tooltip>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        disableScrollLock
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 1.5,
              minWidth: 190,
              borderRadius: 2,
              overflow: 'hidden'
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {menuItems[role].map((item, index) => (
          <MenuItem key={index} onClick={() => onNagivate(item.route)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
