var express = require('express');
var request = require('request');
//var cards = require('../data/cards.json');
var members = require('../data/members.json');
var router = express.Router();

// Event dispatcher
var events = require('events');
var eventEngine = new events.EventEmitter();

// Card reader
var pcsc = require('pcsclite');
var pcsc = pcsc();
pcsc.on('reader', function(reader) {
	console.log('Detected ' + reader.name);

	reader.on('status', function(status) {
		var changes = this.state ^ status.state;
		if (!changes)
			return;

		// Card removed
		if ((changes & this.SCARD_STATE_EMPTY) && (status.state & this.SCARD_STATE_EMPTY)) {
			reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
				console.log('Card removed');

			});
			return;
		}

		// Detected card
		if ((changes & this.SCARD_STATE_PRESENT) && (status.state & this.SCARD_STATE_PRESENT)) {
			console.log('Detected card');
			reader.connect({ share_mode : this.SCARD_SHARE_SHARED }, function(err, protocol) {
				if (err) {
					console.err(err);
					return;
				}

				// Getting serial number
				reader.transmit(new Buffer([0xFF, 0xCA, 0x00, 0x00, 0x00]), 40, protocol, function(err, data) {
					eventEngine.emit('passed', data.toString('hex'));
				});
			});
		}
	});
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/checkmember/:memberno', function(req, res) {
	for (var index in members) {
		var member = members[index];

		if (member.regno == req.params.memberno) {
			res.json(member);
			break;
		}
	}

	res.status(404).end();
});

router.get('/cardreader', function(req, res) {

	eventEngine.once('passed', function(token) {
		res.json({
			token: token
		});
	});
});

router.post('/opencard', function(req, res) {
	request.post({
		url: 'http://localhost:3001/opencard',
		json: true,
		body: {
			email: req.body.email,
			cardno: req.body.cardno,
			token: req.body.token
		}
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			res.json({});
		}
	});


});

module.exports = router;
