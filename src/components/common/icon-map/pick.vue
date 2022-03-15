<template>
    <div ref="bg">
        <!-- <el-dialog
          :fullscreen="true"
          title="全屏显示"
          :visible.sync="fullscreen"
          custom-class="custom-dialog-dev"
          width="100%"
        >
          <div ref='sce-container' v-if="img_loaded" :style="'position:relative;top:0;left:0;width:100%;height:100%;border:0px solid red;background-image:url('+src+');background-size:contain;background-repeat:no-repeat'">

          </div>
        </el-dialog> -->

        <div v-if="img_loaded"
             @click="pickup"
             :style="'position:relative;width:'+width+'px;height:'+height+'px;border:0px solid red;background-size:contain;background-repeat:no-repeat;background-image:url('+src+');'">

        </div>
        <oms-loading v-else :loading="!img_loaded"></oms-loading>

    </div>
</template>
<script>
import Point from '../../configuration/point/warehouse/form/point.vue';
import pIcon from "./point"

export default {
    props: {

        src: String,

    },
    components: {
        Point, pIcon

    },

    watch: {
        fullscreen: function (n, o) {
            //console.log('screen change',o,n)
            if (n) {
                setTimeout(() => {
                    let div = this.$refs['sce-container'];
                    // let width = div.offsetWidth;
                    //console.log(div.offsetHeight)
                    this.containerWidth = div.offsetWidth;
                    this.containerHeight = div.offsetHeight;
                    this.calcScaling();
                }, 50);
            } else {
                this.containerWidth = this.width;
                this.containerHeight = this.height;
                this.calcScaling();
            }
        },
    },
    data() {
        return {
            img_loaded: false,
            fullscreen: false,
            imgRawWidth: 0,
            imgRawHeight: 0,

            width: 0,
            height: 0,
            containerWidth: 0,
            containerHeight: 0,
            scaling: 1,

        };
    },
    methods: {
        pickup(e) {
            // let disX = e.clientX - odiv.offsetLeft;
            // let disY = e.clientY - odiv.offsetTop;
            // console.log(disX,disY);
        },
        loadImg() {
            let image = new Image();
            image.src = this.src;
            setTimeout(() => {
                if (!this.img_loaded) this.$alert(`图片加载失败:${this.src}`);
            }, 20000)
            image.onload = () => {
                this.img_loaded = true;
                this.imgRawWidth = image.width;
                this.imgRawHeight = image.height;
                this.calcScaling();
            };

        },
        copyArr(arr) {
            let res = []
            for (let i = 0; i < arr.length; i++) {
                res.push(arr[i])
            }
            return res
        },
        // text(item){
        //   return 'item.y' + '';
        // },
        /***
         * width 容器宽度
         * height 容器高度
         * img_width 图片宽度
         * img_height 图片高度
         * 函数会设置 当前比例
         */
        calcScaling() {
            let width = 0;
            let height = 0;
            let img_width = this.imgRawWidth;
            let img_height = this.imgRawHeight;
            if (this.fullscreen) {
                width = this.containerWidth;
                height = this.containerHeight;
            } else {
                width = this.width;
                height = this.height;
            }

            if (img_width == 0 || img_height == 0) {
                console.error('图片高度或宽度为0');
                return;
            }
            let scaling = width / img_width;
            this.height = img_height * scaling;
            this.scaling = scaling;
            console.log(this.width, this.height, img_width, img_height, this.scaling)
        },

    },
    mounted() {
        this.width = this.$refs.bg.parentNode.offsetWidth;
        // alert(this.width);
        this.loadImg();
        //console.log(this.$refs.bg.parentNode.offsetWidth,this.$refs.bg.parentNode.offsetHeight)
    },
};
</script>
