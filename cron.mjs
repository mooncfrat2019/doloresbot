import pkg from "sequelize";
import cron from "node-cron";
import {bot_users, pills_data} from "./modules/models.mjs";
import moment from "moment";
import {modulusIndex, propertyByIndex, timeMs, vkApi} from "./modules/utils.mjs";
import {config} from "./modules/config.mjs";
const { Op } = pkg;

const toRun = async () => {
  try {
    const group_id = 221547354;
    const current_time = moment().utcOffset('+0300').format("HH:mm");
    console.log('current_time', current_time);
    const pills = await pills_data.findAll({ where: { time: current_time }});
    const users = await bot_users.findAll({ where: { is_message_allowed: 1 }});
    const ids = users.map((user) => user.user_id)
    if (pills.length) {
      const filtered = pills.filter((pill) => ids.includes(pill.user_id));
      if (filtered.length) {
        filtered.forEach((pill) => {
          const access_token = propertyByIndex(config.bot[group_id], modulusIndex({ modulus: 10, maxIndex: 2, corrector: 6 }));
          vkApi({
            method: 'messages.send',
            params: {
              random_id: timeMs(),
              peer_ids: pill.user_id,
              message: `Пора выпить таблеку: ${pill.title}.`,
              access_token,
              v: '5.131'
            }}).then((r) => console.log(r)).catch((e) => console.error(e));
        });
      }
    }
    return Promise.resolve({ runStatus: 'complete' });
  } catch (e) {
    return Promise.reject(e)
  }
}
cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  toRun().then((r) => console.log(r)).catch((e) => console.error(e))
});