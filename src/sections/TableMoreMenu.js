import {useRef, useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
// material
import {Menu, MenuItem, IconButton, ListItemIcon, ListItemText} from '@mui/material';
// component
import Iconify from '../components/Iconify';

// ----------------------------------------------------------------------

export default function TableMoreMenu({handleDelete, handleEdit, isEditEnabled = true}) {
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const onClickItem = (type) => {
        setIsOpen(false);
        return type === 'delete' ? handleDelete() : handleEdit();
    }

    return (
        <>
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20}/>
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: {width: 200, maxWidth: '100%'},
                }}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <MenuItem sx={{color: 'text.secondary'}}>
                    <ListItemIcon>
                        <Iconify icon="eva:trash-2-outline" width={24} height={24}/>
                    </ListItemIcon>
                    <ListItemText onClick={() => onClickItem('delete')} primary="Delete"
                                  primaryTypographyProps={{variant: 'body2'}}/>
                </MenuItem>

                {isEditEnabled && (
                    <MenuItem component={RouterLink} to="#" sx={{color: 'text.secondary'}}>
                        <ListItemIcon>
                            <Iconify icon="eva:edit-fill" width={24} height={24}/>
                        </ListItemIcon>
                        <ListItemText onClick={() => onClickItem('edit')} primary="Edit"
                                      primaryTypographyProps={{variant: 'body2'}}/>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
}
