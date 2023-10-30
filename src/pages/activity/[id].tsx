import { useRouter } from 'next/router';
import { useState, useEffect, useCallback  } from 'react';
import { Card, CardContent, Typography, Box ,Button } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';  // 確保有導入 axios
import TextField from '@mui/material/TextField';
import CommentSection from '../../component/CommentSection'; 




type Activity = {
    id: number;
    activityName: string;
    description: string;
    joined?: boolean;
    count?: number;
    from?: string;
    to?: string;
};

type Attendance = {
    userName: string;
    activityName: string;
    signStatus: string;
  };

type Comments = {
    comment?: string;
    userName: string,
    message: string,
    timestamp: string
    activityId: number | null;
    createdAt: string;
}

function ActivityPage() {
    const router = useRouter();
    const id = typeof router.query.id === 'string' ? parseInt(router.query.id) : null;

    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);   
    const [hasJoined, setHasJoined] = useState(false);
    const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState<Comments[]>([]);

    const activity = activities.find(activity => activity.id === id);

    const handleGetComments = useCallback(async () => {
        try {
            const response = await axios.get('/api/comment');  // 確保 API 路徑正確
            if (response.status === 200) {
                console.log('獲取到的所有留言:', response.data);  // 新增的log
    
                const activityComments = response.data
                    .filter((comment: Comments) => comment.activityId === id)
                    .map((comment: Comments) => {
                        return {
                            userName: comment.userName,
                            message: comment.comment,   // 注意這裡使用 comment.comment
                            timestamp: comment.createdAt,
                            activityId: comment.activityId,
                            createdAt: comment.createdAt
                        };
                    });
    
                    const sortedComments = activityComments.sort((a, b) => {
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    });
        
                    setComments(sortedComments);
            } else {
                // console.error('獲取留言時出錯:', response.data.error);
            }
        } catch (error) {
            console.error('請求時出現異常:', error);
        }
    }, [id]); 
    
    
    

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const currentUser = localStorage?.getItem("currentUser") ?? "";
            
            // 定義 POST 請求的數據
            const postData = {
                userName: currentUser,  // 需要填寫正確的值
                comment: message,  // 假設您在 useState 中有一個名為 message 的狀態來存放留言
                activityId: activity?.id  // 這裡是示例值，您應該使用正確的 activityId
            };
    
            try {
                const response = await fetch("/api/comment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData)
                });
    
                const data = await response.json();
                
                if (response.ok) {
                    console.log("成功:", data.message);
                    
                    setComments((prev) => [    ...prev,
                        {
                            userName: currentUser,
                            message: message,
                            timestamp: new Date().toString(),
                            activityId: id,
                            createdAt: new Date().toISOString()
                        }])
                } else {
                    console.error("錯誤:", data.error);
                }
    
                setMessage(''); // 清空留言
            } catch (error) {
                console.error("API請求出錯:", error);
            }
        }
    };
    


    const handleGetActivities = async () => {
        setLoading(true);
        setError(null);   
        try {
            const response = await axios.get('/api/activity');
            if (response.status === 200) {
                setActivities(response.data);
                console.log('成功獲取活動列表:', response.data);
            } else {
                console.error('獲取活動列表時出錯:', response.data.error);
                setError(response.data.error);
            }
        } catch (error) {
            console.error('請求時出現異常:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinActivity = async () => {
        const currentUser = localStorage.getItem('currentUser');
        console.log(currentUser);
    
        const newSignStatus = hasJoined ? 'out' : 'in';
    
        // 先檢查該使用者是否已有attendance資料
        const userAttendance = attendanceData.find(
            att => att.userName === currentUser && att.activityName === activity?.activityName
        );
    
        try {
            // 若該使用者沒有attendance資料，則新增一筆
            if (!userAttendance) {
                const responsePost = await axios.post('/api/attendance', {
                    userName: currentUser,
                    activityName: activity?.activityName,
                    signStatus: newSignStatus,
                });
    
                if (responsePost.status !== 200) {
                    console.error('新增出席資料時出錯:', responsePost.data.error);
                    alert('新增出席資料時出錯');
                    return;
                }
            }
    
            // 更新該使用者的出席狀態
            const responsePut = await axios.put('/api/attendance', {
                userName: currentUser,
                activityName: activity?.activityName,
                signStatus: newSignStatus,
            });
    
            if (responsePut.status === 200) {
                setHasJoined(!hasJoined); // 切換參加狀態
                alert(hasJoined ? '已退出此活動！' : '已參加此活動！');
            } else {
                console.error('更新出席狀態時出錯:', responsePut.data.error);
                alert('更新出席狀態時出錯');
            }
        } catch (error) {
            console.error('請求時出現異常:', error);
            alert('請求時出現異常');
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

      const checkUserAttendance = () => {
        // 從 localStorage 獲取當前用戶
        const currentUser = localStorage.getItem('currentUser');

        console.log(currentUser, "curr")

        // 確定該用戶是否參加了這次活動
        const userAttendance = attendanceData.find(att => att.userName === currentUser && att.activityName === activity?.activityName);

        console.log(userAttendance, "user")

        // 如果找到用戶的出席資料且他/她的狀態是已經參加，則更新 hasJoined 的狀態
        if (userAttendance && userAttendance.signStatus === "in") {
            setHasJoined(true);
        } else {
            setHasJoined(false);
        }
    };



    useEffect(() => {
        handleGetActivities();
        handleGetAttendance();
  
        if (id) {
            handleGetComments();
        }
    }, [id]);

    useEffect(() => {
        checkUserAttendance();
    }, [attendanceData]);

    if (loading) return <div>正在加載活動...</div>;
    if (error) return <div>加載錯誤：{error}</div>;

    if (!id) return null;

    

    if (!activity) return <div>活動不存在</div>;
    const localFromDate = new Date(activity.from!).toLocaleDateString();
    const localToDate = new Date(activity.to!).toLocaleDateString();

    //console.log('留言數據:', comments);

    return (
        
        <div>
            <Link href="/" passHref>
                <Button variant="outlined" sx={{ mb: 2 }}>返回首頁</Button>
            </Link>
            <Card variant="outlined" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        活動名稱:  {activity.activityName}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        開始時間: {localFromDate}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        結束時間: {localToDate}
                    </Typography>
                    <Button variant="contained" color={hasJoined ? 'error' : 'success'} onClick={handleJoinActivity}>
                        {hasJoined ? '我已參加' : '參加活動'}
                    </Button>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        placeholder="在這裡輸入留言..."
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        sx={{ mt: 2 }}
                        disabled={!hasJoined} 
                    />
                    <CommentSection comments={comments} />
                </CardContent>
            </Card>
            
            
        </div>
    );
}

export default ActivityPage;
