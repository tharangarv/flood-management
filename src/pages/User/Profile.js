import React from "react";
import {Box, Container, Tab, Typography} from "@mui/material";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import ChangePassword from "../../sections/profile/ChangePassword";

const Profile = () => {

    const [value, setValue] = React.useState('1');

    const handleChange = (_event, newValue) => {
        setValue(newValue);
    };

    const getIcon = (icon) => <Iconify icon={icon} width={22} height={22}/>

    return (
        <Page title="Add Location">
            <Container maxWidth="xl">
                <Typography variant="h4" gutterBottom>
                    Profile
                </Typography>
                <Box sx={{width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} aria-label="user profile">
                                <Tab label="Change Password" value="1" iconPosition='start'
                                     icon={getIcon("ri:lock-password-fill")}/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Container>
                                <ChangePassword/>
                            </Container>
                        </TabPanel>
                    </TabContext>
                </Box>
            </Container>
        </Page>
    )
}

export default Profile;