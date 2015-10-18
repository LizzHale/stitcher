var express = require('express');
var formidable = require('formidable');

var app = express();
var port = process.env.PORT || 8080;

var handlebars = require('express-handlebars')
    .create({ defaultLayout: 'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/upload', function(req, res) {
    var now = new Date();
    res.render('upload/upload-gpx', {
        year: now.getFullYear(),month: now.getMonth()
    });
});

app.get('/thank-you', function(req, res) {
    res.render('thank-you');
});

app.post('/upload/:year/:month', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) return res.redirect(303, '/error');
        console.log('received fields:');
        console.log(fields);
        console.log('received files:');
        console.log(files);
        res.redirect(303, '/thank-you');
    });
});

app.listen(port, function() {
    console.log('Express started on http://localhost:' +
        port + '; press Ctrl-C to terminate.');
});