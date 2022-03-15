<style scoped>
.form-header-part .header {
    line-height: 24px;
    height: 24px;
}

.empty-info.mini {
    margin-top: 100px;
}

.index-tit {
    font-size: 20px;
}

.tn-cell {
    font-size: 16px;
}
</style>
<template>
    <div>
        <div class="empty-info mini" v-if="!detail.id">暂无数据</div>
        <div v-else>
            <div class="form-header-part">
                <div class="header">
                    <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                        {{ pageSets[0].name }}</h3>
                </div>
                <div class="content" style="overflow: hidden">
                    <tn-ceil :span="rowSpan" label="发生时间">{{ detail.createTime | time }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="恢复时间">{{ detail.restoreTime | time }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="持续时间">
                        {{ formatKeepTime(detail) }}
                    </tn-ceil>
                    <tn-ceil :span="rowSpan" label="异常类型">
                        <el-tooltip
                            :content="iconClass[icon].title + (detail.warnLevel === '0' ? '告警，级别:低' : '告警，级别:高')"
                            :key="icon"
                            class="item" effect="dark"
                            placement="top"
                            v-for="icon in detail.warnTypes && detail.warnTypes.split(',') || []">
                            <f-a :class="detail.warnLevel === '0' ? 'icon-warning' :'icon-danger'"
                                 :name="iconClass[icon].icon"></f-a>
                        </el-tooltip>
                    </tn-ceil>
                    <tn-ceil :span="rowSpan" label="监控对象">
                        <span>{{ formatTitle(detail) }}</span>
                    </tn-ceil>
                    <tn-ceil :span="rowSpan" label="设备名称">
                        <el-tooltip :content="tempTypeList[detail.devType]" effect="dark" placement="top">
                            <f-a :name="DevIcon[detail.devType][1]" class="icon-danger ver-a-mid"></f-a>
                        </el-tooltip>
                        <span>{{ detail.devName }}</span>
                    </tn-ceil>
                    <tn-ceil :span="rowSpan" label="设备编号/编码">{{ detail.devNo }}/{{ detail.devCode }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="创建时间">{{ detail.insertTime | time }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="告警规则">{{ detail.warnHisInfo }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="触发信息">{{ detail.triggerInfo }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="状态">{{ detail.confirmStatus === '1' ? '已确认' : '未确认' }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="处理时间" v-show="detail.confirmTime">{{ detail.confirmTime | time }}
                    </tn-ceil>
                    <tn-ceil :span="rowSpan" label="处理人" v-show="detail.confirmerId">{{ detail.confirmerId }}</tn-ceil>
                    <tn-ceil :span="rowSpan" label="情况说明" v-show="detail.confirmContent">{{ detail.confirmContent }}
                    </tn-ceil>
                </div>
            </div>
            <div class="form-header-part">
                <div class="header">
                    <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                        {{ pageSets[1].name }}</h3>
                </div>
                <div class="content">
                    <chart-line :detail="detail" :filters="filters" :isRecord="true" chartWidth="100%"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {WarnRecord} from './resources';
import utils from '@/tools/utils';
import ChartLine from './chart-line-new';
import AlarmMixin from '@/mixins/alarmMixin';
import AlarmEventMixin from '@/mixins/alarmEventMixin';
import TnCeil from './tn-cell';

const {DevIcon} = utils;
const halfDay = 60 * 60 * 1000;
export default {
    components: {ChartLine, TnCeil},
    mixins: [AlarmMixin, AlarmEventMixin],
    data() {
        return {
            rowSpan: 8,
            loading: false,
            pageSets: [
                {name: '基本信息', key: 0},
                {name: '历史数据', key: 0}
            ],
            currentTab: {},
            tempList: [],
            detail: {},
            filters: {
                startTime: '',
                endTime: '',
                devId: '',
                devCode: '',
                valType: ['1']
            },
            DevIcon
        };
    },
    mounted() {
        this.queryDetail();
    },
    methods: {
        selectTab(item) {
            this.currentTab = item;
        },
        close() {
            this.$emit('right-close');
        },
        formatKeepTime(detail) {
            let formatMsToTime = utils.formatMsToTime;
            return formatMsToTime((detail.restoreTime ? detail.restoreTime : Date.now()) - detail.createTime);
        },
        queryDetail() {
            let id = this.$route.params.id;
            if (id === 'id') {
                id = window.localStorage.getItem('alarmId');
            }
            window.localStorage.setItem('alarmId', id);
            this.loading = true;
            WarnRecord.get(id).then(res => {
                this.detail = res.data;
                this.loading = false;
                this.$nextTick(() => {
                    this.queryTempData();
                });
            });
        },
        getValType(warnTypes) {
            let ary = warnTypes.split(',');
            // 离线时间报警显示所有类型数据
            ary.length === 1 && ary[0] === '4' && (ary = ['1', '2', '3']);
            return ary;
        },
        formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
            return time ? this.$moment(time).format(str) : '';
        },
        queryTempData() {
            let {formatTime, getValType} = this;
            let {createTime, restoreTime, devCode, ccsDevId, warnTypes} = this.detail;
            this.filters = {
                startTime: formatTime(createTime - halfDay),
                endTime: formatTime(restoreTime ? restoreTime + halfDay : Date.now()),
                devId: ccsDevId,
                devCode: devCode,
                valType: getValType(warnTypes)
            };
        }
    }
};
</script>
