<template>
    <div style="width: 100%;height: calc(100vh - 140px);box-sizing: border-box;">
        <div
            id="divContainer"
            class="divContainer"
            :style="'position:relative;background-image:url('+src+');'">
            <p-icon :x="x"
                    :y="y"
                    :divWidth="divWidth"
                    :divHeight="divHeight"
                    :edit-mode="editable"
                    :text="text"
                    :tip="tip"
                    :pointName="item.ccsPointName"
                    v-model="list[index]"
                    :key="index" v-for="(item,index) in list"/>
        </div>
        <div style="position:absolute;right:10px;top:10px;">
            <el-button
                @click="editable=true"
                plain=""
                size="mini"
                v-if="!editable"
            >编辑设备位置
            </el-button>
            <el-button
                @click="save()"
                plain=""
                size="mini"
                v-if="editable"
            >保存
            </el-button>
            <el-button
                @click="editable = false"
                plain=""
                size="mini"
                v-if="editable"
            >取消
            </el-button>
            <el-button plain style="" size="mini" @click="fullScreen">全屏显示</el-button>
        </div>
    </div>
</template>
<script>
import Point from '../../configuration/point/warehouse/form/point.vue';
import pIcon from "./point"

export default {
    props: {
        width: Number,
        height: Number,
        src: String,
        iconList: Array,
        editMode: Boolean,
        x: String,
        y: String,
        text: {
            type: Function,
            default: function (item) {
                return '请设置属性text'
            }
        },
        tip: {
            type: Function,
            default: function (item) {
                return '请设置属性tip'
            }
        },
        scenesId: String
    },

    components: {
        Point, pIcon

    },
    watch: {
        iconList: function (n, o) {
            this.list = this.copyArr(this.iconList);
        },
        list: function (n) {
        },
    },
    data() {
        return {
            divWidth: 0,
            divHeight: 0,
            list: [],
            editable: this.editMode
        };
    },
    methods: {
        fullScreen() {
            console.log(this.src);
            let routeData = this.$router.resolve({
                name: 'fullscreen',
                query: {scenesId: this.scenesId, imageUrl: this.src}
            });
            window.open(routeData.href, '_blank')
        },
        save() {
            this.$emit('save', this.list, this.divWidth, this.divHeight);
        },
        quitEditMode() {
            this.editable = false;
        },

        copyArr(arr) {
            let res = [];
            for (let i = 0; i < arr.length; i++) {
                let item = JSON.parse(JSON.stringify(arr[i]));
                item.longitude = parseFloat(this.divWidth / 1000 * item.longitude);
                item.latitude = parseFloat(this.divHeight / 600 * item.latitude);
                res.push(item)
            }
            return res
        },
    },
    mounted() {

        let o = document.getElementById("divContainer");
        let divWidth = o.clientWidth || o.offsetWidth;
        let divHeight = o.clientHeight || o.offsetHeight;
        this.divWidth = divWidth;
        this.divHeight = divHeight;
        this.list = this.copyArr(this.iconList);

    },
};
</script>

<style scoped>
    .divContainer {
        position: relative;
        width: 100%;
        height: 100%;
        background: url(https://iot-test.tracentsure.com/iotap/api//file/3a0d70cad50e41b3ac9681c225b5a42f.png);
        background-size: 100% 100%;
    }
</style>
