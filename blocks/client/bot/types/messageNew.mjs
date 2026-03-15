import {config} from "../../../../modules/config.mjs";
import {isJson, modulusIndex, propertyByIndex, timeMs, vkApi} from "../../../../modules/utils.mjs";
import pkg from "sequelize";
import {addPillKeyboard, cancelKeyboard} from "../../../../modules/keyboards.mjs";
import {bot_users, pills_data} from "../../../../modules/models.mjs";
const { Op } = pkg;

export const messageNew = async ({ group_id, object, secret }) => {
    try {
        if (secret === config.bot_secret) {
            //await pills_data.sync({ alter: true });
            //await bot_users.sync({ alter: true });
            const { message, client_info } = object;
            const { keyboard } = client_info;
            const { text, payload, peer_id } = message;
            const pl = isJson(payload) ? JSON.parse(payload) : payload;
            console.log('pl?.command', pl);
            console.log('text', text);
            const access_token = propertyByIndex(config.bot[group_id], modulusIndex({ modulus: 10, maxIndex: 2, corrector: 6 }));
            //console.log('access_token', access_token);
            const [user] = await bot_users.findOrCreate({ where: { user_id: peer_id }});
            await user.update({ is_message_allowed: 1 });
            await user.save()
            if (text === '/начать' || text === 'начать' || text === 'Начать' || pl?.command === 'start' || pl?.button === '0') {
                console.log('start point');
                await user.update({ state: 1 });
                await user.save();
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: 'Управление таблами 💊 и напоминаниями.',
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(addPillKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (pl?.button && pl?.button.startsWith('cancel')) {
                await user.update({ state: 1 });
                await user.save();
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: 'Управление таблами 💊 и напоминаниями.',
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(addPillKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (pl?.button && pl?.button.startsWith('list')) {
                const pills = await pills_data.findAll({ where: { user_id: peer_id } });
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: `Вот список принимаемых таблеток: \n ${pills.map((pill) => `${pill.id}: ${pill.title}. Время приема: ${pill.time}.`).join('\n\n')}`,
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(addPillKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (pl?.button && pl?.button.startsWith('remove')) {
                await user.update({ state: 10 });
                await user.save();
                const pills = await pills_data.findAll({ where: { user_id: peer_id } });
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: `Вот список принимаемых таблеток: \n
                        ${pills.map((pill) => `${pill.id}: ${pill.title}. Время приема: ${pill.time}.`).join('\n\n')}
                        \n
                        Напиши id (номер) таблетки, которую нужно удалить.
                        `,
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(cancelKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (pl?.button && pl?.button.startsWith('add')) {
                const payloadValue = Number(pl?.button.split('add')[1]);
                if (payloadValue === 1) {
                    await user.update({ state: 2 });
                    await user.save();
                    const { response, error: messagesSendError } = await vkApi({
                        method: 'messages.send',
                        params: {
                            random_id: timeMs(),
                            peer_ids: peer_id,
                            message: 'Напиши название таблы:',
                            access_token,
                            keyboard: (keyboard) ?  JSON.stringify(cancelKeyboard) : undefined, v: '5.131'
                        }});
                    console.log(response);
                    console.error(messagesSendError);
                    return 'ok'
                }
            }
            if (user && user.state === 2) {
                const pill = await pills_data.create({ title: text, user_id: peer_id });
                await pill.save();
                await user.update({ state: 3, current_pill_id: pill.id });
                await user.save();
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: `Выбранная табла: ${pill.title}. Укажи время приема в формате "23:00" или "08:00" (без кавычек и только одно время на одну таблетку):`,
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(cancelKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (user && user.state === 3) {
                const pill = await pills_data.findOne({ where: { id: user.current_pill_id } });
                await pill.update({ time: text });
                await pill.save();
                await user.update({ state: 1, current_pill_id: 0 });
                await user.save();
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: `Выбранная табла: ${pill.title}. Выбранное время приема: ${pill['time']}. Напомню о приеме таблетки когда придет время. `,
                        access_token,
                        keyboard: (keyboard) ?  JSON.stringify(addPillKeyboard) : undefined, v: '5.131'
                    }});
                console.log(response);
                console.error(messagesSendError);
                return 'ok'
            }
            if (user && user.state === 10) {
                const pillOne = await pills_data.findOne({ where: { id: text } });
                await pills_data.destroy({ where: { id: text } });
                await user.update({ state: 1 });
                await user.save();
                const { response, error: messagesSendError } = await vkApi({
                    method: 'messages.send',
                    params: {
                        random_id: timeMs(),
                        peer_ids: peer_id,
                        message: `Выбранная табла ${pillOne.title} с id ${pillOne.id} удалена. Больше не буду о ней напоминать.`,
                        access_token,
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