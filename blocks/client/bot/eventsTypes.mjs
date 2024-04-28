import {messageNew} from "./types/messageNew.mjs";
import {messageAllow} from "./types/messageAllow.mjs";
import {messageDeny} from "./types/messageDeny.mjs";

export const eventsTypes = {
  confirmation: async () => {
     return '764191d1';
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