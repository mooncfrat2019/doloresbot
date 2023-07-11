import pkg from "sequelize";
import cron from "node-cron";
import {pills_data} from "./modules/models.mjs";
import moment from "moment";
import {timeMs, vkApi} from "./modules/utils.mjs";
import {config} from "./modules/config.mjs";
const { Op } = pkg;

const toRun = async () => {
  try {
    const current_time = moment().utcOffset('+0300').format("HH:mm");
    console.log('current_time', current_time);
    const pills = await pills_data.findAll({ where: { time: current_time }});
    if (pills.length) {
      pills.forEach((pill) => {
        vkApi({
          method: 'messages.send',
          params: {
            random_id: timeMs(),
            peer_ids: pill.user_id,
            message: `Пора выпить таблеку: ${pill.title}.`,
            access_token: config.BOT_TOKEN,
            v: '5.131'
          }}).then((r) => console.log(r)).catch((e) => console.error(e));
      });
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