<style lang="scss" scoped>
@import "../../../../../assets/scss/mixins";

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
                <h3>点位设备绑定</h3>
                <el-form
                    :model="form"
                    :rules="rules"
                    label-width="100px"
                    ref="tempForm"
                    style="padding-right: 20px"
                >
                    <el-form-item label="点位名称">
                        {{ form.ccsPointName }}
                    </el-form-item>
                    <el-form-item label="设备" prop="devId">
                        <dev-tree
                            v-model="form.devices"
                            :element="element"
                            :sceneid="scene.id + ''"
                        ></dev-tree>
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            :disabled="doing"
                            @click="save('tempForm')"
                            type="primary"
                        >
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import methodsMixin from "@/mixins/methodsMixin";
import { CcsPointDevice } from "@/resources";
import DevTree from "@/components/common/dev/dev-tree";

export default {
    components: { DevTree },
    props: ["formItem", "index", "scene", "element"],
    mixins: [methodsMixin],
    data() {
        return {
            form: {
                devices: [],
                ccsPointId: "",
                ccsPointName: ""
            },
            doing: false,
            rules: {
                devices: [
                    { required: true, message: "请选择设备", trigger: "change" }
                ]
            },
            re_new: true
        };
    },
    computed: {},
    watch: {
        // formItem: function (val) {
        //     this.form = Object.assign(this.form,val);
        //     if(!this.form.ccsPointId)return;
        // }
    },
    mounted() {
        this.loadDefDev();
    },
    methods: {
        loadDefDev() {
            // console.log(this.formItem);
            this.form = Object.assign({}, this.formItem);
            this.doing = true;
            this.form.devices = [];
            CcsPointDevice.query(this.form.ccsPointId).then(res => {
                this.doing = false;
                // console.log(res);
                // this.$refs['dev_tree'].reset();
                this.form.devices = res.data.data;
                // console.log( this.form.devices)
            });
        },
        save(formName) {
            // console.log(this.form);return;
            this.$refs[formName].validate(valid => {
                if (valid && this.doing === false) {
                    // 组装数据
                    // this.setPointRelation();
                    let post_data = {};
                    post_data.devices = this.form.devices;
                    post_data.ccsPointId = this.form.ccsPointId;
                    let form = JSON.parse(JSON.stringify(post_data));
                    // console.log(this.form.devices);return;
                    // this.doing = true;
                    // CcsPointDevice.save(form).then(res =>{
                    //     this.doing = false;
                    //     this.resetForm();
                    //     // this.$emit('refresh');
                    // });
                    this.doing = true;
                    this.$httpRequestOpera(CcsPointDevice.save(form), {
                        successTitle: "添加成功",
                        errorTitle: "添加失败",
                        success: res => {
                            this.doing = false;
                            if (res.data.data.unbind.length > 0) {
                                console.log("=======>{}", res.data.data.unbind);
                                this.$alert(
                                    "设备:" +
                                        res.data.data.unbind +
                                        "已被其它点位绑定",
                                    "绑定提示",
                                    {
                                        type: "warning",
                                        confirmButtonText: "确定"
                                    }
                                );
                            } else {
                                this.$emit("refresh", this.form, this.type, 1);
                            }
                        },
                        error: () => {
                            this.doing = false;
                        }
                    });
                }
            });
        }
    }
};
</script>
