<template>
    <el-drawer
            :append-to-body="true"
            :title="isAdd ? 'ADD' : 'EDIt'"
            :visible.sync="dialog"
            custom-class="demo-drawer"
            ref="drawer"
            direction="ltr"
            :before-close="handleClose"
            size="50%"
            @open = "callback()"
    >

      <div style="margin-right: 10px,margin-bottom: -50px; " >
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="150px"  style="max-height:800px;overflow: auto; " >

      <el-form-item label="Shop ID"  v-if="form.shopId">
        <el-input v-model="form.shopId"  readonly style="width: 370px;"/>
      </el-form-item>

      <el-form-item label="Goods ID" v-if="form.goodsId">
        <el-input v-model="form.goodsId"  readonly style="width: 370px;"/>
      </el-form-item>


      <el-form-item label="url">
        <!--<el-input v-model="form.url" style="width: 320px;"/>-->
        <img :src="form.url"   ref="url"   />
        <el-button
                v-permission="['ADMIN','PICTURE_ALL','PICTURE_UPLOAD']"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-upload"
                @click="imgDialog = true">上传图片
        </el-button>
        <!--上传图片-->
        <el-dialog :visible.sync="imgDialog" append-to-body width="300px" @close="picSubmit">
          <el-upload
                  :on-preview="handlePictureCardPreview"
                  :before-remove="handleBeforeRemove"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :headers="headers"
                  :file-list="fileList"
                  :action="imagesUploadApi"
                  :limit=1
                  list-type="picture-card">
            <i class="el-icon-plus"/>
          </el-upload>
          <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
            <img :src="dialogImageUrl" style="width:100px;height:100px"  alt="">
          </el-dialog>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary"  ref="picsb"  @click="picSubmit" >确认</el-button>
          </div>
        </el-dialog>

      </el-form-item>

      <el-form-item label="Picture" >
        <el-input v-model="form.picId" readonly  style="width: 370px;"/>
      </el-form-item>

      <el-form-item label="Url" >
        <el-input v-model="form.url" readonly style="width: 370px;"/>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer" style="position: fixed;margin-left: 30%; margin-bottom: 10px">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
      </div>
    </el-drawer>
</template>

<script>
import { add, edit } from '@/api/shopGoodsPicture'
import {mapGetters} from 'vuex'

import {getToken} from '@/utils/auth'

import { del } from '@/api/picture'


export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    goodsId: {
        type: Number,
    },
    shopId: {
        type: Number,
    },
  },
  data() {
    return {
      loading: false, dialog: false,
      imgDialog:false,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      headers: {
          'Authorization': 'Bearer ' + getToken()
      },
      form: {
        id: '',
        shopId: '',
        goodsId: '',
        picId: '',
        url: '',
      },
      rules: {
          url: [
              { required: true, message: 'url cannot be empty', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
      handleSuccess(response, file) {
          console.log("response:",response)
          this.form.url = response.data[0]
          this.form.picId =  response.id
          alert(this.form.url)

          const uid = file.uid
          const id = response.id
          this.pictures.push({ uid, id })
    },
    handleBeforeRemove(file, fileList) {
        for (let i = 0; i < this.pictures.length; i++) {
            if (this.pictures[i].uid === file.uid) {
                del(this.pictures[i].id).then(res => {
                })
                return true
            }
        }
    },
    handlePictureCardPreview(file) {


        this.dialogImageUrl = file.url
        this.fileList.push(file)
        this.dialogVisible = true
    },
    // 刷新列表数据
    picSubmit() {
        this.fileList = []
        this.dialogVisible = false
        this.dialogImageUrl = ''
        this.imgDialog = false

        return ;
    },
    // 监听上传失败
    handleError(e, file, fileList) {
        const msg = JSON.parse(e.message)
        this.$message({
            message: msg.message,
            type: 'error',
            duration: 2500
        })
    },
    callback(){
        this.form.shopId = this.shopId
        this.form.goodsId = this.goodsId
    },
    handleClose(done) {
        done();
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$message({
          message: 'Add  Success',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$message({
          message: 'Edit  Success',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        shopId: '',
        goodsId: '',
        picId: '',
        url: '',
      }
    }
  },
  computed: {
      ...mapGetters([
          // sm.ms图床
          'imagesUploadApi',
          // 七牛云 按需选择
          'qiNiuUploadApi'
      ])
  },
}
</script>

<style scoped>

</style>
