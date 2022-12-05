import { Chatbot } from "../dist/index.js";
const chatbot = new Chatbot({
});
await chatbot.refresh_session();
const res = await chatbot.get_chat_response("Hello");
console.log(res);