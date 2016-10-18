var request = require('request');
var Context = require('./models/Context');

module.exports = function (app) {

    app.post('/getIntent', function (req, res) {
        if(!req.body || !req.body.text || !req.body.userId) {
            res.status(400).send({
                message : "Invalid input"
            })
        }
        var userId = req.body.userId;
        var textToParse = req.body.text;
        var options = {
            method: 'POST',
            url: 'http://api.meaningcloud.com/class-1.1',
            headers: {'content-type': 'application/x-www-form-urlencoded'},
            form: {
                key: '0caf55009f1de55222b4d258387fb9b8',
                txt: textToParse,
                model: "Bot"
            }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var result = JSON.parse(body);
            console.log(result.status);
            var cat_list = result.category_list;
            var intent = "empty";
            if (cat_list && cat_list.length > 0) {
                console.log(cat_list[0]);
                intent = cat_list[0].code;
            }
            res.status(200).send({
                intent: intent
            });
            var context = new Context();
            context.userId = userId;
            context.intent = intent;
            context.save(function(err){
                if(err){}
            })
        });
    });

};
