import {useEffect, useState} from "react";
// @mui
import {Grid, Container, Typography} from '@mui/material';
// components
import Page from '../components/Page';
// sections
import {
    AlertCard,
    AppWidgetSummary,
} from '../sections/@dashboard/app';
import MapCard from "../components/map/MapCard";
import {getUsers} from "../repository/user";
import useAuth from "../hooks/useAuth";
import {getLocations} from "../repository/map";
import {getAlerts} from "../repository/alert";

export default function DashboardApp() {

    const {auth} = useAuth();

    const [isDataAdding, setIsDataAdding] = useState(true);

    const [locationCount, setLocationCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [alertsList, setAlertsList] = useState([]);


    useEffect(() => {
        (async () => {

            const users = await getUsers(auth.accessToken);
            const locations = await getLocations(auth.accessToken);
            const alerts = await getAlerts(auth.accessToken, false);

            setLocationCount(locations.items.length);
            setUserCount(users.items.length);
            setAlertsList(alerts.items);
        })()
    }, []);

    return (
        <Page title="Dashboard">
            <Container maxWidth="xl">
                <Typography variant="h4" sx={{mb: 5}}>
                    Hi, Welcome back
                </Typography>

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Alerts" total={alertsList.length} color="warning"
                                          icon={'fluent:alert-20-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Safe Locations" total={locationCount} color="success"
                                          icon={'carbon:location-filled'}/>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <AppWidgetSummary title="Users" total={userCount} icon={'clarity:users-solid'}/>
                    </Grid>

                    <Grid item xs={12}>
                        <MapCard title={'Safe Location Map'} handleDataAdding={setIsDataAdding}
                                 isDataAdding={isDataAdding}/>
                    </Grid>

                    <Grid item xs={12}>
                        <AlertCard
                            title="Latest Alerts"
                            list={alertsList}
                            limit={10}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}
