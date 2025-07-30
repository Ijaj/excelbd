import React, { useCallback, useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack
} from '@mui/material';
import { LocalShipping, Menu as MenuIcon, Login, PersonAdd, Close } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

import { useAuth } from 'hooks/AuthProvider';
import AccountMenu from 'components/profile';

const Layout = () => {
  const theme = useTheme();
  const { user, isLoggedIn } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // const navigationItems = useMemo(() => {
  //   if (isLoggedIn)
  //     return [
  //       { label: 'Features', href: '#features' },
  //       { label: 'Pricing', href: '#pricing' },
  //       { label: 'About', href: '#about' },
  //       { label: 'Contact', href: '#contact' }
  //     ];
  //   else
  //     return [
  //       { label: 'Features', href: '#features' },
  //       { label: 'Pricing', href: '#pricing' },
  //       { label: 'About', href: '#about' },
  //       { label: 'Contact', href: '#contact' }
  //     ];
  // }, [isLoggedIn]);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  // const handleNavigation = (href) => {
  //   const element = document.querySelector(href);
  //   if (element) {
  //     element.scrollIntoView({ behavior: 'smooth' });
  //   }
  //   handleMobileMenuClose();
  // };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping
                sx={{
                  fontSize: 32,
                  color: '#f5f5f5',
                  transform: 'rotate(-10deg)'
                }}
              />
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: 800,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: '#f5f5f5',
                  letterSpacing: '-0.5px'
                }}
              >
                CourierPro
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {/* <Box sx={{ display: 'flex', gap: 3 }}>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.label}
                      variant="text"
                      onClick={() => handleNavigation(item.href)}
                      sx={{
                        color: '#f5f5f5',
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '0.95rem',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.dark,
                          transform: 'translateY(-1px)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box> */}

                <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                  {!isLoggedIn ? (
                    <Button
                      variant="contained"
                      startIcon={<Login />}
                      color="inherit"
                      sx={{
                        color: theme.palette.text.primary,
                        textTransform: 'none',
                        fontWeight: 500
                      }}
                    >
                      Login
                    </Button>
                  ) : (
                    ''
                  )}
                  {isLoggedIn ? (
                    <AccountMenu />
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<PersonAdd />}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        borderRadius: 2,
                        boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${theme.palette.primary.main}40`
                        },
                        transition: 'all 0.3s ease-in-out'
                      }}
                    >
                      Sign Up
                    </Button>
                  )}
                </Box>
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{
                  color: theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShipping
                sx={{
                  fontSize: 28,
                  color: theme.palette.primary.main,
                  transform: 'rotate(-10deg)'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                CourierPro
              </Typography>
            </Box>
            <IconButton onClick={handleMobileMenuClose}>
              <Close />
            </IconButton>
          </Box>

          {/* Navigation Items */}
          {/* <List sx={{ flex: 1 }}>
            {navigationItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.href)}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '1rem'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}

          <Divider />

          {/* Action Buttons */}
          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Login />}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAdd />}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${theme.palette.primary.main}40`
                  }
                }}
              >
                Sign Up Free
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      {/* Content with proper spacing for fixed header */}
      <Box sx={{ pt: '80px' }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
