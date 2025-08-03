import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Stack,
  Divider,
  TextField
} from '@mui/material';
import {
  LocalShipping,
  TrackChanges,
  Route,
  Analytics,
  NotificationsActive,
  PhoneAndroid,
  Security,
  Search,
  TrendingUp,
  SupportAgent
} from '@mui/icons-material';

const CustomerLandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <TrackChanges />,
      title: 'Real-time Tracking',
      description: 'Monitor every package with GPS precision. Get live updates and estimated delivery times for complete visibility.'
    },
    {
      icon: <Route />,
      title: 'Route Optimization',
      description: 'AI-powered algorithms find the most efficient delivery routes, reducing costs and improving delivery times.'
    },
    {
      icon: <Analytics />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into your operations with detailed reports and performance metrics.'
    },
    {
      icon: <NotificationsActive />,
      title: 'Smart Notifications',
      description: 'Automated alerts for customers and staff about delivery status, delays, and important updates.'
    },
    {
      icon: <PhoneAndroid />,
      title: 'Mobile App',
      description: 'Full-featured mobile applications for drivers and customers with offline capabilities.'
    },
    {
      icon: <Security />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with GDPR compliance and data encryption to protect sensitive information.'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Deliveries Tracked', icon: <LocalShipping /> },
    { number: '99.9%', label: 'Uptime', icon: <TrendingUp /> },
    { number: '24/7', label: 'Support', icon: <SupportAgent /> }
  ];

  const trackingSteps = [
    { status: 'completed', title: 'Package Picked Up', time: '2:30 PM', location: 'Warehouse A' },
    { status: 'completed', title: 'In Transit', time: '4:15 PM', location: 'Route 101' },
    { status: 'pending', title: 'Out for Delivery', time: 'Est. 6:00 PM', location: 'Final Mile' }
  ];

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          // background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          pt: 10,
          pb: 8,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,.2) 2px, transparent 0)',
            backgroundSize: '50px 50px',
            opacity: 0.5
          }
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography
                  variant={isMobile ? 'h3' : 'h2'}
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.text.secondary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Streamline Your{' '}
                  <Box
                    component="span"
                    sx={{
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    Courier Operations
                  </Box>{' '}
                  with Smart Technology
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.secondary,
                    mb: 4,
                    lineHeight: 1.7,
                    maxWidth: 600
                  }}
                >
                  Revolutionize your parcel management with our comprehensive platform. Track, manage, and optimize deliveries with
                  real-time insights and automated workflows.
                </Typography>

                <Stack direction={isMobile ? 'column' : 'row'} spacing={2} sx={{ mb: 6 }}>
                  <TextField
                    placeholder="Enter You Tracking ID"
                    sx={{
                      py: 0,
                      px: 0,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${theme.palette.primary.main}50`
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Search />}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 24px ${theme.palette.primary.main}40`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 32px ${theme.palette.primary.main}50`
                      },
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    Track Your Parcel
                  </Button>
                </Stack>

                <Grid container spacing={4}>
                  {stats.map((stat, index) => (
                    <Grid size={{ xs: 4 }} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 800,
                            color: theme.palette.primary.main,
                            mb: 0.5
                          }}
                        >
                          {stat.number}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.text.secondary,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            fontWeight: 500
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                <Paper
                  elevation={10}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: theme.palette.background.paper,
                    transform: 'rotate(3deg)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'rotate(1deg) translateY(-8px)'
                    },
                    maxWidth: 400,
                    width: '100%'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        mr: 2,
                        width: 32,
                        height: 32
                      }}
                    >
                      <TrackChanges fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight={600}>
                      Live Tracking Dashboard
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    {trackingSteps.map((step, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: step.status === 'completed' ? theme.palette.success.main : theme.palette.warning.main,
                              flexShrink: 0
                            }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" fontWeight={600}>
                              {step.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {step.time} - {step.location}
                            </Typography>
                          </Box>
                          <Chip
                            label={step.status === 'completed' ? 'Done' : 'Pending'}
                            size="small"
                            color={step.status === 'completed' ? 'success' : 'warning'}
                            variant="outlined"
                          />
                        </Box>
                        {index < trackingSteps.length - 1 && <Divider sx={{ ml: 3, mt: 1 }} />}
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 800,
                mb: 2,
                color: theme.palette.text.primary
              }}
            >
              Powerful Features for Modern Logistics
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Everything you need to manage your courier operations efficiently and scale your business.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.3s ease-in-out'
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[16],
                      '&::before': {
                        transform: 'scaleX(1)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        fontSize: '1.5rem'
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: theme.palette.text.primary
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`,
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 800,
              mb: 3
            }}
          >
            Ready to Transform Your Delivery Operations?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              opacity: 0.9,
              lineHeight: 1.6
            }}
          >
            Join thousands of businesses already using CourierPro to streamline their logistics and improve customer satisfaction.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              py: 2,
              px: 6,
              fontSize: '1.125rem',
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': {
                bgcolor: theme.palette.grey[100],
                transform: 'translateY(-2px)',
                boxShadow: theme.shadows[12]
              },
              transition: 'all 0.3s ease-in-out'
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default CustomerLandingPage;
