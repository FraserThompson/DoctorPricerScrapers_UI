import React from 'react';
import config from 'config';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

class ErrorBar extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Snackbar action='' open={this.props.active}>
                    <Alert severity="warning" sx={{ width: '100%' }}>
                        {this.props.message}
                    </Alert>
            </Snackbar>
        );
    }
}

export default ErrorBar;