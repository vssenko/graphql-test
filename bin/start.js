const http = require('http');
const args = require('minimist')(process.argv);

const app = require('../src/app');

const server = http.createServer(app);
server.listen(args.port || 3000);