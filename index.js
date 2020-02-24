exports.authorize_request_with_secret_param = (req, res) => {

  // Authentication from the HEADER
  // res.send(req.headers.my_token);

  // Authentication from PARAMS
  return (req.body.auth || req.query.auth) == 'LUKELOVE';
};

exports.initHTTP = (req, res) => {
  if( !(exports.authorize_request_with_secret_param(req, res)) ){
    res.sendStatus(401).end();
    return false;
  }
  return true;
};

exports.pubsubMessageString = (pubsubMessage) => {
  const messageString = Buffer.from(pubsubMessage.data, 'base64').toString('utf-8');
  return messageString;
};

exports.pubsubMessageJSON = (pubsubMessage) => {
  return JSON.parse( exports.pubsubMessageString(pubsubMessage) );
};

exports.publishMessage = async function publishMessage(topicName, json) {
  console.log("publishMessage: ", topicName, json)
  var timestamp = new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '')

  const {PubSub} = require('@google-cloud/pubsub');
  const pubSubClient = new PubSub();
  const topic = pubSubClient.topic(topicName);

  const callback = (err, messageId) => {
    if (err) {
      console.log("publish error ", err, topicName, json);
    }else{
      console.log(`Message ${messageId} published.`);
    }
  };
  await topic.publishJSON(json, callback); // https://googleapis.dev/nodejs/pubsub/latest/Topic.html#publishJSON
};
