var log = require('winston');
log.add(log.transports.File, { filename: 'dict.log' });

var fs = require('fs');

fs.readFile("./resources/swedish_sv-ru.json", 'utf8', function (err,data) {
  if (err) {
    return log.error(err);
  }
  
  var length = data.length;  
  log.info('dict has %s symbols', length);

  var dict = JSON.parse(data);
  var complexKeyCount = 0;
  
  var outDict = {};
  
  for (var key in dict) {
	  if (dict.hasOwnProperty(key)) {
		  if (key.indexOf(' ') !== -1) {
			  var value = dict[key];
			  var parts = key.split(' ');
			  
			  var newKey = parts[0];
			  var goodPartsCount = parts.length;
			  
			  for (var i = 1; i < parts.length; i++) {
				  var part = parts[i];
				  if (part == '' || part == 'ngn' || part == 'ngt' || part == 'ngnngt' || part == 'arsvamp'
						|| part == 'en' || part == 'et'						
						|| part == 'konj' || part == 'prep' || part == 'v' || part == 'el'
						|| part == 'adv' || part == 's' || part == 'a' || part == 'pron' || part == 'def'
						|| part == '1' || part == '2' || part == '3' || part == '4'
						|| value.indexOf('pl.') !== -1
						|| value.indexOf('-' + part) !== -1
						|| (value.indexOf('-') !== -1 && part.indexOf('er') == part.length - 2)
						) {
					  goodPartsCount--;
				  } else {
					  newKey += " " + part;
				  }
			  }
			  
			  if (goodPartsCount > 1) {
				  complexKeyCount++;
				  outDict[newKey] = value;
			  }
		  }			  
	  }
  }
  
  fs.writeFile("./resources/phrases.json", JSON.stringify(outDict));

  log.info('dict has %s keys', complexKeyCount);
});
