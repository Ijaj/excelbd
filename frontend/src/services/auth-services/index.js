import axios from 'axios';

function generateErrorMessage(apiErrors = []) {
  return apiErrors && Array.isArray(apiErrors) ? apiErrors.map((item) => item.message).join(', ') : '';
}

export async function service_login(email = '', password = '', loginFn) {
  const url = `${process.env.REACT_APP_AUTH_URL}/login`;
  try {
    const result = await axios.post(url, { email, password });
    if (result.status === 200) {
      // created successfully
      return {
        msg: 'Login Successful.',
        duration: 1,
        type: 'success',
        onCloseCallback: () => {
          loginFn({ user: result.data.user, token: result.data.token });
          window.location.href = '/';
        }
      };
    } else {
      return {
        msg: 'Invalid Email or Password',
        duration: 3,
        type: 'error'
      };
    }
  } catch (error) {
    const errorMessages = generateErrorMessage(error.response.data.errors);
    return {
      msg: `Login Failed. ${errorMessages} Please try again. If this presists, contact support`,
      duration: 3,
      type: 'error'
    };
  }
}

export function validateForm(formData) {
  const newErrors = {};

  if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
  if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
    newErrors.email = 'Enter a valid email address';
  }
  if (!formData.address.trim()) newErrors.address = 'Address is required';
  if (!formData.phone.trim()) {
    newErrors.phone = 'Phone number is required';
  } else if (!/^\d{10,15}$/.test(formData.phone)) {
    newErrors.phone = 'Enter a valid phone number';
  }
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }
  if (!formData.confirmPassword) {
    newErrors.confirmPassword = 'Confirm your password';
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }
  if (!formData.agreeToTerms) {
    newErrors.agreeToTerms = 'You must agree to the terms';
  }
  return newErrors;
}

export async function service_register(formData) {
  const url = `${process.env.REACT_APP_AUTH_URL}/register`;
  try {
    const result = await axios.post(url, formData);
    if (result.status === 201) {
      // created successfully
      return {
        msg: 'Registration Successful. Please login',
        duration: 1,
        type: 'success',
        onCloseCallback: () => {
          window.location.href = '/';
        }
      };
    } else {
      return {
        msg: 'Registration Failed. Please try again. If this presists, contact support',
        duration: 3,
        type: 'error'
      };
    }
  } catch (error) {
    const errorMessages = generateErrorMessage(error.response.data.errors);
    return {
      msg: `Registration Failed. ${errorMessages} Try again or contact support`,
      duration: 3,
      type: 'error'
    };
  }
}
