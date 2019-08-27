<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="Promote Id   优惠卷类别ID" >
        <el-input v-model="form.promoteId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Member Id" >
        <el-input v-model="form.mid" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Shop Id" >
        <el-input v-model="form.shopId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Promote Price" >
        <el-input v-model="form.price" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="DIscount" >
        <el-input v-model="form.discount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Order Id" >
        <el-input v-model="form.orderId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="State" >
        <el-input v-model="form.state" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Use Time" >
        <el-input v-model="form.useTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label=" Receive Time" >
        <el-input v-model="form.receiveTime" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/promoteCode'
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
        promoteId: '',
        mid: '',
        shopId: '',
        price: '',
        discount: '',
        orderId: '',
        remark: '',
        state: '',
        useTime: '',
        receiveTime: ''
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
        this.$notify({
          title: '添加成功',
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
        this.$notify({
          title: '修改成功',
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
        promoteId: '',
        mid: '',
        shopId: '',
        price: '',
        discount: '',
        orderId: '',
        remark: '',
        state: '',
        useTime: '',
        receiveTime: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
