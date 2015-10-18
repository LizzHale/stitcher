var express = require('express');
var formidable = require('formidable');

var app = express();
var port = process.env.PORT || 8080;

var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

var jqupload = require('jquery-file-upload-middleware');

app.use('/upload', function(req, res, next){
    var now = Date.now();
    jqupload.fileHandler({
        uploadDir: function(){
            return __dirname + '/public/uploads/' + now;
        },
        uploadUrl: function(){
            return '/upload/' + now;
        },
    })(req, res, next);
});

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/contest', function(req, res) {
    var now = new Date();
    res.render('upload/upload-gpx', {
        year: now.getFullYear(),month: now.getMonth()
    });
});

app.get('/thank-you', function(req, res) {
    res.render('thank-you');
});

app.post('/contest/:year/:month', function(req, res) {
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