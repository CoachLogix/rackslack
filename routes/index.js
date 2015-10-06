var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
      title: 'RackSlack', 
      info: 'A generic RackSpace Cloud Monitoring Alert integration with Slack',
      usage: 'To use, congigure your Rackspace Cloud Monitoring nofication plan to send a webhook to ' +
              'https://rackslack.herokuapp.com/alert/<slackTeamId>/<slackChannelId/<slackIntegrationId>'
    });
});

module.exports = router;
