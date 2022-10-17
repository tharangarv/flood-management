import React, {useEffect, useState} from "react";
import {
    Card,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import CsvDownload from 'react-json-to-csv';

import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import {deleteLocation, getLocations} from "../../repository/map";
import {getComparator, applySortFilter} from "../../utils/table";
import {UserListHead, UserMoreMenu} from "../../sections/@dashboard/user";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";

import ListToolbar from '../../components/ListToolbar';
import AlertDialog from "../../components/AlertDialog";
import useAuth from "../../hooks/useAuth";
import EditLocationModel from "../../sections/@dashboard/location/EditLocationModel";
import errorHandler from "../../utils/errorHandler";

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'location', label: 'Location', alignRight: false},
    {id: 'longitude', label: 'Longitude', alignRight: false},
    {id: 'latitude', label: 'Latitude', alignRight: false},
    {id: ''},
];

const LocationList = () => {

    const {auth} = useAuth();

    const [locations, setLocations] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [alertDialog, setAlertDialog] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);
    const [editItem, setEditItem] = useState(null);

    const editModelClose = (id, name, longitude, latitude) => {
        setEditModel(false);
        setEditItem(null);

        const updatedLocations = locations.map(item => {
            if (item.id === id) {
                return {id, name, longitude, latitude};
            }
            return item;
        });

        setLocations(updatedLocations);
    };
    const editModelOpen = async (id, name, longitude, latitude) => {
        setEditModel(true);

        const item = {
            id,
            name,
            longitude,
            latitude
        };
        setEditItem(item);
    };

    const handleDeleteItem = (locationId) => {
        setDeleteItem(locationId);
        setAlertDialog(true);
    }

    const handleDeleteDialogClose = async (isAgreed) => {
        setAlertDialog(false);

        try {
            if (isAgreed && deleteItem) {
                await deleteLocation(deleteItem, auth.accessToken);
                const newLocationList = locations.filter(item => item.id !== deleteItem)
                setLocations(newLocationList);
                setDeleteItem(null);
            }
        } catch (e) {
            const messages = {
                e404: 'Location not found'
            };
            const options = {
                isSignOut: true
            }
            errorHandler(e, messages, options);
        }
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = locations.map((n) => n.name);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - locations.length) : 0;

    const filteredLocations = applySortFilter(locations, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredLocations.length === 0;

    useEffect(() => {
        (async () => {
            try {
                const data = await getLocations(auth.accessToken);
                setLocations(data?.items);
            } catch (e) {
                const messages = {
                    e404: 'No Markers'
                };
                const options = {
                    isSignOut: true
                }
                errorHandler(e, messages, options);
            }
        })()
    }, []);


    const downloadBtnStyles = {
        cursor: 'pointer',
        outline: 0,
        border: 0,
        margin: 0,
        verticalAlign: 'middle',
        fontWeight: 700,
        lineHeight: 1.7,
        fontSize: '0.875rem',
        fontFamily: 'Public Sans,sans-serif',
        minWidth: '64px',
        padding: '6px 16px',
        borderRadius: '8px',
        backgroundColor: '#2065D1',
        paddingLeft: 10,
        boxShadow: 'none',
        boxSizing: 'border-box',
        color: '#ffffff',
        textRendering: 'auto',
        textIndent: '0px',
        textShadow: 'none',
        textAlign: 'center',
    }

    return (
        <Page title='Location List'>
            <Container>
                <AlertDialog title={'Are you sure you want to delete?'} content={''}
                             handleClose={handleDeleteDialogClose} open={alertDialog}/>

                <EditLocationModel open={editModel} handleClose={editModelClose} item={editItem}/>

                <Stack direction="row" width={900} alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Locations
                    </Typography>
                    <CsvDownload
                        filename="Locations.csv"
                        data={locations}
                        style={downloadBtnStyles}>
                        <Iconify width={20} height={20} style={{marginRight: 7}}
                                 icon="carbon:document-download"/>
                        Download CSV
                    </CsvDownload>

                </Stack>

                <Card sx={{width: 900, alignItems: 'center'}}>
                    <ListToolbar numSelected={selected.length} filterName={filterName} type={'Location'}
                                 onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer>
                            <Table sx={{px: 4}}>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={locations.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredLocations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {

                                        const {id, name, longitude, latitude} = row;
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
                                                <TableCell align="left">
                                                    {name}
                                                </TableCell>
                                                <TableCell align="left">{longitude}</TableCell>
                                                <TableCell align="left">{latitude}</TableCell>
                                                <TableCell align="right">
                                                    <UserMoreMenu handleDelete={() => handleDeleteItem(id)}
                                                                  handleEdit={() => editModelOpen(id, name, longitude, latitude)}/>
                                                </TableCell>
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
                        count={locations.length}
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

export default LocationList;