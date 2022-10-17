import PropTypes from 'prop-types';
// form
import {useFormContext, Controller} from 'react-hook-form';
// @mui
import {MenuItem, Select, TextField} from '@mui/material';

// ----------------------------------------------------------------------

RHFDropDown.propTypes = {
    name: PropTypes.string,
    options: PropTypes.array
};

export default function RHFDropDown({name, options, ...other}) {
    const {control} = useFormContext();

    const generateSelectOptions = () => (options.map((option) => (
                <MenuItem key={option.user_role} value={option.user_role}>
                    {option.user_role}
                </MenuItem>
            )
        )
    );

    return (
        <Controller
            name={name}
            control={control}
            render={({field: {onChange, value}}) => (
                <Select onChange={onChange} value={value}>
                    {generateSelectOptions()}
                </Select>
            )}
        />
    );
}
