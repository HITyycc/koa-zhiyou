import Router from "koa-router";
import { DefaultState, Context, Next } from "koa";
import chatController from "@src/controller/chat";

const routers = new Router<DefaultState, Context>();

routers.prefix("/chat");

routers.get("/createnewconveration", chatController.createNewConveration);
routers.get("/getConversationList", chatController.getConversationList);
routers.get("/getChatContentList", chatController.getChatContentList);
routers.post("/insertChatContentList", chatController.insertChatContentList);
routers.post("/getChatGptResponse", chatController.getChatGptResponse);

export default routers;
