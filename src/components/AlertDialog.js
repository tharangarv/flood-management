import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AlertDialog = ({title, content, open, handleClose}) => (
    <div>
        <Dialog
            open={open}
            onClose={() => handleClose(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleClose(false)}>Disagree</Button>
                <Button onClick={() => handleClose(true)} autoFocus>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    </div>
);

export default AlertDialog;
