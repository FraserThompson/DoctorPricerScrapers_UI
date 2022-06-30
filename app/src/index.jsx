import React from 'react';
import ReactDOM from 'react-dom';
import ScraperApp from './ScraperApp';

require('../CNAME')

ReactDOM.render(
    <ScraperApp/>,
    document.getElementById('react-app')
);