export default {
    data() {
        return {
            checkList: [
                {label: '温度值', key: '1', unit: '℃', show: true},
                {label: '湿度值', key: '2', unit: '%', show: true},
                {label: '电压值', key: '3', unit: '%', show: true},
                {label: '离线时间', key: '4', unit: 'min', show: true}
            ],
            conditions: [
                {label: '小于', key: '0'},
                {label: '大于', key: '1'},
                {label: '等于', key: '2'}
            ],
            levels: [
                {label: '低', key: '0'},
                {label: '高', key: '1'}
            ],
            logicList: [
                {label: '满足一个条件', key: '0'},
                {label: '满足所有条件', key: '1'}
            ],
            offLine: {
                0: '不延时',
                1: '1分钟',
                2: '2分钟',
                3: '3分钟',
                5: '5分钟',
                10: '10分钟',
                15: '15分钟',
                30: '30分钟'
            },
            ruleType: [
                {label: '预警规则', key: '0'},
                {label: '告警规则', key: '1'}
            ],
            conditionsNew: [
                {label: '小于', key: '0'},
                {label: '大于', key: '1'},
                {label: '等于', key: '2'},
                {label: '小于等于', key: '3'},
                {label: '大于等于', key: '4'},
                {label: '介于', key: '5'}
            ],
            alertNotificationMethod: [
                {label: '首次通知', key: '0'},
                {label: '循环通知', key: '1'},
            ]
        };
    }
};
