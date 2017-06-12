var express = require('express');
var bodyParser = require('body-parser');
var requestModule = require('request');

var DataStore = require('nedb');
var path = require('path');

var jsonwebtoken = require('jsonwebtoken');

var port = (process.env.PORT || 800);
var app = express();


var db = new DataStore({
    filename: path.join(__dirname, 'contacts.db'),
    autoload: true
});

console.log('DB initialized');

// to be passed from ENV or Docker secret
var AUTH0_CLIENT_ID = '9XCr2Ef0OH2ijb9HqOIHrQelKtgkGjU9';
var AUTH0_SECRET = 'JH8-e-uY_9FFw97GLNL7P-AT0NW7i2TYSYnZb65zafAR5BUk92MfIvMZj98dhxkO';
var AUTH0_DOMAIN = 'us-ellocoyo.auth0.com';



// MIDDLEWARES //
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.use("/contacts", function (request, response, next) {
    function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }

    var token = fromHeaderOrQuerystring(request);

    console.log('Received token:', token);
    if (token) {
        try {
            var secret = new Buffer(AUTH0_SECRET, "base64");
            var verified = jsonwebtoken.verify(token, secret);
        } catch (err) {
            console.log("WARNING: invalid JWT signature");
        }
        if (verified) {
            if (verified.aud === AUTH0_CLIENT_ID) {
                requestModule({
                    method: 'POST',
                    uri: 'https://' + AUTH0_DOMAIN + '/tokeninfo',
                    headers: [
                        {
                            name: 'content-type',
                            value: 'application/x-www-form-urlencoded'
                        }
                    ],
                    form: {id_token: token}

                },
                        function (err, res, stringProfile) {

                            if (err) {
                                console.log('err', err);
                                response.status(401).send("You shall not pass. Error while getting user profile");
                            } else {
                                var profile = JSON.parse(stringProfile);
                                next();
                                console.log("A request to '" + response.req.url + "' from '" + profile["name"] + "' is being served");
                            }
                        });
            } else {
                console.log("Invalid JWT payload", verified);
                response.status(401).send("You shall not pass. Invalid JWT payload");
            }
        } else {
            console.log("Invalid JWT signature");
            response.status(401).send("You shall not pass. Invalid JWT signature");
        }
    } else {
        console.log("No token was given");
        response.status(401).send("You shall not pass. No token was given");
    }
});



// API //

// GET
app.get('/contacts', function (req, res) {
    console.log('New GET request');

    db.find({}, function (err, contacts) {

        if (err) {
            console.error('Error getting data from DB');
            return 0;
        }


        res.send(contacts);
    });
});


// POST
app.post('/contacts', function (req, res) {
    console.log('New POST request');
    console.log(req.body);
    db.insert(req.body);
    res.sendStatus(200);
});


// DELETE
app.delete('/contacts/:id', function (req, res) {
    var id = req.params.id;
    console.log('New DELETE request for contact with id ' + id);

    db.remove({_id: id}, {}, function (err, numRemoved) {

        if (err) {
            console.error('Error removing data from DB');
            return 0;
        }
        console.log("contacts removed: " + numRemoved);
        if (numRemoved === 1)
            res.sendStatus(200);
        else
            res.sendStatus(404);
    });
});


// initialization
db.find({}, function (err, contacts) {

    if (err) {
        console.error('Error getting initial data from DB');
        return 0;
    }

    if (contacts.length === 0) {
        console.log('Empty DB, loading initial data');

        var person1 = {
            name: 'Pablo',
            email: 'pafmon@gmail.com',
            number: '682 123 123'
        };

        var person2 = {
            name: 'Pedro',
            email: 'pedro@gmail.com',
            number: '682 122 126'
        };

        db.insert([person1, person2]);

    } else {
        console.log('DB has ' + contacts.length + ' contacts ');
    }

});

app.listen(port);
console.log('Magic is happening on port ' + port);