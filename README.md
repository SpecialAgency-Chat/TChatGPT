# ChatGPT
Reverse Engineered ChatGPT by OpenAI. Extensible for chatbots etc.

# Disclaimer
This is not an official OpenAI product. This is a personal project and is not affiliated with OpenAI in any way. Don't sue me

# Features
![image](https://user-images.githubusercontent.com/36258159/205534498-acc59484-c4b4-487d-89a7-d7b884af709b.png)
- No moderation
- Programmable

# Setup
## Install
`npm install tchatgpt`
## Get your session token
Go to https://chat.openai.com/chat and log in or sign up
1. Open console with `F12`
2. Open `Application` tab > Cookies
![image](https://user-images.githubusercontent.com/36258159/205494773-32ef651a-994d-435a-9f76-a26699935dac.png)
3. Copy the value for `__Secure-next-auth.session-token` and paste it into `config.json.example` under `session_token`. You do not need to fill out `Authorization`

# Running
```js
const { Chatbot } = require('tchatgpt');
const config = require('./config.json');
const chatbot = new Chatbot(config);
chatbot.refresh_session().then(() => {
    chatbot.get_chat_response('Hello').then(console.log);
});
```
**Make sure you run `refresh_session` if you are only using the `session_token`.**

Refresh every so often in case the token expires.
