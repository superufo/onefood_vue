<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="promote Id" >
        <el-input v-model="form.promoteId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Goods Id" >
        <el-input v-model="form.goodsId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="promote Ename" >
        <el-input v-model="form.promoteEname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="promote Cname" >
        <el-input v-model="form.promoteCname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Goods Ename" >
        <el-input v-model="form.goodsEname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Goods Cname" >
        <el-input v-model="form.goodsCname" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/promoteGoods'
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
        promoteId: '',
        goodsId: '',
        promoteEname: '',
        promoteCname: '',
        goodsEname: '',
        goodsCname: ''
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
        promoteId: '',
        goodsId: '',
        promoteEname: '',
        promoteCname: '',
        goodsEname: '',
        goodsCname: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
