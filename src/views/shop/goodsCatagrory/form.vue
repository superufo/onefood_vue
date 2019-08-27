<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="父ID" >
        <!--<el-input v-model="form.parentId" style="width: 370px;"/>-->
        <el-select v-model="form.parentId" style="width: 370px"  clearable placeholder="请选择父ID" >
          <el-option
                  v-for="item in pidOprions"
                  :key="item.key" :label="item.display_name" :value="item.key"    />
        </el-select>
      </el-form-item>
      <el-form-item label="中文名称" >
        <el-input v-model="form.cname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="英文名称" >
        <el-input v-model="form.ename" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="备注" >
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
import { add, edit,index } from '@/api/shopGoodsCatagrory'
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
        parentId: '',
        cname: '',
        ename: '',
        remark: ''
      },
      pidOprions:this.getpidOprions(),
      rules: {
      }
    }
  },
  methods: {
    getpidOprions() {
        var pidOprions=[];
        index().then(res => {
            for (var item of res.content) {
                let  temp = {display_name:item.cname,key:item.id,label:item.ename}
                pidOprions.push(temp)
            }
        });
        return pidOprions;
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
        id: '',
        parentId: '',
        cname: '',
        ename: '',
        remark: ''
      }
    }
  }


}
</script>

<style scoped>

</style>
