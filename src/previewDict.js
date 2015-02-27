var log = require('winston');
log.add(log.transports.File, { filename: 'dict.log' });

var fs = require('fs');

fs.readFile("./resources/swedish_sv-ru.dict", 'utf8', function (err,data) {
  if (err) {
    return log.error(err);
  }
  
  var length = data.length;
  
  log.info('dict has %s symbols', length);
  
  var parser = new Parser();
  
  for (var i = 0; i < length; i++) {
	  var sym = data[i];
	  
	  parser.acceptChar(sym);
  }
  
  log.info('keys: %s', parser.inKeyCount);
  log.info('values: %s', parser.waitKeyCount);
});

Parser = function () {
	this.state = 'waitKey';
	this.currentChar;
	this.inKeyCount = 0;
	this.waitKeyCount = 0;
}

Parser.prototype.acceptChar = function(c) {
	this.currentChar = c;
	
	if (this.state == 'waitKey') {
		if (c == '<') {
			this.state = 'key<';
		}
	} else if (this.state == 'key<') {
		if (c == 'k') {
			this.state = 'keyk';
		} else {
			log.error('sequence breaked', this);
			this.state = 'waitKey';
		}
	} else if (this.state == 'keyk') {
		if (c == '>') {
			this.inKeyCount++;
			this.state = 'inKey';
		} else {
			log.error('sequence breaked', this);
			this.state = 'waitKey';
		}
	} else if (this.state == 'inKey') {
		if (c == '<') {
			this.state = 'inCloseKey<';
		}
	} else if (this.state == 'inCloseKey<') {
		if (c == '/') {
			this.state = 'inCloseKey/';
		} else if (c == 'k') {
			log.error('key opened when need to be closed', this);
			this.state = 'keyk';
		} else {
			log.error('sequence breaked', this);
			this.state = 'waitKey';
		}		
	} else if (this.state == 'inCloseKey/') {
		if (c == 'k') {
			this.state = 'inCloseKeyk';
		} else {
			log.error('sequence breaked', this);
			this.state = 'waitKey';
		}
	} else if (this.state == 'inCloseKeyk') {
		if (c == '>') {
			this.waitKeyCount++;
			this.state = 'waitKey';
		} else {
			log.error('sequence breaked', this);
			this.state = 'waitKey';
		}
	}
}