<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="Shop Id" >
        <el-input v-model="form.shopId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Reward Point" >
        <el-input v-model="form.point" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Discount" >
        <el-input v-model="form.discount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Link" >
        <el-input v-model="form.link" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="QR Code" >
        <el-input v-model="form.qrCode" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Reward Condition" >
        <el-input v-model="form.condition" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Type" >
        <el-input v-model="form.type" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Star Time" >
        <el-input v-model="form.starTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="End Time" >
        <el-input v-model="form.endTime" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/redeemSetting'
export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        shopId: '',
        point: '',
        discount: '',
        link: '',
        qrCode: '',
        remark: '',
        condition: '',
        type: '',
        starTime: '',
        endTime: ''
      },
      rules: {
      }
    }
  },
  methods: {
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
        point: '',
        discount: '',
        link: '',
        qrCode: '',
        remark: '',
        condition: '',
        type: '',
        starTime: '',
        endTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
