var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//MONGOOSE MODEL (move this this to models folder later)
var inkSchema = new Schema({
  ink: { type: String , unique: true, required: true},
  location: [{type: String}]
});

var Ink = mongoose.model('Ink', inkSchema);

module.exports = Ink;
//END MONGOOSE MODEL