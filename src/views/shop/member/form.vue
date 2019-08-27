<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="账号" >
        <el-input v-model="form.account" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="姓" >
        <el-input v-model="form.firstname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="名" >
        <el-input v-model="form.lastname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="密码" >
        <el-input v-model="form.password" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="salt" >
        <el-input v-model="form.salt" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Email" >
        <el-input v-model="form.useremail" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="手机" >
        <el-input v-model="form.mobile" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="Facebook" >
        <el-input v-model="form.facebook" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="google 账号" >
        <el-input v-model="form.google" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="头像" >
        <el-input v-model="form.image" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="生日" >
        <el-input v-model="form.birthday" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="地址" >
        <el-input v-model="form.addressId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="form.state" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="性别" >
        <el-input v-model="form.sex" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="昵称" >
        <el-input v-model="form.nickname" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="组" >
        <el-input v-model="form.groupId" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="总的奖赏" >
        <el-input v-model="form.userpoint" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最后登录时间" >
        <el-input v-model="form.lastLoginTime" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="最后登录IP" >
        <el-input v-model="form.lastLoginIp" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="系统创建时间" >
        <el-input v-model="form.createdAt" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="系统更新时间" >
        <el-input v-model="form.updatedAt" style="width: 370px;"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/member'
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
        mid: '',
        account: '',
        firstname: '',
        lastname: '',
        password: '',
        salt: '',
        useremail: '',
        mobile: '',
        facebook: '',
        google: '',
        image: '',
        birthday: '',
        addressId: '',
        state: '',
        sex: '',
        nickname: '',
        groupId: '',
        userpoint: '',
        lastLoginTime: '',
        lastLoginIp: '',
        createdAt: '',
        updatedAt: ''
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
        mid: '',
        account: '',
        firstname: '',
        lastname: '',
        password: '',
        salt: '',
        useremail: '',
        mobile: '',
        facebook: '',
        google: '',
        image: '',
        birthday: '',
        addressId: '',
        state: '',
        sex: '',
        nickname: '',
        groupId: '',
        userpoint: '',
        lastLoginTime: '',
        lastLoginIp: '',
        createdAt: '',
        updatedAt: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
