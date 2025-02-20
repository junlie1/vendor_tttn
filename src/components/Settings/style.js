import styled from "styled-components";

export const SettingsContainer = styled.div`
  padding: 2rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }
`;

export const SettingsHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 600;
    color: #1e293b;
  }
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingsCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;

  i {
    font-size: 1.25rem;
    color: #2563eb;
  }

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
`;

export const CardContent = styled.div`
  padding: 1.5rem;
`;

export const SettingItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 0.5rem;
  }

  input[type="email"],
  input[type="password"],
  input[type="number"],
  input[type="time"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #1e293b;
    background: white;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #2563eb;
    }
  }
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;

  label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0;
    cursor: pointer;
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;

export const SaveButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #1d4ed8;
  }
`;

export const BackupActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

export const BackupButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  background: #10b981;
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  i {
    font-size: 0.875rem;
  }
`;

export const RestoreButton = styled(BackupButton)`
  background: #f59e0b;
`;
