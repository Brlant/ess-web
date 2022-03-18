<template>
  <div>
    <oms-el-upload
      :action="uploadUrl"
      :before-upload="beforeAvatarUpload"
      :data="uploadData"
      :formData="formData"
      :on-change="changePhoto"
      :on-error="error"
      :limit="1"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :show-file-list="false"
      class="avatar-user-uploader"
      ref='icoUpload'
      name="file"
    >
        <slot slot="trigger"></slot>
      <!-- <img :src="imageUrl" class="avatar-user" slot="trigger" v-if="imageUrl">
      <img class="avatar-user" slot="trigger" src="@/../static/img/userpic.png" v-else> -->
    </oms-el-upload>
    
  </div>
</template>

<style lang="scss" scoped>
 .avatar-user-uploader{ line-height:normal; height:50px; }
  .avatar-user-uploader .el-upload {
    border: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-user-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-user {
    margin-right: 10px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    border: 1px solid #eee
  }
</style>

<script>
    import {http, OmsAttachment} from '../../../resources';
    import OmsElUpload from './upload/src/index.vue';

    export default {
        props: ['photoUrl', 'formData'],
        components: {
            OmsElUpload
        },
        name: 'omsPhotoIconUpload',
        data() {
            return {
                imageUrl: this.photoUrl,
                uploadData: {},
                uploadUrl: '/omsAttachment'
            };
        },
        watch: {
            photoUrl: function (val) {
                if (!val) {
                    this.imageUrl = '';
                } else {
                    this.imageUrl = val;
                }
            }
        },
        computed: {
            user: function () {
                return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
            }
        },
        methods: {
            handleRemove(file) {
                console.error( file, 8822 ) ;
                OmsAttachment.delete(file.attachmentId).then((d) => {
                    console.error( d, 30303030 ) ;
                    this.$notify.success({
                        duration: 2000,
                        title: '成功',
                        message: '已成功删除附件' + file.url.slice(file.url.lastIndexOf('=') + 1) + '"'
                        // message: '已成功删除附件' + file.attachmentFileName + '"'
                    });
                }).catch(() => {
                    this.$notify.error({
                        duration: 2000,
                        message: '删除失败'
                    });
                });
            },
            clearFilesFn(){
                this.$refs.icoUpload && this.$refs.icoUpload.clearFiles() ;
            },
            changePhoto: function (photo, fileList) {
                this.$emit('change', photo.response);
            },
            handleAvatarSuccess(file) {
                // this.imageUrl = file.url;

                this.$notify.success({
                    title: '成功',
                    // message: '更换成功'
                });

                this.$emit( 'onSuccess', file ) ;
                // this.changPhoto(file); // 这个请求接口是修改用户图标接口~ 在修改单组件中的 icon 图标时, 不需要
            },
            beforeAvatarUpload(file, fileList) {

                let limitFileSize = 1024 * 1024 * 1; // 1M

                if( file.size > limitFileSize ){
                    this.$message({
                    message : '上传文件超出大小限制! 最大上传1M文件',
                    type : 'warning'
                    }) ;

                    return false ;
                }

                if( !/(je?pg|gif|png|eps|bmp|webp|jfif)$/i.test( file.name ) ){
                    this.$message({
                    message : '请选择图片类型文件!',
                    type : 'warning'
                    }) ;

                    return false ;
                }

                // this.$emit('beforeUpload',file, fileList) ;

                /*
                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                    this.$notify.error({
                        duration: 2000,
                        message: '上传附件大小不能超过 10MB!'
                    });
                    return false;
                }
                */
            },
            error(err) {
                this.$notify.error({
                    duration: 2000,
                    message: '上传文件' + err
                });
            },
            changPhoto: function (photo) {
                let user = this.user;
                let obj = {
                    id: user.userId,
                    photoId: photo.attachmentId
                };
                if (user.userId) {
                    http.put('/oms/user/' + user.userId + '/icon', obj).then(() => {
                        this.$notify.success({
                            title: '成功',
                            // message: '更换成功'
                        });
                    }).catch(() => {
                        this.user.userIcon = '';
                        this.$notify.error({
                            title: '失败',
                            // message: '更换失败'
                        });
                    });
                }
            }
        }
    };
</script>

