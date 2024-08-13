import React, { useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }));

  return (
    <Box>
      {!visible && (
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonShowLabel}
        </Button>
      )}
      {visible && (
        <Box>
          {props.children}
          <Button
            variant="outlined"
            color="secondary"
            onClick={toggleVisibility}
            sx={{ mt: 2 }}
          >
            {props.buttonHideLabel}
          </Button>
        </Box>
      )}
    </Box>
  );
});

Togglable.displayName = 'Togglable';
Togglable.propTypes = {
  buttonShowLabel: PropTypes.string.isRequired,
  buttonHideLabel: PropTypes.string.isRequired,
};

export default Togglable;
