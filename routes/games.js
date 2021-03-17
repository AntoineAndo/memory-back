var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;



//var Game = require('../model/game');

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.json({ message: 'User Show' });
});

router.post('/', function(req, res, next){

	console.log("REQUEST");
	console.log(req);
	console.log(req.body);

	mongoose.connect('mongodb+srv://oclock_user:SGWrmgw8iepb3evs@cluster0.ofx2k.mongodb.net/memory_oclock?retryWrites=true&w=majority', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	});

	const GameSchema = new Schema({
		gameID: String,
		cards: [],
		pairNumber: { type: Number, default: 5},
		pairFound: Number,
		date: { type: Date, default: Date.now },
	});

	let gameInstance = mongoose.model('game', GameSchema );

	let game = new gameInstance();
	game.gameID 	= req.body.gameID;
	game.cards 		= req.body.cards;
	game.pairNumber = req.body.pairNumber;
	game.pairFound 	= req.body.pairFound;

	console.log("game to save");
	console.log(game);

	game.save(function (err) {
		if(err){
			console.error(err);
			return res.json({
				"status"	: "KO",
				"message"	: "error inserting the game",
				"info"		: err
			})
		}

  		return res.json({
				"status"	: "OK",
				"message"	: "Game saved",
				"info"		: ""
		});

  		mongoose.connection.close()
	});
	/*
	const collection = db.collection('games');

	collection.insertMany([req.body
	], function(err, result) {
		if(!err)
			res.status(200).json(result);
	});
	*/

})

module.exports = router;
