<style lang="scss" scoped>
@import "../../../../assets/scss/mixins";

$leftWidth: 0px;

.el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
}

.el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
}

.content-part {


    .content-left {
        width: $leftWidth;
    }

    .content-right {
        > h3 {
            left: $leftWidth;
        }

        left: $leftWidth;
    }
}
</style>


<template>
    <div>
        <div class="content-part">
            <div class="content-right min-gutter">
                <h3>上传Excel批量{{ btnTitle }}设备</h3>
                <el-form class="form-part" id="form" label-width="100px" ref="attachmentForm"
                         style="padding-right: 20px">
                    <el-form-item label="附件">
                        <oms-upload :fileList="attachmentList" @change="changeFiles" @refreshCodes="setDoing(false)"
                                    @uploadProgress="setDoing(true)"
                                    accept=".xlsx"></oms-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="doing" :loading="loading"
                                   @click="importExcel()" type="primary">
                            {{ loading ? '正在解析' : '保存' }}
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '@/tools/utils';

export default {
    components: {},
    name: 'importForm',
    props: {
        index: Number,
        batchType: String
    },
    data: function () {
        return {
            attachmentList: [],
            attachmentIdList: [],
            doing: false,
            loading: false
        };
    },
    computed: {
        btnTitle() {
            return this.batchType === '1' ? '新增' : '编辑';
        }
    },
    watch: {
        index() {
            this.attachmentList = [];
            this.attachmentIdList = [];
        }
    },
    mounted: function () {
    },
    methods: {
        setDoing(val) {
            this.doing = val;
        },
        changeFiles: function (fileList) {
            let ids = [];
            fileList.forEach(file => {
                ids.push(file.attachmentId);
            });
            this.attachmentIdList = ids;
        },
        importExcel: function () {
            if (!this.attachmentIdList || this.attachmentIdList.length === 0) {
                this.$notify.warning({
                    duration: 1500,
                    name: '警告',
                    message: '请上传Excel文件'
                });
                return;
            }
            this.doing = true;
            this.loading = true;
            let url = this.batchType === '1' ? 'ccs-dev/import/add' : 'ccs-dev/import/update';
            this.$http.post(url, this.attachmentIdList).then(res => {
                if (res.data.path) {
                    this.$notify.error('导入的Excel文件中存在错误内容,正在导出内容存在错误的设备信息');
                    utils.download(res.data.path, '错误货品表');
                } else {
                    this.$notify.success({
                        duration: 2000,
                        name: '成功',
                        message: `导入Excel批量${this.btnTitle}设备成功`
                    });
                }
                this.doing = false;
                this.loading = false;
                this.$emit('change');
                this.$emit('right-close');
            }).catch(error => {
                this.$notify.error({
                    message: error.response && error.response.data && error.response.data.msg || `导入Excel批量${this.btnTitle}设备失败`
                });
                this.doing = false;
                this.loading = false;
            });
        }
    }
};
</script>
