// IMPORTANT LINE
 app.use(express.static(__dirname + '/public'));
 
var restify = require('restify');
var builder = require('botbuilder');

// Get secrets from server environment
var botConnectorOptions = { 
    appId: '943a9d85-a72c-468d-b9c0-29176d8c0a34',
    appPassword: 'gMJ5LmkcE7yTeJGzmFtqLhZ'
};

// Create bot
var connector = new builder.ChatConnector(botConnectorOptions);
var bot = new builder.UniversalBot(connector);

//Waterfall + Dialog
bot.dialog('/',[
    function(session) {
        builder.Prompts.text(session, 'Hello , what is your name?')
    },
    function(session, args, next){
        session.send('Hello '+ args.response+ ', nice to meet you '  ); //Waterfall
        session.beginDialog('/step2')
    }

]);

bot.dialog('/step2', function(session) { //step for Dialog
    session.send("How can I help you?");
    session.endConversation();
})

// Setup Restify Server
var server = restify.createServer();

// Handle Bot Framework messages
/*here we are giving path as "/api/messages" because during the process of regi9stering bot we have given end point URL as "azure qwebapp url/api/messages" if you want to give some other url give the same url whatever you give in the endpoint excluding azure webapp url */
server.post('/api/messages', connector.listen());

// Serve a static web page
server.get(/.*/, restify.serveStatic({
        'directory': '.',
        'default': 'index.html'
}));

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
