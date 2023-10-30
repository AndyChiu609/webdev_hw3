// UserModal.tsx
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onChangeUser: (name: string) => void;
}

export default function UserModal({ open, onClose, onChangeUser }: UserModalProps) {
  const [inputName, setInputName] = useState('');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
  };

  const handleSubmit = () => {
    onChangeUser(inputName);
    
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <TextField
          fullWidth
          label="使用者名稱"
          variant="outlined"
          value={inputName}
          onChange={handleNameChange}
        />
        <Button variant="outlined" color="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
          確認
        </Button>
      </Box>
    </Modal>
  );
}
