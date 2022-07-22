//extra () - function will be involved immediately after we required it in this file.
const routes = require('next-routes')();


//when users go to this link, then will show this page.
routes
    .add('/campaigns/new','campaigns/new')
    .add('/campaigns/:address', '/campaigns/detail')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');


module.exports = routes;

