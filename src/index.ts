import axios, { type AxiosRequestHeaders } from "axios";
import { v4 } from 'uuid';

type ChatbotConfig = {
  Authorization?: string,
  session_token: string;
}

class Chatbot {
  public config: ChatbotConfig;
  public conversation_id: string | null;
  public parent_id: string
  public headers: AxiosRequestHeaders = {};
  public constructor(config: ChatbotConfig, conversation_id = null) {
    this.config = config;
    this.conversation_id = conversation_id;
    this.parent_id = this.generate_uuid();
    this.refresh_headers();
  }

  public reset_chat() {
    this.conversation_id = null;
    this.parent_id = this.generate_uuid()
  }
  private refresh_headers(){
    this.headers = {
      "Accept": "application/json",
      "Authorization": "Bearer " + this.config['Authorization'],
      "Content-Type": "application/json"
    }
  }

  private generate_uuid() {
    return v4();
  }

  public async get_chat_response(prompt: string) {
        const data = {
            "action":"next",
            "messages":[
                {"id":this.generate_uuid(),
                "role":"user",
                "content":{"content_type":"text","parts":[prompt]}
            }],
            "conversation_id":this.conversation_id,
            "parent_message_id":this.parent_id,
            "model":"text-davinci-002-render"
        }
    const response = await axios.post<string>("https://chat.openai.com/backend-api/conversation", data, { headers: this.headers });
    let response2;
    try {
      response2 = response.data.split("\n").at(-5);
    } catch {
      console.log(response.data);
      throw new TypeError("Error: Response is not a text/event-stream")
    }
    try {
      response2 = response2?.slice(6);
    } catch {
      console.log(response2)
      throw new TypeError("Response is not in the correct format")
    }
    response2 = JSON.parse(response2 as string);
    this.parent_id = response2["message"]["id"]
    this.conversation_id = response2["conversation_id"]
    const message = response2["message"]["content"]["parts"][0]
    return {'message':message, 'conversation_id':this.conversation_id, 'parent_id':this.parent_id}
  }

  public async refresh_session() {
    if (!('session_token' in this.config)) {
      throw new TypeError("No session token provided")
    }
    const s = axios.create({ withCredentials: true, headers: { cookie: `__Secure-next-auth.session-token=${this.config['session_token']}; ` }, validateStatus: () =>true });
    // Set cookies
    const response = await s.get("https://chat.openai.com/api/auth/session");
        try {
            this.config['session_token'] = response.headers["set-cookie"]!.join("").match(/__Secure-next-auth.session-token=.+?;/)![0]!.replace("__Secure-next-auth.session-token=", "").replace(";", "");
            this.config['Authorization'] = response.data["accessToken"]
            this.refresh_headers()
        } catch (e) {
            console.log("Error refreshing session");
            console.log(response.data);
        }
  }
}
export { Chatbot };