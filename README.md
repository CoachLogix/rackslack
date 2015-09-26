# rackslack
A nodejs service to allow Rackspace Cloud Monitoring alerts to be sent to Slack.

# Background
Rackspace provides a Cloud Monitoring service which can be configured to issue alarms notifications based on a wide
variety of metrics.  Rackspace provide four mechanisms for sending alarms: email, sms, and pagerduty, and webhooks. Unfortunately no direct Slack integration is available from the Rackspace service.  

# Purpose
This nodejs service provides a team agnostic https POST endpoint for the Rackspace Cloud Monitoring service to use.
The Rackspace sevice will sent an alarm to this serbice, which in turn
will be re-packaged and forwarded to a Slack incomming webhook integration.  The re-packaging creates a Slack message
payload with basic alarm information, and color coded based on alarm status.  Parameters passed in the webhook from 
Rackspace specify the Slack API Key, Slack Team ID, and Slack Channel in which to post the notification. These 
parameters are provided by Slack when you create the "Incomming Webhook" integration.

