import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MessageWrapper } from './style'; // Styled components

const MessageComponent = ({ type, message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose(); // Tự động đóng thông báo sau 3 giây
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <MessageWrapper type={type}>
      {message}
    </MessageWrapper>
  );
};

MessageComponent.propTypes = {
  type: PropTypes.oneOf(['success', 'error']),
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MessageComponent;
