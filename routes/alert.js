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
  var slack = require('request');

  console.log("Alert Body: " + JSON.stringify(req.body));

  var colors = {'critical': 'danger', 'warning': 'warning', 'ok': 'good'};
  var color = colors[req.body.details.state.toLowerCase()];
  var title = req.body.details.state.toUpperCase() + " (" + req.body.entity.label+ ") - " + req.body.alarm.label;
  var messageText = "*Message:* " + req.body.details.status + "\n" + "*Timestamp:* " + new Date(req.body.details.timestamp).toISOString();

  var slackMessage = {
    text: "*Rackspace Cloud Monitor Alert*",
    attachments: [
      {
        color: color,
        title: title,
        text: messageText,
        mrkdwn_in: ["text"]
      }
    ]
  };

  var postOptions =  {
      url: 'https://hooks.slack.com/services/' + slackTeam + '/' + slackChannel + '/' + slackKey,
      method: 'POST',
      port: 443,
      headers: {      
        'Content-Type': 'application/json',  
      },
      json: slackMessage
  };

  var postComplete = function(error, response, body) {
      if(error) {
          console.log(error);
      } else {
          console.log(response.statusCode, body);
      }
    };

  slack(postOptions, postComplete);
});

// export the router for alert end point
module.exports = router;
