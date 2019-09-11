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
          v-permission="['ADMIN','REDEEMPOINT_ALL','REDEEMPOINT_CREATE']"
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
      <el-table-column prop="code" label="Code"/>
      <el-table-column prop="redeemId" label="Redeem Id"/>
      <el-table-column prop="redeemEname" label="Redeem Ename"/>
      <el-table-column prop="redeemCname" label="Redeem Cname"/>
      <el-table-column prop="mid" label="Member ID"/>
      <el-table-column prop="shopId" label="Shop Id"/>
      <el-table-column prop="point" label="Reward Point "/>
      <el-table-column prop="receiveTime" label="Receive Time 获取的时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="useTime" label="Use Time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.useTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="State"/>
      <el-table-column prop="type" label="Type"/>
      <el-table-column v-if="checkPermission(['ADMIN','REDEEMPOINT_ALL','REDEEMPOINT_EDIT','REDEEMPOINT_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','REDEEMPOINT_ALL','REDEEMPOINT_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','REDEEMPOINT_ALL','REDEEMPOINT_DELETE']"
            :ref="scope.row.code"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.code].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.code)">确定</el-button>
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
import { del } from '@/api/redeemPoint'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'code', display_name: 'Code' },
        { key: 'redeemId', display_name: 'Redeem Id' },
        { key: 'redeemEname', display_name: 'Redeem Ename' },
        { key: 'redeemCname', display_name: 'Redeem Cname' },
        { key: 'mid', display_name: 'Member ID' },
        { key: 'shopId', display_name: 'Shop Id' },
        { key: 'point', display_name: 'Reward Point ' },
        { key: 'remark', display_name: 'Remark' },
        { key: 'receiveTime', display_name: 'Receive Time 获取的时间' },
        { key: 'useTime', display_name: 'Use Time' },
        { key: 'state', display_name: 'State' },
        { key: 'type', display_name: 'Type' }
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
      this.url = 'api/redeemPoint'
      const sort = 'code,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(code) {
      this.delLoading = true
      del(code).then(res => {
        this.delLoading = false
        this.$refs[code].doClose()
        this.dleChangePage()
        this.init()
        this.$message({
          message: 'Delete  Success',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[code].doClose()
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
        code: data.code,
        redeemId: data.redeemId,
        redeemEname: data.redeemEname,
        redeemCname: data.redeemCname,
        mid: data.mid,
        shopId: data.shopId,
        point: data.point,
        remark: data.remark,
        receiveTime: data.receiveTime,
        useTime: data.useTime,
        state: data.state,
        type: data.type
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
