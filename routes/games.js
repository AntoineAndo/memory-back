var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
	_id 	: String,
	time 	: Number,
	date 	: { type: Date, default: Date.now },
});

router.get('/', function(req, res, next) {

	//Connexion à la BDD
	mongoose.connect('mongodb+srv://oclock_user:SGWrmgw8iepb3evs@cluster0.ofx2k.mongodb.net/memory_oclock?retryWrites=true&w=majority', {
		useNewUrlParser 	: true,
		useUnifiedTopology 	: true,
		useFindAndModify 	: false,
		useCreateIndex 		: true
	});

	let gameModel = mongoose.model('game', GameSchema );

	//Recherche d'une game correspondant au gameID de l'url
	gameModel.find({}, function (err, docs) {
		if(err){
			console.error(err);
			return res.json({
				"status"	: "KO",
				"message"	: "Erreur technique",
				"info"		: err
			})
		}

  		return res.json({
				"status"	: "OK",
				"message"	: "Game loaded",
				"data"		: docs
		});

  		//Fermeture de la connexion
  		mongoose.connection.close()
	});
});

router.post('/', function(req, res, next){

	//Connexion à la BDD
	mongoose.connect('mongodb+srv://oclock_user:SGWrmgw8iepb3evs@cluster0.ofx2k.mongodb.net/memory_oclock?retryWrites=true&w=majority', {
		useNewUrlParser		: true,
		useUnifiedTopology	: true,
		useFindAndModify	: false,
		useCreateIndex		: true
	});

	let gameModel = mongoose.model('game', GameSchema );

	//Instanciation d'un nouveau model Mongo de type Game avec les valeurs passées dans la requête
	let game = new gameModel();
	game._id 	= req.body.gameID;
	game.time 	= req.body.time

	let data = game.toObject();

	//Sauvegarde ou mise à jour de la Game
	gameModel.findOneAndUpdate({_id : game._id}, game, {upsert: true}, function (err, doc) {
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

  		//Fermeture de la connexion
  		mongoose.connection.close()
	});

})

module.exports = router;
