import {messageNew} from "./types/messageNew.mjs";

export const eventsTypes = {
  confirmation: async () => {
     return '764191d1';
  },
    message_new: async (body) => {
      console.log('message_new')
      return await messageNew(body)
  },
}