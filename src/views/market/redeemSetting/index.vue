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
          v-permission="['ADMIN','REDEEMSETTING_ALL','REDEEMSETTING_CREATE']"
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
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="shopId" label="Shop Id"/>
      <el-table-column prop="point" label="Reward Point"/>
      <el-table-column prop="discount" label="Discount"/>
      <el-table-column prop="qrCode" label="QR Code"/>
      <el-table-column prop="condition" label="Reward Condition"/>
      <el-table-column prop="type" label="Type"/>
      <el-table-column prop="starTime" label="Star Time"/>
      <el-table-column prop="endTime" label="End Time"/>
      <el-table-column v-if="checkPermission(['ADMIN','REDEEMSETTING_ALL','REDEEMSETTING_EDIT','REDEEMSETTING_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','REDEEMSETTING_ALL','REDEEMSETTING_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','REDEEMSETTING_ALL','REDEEMSETTING_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
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
import { del } from '@/api/redeemSetting'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'shopId', display_name: 'Shop Id' },
        { key: 'point', display_name: 'Reward Point' },
        { key: 'discount', display_name: 'Discount' },
        { key: 'qrCode', display_name: 'QR Code' },
        { key: 'remark', display_name: 'Remark' },
        { key: 'condition', display_name: 'Reward Condition' },
        { key: 'type', display_name: 'Type' },
        { key: 'starTime', display_name: 'Star Time' },
        { key: 'endTime', display_name: 'End Time' }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    checkPermission,
    beforeInit() {
      this.url = 'api/redeemSetting'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value
      if (type && value) { this.params[type] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.dleChangePage()
        this.init()
        this.$message({
          message: 'Delete  Success',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
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
        id: data.id,
        shopId: data.shopId,
        point: data.point,
        discount: data.discount,
        link: data.link,
        qrCode: data.qrCode,
        remark: data.remark,
        condition: data.condition,
        type: data.type,
        starTime: data.starTime,
        endTime: data.endTime
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
