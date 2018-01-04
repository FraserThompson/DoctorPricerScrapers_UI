import React from 'react';
import config from 'config';
import { Snackbar } from 'react-toolbox/lib/snackbar';

class ErrorBar extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Snackbar
                action=''
                active={this.props.active}
                label={this.props.message}
                ref='snackbar'
                type='warning'
                />
            </div>
        );
    }
}

export default ErrorBar;