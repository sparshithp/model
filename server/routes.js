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
        var textToParseURLFormat = encodeURI(req.body.text);
        console.log(textToParseURLFormat);
        var options = {
            method: 'GET',
            url: 'https://api.wit.ai/message?v=20161019&q='+textToParseURLFormat,
            auth: {
                'bearer': 'GKIQYF7KBTWBDI7S5JAXU6M7UFKK5HWN'
            }
        };


        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            console.log(body);
            var result = JSON.parse(body);
            console.log(result.status);
            var entities = result.entities;
            var slots = [];
            for(var key in entities) {
                var entity = (entities[key][0]);
                if(entity.confidence > 0.5 && key != "intent") {
                    var slot = {};
                    slot[key] = entity.value;
                    slots.push(slot);
                }
            }
            console.log(slots);
            var intentList = entities.intent;
            var intent = "empty";
            if (intentList && intentList.length > 0) {
                intent = intentList[0].value;
            }
            res.status(200).send({
                intent: intent,
                slots: slots
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
