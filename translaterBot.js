require("dotenv").config();
const { telegramApiToken, rapidapiKey, HEROKU_URL } = process.env;

const TelegramBot = require("node-telegram-bot-api");
const fetch = require("node-fetch");
const { URLSearchParams } = require("url");

if (process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(telegramApiToken);
  bot.setWebHook(process.env.HEROKU_URL + bot.telegramApiToken);
} else {
  bot = new TelegramBot(telegramApiToken, { polling: true });
}


bot.onText(/^\/start/, function (msg) {

  const chatId = msg.chat.id;
  const username = msg.from.username;

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
        "x-rapidapi-key": rapidapiKey,
        "x-rapidapi-host": "google-translate1.p.rapidapi.com",
      },
      "body": body.toString(),
    }
  )
    .then(res => res.json())
    .then(response => {
      return response.data.translations[0].translatedText;
    })
    .catch(err => {
      console.error(err);
    });
};

bot.on("message", async function (msg) {
  
  const chatId = msg.chat.id;

  const translation = await translater(msg.text);

  bot.sendMessage(chatId, translation);
});


