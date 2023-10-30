"use client"

import React, { useState,useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import UserModal from '../component/UserModal';
import ActivityModal from '../component/ActivityModal';
import ActivityCard from '../component/ActivityCard';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';


type Activity = {
  id: string;
  activityName: string;
  createdAt: string;
  from: string;
  to: string;
}

type Attendance = {
  userName: string;
  activityName: string;
  signStatus: string;
};


export default function Home() {
  const [userName, setUserName] = useState('肝死人的地理系-默認名稱');
  const [open, setOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

    
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);

  useEffect(() => {
    const currentUserFromLocalStorage = localStorage.getItem('currentUser');
    if (currentUserFromLocalStorage) {
        setUserName(currentUserFromLocalStorage);
    }
}, []); 

    useEffect(() => {
      
      handleGetActivities();
      handleGetAttendance();
    }, [userName]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeUserName = (newName: string) => {
    localStorage.setItem("currentUser",newName);
    setUserName(newName);
    
  };

  const handleActivityModalOpen = () => {
    setActivityModalOpen(true);
  };
  const handleActivityModalClose = () => {
    setActivityModalOpen(false);
  };
  const handleAddActivity = async (from: Date, to: Date, activityName: string) => {

    try {
        // 使用 axios 替換 fetch 進行 POST 新的 activity 資訊
        const activityResponse = await axios.post('/api/activity', {
            from,
            to,
            activityName
        });

        if (activityResponse.status === 200) {
            console.log('活動已成功添加！');



            // POST出席資訊
            const attendanceResponse = await axios.post('/api/attendance', {
                userName: userName,     // 使用當前state中的userName
                activityName: activityName,
                signStatus: 'in',         // 固定狀態為 'in'
            });
            
            if (attendanceResponse.status === 200) {
                console.log('出席資訊已成功添加！');
                await handleGetAttendance();
                await handleGetActivities();
            } else {
                console.error('添加出席資訊時出錯:', attendanceResponse.data.error);
            }

            await handleGetActivities();
        } else {
            console.error('添加活動時出錯:', activityResponse.data.error);
        }
    } catch (error) {
        console.error('請求時出現異常:', error);
    }
    setActivityModalOpen(false);
};


const handleGetActivities = async () => {
  try {
      const response = await axios.get('/api/activity'); // 假設您的GET API路徑為 '/api/activity'
      if (response.status === 200) {
        setActivitiesData(response.data);
        console.log('成功獲取活動列表:', response.data);
          // alert(JSON.stringify(response.data)); // 提示取得的活動列表
      } else {
          console.error('獲取活動列表時出錯:', response.data.error);
      }
  } catch (error) {
      console.error('請求時出現異常:', error);
  }
};

const handleGetAttendance = async () => {
  try {
    const response = await axios.get('/api/attendance');
    if (response.status === 200) {
      setAttendanceData(response.data);
      console.log('成功獲取出席資料:', response.data);
    } else {
      console.error('獲取出席資料時出錯:', response.data.error);
    }
  } catch (error) {
    console.error('請求時出現異常:', error);
  }
};

return (
  <Container component="main" maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'flex-start', alignItems: 'center', paddingTop: '50px' }}>
   {/* 使用者名稱和切換使用者按鈕的flex布局 */}
   <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <Typography variant="h5" component="h2" style={{ marginRight: '16px' }}>
        使用者名稱: {userName}
      </Typography>
      <Button variant="outlined" onClick={handleOpen}>
        切換使用者
      </Button>
    </div>

    {/* 搜尋區域和新增活動按鈕的flex布局 */}
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '16px' }}>
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', flex: 1, marginRight: '12px' }}>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="搜尋活動"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          inputProps={{ 'aria-label': '搜尋活動' }}
        />

      </Paper>
      <Button variant="outlined" onClick={handleActivityModalOpen}>
        新增活動
      </Button>
    </div>

    <UserModal open={open} onClose={handleClose} onChangeUser={handleChangeUserName} />
    <ActivityModal open={activityModalOpen} handleClose={handleActivityModalClose} onAddActivity={handleAddActivity} />

    {activitiesData.filter(activity => activity.activityName.includes(searchTerm)).map((activity, index) => {
      // 檢查當前用戶是否參加了該活動
      const hasJoined = attendanceData.some(attendance => 
        attendance.userName === userName && 
        attendance.activityName === activity.activityName && 
        attendance.signStatus === 'in'
      );

      const participantCount = attendanceData.filter(attendance => 
        attendance.activityName === activity.activityName && 
        attendance.signStatus === 'in'
      ).length;

      return (
        <ActivityCard 
          key={index} 
          id={activity.id} 
          name={activity.activityName} 
          joined={hasJoined} 
          count={participantCount} // 這裏的count應該也要基於出席資料動態計算，但目前的代碼中還沒有提供這個功能
        />
      );
    })}
  </Container>
);
}