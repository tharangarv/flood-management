// @mui
import PropTypes from 'prop-types';
import {Box, Stack, Link, Card, Button, Divider, Typography, CardHeader} from '@mui/material';
import {useNavigate} from "react-router-dom";
// utils
import {fToNow} from '../../../utils/formatTime';
// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';

// ----------------------------------------------------------------------

AlertCard.propTypes = {
    title: PropTypes.string,
    subheader: PropTypes.string,
    list: PropTypes.array.isRequired,
    limit: PropTypes.number
};


export default function AlertCard({title, subheader, list, limit, ...other}) {

    const navigate = useNavigate();

    const handleViewAllClick = () => {
        navigate('/dashboard/alert/list', {replace: true});
    }

    return (
        <Card {...other}>
            <CardHeader title={title} subheader={subheader}/>

            <Scrollbar>
                <Stack spacing={3} sx={{p: 3, pr: 0}}>
                    {list.slice(0, limit).map((alert) => {

                        const formattedAlert = {
                            alertBody: alert.alert_body,
                            alertName: alert.alert_name,
                            timestamp: alert.timestamp
                        }
                        return <AlertItem key={alert.id} alert={formattedAlert}/>
                    })}
                </Stack>
            </Scrollbar>

            <Divider/>

            <Box sx={{p: 2, textAlign: 'right'}}>
                <Button size="small" color="inherit" onClick={handleViewAllClick}
                        endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'}/>}>
                    View all
                </Button>
            </Box>
        </Card>
    );
}

// ----------------------------------------------------------------------

AlertItem.propTypes = {
    alert: PropTypes.shape({
        alertName: PropTypes.string,
        alertBody: PropTypes.string,
        timestamp: PropTypes.instanceOf(Date),
    }),
};

function AlertItem({alert}) {
    const {alertName, alertBody, timestamp} = alert;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box component="img" alt={alertName} src="/static/illustrations/alert_icon.png"
                 sx={{width: 48, height: 48, borderRadius: 1.5, flexShrink: 0}}/>

            <Box sx={{minWidth: 240, flexGrow: 1}}>
                <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                    {alertName}
                </Link>

                <Typography variant="body2" sx={{color: 'text.secondary'}} noWrap>
                    {alertBody}
                </Typography>
            </Box>

            <Typography variant="caption" sx={{pr: 3, flexShrink: 0, color: 'text.secondary'}}>
                {fToNow(timestamp)}
            </Typography>
        </Stack>
    );
}
