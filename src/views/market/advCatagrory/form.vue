<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="English Name" >
        <el-input v-model="form.ename" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Chinese Name" >
        <el-input v-model="form.cname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Position" >
        <el-input v-model="form.position" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Shop Id" >
        <el-input v-model="form.shopId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Width" >
        <el-input v-model="form.wide" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Length" >
        <el-input v-model="form.length" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Remark" >
        <el-input v-model="form.remark" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/advCatagrory'
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
        ename: '',
        cname: '',
        position: '',
        shopId: '',
        wide: '',
        length: '',
        remark: ''
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
        ename: '',
        cname: '',
        position: '',
        shopId: '',
        wide: '',
        length: '',
        remark: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
