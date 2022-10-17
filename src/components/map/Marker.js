import React from "react";
import {Box} from "@mui/material";
import {Icon} from "@iconify/react";


const Marker = ({name, ...otherProps}) => {
    const allProps = {
        color: (theme) => theme.palette.info.main,
        ...otherProps
    };

    const textStyle = {
        textAlign: 'center',
        fontWeight: 700,
        fontStyle: 'italic'
    }

    return (
        <>
            <Box component={Icon} icon={'majesticons:map-marker-area'} width={34}
                 height={34} {...allProps}
            />
            <p style={textStyle}>{name}</p>
        </>
    );
}


export default Marker;