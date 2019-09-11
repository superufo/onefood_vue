<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="Redeem Id" >
        <el-input v-model="form.redeemId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Redeem Ename" >
        <el-input v-model="form.redeemEname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Redeem Cname" >
        <el-input v-model="form.redeemCname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Member ID" >
        <el-input v-model="form.mid" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Shop Id" >
        <el-input v-model="form.shopId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Reward Point " >
        <el-input v-model="form.point" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Receive Time 获取的时间" >
        <el-input v-model="form.receiveTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Use Time" >
        <el-input v-model="form.useTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="State" >
        <el-input v-model="form.state" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Type" >
        <el-input v-model="form.type" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/redeemPoint'
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
        code: '',
        redeemId: '',
        redeemEname: '',
        redeemCname: '',
        mid: '',
        shopId: '',
        point: '',
        remark: '',
        receiveTime: '',
        useTime: '',
        state: '',
        type: ''
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
        code: '',
        redeemId: '',
        redeemEname: '',
        redeemCname: '',
        mid: '',
        shopId: '',
        point: '',
        remark: '',
        receiveTime: '',
        useTime: '',
        state: '',
        type: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
