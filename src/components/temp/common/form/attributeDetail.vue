<template>
<el-dialog class="app-container" width="50%" :title="dialogTitle"
    :visible.sync="propsDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
    @closed="dialogClose('','0')">
    <el-form ref="thingsForm" :model="operationModel" label-width="150px">
       <el-row>
        <el-col :span="12">
          <el-form-item label="属性名称" prop="thingPropertyName">
              <el-input v-model="operationModel.thingPropertyName" :readonly="true" maxlength="30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="属性字段" prop="prop">
              <el-input v-model="operationModel. thingPropertyValue" :readonly="true" maxlength="30"></el-input>
          </el-form-item>
        </el-col>
      </el-row>     
        <el-row>
            <el-col :span="12">
              <el-form-item label="属性类型" prop="thingPropertyType">
                <el-input :value="operationModel.thingPropertyType"
                   :readonly="true" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="属性单位" prop="thingPropertyUnit">
                  <el-input v-model="operationModel.thingPropertyUnit" :readonly="true" maxlength="10" ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="属性单位名称" prop="unitName">
                  <el-input v-model="operationModel.unitName" :readonly="true" maxlength="50" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

      <div class="form-bottom-area">
        <el-button v-if="transParams.type == 'DELETE'" 
          type="danger" class="form-bottom-btn" @click="deleteModel()" >删除</el-button>
        <el-button type="normal" class="form-bottom-btn" @click="dialogClose('','0')" >返回</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
// import thingRules from "./rules/thingRules";
// import { messageI18n } from "../../utils/message";
// import { crud } from "../../utils/base/crud";
// import { API_Search } from "../../config/api/crud";
// import { codeListI18n, codeI18n } from "../../utils/codes";
import https from "../../../../https";
/**
 * 属性 添加/修改 模态窗口
 * @author  gyiot
 * @date    2020-11-12 17:13
 */
export default {
  name: "attributeDetail",
  components: {},
  props: {
    dialogShow: Boolean,
    //  外部参数传递
    transParams: Object
  },
  data() {
    return {
        operationModel:{
             productKey: null,
            /** 所属物模型 */
            objectModelId: '',
            /** 属性名称 */
            thingPropertyName: '',
            /** 属性识别符 */
            prop: '',
            /** 读写类型 */
            readType: '',
            /** 属性值计算式 */
            propExpression: '',
            /** 属性类型 */
            thingPropertyType: '',
            /** 参数最小值 */
            minValue: '',
            /** 参数最大值 */
            maxValue: '',
            /** 属性单位 */
            thingPropertyUnit: '',
            /** 单位名称 */
            unitName: '',
            /** 步长 */
            step: '',
            /** 数据长度 */
            dataLen: null,
            /** 布尔值0的意义 */
            zeroMeaning: '',
            /** 布尔值1的意义 */
            oneMeaning: '',
        },
      //  表单title(从外部参数接收)
      dialogTitle: "",
      // 新增处理选项参数
      opts: { moduleName: "thing", formName: "thingsForm",
      },
      //  表单model
    //   operationModel: attributeModel,
      //  表单验证规则
    //   thingRules,
      //  模态窗口显示标识
      propsDialogShow: true,
    };
  },
  created() {
    //   crud(this);
      this.dialogTitle = this.transParams.title;
      var thingPropertyId = this.transParams.id;
       https.get('/ccsThingProperty/'+thingPropertyId).then(res => {
                this.operationModel=Object.assign({},res)
             })
      // 修改时-> 初始化
      if(this.transParams.type == 'UPDATE'){
        // this.detail(this);
      }else{
        //  清空form
        for(let key in this.operationModel){
          this.operationModel[key] = null;
        }
        //  新增时 - 赋值
        this.operationModel.productKey = this.transParams.productKey;
      }
  },
  watch: {
    /**
     * 监听 dialogShow属性值变化
     * @params val boolean dialogShow 
     */
    dialogShow(val) {
      this.propsDialogShow = val;
      if (!val) {
        this.$refs["thingsForm"].resetFields();
      }
    },
    /**
     * 监听 transParams 属性值变化
     * @params transValue 传递参数
     */
    transParams(transValue){
      this.transParams = transValue;
      //  赋值title
      this.dialogTitle = transValue.title;

      if(this.transParams.type == 'UPDATE'){
        // this.detail(this);
      }else{
        //  新增时 - 赋值
        this.operationModel.productKey = this.transParams.productKey;
      }
    }
  },
  methods: {
    //删除物理模型
    deleteModel(){
       var thingPropertyId = this.transParams.id;
       this.$httpRequestOpera( https.destroy('/ccsThingProperty/'+thingPropertyId), {
          successTitle: '删除成功',
          errorTitle: '删除失败',
          success: res => {
            this.dialogClose('', '0')
          },
          error: () => {
        }
      });

    },
    /** 模态窗口关闭 */
    dialogClose(formName, refresh) {

      this.$refs['thingsForm'].resetFields();
      
      this.propsDialogShow = false;
      this.$emit("dialogCloseCallback", {
        moduleName: "thingsModel",
        refresh: refresh
      });
    },
  }
};
</script>

<style scoped>
.panel-header {
  font-size: large;
  padding-left: 20px;
  text-align: left;
  width: 100%;
}
.form-bottom-area{
  text-align: center;
}
</style>
