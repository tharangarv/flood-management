import React, {useEffect, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
} from '@mui/material';
import {toast} from "react-toastify";
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import {UserListHead, UserListToolbar, UserMoreMenu} from '../../sections/@dashboard/user';
import {getComparator, applySortFilter} from "../../utils/table";
import useAuth from "../../hooks/useAuth";
import {deleteUser, getUsers} from "../../repository/user";
import errorHandler from "../../utils/errorHandler";
import AlertDialog from "../../components/AlertDialog";


// ----------------------------------------------------------------------

const TABLE_HEAD = [
    {id: 'id', label: 'ID', alignRight: false},
    {id: 'name', label: 'Name', alignRight: false},
    {id: 'email', label: 'Email', alignRight: false},
    {id: 'role', label: 'Role', alignRight: false},
    {id: ''},
];


export default function User() {

    const {auth} = useAuth();

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [alertDialog, setAlertDialog] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

    const filteredUsers = applySortFilter(users, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    const handleDeleteItem = (email) => {
        setDeleteItem(email);
        setAlertDialog(true);
    }

    const handleDeleteDialogClose = async (isAgreed) => {
        setAlertDialog(false);

        try {
            if (isAgreed && deleteItem) {
                await deleteUser(deleteItem, auth.accessToken);
                const newUsersList = users.filter(item => item.email !== deleteItem)
                setUsers(newUsersList);
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

    useEffect(() => {
        (async () => {
            try {
                const usersList = await getUsers(auth.accessToken);

                if (!usersList?.items) {
                    return toast.info("No users");
                }
                setUsers(usersList.items);
            } catch (e) {
                const options = {
                    isSignOut: true
                }
                errorHandler(e, null, options);
            }
        })()
    }, []);

    return (
        <Page title="User">
            <Container>
                <AlertDialog title={'Are you sure you want to delete?'} content={''}
                             handleClose={handleDeleteDialogClose} open={alertDialog}/>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Users
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="/dashboard/user/add"
                            startIcon={<Iconify icon="eva:plus-fill"/>}>
                        New User
                    </Button>
                </Stack>

                <Card>
                    <UserListToolbar numSelected={selected.length} filterName={filterName} type={'User'}
                                     onFilterName={handleFilterByName}/>

                    <Scrollbar>
                        <TableContainer sx={{minWidth: 800}}>
                            <Table>
                                <UserListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={users.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                                        const {name, role, email} = row;
                                        const isItemSelected = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}
                                                role="checkbox"
                                                selected={isItemSelected}
                                                aria-checked={isItemSelected}
                                            >
                                                <TableCell align="left" sx={{fontWeight: '700'}}>{index + 1}</TableCell>
                                                <TableCell align="left">
                                                    {name}
                                                </TableCell>
                                                <TableCell align="left">{email}</TableCell>
                                                <TableCell align="left">{role}</TableCell>
                                                <TableCell align="right">
                                                    <UserMoreMenu isEditEnabled={false}
                                                                  handleDelete={() => handleDeleteItem(email)}/>
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
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card>
            </Container>
        </Page>
    );
}
