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
          v-permission="['ADMIN','PROMOTESETTING_ALL','PROMOTESETTING_CREATE']"
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
      <el-table-column prop="id" label="Id"/>
      <el-table-column prop="startDate" label="Start Date ">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="endDate" label="End Date ">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ename" label="English  Name"/>
      <el-table-column prop="cname" label="Chinese Name"/>
      <el-table-column prop="shopId" label="Shop Id"/>
      <el-table-column prop="price" label="Promote Price  价格"/>
      <el-table-column prop="discount" label="Discount"/>
      <el-table-column prop="goods" label="Goods"/>
      <el-table-column prop="goodsType" label="Goods Type    或者优惠的类目"/>
      <el-table-column prop="type" label="Type"/>
      <el-table-column prop="quantity" label="Quantity"/>
      <el-table-column v-if="checkPermission(['ADMIN','PROMOTESETTING_ALL','PROMOTESETTING_EDIT','PROMOTESETTING_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','PROMOTESETTING_ALL','PROMOTESETTING_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','PROMOTESETTING_ALL','PROMOTESETTING_DELETE']"
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
import { del } from '@/api/promoteSetting'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'Id' },
        { key: 'startDate', display_name: 'Start Date ' },
        { key: 'endDate', display_name: 'End Date ' },
        { key: 'ename', display_name: 'English  Name' },
        { key: 'cname', display_name: 'Chinese Name' },
        { key: 'shopId', display_name: 'Shop Id' },
        { key: 'price', display_name: 'Promote Price  价格' },
        { key: 'discount', display_name: 'Discount' },
        { key: 'goods', display_name: 'Goods' },
        { key: 'remark', display_name: 'Remark' },
        { key: 'goodsType', display_name: 'Goods Type    或者优惠的类目' },
        { key: 'type', display_name: 'Type' },
        { key: 'quantity', display_name: 'Quantity' }
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
      this.url = 'api/promoteSetting'
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
        startDate: data.startDate,
        endDate: data.endDate,
        ename: data.ename,
        cname: data.cname,
        shopId: data.shopId,
        price: data.price,
        discount: data.discount,
        goods: data.goods,
        remark: data.remark,
        goodsType: data.goodsType,
        type: data.type,
        quantity: data.quantity
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
