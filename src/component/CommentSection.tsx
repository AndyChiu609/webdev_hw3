// components/CommentSection.tsx
import { Typography, Box, Card, CardContent } from '@mui/material';

type CommentProps = {
    userName: string;
    message: string;
    createdAt: string;  // 直接使用 'createdAt' 替代 'timestamp'
};

type CommentSectionProps = {
    comments: CommentProps[];
};

const CommentSection: React.FC<CommentSectionProps> = ({ comments }) => {
    return (
        <Box mt={4}>
            <Typography variant="h6" gutterBottom>
                留言區
            </Typography>
            {comments.map((comment, index) => (
                <Card variant="outlined" sx={{ mt: 2 }} key={index}>
                    <CardContent>
                        <Typography variant="subtitle1" color="textSecondary">
                            {comment.userName} 於 {new Date(comment.createdAt).toLocaleString()} 留言：
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {comment.message}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default CommentSection;
