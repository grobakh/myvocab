var log = require('winston');
log.add(log.transports.File, { filename: 'dict.log' });

log.info('hello', log);