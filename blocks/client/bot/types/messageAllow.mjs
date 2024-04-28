import {config} from "../../../../modules/config.mjs";
import pkg from "sequelize";
import {bot_users} from "../../../../modules/models.mjs";
const { Op } = pkg;

export const messageAllow = async ({ object, secret }) => {
    try {
        if (secret === config.bot_secret) {
            const { user_id } = object;
            const [user] = await bot_users.findOrCreate({ where: { user_id }});
            await user.update({ is_message_allowed: 1 });
            await user.save()
        }
        return 'ok'
    } catch (e) {
        console.error(e)
        return 'ok'
    }
}