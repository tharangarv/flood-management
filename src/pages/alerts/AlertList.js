import React, {useEffect, useState} from "react";
import {
    Card,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";

import Page from "../../components/Page";
import ListToolbar from "../../components/ListToolbar";
import Scrollbar from "../../components/Scrollbar";
import {UserListHead} from "../../sections/@dashboard/user";
import SearchNotFound from "../../components/SearchNotFound";
import {applySortFilter, getComparator} from "../../utils/table";
import errorHandler from "../../utils/errorHandler";
import {getAlerts} from "../../repository/alert";
import useAuth from "../../hooks/useAuth";
import {fDateTimeSuffix} from "../../utils/formatTime";

export const AlertList = () => {

    const {auth} = useAuth();

    const TABLE_HEAD = [
        {id: 'id', label: 'ID', alignRight: false},
        {id: 'alertName', label: 'Alert Title', alignRight: false},
        {id: 'alertBody', label: 'Alert Body', alignRight: false},
        {id: 'timestamp', label: 'Time Stamp', alignRight: false}
    ];

    const [alerts, setAlerts] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = alerts.map((n) => n.alertName);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - alerts.length) : 0;

    const filteredAlert = applySortFilter(alerts, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredAlert.length === 0;

    useEffect(() => {
        (async () => {
            try {
                const data = await getAlerts(auth.accessToken, false);
                const convertedAlerts = data?.items.map(alert => (
                    {
                        id: alert.id,
                        name: alert.alert_name,
                        body: alert.alert_body,
                        timestamp: alert.timestamp
                    }
                ));
                setAlerts(convertedAlerts);

            } catch (e) {
                const messages = {
                    e404: 'No Alerts'
                };
                const options = {
                    isSignOut: true
                }
                errorHandler(e, messages, options);
            }
        })()
    }, []);

    return (
        <Page title='Location List'>
            <Container>
                <Stack direction="row" width={900} alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Alerts
                    </Typography>
                </Stack>

                <Card sx={{width: 900, alignItems: 'center'}}>
                    <ListToolbar numSelected={selected.length} filterName={filterName} type={'Alert'}
                                 onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer>
                            <Table sx={{px: 4}}>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={alerts.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredAlert.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                                        const {id, timestamp, name, body} = row;

                                        const isItemSelected = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={id}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell component="th" scope="row"
                                                           sx={{fontWeight: 700}}>{id}</TableCell>
                                                <TableCell align="left">{name}</TableCell>
                                                <TableCell align="left">{body}</TableCell>
                                                <TableCell align="left">{fDateTimeSuffix(timestamp)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{height: 53 * emptyRows}}>
                                            <TableCell colSpan={6}/>
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isUserNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{py: 3}}>
                                                <SearchNotFound searchQuery={filterName}/>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={alerts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>

    )

}