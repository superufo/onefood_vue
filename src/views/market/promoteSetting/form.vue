<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="Start Date " >
        <el-input v-model="form.startDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="End Date " >
        <el-input v-model="form.endDate" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="English  Name" >
        <el-input v-model="form.ename" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Chinese Name" >
        <el-input v-model="form.cname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Shop Id" >
        <el-input v-model="form.shopId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Promote Price  价格" >
        <el-input v-model="form.price" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Discount" >
        <el-input v-model="form.discount" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Goods" >
        <el-input v-model="form.goods" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Goods Type    或者优惠的类目" >
        <el-input v-model="form.goodsType" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Type" >
        <el-input v-model="form.type" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Quantity" >
        <el-input v-model="form.quantity" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/promoteSetting'
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
        startDate: '',
        endDate: '',
        ename: '',
        cname: '',
        shopId: '',
        price: '',
        discount: '',
        goods: '',
        remark: '',
        goodsType: '',
        type: '',
        quantity: ''
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
        startDate: '',
        endDate: '',
        ename: '',
        cname: '',
        shopId: '',
        price: '',
        discount: '',
        goods: '',
        remark: '',
        goodsType: '',
        type: '',
        quantity: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
