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

export const cancelKeyboard = {
    "one_time": false,
    "buttons": [
        [
            {
                "action": {
                    "type": "text",
                    "label": "Отмена",
                    "payload": "{\"button\":\"cancel\"}"
                },
                "color": "negative"
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
                    "label": "Удалить",
                    "payload": "{\"button\":\"remove1\"}"
                },
                "color": "secondary"
            }
        ],
        [
            {
                "action": {
                    "type": "text",
                    "label": "Список",
                    "payload": "{\"button\":\"list\"}"
                },
                "color": "primary"
            },
            {
                "action": {
                    "type": "text",
                    "label": "Отмена",
                    "payload": "{\"button\":\"cancel\"}"
                },
                "color": "secondary"
            }
        ],
    ]
}