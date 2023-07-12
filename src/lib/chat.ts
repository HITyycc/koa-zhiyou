import Koa from "koa";
import { decimalTo62, base62ToDecimal } from "./utils";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import mysql from "mysql2"

export const createNewConveration = async (ctx: Koa.Context, id: string) => {
  const queryString: string = `INSERT INTO userConversations (user_id) values (?);`;
  await ctx.mysql.query(queryString, [id]);
  let [rows] = await ctx.mysql.query("SELECT LAST_INSERT_ID();");
  return decimalTo62(rows[0]["LAST_INSERT_ID()"].toString());
};

interface conversationOneRow {
  conversation_id: string;
  title: string;
}

export const getConversationList = async (ctx: Koa.Context, id: string) => {
  const queryString: string = `SELECT CONCAT(conversation_id, '') as conversation_id, title FROM userConversations WHERE user_id=? ORDER BY updated_at DESC;`;
  const [rows, fields] = await ctx.mysql.query(queryString, [id]);
  return rows.map((item: conversationOneRow) => {
    item.conversation_id = decimalTo62(item.conversation_id);
    return item;
  });
};

export const getChatContentList = async (
  ctx: Koa.Context,
  userId: string,
  chatIdOrigin: string
):Promise<chatContentOneRow[]> => {
  const chatId = base62ToDecimal(chatIdOrigin);
  const queryString: string = `SELECT CONCAT("[", conversation_content, "]") AS chatContentList FROM userConversations WHERE conversation_id=? AND user_id=?;`;
  const [rows, fields] = await ctx.mysql.query(queryString, [chatId, userId]);
  if (rows.length === 0) {
    throw new ctx.customError({
      message: "会话不存在或无权限",
      code: 400,
      errorCode: 3,
    });
  } else {
    const chatContentList = rows[0].chatContentList
    const l = JSON.parse(chatContentList)
    return JSON.parse(chatContentList).filter(
      (val: { role: string }) => val.role != "system"
    );
  }
};

export interface chatContentOneRow {
  role: ChatCompletionRequestMessageRoleEnum
  content: string
}

export const insertChatContentList = async (
  ctx: Koa.Context,
  userId: string,
  chatIdOrigin: string,
  newChatContentList: Array<chatContentOneRow>
) => {
    const chatId = base62ToDecimal(chatIdOrigin)
    const newContent = JSON.stringify(newChatContentList).slice(1, -1)
    const queryString: string = `UPDATE userConversations SET conversation_content=CONCAT(conversation_content, ",", ?) WHERE user_id=? AND conversation_id=?;`
    const res = await ctx.mysql.query(queryString, [newContent, userId, BigInt(chatId)])
    if(res[0].affectedRows == 0){
        throw new ctx.customError({
            message: "会话不存在或无权限",
            code: 400,
            errorCode: 1,
          });
    }
};
