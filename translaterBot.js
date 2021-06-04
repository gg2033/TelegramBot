const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

const token = "1761621470:AAEeCrK_TGjboC8yogsCsiaqnTE3Qakk6aM";
const bot = new TelegramBot(token, { polling: true });

//Inicializa el bot

bot.onText(/^\/start/, function(msg){
  var chatId = msg.chat.id;
  var username = msg.from.username;

  bot.sendMessage(
    chatId,
    "Hola, " +
      username +
      ", soy TranslaterBot y estoy aquí para ayudarte. ¿Qué quieres traducir?"
  );
});

const translater = (msg) => {
  const body = new URLSearchParams();
  body.append("q", msg);
  body.append("source", "es");
  body.append("target", "en");

  return fetch(
    "https://google-translate1.p.rapidapi.com/language/translate/v2",
    {
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "accept-encoding": "application/gzip",
        "x-rapidapi-key": "250f1d4343msh0c8d55a6ce658dap16bb9cjsn3655f6aed22c",
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
      },
      "body": body.toString(),
    })
    .then(res => res.json())
    .then(response => {
      return response.data.translations[0].translatedText;
    })
    .catch(err => {
      console.error(err);
    });
};

bot.on('message', async function(msg) {
  var chatId = msg.chat.id;

  const translation = await translater(msg.text);
  
  bot.sendMessage(chatId, translation);
});