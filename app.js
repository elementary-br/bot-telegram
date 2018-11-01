#!/usr/bin/env nodejs

process.env["NTBA_FIX_319"] = 1;

var tbot = require('node-telegram-bot-api');
var watson = require('watson-developer-cloud');
var config = require('./config.json');

var conversation = new watson.AssistantV1({
  username: config.conversation.username,
  password: config.conversation.password,
  version: config.conversation.version
});

var context = {};
var telegramBot = new tbot(config.telegram.token, { polling: true });

telegramBot.on('message', function (msg) {
	var chatId = msg.chat.id;	
	
	conversation.message({
		workspace_id: config.conversation.workspaceId,
		input: {'text': msg.text},
		context: context
	},  function(err, response) {
		if (err)
			console.log('error:', err);
		else {
			context = response.context;

			if (response.output.text[0] != "")
				telegramBot.sendMessage(chatId, response.output.text[0]);
		}
	});	
});