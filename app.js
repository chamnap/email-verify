#!/usr/bin/env node

var arguments = process.argv.slice(2);

if (arguments.length === 0) {
    throw new Error('You must provide one or more email addresses.');
}

var addresses = [],
  domain = null,
  err_msg = null,
  options = {
    port : 25,
    sender : 'name@example.org',
    fdqn : 'mail.example.org'
  };

//todo: code refactoring
for (var i = 0 ; i < arguments.length ; i++) {
  if (arguments[i] === '-d') {
    if (arguments[++i]) {
      domain = '@' + arguments[i];
    }
    else {
      err_msg = 'Malformed Domain Command'; break;
    }
  }
  else if (domain && arguments[i] === '-n') {
    if (arguments[i + 1] && arguments[i + 2]) {

      var first = arguments[++i],
        firstletter = first.charAt(0),
        last = arguments[++i],
        lastletter = last.charAt(0);

      addresses.push(first + domain);
      addresses.push(last + domain);

      addresses.push(first + last + domain);
      addresses.push(first + '.' + last + domain);
      addresses.push(last + first + domain);
      addresses.push(last + '.' + first + domain);

      addresses.push(firstletter + last + domain);
      addresses.push(firstletter + '.' + last + domain);
      addresses.push(firstletter + lastletter + domain);
      addresses.push(firstletter + domain);

      addresses.push(last + firstletter + domain);
      addresses.push(last + '.' + firstletter + domain);
      addresses.push(first + lastletter + domain);
      addresses.push(first + '.' + lastletter + domain);

    }
    else {
      err_msg = 'Malformed Domain Command';
      break;
    }
  }
  else if (domain && arguments[i] === '-s') {
    require('./standard.json').addresses.forEach(function (val, index, array) {
      addresses.push(val + domain);
    });
  }
  else if (arguments[i] === '-sd' && arguments[i+1]) {
    options.sender = arguments[++i];
  }
  else if (arguments[i] === '-p' && arguments[i+1] && arguments[i+1] % 1 === 0) {
    options.port = arguments[++i];
  }
  else if (arguments[i] === '-t' && arguments[i+1] && arguments[i+1] % 1 === 0) {
    options.timeout = parseInt(arguments[++i]);
  }
  else if (arguments[i] === '-f' && arguments[i+1]) {
    options.fdqn = arguments[++i];
  }
  else if (arguments[i] === '-dns' && arguments[i+1]) {
    options.dns = arguments[++i];
  }
  else if (domain) {
    addresses.push(arguments[i] + domain);
  }
  else {
    addresses.push(arguments[i]);
  }
}

if (err_msg) {
  console.log(err_msg);
}
else {
  addresses.forEach(function (val, index, array) {
    var verifier = require('./index.js');
    verifier.verify(val, options, function (err, info) {
      console.log(info.log.join("\r\n"));
      if (!err && info.success) {
        console.log(info.addr);
      }
    });
  });
}
