/* eslint-disable react/prop-types */
import { useState, useCallback } from 'react';
import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, useTheme } from '@mui/material';
import { Close as CloseIcon, Error as ErrorIcon, CheckCircle as SuccessIcon, Info as InfoIcon } from '@mui/icons-material';

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState({ isOpen: false, config: {} });

  const openDialog = useCallback((config) => {
    setDialogState({ isOpen: true, config });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState((prevState) => ({ ...prevState, isOpen: false }));
  }, []);

  return (
    <ConfirmContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogState.isOpen && <ConfirmDialog open={dialogState.isOpen} {...dialogState.config} onClose={closeDialog} />}
    </ConfirmContext.Provider>
  );
};

const ConfirmDialog = ({
  open,
  title,
  body,
  buttons = 'yesno',
  type = 'none',
  onPositive = () => {},
  onNegative = () => {},
  onCancel = () => {},
  onClose
}) => {
  const theme = useTheme();

  const handlePositive = () => {
    onPositive();
    onClose();
  };

  const handleNegative = () => {
    onNegative();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'success':
        return <SuccessIcon color="success" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return null;
    }
  };

  const getButtons = () => {
    const getButtonColor = (buttonType) => {
      switch (type) {
        case 'error':
          return buttonType === 'positive' ? 'error' : 'inherit';
        case 'success':
          return buttonType === 'positive' ? 'success' : 'inherit';
        case 'info':
          return buttonType === 'positive' ? 'info' : 'inherit';
        default:
          return 'primary';
      }
    };

    switch (buttons) {
      case 'yesno':
        return (
          <>
            <Button variant="outlined" onClick={handleNegative} color={getButtonColor('negative')}>
              No
            </Button>
            <Button variant="contained" onClick={handlePositive} color={getButtonColor('positive')} autoFocus>
              Yes
            </Button>
          </>
        );
      case 'submitcancel':
        return (
          <>
            <Button variant="outlined" onClick={handleCancel} color={getButtonColor('negative')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handlePositive} color={getButtonColor('positive')} autoFocus>
              Submit
            </Button>
          </>
        );
      case 'okcancel':
        return (
          <>
            <Button variant="outlined" onClick={handleCancel} color={getButtonColor('negative')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handlePositive} color={getButtonColor('positive')} autoFocus>
              OK
            </Button>
          </>
        );
      case 'ok':
        return (
          <Button variant="contained" onClick={handlePositive} color={getButtonColor('positive')} autoFocus>
            OK
          </Button>
        );
      case 'cancel':
        return (
          <Button variant="outlined" onClick={handleCancel} color={getButtonColor('negative')} autoFocus>
            Cancel
          </Button>
        );
      case 'yesnocancel':
        return (
          <>
            <Button variant="text" onClick={handleCancel} color={getButtonColor('negative')}>
              Cancel
            </Button>
            <Button variant="outlined" onClick={handleNegative} color={getButtonColor('negative')}>
              No
            </Button>
            <Button variant="contained" onClick={handlePositive} color={getButtonColor('positive')} autoFocus>
              Yes
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" style={{ display: 'flex', alignItems: 'center' }}>
          {getIcon()}
          <span style={{ marginLeft: '8px' }}>{title}</span>
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography color="textPrimary">{body}</Typography>
      </DialogContent>
      <DialogActions>{getButtons()}</DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  buttons: PropTypes.oneOf(['yesno', 'submitcancel', 'okcancel', 'ok', 'cancel', 'yesnocancel']),
  type: PropTypes.oneOf(['error', 'success', 'info', 'none']),
  onPositive: PropTypes.func,
  onNegative: PropTypes.func,
  onCancel: PropTypes.func,
  onClose: PropTypes.func.isRequired
};

/**
 * @typedef {Object} ConfirmOptions
 * @property {('yesno'|'submitcancel'|'okcancel'|'ok'|'cancel'|'yesnocancel')} [buttons='yesno']
 * @property {string} title
 * @property {string} body
 * @property {('error'|'success'|'info'|'none')} [type='none']
 * @property {() => void} [onPositive]
 * @property {() => void} [onNegative]
 * @property {() => void} [onCancel]
 */

/**
 * Custom hook for displaying confirmation dialogs
 * @returns {(options: ConfirmOptions) => Promise<boolean|null>}
 */

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }

  const confirm = useCallback(
    /** @type {(options: ConfirmOptions) => Promise<boolean|null>} */
    (options = {}) => {
      return new Promise((resolve) => {
        context.openDialog({
          ...options,
          onPositive: () => {
            options.onPositive?.();
            resolve(true);
          },
          onNegative: () => {
            options.onNegative?.();
            resolve(false);
          },
          onCancel: () => {
            options.onCancel?.();
            resolve(null);
          }
        });
      });
    },
    [context]
  );

  return confirm;
};
