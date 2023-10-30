import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

interface ActivityProps {
  id: string;
  name: string;
  joined: boolean;
  count: number;
}

const ActivityCard: React.FC<ActivityProps> = ({ name, joined, count, id }) => {
  return (
    <Link href={`/activity/${id}`} passHref>
        
    <Card variant="outlined" sx={{ my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        {/* name部分 */}
        <Typography variant="body1">{name}</Typography>
      </CardContent>

      {/* joined 和 count部分 */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 2 }}>
        {joined && (
          <CheckCircleIcon color="success" />
        )}
        <Typography variant="body2" color="textSecondary">{count}人參加</Typography>
      </Box>
    </Card>
    
    </Link>
  );
}

export default ActivityCard;
