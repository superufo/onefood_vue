<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          v-permission="['ADMIN','MEMBER_ALL','MEMBER_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="mid" label="用户ID"/>
      <el-table-column prop="account" label="账号"/>
      <el-table-column prop="firstname" label="姓"/>
      <el-table-column prop="lastname" label="名"/>
      <!--<el-table-column prop="password" label="密码"/>-->
      <el-table-column prop="useremail" label="Email"/>
      <el-table-column prop="mobile" label="手机"/>
      <el-table-column prop="facebook" label="Facebook"/>
      <el-table-column prop="google" label="google 账号"/>
      <el-table-column prop="image" label="头像">
        <template slot-scope="scope">
          <img  style="width:30px; height:30px"  :src="scope.row.image"/>
        </template>
      </el-table-column>
      <el-table-column prop="birthday" label="生日">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="addressId" label="地址"/>
      <el-table-column prop="state" label="状态">
      <template slot-scope="scope">
        <span v-if="scope.row.state ===1 " >激活</span>
        <span v-if="scope.row.state ===0 " >禁止</span>
      </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" >
          <template slot-scope="scope">
            <span v-if="scope.row.sex ===1 " >男</span>
            <span v-if="scope.row.sex ===0 " >女</span>
          </template>
      </el-table-column>

      <el-table-column prop="nickname" label="昵称"/>
      <el-table-column prop="groupId" label="组"/>
      <el-table-column prop="userpoint" label="总的奖赏"/>
      <el-table-column prop="lastLoginTime" label="最后登录时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastLoginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastLoginIp" label="最后登录IP"/>
      <el-table-column v-if="checkPermission(['ADMIN','MEMBER_ALL','MEMBER_EDIT','MEMBER_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','MEMBER_ALL','MEMBER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','MEMBER_ALL','MEMBER_DELETE']"
            :ref="scope.row.mid"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.mid].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.mid)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      :current-page="page + 1"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/member'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'mid', display_name: '用户ID' },
        { key: 'account', display_name: '账号' },
        { key: 'firstname', display_name: '姓' },
        { key: 'lastname', display_name: '名' },
        { key: 'useremail', display_name: 'Email' },
        { key: 'mobile', display_name: '手机' },
        { key: 'state', display_name: '状态' },
        { key: 'sex', display_name: '性别' },
        { key: 'nickname', display_name: '昵称' },
        { key: 'lastLoginIp', display_name: '最后登录IP' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/member'
      const sort = 'mid,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(mid) {
      this.delLoading = true
      del(mid).then(res => {
        this.delLoading = false
        this.$refs[mid].doClose()
        this.dleChangePage()
        this.init()
        this.$message({
          message: 'Delete  Success',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[mid].doClose()
        console.log(err.response.data.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.form = {
        mid: data.mid,
        account: data.account,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
        salt: data.salt,
        useremail: data.useremail,
        mobile: data.mobile,
        facebook: data.facebook,
        google: data.google,
        image: data.image,
        birthday: data.birthday,
        addressId: data.addressId,
        state: data.state,
        sex: data.sex,
        nickname: data.nickname,
        groupId: data.groupId,
        userpoint: data.userpoint,
        lastLoginTime: data.lastLoginTime,
        lastLoginIp: data.lastLoginIp,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
