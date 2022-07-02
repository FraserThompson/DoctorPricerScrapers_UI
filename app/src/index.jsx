import React from 'react';
import ReactDOM from 'react-dom/client';
import ScraperApp from './ScraperApp';

require('../CNAME')

const container = document.getElementById('react-app')
const root = ReactDOM.createRoot(container);
root.render(<ScraperApp/>);