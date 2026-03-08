import {messageNew} from "./types/messageNew.mjs";
import {messageAllow} from "./types/messageAllow.mjs";
import {messageDeny} from "./types/messageDeny.mjs";
import {config} from "../../../modules/config.mjs";

export const eventsTypes = {
  confirmation: async () => {
     const conf = config.bot_confirmation;
     return conf || '63199864';
  },
  message_new: async (body) => {
      console.log('message_new')
      return await messageNew(body)
  },
  message_allow: async (body) => {
    console.log('message_allow');
    return await messageAllow(body);
  },
  message_deny: async (body) => {
    console.log('message_deny');
    return await messageDeny(body);
  }
}