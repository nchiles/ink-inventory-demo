const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const mongoose = require('mongoose');
const Ink = require('./models/ink');
const methodOverride   = require("method-override")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(methodOverride("_method"))

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs')

mongoose.connect(process.env.MONGO_DB, { 
  useCreateIndex: true,
  useNewUrlParser: true 
});

app.listen(port);
console.log('Server running on port ' + port);

var locationArray = [
    'NTMD',
    'SHLF',
    'C218',
    'C312',
    'C318',
    'GA18',
    'MANL',
    'SMPL',
    'SP10', 
    'SP14'
]

app.get('/', (req, res, next) => {
  Ink.find({}, (err, allInks) => {
    if (err)
      return next(err);
    res.render('index', { ink: allInks, locationArray: locationArray });
  });
});

app.get('/search', (req, res, next) => {
  Ink.findOne({ ink: req.query.q }, (err, foundInk) => {
    console.log(foundInk);
    if (err)
      return res.status(500).json({ error: err.message });
    res.json({ data: foundInk, locationArray: locationArray });
  });
});

//LIST OF STRINGS FOR AUTOCOMPLETE ON SEARCH BOX
app.get('/inklist', function(req, res){
	Ink.distinct("ink", function(err, allInks) {
		if(err){
			console.log(err);
		} else {
      res.json(allInks); 
    }  	
  })
});

//ADD INK TO DATABASE
app.post('/add-ink', (req, res) => {
  var ink = req.body.ink

  var newInk = {
    ink: ink
  }

  Ink.create(newInk, function(err, result, next) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        //duplicate ink
        res.status(422).json({ success: false, error: 'ink already exists' })
        console.log("duplicate")
      } else {
        //other error
        console.log(err)
        return res.status(422).send(err);
      }
    } else {
        console.log(result);
        res.status(200).json({ message: 'success' });
        // res.render('add-ink')
    }
  })
})

// UPDATE LOCATION FROM HOME
app.put('/:id', function(req, res){
	Ink.findByIdAndUpdate(req.params.id, req.body.ink, function(err, updatedInk){
		if(err) {
			res.send("error");
		} else {
      res.redirect("/", "edit", {ink: updatedInk});
      console.log("Location Updated")
		}
	});
});

//DELETE INK
// app.get('/delete/:id', function(req, res){
//   Ink.deleteOne({_id: req.params.id}, function(err){
//     if(err) {
//       console.log(err);
//       res.json(err);
//     } 
//     else {
//       console.log("Ink Deleted")
//     }
//     res.redirect("/all-inks");
//   });
// });	  

//GET ALL INKS IN DATABASE
app.get("/all-inks", function(req, res){
  Ink.find({}, function(err, allInks){
    if(err){
        console.log(err);
    } else {
      res.render("all-inks", { ink: allInks, locationArray: locationArray });
    }
  }).sort({"ink": 1});
});

// UPDATE LOCATION FROM ALL-INKS
app.put('/all-inks/:id', function(req, res){
	Ink.findByIdAndUpdate(req.params.id, req.body.ink, function(err, updatedInk){
		if(err) {
			res.send("error");
		} else {
      res.redirect("/all-inks", "edit", {ink: updatedInk});
      console.log("Location Updated")
		}
	});
});

//DUPLICATE INK
app.post('/inventory', (req, res) => {
  var ink = req.body.ink

  var newInk = {
    ink: ink
  }

  Ink.create(newInk, function(err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(result);
    } 
    res.redirect('/all-inks')
  })
})

