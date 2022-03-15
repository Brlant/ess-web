<style lang="scss">
  .dialog-template {
    $width: 180px;

    &.content-part {
      .content-left {
        width: $width;
      }

      .content-right {
        > h3 {
          left: $width;
          margin-bottom: 0;
        }

        left: $width;
        padding-top: 65px;
        padding-right: 0;
      }
    }

    .dialog-template_scroll {
      overflow: hidden;
      height: 100%;
    }

    .dialog-template_scroll_content {
      padding-right: 30px;
      padding-left: 20px;
    }
  }
</style>
<template>
  <div class="content-part dialog-template">
    <div class="content-left">
      <h2 class="clearfix right-title">
        <slot name="title"></slot>
      </h2>
      <ul v-if="pageSets">
        <li @click="selectTab(item, key)" class="list-style" v-bind:class="{ 'active' : index === key}"
            v-for="(item, key) in pageSets"><span>{{ item.name }}</span>
        </li>
      </ul>
      <div class="btn-group-lt-bm-part">
        <slot name="btn"></slot>
      </div>
    </div>
    <div class="content-right content-padding">
      <h3>{{title}}</h3>
      <el-scrollbar @scroll="throttle" class="dialog-template_scroll" tag="div">
        <div class="dialog-template_scroll_content">
          <slot name="content"></slot>
          <div :style="{'padding-left': `${btnSavePosition}px`}" class="btn-save">
            <slot name="btnSave"></slot>
          </div>
        </div>
      </el-scrollbar>

    </div>
  </div>
</template>
<script>
    const wait = 500;
    let canRun = true;

    export default {
        name: 'dialogTemplate',
        props: {
            pageSets: Array,
            indexClass: {
                type: String,
                default: 'index-tit'
            },
            btnSavePosition: {
                type: Number,
                default: 80
            }
        },
        data() {
            return {
                index: 0,
                title: '',
                isClickLeftTab: false,
                titleAry: null,
                dialogWarp: null
            };
        },
        computed: {
            showIndex() {
                return this.$parent.$parent.$parent.showIndex;
            }
        },
        watch: {
            showIndex(val) {
                if (val === -1 && this.pageSets) {
                    this.selectTab(this.pageSets[0], 0);
                }
                this.titleAry = null;
                this.dialogWarp = null;
            }
        },
        methods: {
            setTitleAry() {
                if (this.titleAry) return;
                this.titleAry = this.$el.querySelectorAll('.' + this.indexClass);
            },
            getDialogWarp() {
                if (this.dialogWarp) return;
                this.dialogWarp = this.$el.getElementsByClassName('el-scrollbar__wrap')[0];
            },
            selectTab(item, key) {
                this.index = key;
                this.title = item.name;
                this.isClickLeftTab = true;
                this.setScrollTop(key);
                this.$emit('selectTab', item);
            },
            // 节流
            throttle(e) {
                this.setTitleAry();
                if (!canRun) return;
                canRun = false;
                setTimeout(() => {
                    this.setIndex(e);
                    canRun = true;
                }, wait);
            },
            setIndex(e) {
                if (this.isClickLeftTab) {
                    this.isClickLeftTab = false;
                    return;
                }
                let event = e || window.event;
                let target = event.target || e.srcElement;
                let {titleAry} = this;
                if (!titleAry) return;
                let scrollTop = target.scrollHeight - target.clientHeight;
                // 滚到底处理
                if (scrollTop - target.scrollTop < 20) {
                    let index = titleAry.length - 1;
                    this.index = index;
                    if (index < 0) return;
                    this.title = this.pageSets[index].name;
                    this.$emit('selectTab', this.pageSets[index]);
                    return;
                }
                for (let i = 0; i < titleAry.length; i++) {
                    if (!titleAry[i]) return;
                    let curOffsetTop = titleAry[i].parentNode.parentNode.offsetTop - 65;
                    let nexOffsetTop = i < titleAry.length - 1 ? titleAry[i + 1].parentNode.parentNode.offsetTop - 65 : 0;
                    if (target.scrollTop > curOffsetTop && target.scrollTop < nexOffsetTop) {
                        this.index = i;
                        if (i < 0) return;
                        this.title = this.pageSets[i].name;
                        this.$emit('selectTab', this.pageSets[i]);
                    }
                }
            },
            setScrollTop(index) {
                this.setTitleAry();
                this.getDialogWarp();
                let {titleAry, dialogWarp} = this;
                if (!titleAry || !dialogWarp) return;
                let scrollTop = dialogWarp.scrollHeight - dialogWarp.clientHeight;
                if (!titleAry[index]) return;
                let otp = titleAry[index].parentNode.parentNode.offsetTop - 65;
                dialogWarp && (dialogWarp.scrollTop = scrollTop > otp ? otp : scrollTop);
            }
        }
    };
</script>
