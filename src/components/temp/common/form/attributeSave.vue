<template>
  <el-dialog class="app-container" width="50%" :title="dialogTitle"
    :visible.sync="propsDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
    @closed="dialogClose('','0')">
    <el-form ref="thingsForm" :model="operationModel"  label-width="150px">
      <!-- <el-row :v-if="transParams.type == 'UPDATE'">
        <el-col :span="16">
          <el-form-item label="属性标识" prop="prop">
              <el-input v-model="operationModel.prop" maxlength="50"></el-input>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="16">
          <el-form-item label="属性名称" prop="thingPropertyName">
              <el-input v-model="operationModel.thingPropertyName" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="16">
          <el-form-item label="属性字段" prop="thingPropertyValue">
              <el-input v-model="operationModel.thingPropertyValue" maxlength="100"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="属性类型" prop="readType">
              <el-select v-model="operationModel.thingPropertyType" placeholder style="display: unset;">
                <!-- <el-option key="" label="" value=""></el-option> -->
                <el-option v-for="item in codeList(thingPropertyType)"
                  :key="item.value" :label="item.label" :value="item.value"
                ></el-option>
              </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
            <el-col :span="12">
              <el-form-item label="属性单位" prop="thingPropertyUnit">
                  <el-input v-model="operationModel.thingPropertyUnit" maxlength="10"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="单位名称" prop="unitName">
                  <el-input v-model="operationModel.unitName" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

      <!-- <el-card class="box-card">
        <div slot="header" class="panel-header">
          <span>数据类型</span>
        </div>
        <div class="text item">
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="属性类型" prop="thingPropertyType">
                  <el-select v-model="operationModel.thingPropertyType" placeholder style="display: unset;">
                    <el-option key="" label="" value=""></el-option>
                    <el-option v-for="item in codeList(thingPropertyType)"
                      :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="getAttrShow('minValue')" :span="12">
              <el-form-item label="参数最小值" prop="minValue">
                  <el-input type="number" v-model="operationModel.minValue" maxlength="50"></el-input>
              </el-form-item>
            </el-col>

            <el-col v-if="getAttrShow('maxValue')" :span="12">
              <el-form-item label="参数最大值" prop="maxValue">
                  <el-input v-model="operationModel.maxValue" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="属性单位" prop="thingPropertyUnit">
                  <el-input v-model="operationModel.thingPropertyUnit" maxlength="10"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="单位名称" prop="unitName">
                  <el-input v-model="operationModel.unitName" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="getAttrShow('step')" :span="12">
              <el-form-item label="步长" prop="step">
                  <el-input-number v-model="operationModel.step" :precision="2" :step="1" maxlength="21"></el-input-number>
              </el-form-item>
            </el-col>

            <el-col v-if="getAttrShow('dataLen')" :span="12">
              <el-form-item label="数据长度" prop="dataLen">
                  <el-input v-model="operationModel.dataLen"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="getAttrShow('zeroMeaning')" :span="12">
              <el-form-item label="0" prop="zeroMeaning">
                  <el-input v-model="operationModel.zeroMeaning" maxlength="50"></el-input>
              </el-form-item>
            </el-col>

            <el-col v-if="getAttrShow('oneMeaning')" :span="12">
              <el-form-item label="1" prop="oneMeaning">
                  <el-input v-model="operationModel.oneMeaning" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="operationModel.readType == 'CAL'" >
            <el-col :span="23">
              <el-form-item label="属性值计算式" prop="propExpression"> 
                  <el-input type="textarea" rows="3" v-model="operationModel.propExpression" maxlength="500"></el-input>
              </el-form-item>
            </el-col> 
            <el-col :span="1" style="text-align: left; padding: 0 3px;">
              <el-tooltip placement="bottom" :open-delay="200">
                <div slot="content">
                  例：items['temperature']?.value*3 
                </div>
                <i class="el-icon-info" style="color: #409EFF;"></i>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>
      </el-card> -->

      <div class="form-bottom-area">
        <el-button type="primary" class="form-bottom-btn" @click="commitMethod()">确定</el-button>
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
            //  productKey: null,
            /** 所属物模型 */
            // objectModelId: '',
            /** 属性名称 */
            thingPropertyName: '',
            /** 属性类型 */
            thingPropertyType: '',
            /** 属性单位 */
            thingPropertyUnit: '',
            /** 单位名称 */
            unitName: ''
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
      //  thingRules: {
      //      thingPropertyValue:[{ required: true, message: '请输入属性字段', trigger: 'blur' }],
      //      thingPropertyName:[{ required: true, message: '请输入属性名称', trigger: 'blur' }],
      //      thingPropertyType:[{ required: true, message: '请选择属性类型', trigger: 'blur' }],
      //      thingPropertyType:[{ required: true, message: '请输入属性类型', trigger: 'blur' }]
      //  },
    //  产品属性 - 读写类型
    readType:{
      'READ':'只读',
      'WRITE':'读写',
      'CAL':'计算'
    },
    //  产品属性 - 属性类型
    thingPropertyType:{
      'INTEGER':'整数型',
      'STRING':'字符型',
      'BOOLEAN':'布尔型',
      'FLOAT':'浮点型'
    },
    };
  },
  created() {
    //   crud(this);
      this.dialogTitle = this.transParams.title;
      // 修改时-> 初始化
      if(this.transParams.type == 'UPDATE'){
        this.detail();
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
        this.detail();
      }else{
        //  新增时 - 赋值
        this.operationModel.productKey = this.transParams.productKey;
      }
    }
  },
  methods: {
       codeList(code){
            let codeObjStr = JSON.stringify(code).replace(/"/g, '')
            codeObjStr = codeObjStr.replace(/\{/g, '').replace(/\}/g, '')
            let codeObjAll = codeObjStr.split(',')
            let codeArr = [];
            for (let i = 0; i < codeObjAll.length; i++) {
                let codeObjEach = codeObjAll[i].split(':');
                let codeEach = {};
                codeEach.label = codeObjEach[1];
                codeEach.value = codeObjEach[0];
                codeArr.push(codeEach);

            }
            return codeArr;

        },
        // 修改时初始化数据
      detail(){
        var thingPropertyId = this.transParams.id;
         https.get('/ccsThingProperty/'+thingPropertyId).then(res => {
                this.operationModel=Object.assign({},res)
             })
      },
      //修改方法
      updateModele(){
        var ids={productId:this.transParams.productId}
       var params=Object.assign(this.operationModel,ids);
       this.$httpRequestOpera( https.put('/ccsThingProperty ',params), {
          successTitle: '修改成功',
          errorTitle: '修改失败',
          success: res => {
             this.dialogClose('','0')
          },
          error: () => {
        }
      });
      },
        //新建物理模型
    addModel(){
      var ids={productId:this.transParams.productId}
      var params=Object.assign(this.operationModel,ids);
       this.$httpRequestOpera( https.post('/ccsThingProperty ',params), {
          successTitle: '添加成功',
          errorTitle: '添加失败',
          success: res => {
             this.dialogClose('','0')
          },
          error: () => {
        }
      });
    },
    // codeListI18n,
    /** 模态窗口关闭 */
    dialogClose(formName, refresh) {

      this.$refs['thingsForm'].resetFields();
      
      this.propsDialogShow = false;
      this.$emit("dialogCloseCallback", {
        moduleName: "thingsModel",
        refresh: refresh
      });
    },
    /** 模态窗口[确定] 按钮点击保存 */
    commitMethod(){
      if(this.transParams.type == "UPDATE"){
        this.updateModele();
      }else{
        this.addModel();
      }
    }
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
