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
  // Get slack integration parameters from URL
  var slackKey = req.params.slackKey;
  var slackTeam = req.params.slackTeam;
  var slackChannel = req.params.slackChannel;

  // Create slack hhtp request object
  var slack = require('request');

  // Build slack message from alert data
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

  // Set https post options
  var postOptions =  {
      url: 'https://hooks.slack.com/services/' + slackTeam + '/' + slackChannel + '/' + slackKey,
      method: 'POST',
      port: 443,
      headers: {      
        'Content-Type': 'application/json',  
      },
      json: slackMessage
  };

  // callback for post action
  var postComplete = function(error, response, body) {
      if(error) {
          // Send error back to response
          res.status(response.statusCode).send(body)
          console.log("Post to slack not successful = " + error);
      } else {
          // send completion status code back to response
          res.status(response.statusCode).send(body)
          console.log("Post to slack successful - " + response.statusCode, body);
      }
    };

  // send the message to slack
  slack(postOptions, postComplete);
});

// export the router for alert end point
module.exports = router;
