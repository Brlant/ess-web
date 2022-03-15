<template>
    <dialog-template :pageSets="pageSets" @selectTab="selectTab">
        <template slot="title">设备监控信息</template>
        <template slot="btn">
            <el-button @click="close" plain>关闭</el-button>
        </template>
        <template slot="content">
            <div v-if="loading">
                <oms-loading :loading="loading"></oms-loading>
            </div>
            <div class="empty-info" v-else-if="!formItem.pointRelationId">暂无数据</div>
            <div v-else>
                <div class="form-header-part">
                    <div class="header">
                        <div class="sign f-dib"></div>
                        <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                            {{ pageSets[0].name }}</h3>
                    </div>
                    <div class="content mt-10" style="overflow: hidden">
                        <oms-col :isShow="true" label="仓库名称">{{ formItem.warehouseName }}</oms-col>
                        <oms-col :isShow="true" label="点位名称">{{ formItem.pointName }}</oms-col>
                        <oms-col :isShow="true" label="设备名称">{{ formItem.devName }}</oms-col>
                        <oms-col :isShow="true" label="设备编码">{{ formItem.devCode }}</oms-col>
                        <oms-col :isShow="true" label="启用时间">{{ formItem.startTime | time }}</oms-col>
                        <oms-col :isShow="true" label="截止时间">{{ formItem.endTime | time }}</oms-col>
                    </div>
                    <div class="hr mb-10 mt-10"></div>
                </div>
                <div class="form-header-part">
                    <div class="header">
                        <div class="sign f-dib"></div>
                        <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                            {{ pageSets[1].name }}</h3>
                    </div>
                    <div class="content mt-10" style="overflow: hidden" v-if="formItem.oldPointRelationId">
                        <oms-col :isShow="true" label="仓库名称">{{ oldPointRelation.warehouseName }}</oms-col>
                        <oms-col :isShow="true" label="点位名称">{{ oldPointRelation.pointName }}</oms-col>
                        <oms-col :isShow="true" label="设备名称">{{ oldPointRelation.devName }}</oms-col>
                        <oms-col :isShow="true" label="设备编码">{{ oldPointRelation.devCode }}</oms-col>
                        <oms-col :isShow="true" label="启用时间">{{ oldPointRelation.startTime | time }}</oms-col>
                        <oms-col :isShow="true" label="截止时间">{{ oldPointRelation.endTime | time }}</oms-col>
                    </div>
                    <div class="empty-info" v-else>暂无旧设备信息</div>
                    <div class="hr mb-10 mt-10"></div>
                </div>
            </div>
        </template>
    </dialog-template>
</template>
<script>
import {PointRelation} from '@/resources';

export default {
    props: ['formItem', 'index'],
    data() {
        return {
            loading: false,
            pageSets: [
                {name: '新设备信息', key: 0},
                {name: '旧设备信息', key: 1}
            ],
            currentTab: {},
            oldPointRelation: {}
        };
    },
    watch: {
        index(val) {
            if (val !== 1) return;
            this.queryDetail();
        }
    },
    methods: {
        showRecordDate: function (data) {
            return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
        },
        selectTab(item) {
            this.currentTab = item;
        },
        close() {
            this.$emit('right-close');
        },
        queryDetail() {
            if (!this.formItem.oldPointRelationId) return;
            this.loading = true;
            PointRelation.get(this.formItem.oldPointRelationId).then(res => {
                this.oldPointRelation = res.data;
                this.loading = false;
            });
        }
    }
};
</script>
