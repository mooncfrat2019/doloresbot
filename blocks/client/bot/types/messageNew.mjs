import {config} from "../../../../modules/config.mjs";
import {isJson, timeMs, vkApi} from "../../../../modules/utils.mjs";
import pkg from "sequelize";
import {addPillKeyboard} from "../../../../modules/keyboards.mjs";
const { Op } = pkg;

export const messageNew = async ({ group_id, object, secret }) => {
    try {
        if (secret === config.bot_secret) {
            const { message, client_info } = object;
            const { keyboard } = client_info;
            const { text, payload, peer_id } = message;
                const pl = isJson(payload) ? JSON.parse(payload) : payload;
                console.log('pl?.command', pl);
                console.log('text', text);
                let payloadFromButton = 0;
                if (pl?.button && !pl?.button.startsWith('add') && !pl?.button.startsWith('pd') && !pl?.button.startsWith('flw')) {
                    payloadFromButton = Number(pl?.button);
                }
                if (text === '/начать' || text === 'начать' || text === 'Начать' || pl?.command === 'start' || pl?.button === '0') {
                    console.log('start point');
                    const { response, error: messagesSendError } = await vkApi({
                        method: 'messages.send',
                        params: {
                            random_id: timeMs(),
                            peer_ids: peer_id,
                            message: 'Добавим таблу? 💊',
                            access_token: config.BOT_TOKEN,
                            keyboard: (keyboard) ?  JSON.stringify(addPillKeyboard) : undefined, v: '5.131'
                        }});
                    console.log(response);
                    console.error(messagesSendError);
                    return 'ok'
                }
        }
        return 'ok'
    } catch (e) {
        console.error(e);
        return 'ok';
    }
}