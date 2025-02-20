import styled from 'styled-components';

export const MessageWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: ${({ type }) => (type === 'success' ? '#d4edda' : '#f8d7da')};
  color: ${({ type }) => (type === 'success' ? '#155724' : '#721c24')};
  border: 1px solid ${({ type }) => (type === 'success' ? '#c3e6cb' : '#f5c6cb')};
  padding: 15px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  opacity: 0.95;
`;
