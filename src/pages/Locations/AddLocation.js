import React, {useState} from "react";

import {Container, Grid, Typography} from "@mui/material";
import Page from "../../components/Page";
import MapCard from "../../components/map/MapCard";
import AddLocationForm from "../../sections/@dashboard/location/AddLocationForm";

const AddLocation = () => {

    const [isDataAdding, setIsDataAdding] = useState(true);
    return (
        <Page title="Add Location">
            <Container maxWidth="xl">
                <Typography variant="h4" gutterBottom>
                    Add Locations
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} xl={4}>
                        <AddLocationForm handleDataAdding={setIsDataAdding}/>
                    </Grid>
                    <Grid item xs={12} xl={8}>
                        <MapCard title={'Safe Location Map'} handleDataAdding={setIsDataAdding}
                                 isDataAdding={isDataAdding}/>
                    </Grid>
                </Grid>
            </Container>
        </Page>
    )

}

export default AddLocation;