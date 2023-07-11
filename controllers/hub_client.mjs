import { eventsTypes } from "../blocks/client/bot/eventsTypes.mjs";

export const hub_client = async ({req, res, route}) => {
  const body = req.body;
  console.log('req.params.routeName', req.params.routeName);

  const act = {
    'bot': async () => {
      try {
        const { type } = body;
        console.log('type', type);
        return await eventsTypes[type]({ ...body });
      } catch (e) {
        console.error(e);
        return 'error in bot'
      }
    },
  }
  return res.send(await act[req.params.routeName]());
}