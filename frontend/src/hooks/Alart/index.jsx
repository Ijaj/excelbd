import React, { createContext, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Alert, AlertTitle, Slide } from '@mui/material';

const AlertContext = createContext();

/**
 * @typedef {'success' | 'info' | 'warning' | 'error'} AlertType
 */

/**
 * @typedef {Object} AlertOptions
 * @property {string} msg - The message to display in the alert
 * @property {AlertType} [type='success'] - The type of the alert
 * @property {Function} [onCloseCallback] - Callback function to be called when the alert is closed
 * @property {number} [duration=5] - Duration in seconds for which the alert should be displayed
 */

/**
 * Slide transition component for the Snackbar
 * @param {Object} props - The props for the Slide component
 * @returns {JSX.Element}
 */
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

/**
 * AlertProvider component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components
 */
export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  /**
   * Show an alert
   * @type {(options: AlertOptions) => void}
   */
  const showAlert = useCallback(({ msg, type = 'success', onCloseCallback, duration = 5 }) => {
    const id = new Date().getTime(); // Unique ID for each alert
    setAlerts((prevAlerts) => [...prevAlerts, { id, msg, type, onCloseCallback, duration: duration * 1000 }]);
  }, []);

  /**
   * Handle closing of an alert
   * @param {number} id - The ID of the alert to close
   */
  function handleClose(id) {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    const alert = alerts.find((alert) => alert.id === id);
    if (alert && alert.onCloseCallback) {
      alert.onCloseCallback();
    }
  }

  /**
   * Capitalize the first letter of a string
   * @param {string} s - The string to capitalize
   * @returns {string}
   */
  const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={true}
          autoHideDuration={alert.duration}
          onClose={() => handleClose(alert.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          slot={{
            transition: SlideTransition
          }}
        >
          <Alert variant="filled" onClose={() => handleClose(alert.id)} severity={alert.type} sx={{ width: '100%' }}>
            <AlertTitle>{capitalize(alert.type)}</AlertTitle>
            {alert.msg}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
}

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use the alert context
 * @returns {(options: AlertOptions) => void}
 */
export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}