var express = require('express');
var router = express.Router();

/**
 * alert POST endpoint
 *	url parameters: slackTeam, slackChannel, slackKey
 *	
 *  accept a post containing a rackspace cloud monitoring alert as JSON body.
 *  URL paramters will be used to forward the alert in Slack message attachment
 *  format to the specified slackTeam, slackChannel, using the specified webhook API
 *  key.
 **/
router.post('/:slackTeam/:slackChannel/:slackKey', function(req, res, next) {
  var slackKey = req.params.slackKey;
  var slackTeam = req.params.slackTeam;
  var slackChannel = req.params.slackChannel;
  var https = require("https");
  var options = {  
    hostname: 'hooks.slack.com',
    port: 443,  
    path: '/services/' + slackTeam + '/' + slackChannel + '/' + slackKey,
    method: 'POST',  
    headers: {      
      'Content-Type': 'application/json',  
    }
  };
  var slack = https.request(options, function(res) 
  {  
    console.log('POST Status: ' + res.statusCode);  
    console.log('POST Headers: ' + JSON.stringify(res.headers));  
  });
  slack.on('error', function(e) {  
    console.log('problem with POST request: ' + e.message);
  });
  // write data to request body
  console.log("Alert Body: " + JSON.stringify(req.body));
  var colors = {'critical': 'danger', 'warning': 'warning', 'ok': 'good'};
  var color = colors[req.body.details.state.toLowerCase()];
  var title = req.body.details.state.toUpperCase() + " (" + req.body.entity.label+ ") - " + req.body.alarm.label;
  var messageText = req.body.details.status;

  var message = {
    text: "*Rackspace Cloud Monitor Alert*",
    attachments: [
      {
        color: color,
        title: title,
        text: messageText,
      }
    ]
  };
  slack.write(JSON.stringify(message));
  slack.end();
  res.send('Ok');
});

module.exports = router;
