import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Divider,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Stack,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { LocalShipping, Visibility, VisibilityOff, Email, Lock, Person, Business, Phone } from '@mui/icons-material';
import { service_register, validateForm } from 'services/auth-services';
import { useAlert } from 'hooks/Alart';

export default function SignUpPage() {
  const notify = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'customer',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field) => (event) => {
    const value = ['agreeToTerms', 'subscribeNewsletter'].includes(field) ? event.target.checked : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await service_register(formData);
    notify(result);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.secondary.light}15, ${theme.palette.primary.light}15)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={24}
          sx={{
            p: isMobile ? 3 : 5,
            borderRadius: 3,
            background: theme.palette.background.paper,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`
                }}
              >
                <LocalShipping sx={{ fontSize: 32 }} />
              </Avatar>
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join CourierPro and streamline your delivery operations
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Create account with email
            </Typography>
          </Divider>

          {/* Sign Up Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Name Fields */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      )
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                error={!!errors.email}
                helperText={errors.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                name="address"
                label="Full Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                error={!!errors.address}
                helperText={errors.address}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {/* Role Selection Dropdown */}
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-label">I am</InputLabel>
                <Select labelId="role-label" id="role" value={formData.role} label="Role" onChange={handleInputChange('role')}>
                  <MenuItem value="customer">A Customer</MenuItem>
                  <MenuItem value="agent">An Agent</MenuItem>
                </Select>
                {errors.role && (
                  <Typography variant="caption" color="error">
                    {errors.role}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                error={!!errors.password}
                helperText={errors.password}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />

              {/* Checkboxes */}
              <Box>
                <FormControlLabel
                  control={<Checkbox checked={formData.agreeToTerms} onChange={handleInputChange('agreeToTerms')} color="primary" />}
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="#" color="primary">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="#" color="primary">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={!formData.agreeToTerms}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    transform: 'translateY(-2px)'
                    // boxShadow: `0 12px 32px ${theme.palette.secondary.main}50`
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Create Account
              </Button>
            </Stack>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
