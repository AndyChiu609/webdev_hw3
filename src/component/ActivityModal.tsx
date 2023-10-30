import React, { useState,useEffect  } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { type } from 'os';


type ActivityModalProps = {
  open: boolean;
  handleClose: () => void;
  onAddActivity: (from: Date, to: Date, activityName: string)=> void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ open, handleClose, onAddActivity }) => {
  const [fromDate, setFromDate] = useState<Dayjs | null>(null);
  const [toDate, setToDate] = useState<Dayjs | null>(null);
  const [activityName, setActivityName] = useState<string>('');

  useEffect(() => {
    if (open) {
      // 當模態視窗開啟時重置狀態
      setFromDate(null);
      setToDate(null);
      setActivityName('');
    }
  }, [open]);

  const handleAddActivity = () => {
    // 首先確保 fromDate 和 toDate 都存在
    if (!fromDate || !toDate) {
      // 提示用戶必須選擇日期
      alert("請選擇開始和結束日期");
      return;
    }
  
    // 檢查 fromDate 是否晚於 toDate
    if (fromDate.isAfter(toDate)) {
      alert("開始日期不能晚於結束日期");
      return;
    }

      // 檢查開始和結束日期之間的天數是否超過 7 天
    const daysDifference = toDate.diff(fromDate, 'day');
    if (daysDifference > 7) {
      alert("開始與結束時間相差不能超過 7 天");
      return;
    }
  
    // 檢查 activityName 是否有值
    if (activityName.trim() === '') {
      alert("請輸入活動名稱");
      return;
    }

    if (fromDate.isSame(toDate, 'day')) {
      alert("開始和結束日期不能是同一天");
      return;
    }
    
  
    // 如果所有條件都符合，則添加活動並關閉模態視窗
    onAddActivity(fromDate.toDate(), toDate.toDate(), activityName);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ 
        position: 'absolute', top: '50%', left: '50%', 
        transform: 'translate(-50%, -50%)', 
        bgcolor: 'background.paper', boxShadow: 24, p: 4 
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="開始日期"
            value={fromDate}
            onChange={(newValue: Dayjs | null) => setFromDate(newValue)}
            
          />
          <DatePicker
            label="結束日期"
            value={toDate}
            onChange={(newValue: Dayjs | null) => setToDate(newValue)}
            
          />
        </LocalizationProvider>
        <TextField
          label="活動名稱"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button color="primary" variant="outlined" fullWidth onClick={handleAddActivity}>
          新增活動
        </Button>
      </Box>
    </Modal>
  );
};

export default ActivityModal;
