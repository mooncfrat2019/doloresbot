export const startKeyboard = {
    "one_time": false,
    "buttons": [
        [
            {
                "action": {
                    "type": "text",
                    "label": "Начать",
                    "payload": "{\"button\":\"0\"}"
                },
                "color": "primary"
            }
        ]
    ]
}
export const addPillKeyboard = {
    "one_time": false,
    "buttons": [
        [
            {
                "action": {
                    "type": "text",
                    "label": "Добавить",
                    "payload": "{\"button\":\"add1\"}"
                },
                "color": "primary"
            },
            {
                "action": {
                    "type": "text",
                    "label": "Отмена",
                    "payload": "{\"button\":\"add0\"}"
                },
                "color": "secondary"
            }
        ]
    ]
}