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
          v-permission="['ADMIN','SHOPGOODS_ALL','SHOPGOODS_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>

    <el-drawer
            :append-to-body="true"
            title="Goods Picture Lists"
            :visible.sync="isShowChildList"
            custom-class="demo-drawer"
            ref="listDrawer"
            direction="rtl"
            :before-close="handleListClose"
            size="50%"
            @open="openDl(this)"
    >
      <listDrawer ref="list" :goods-id="goodsId" :shop-id="shopId" />
    </el-drawer>


    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="catagroryId" label="菜肴分类">
      <template slot-scope="scope">
        {{ scope.row.goodsCatagrory.ename }}
      </template>
      </el-table-column>

      <el-table-column  label="店铺">
          <template slot-scope="scope">
            {{ scope.row.shop.ename }}
          </template>
      </el-table-column>
      <!--<el-table-column prop="shopId" label="shopId" />-->
      <el-table-column prop="cname" label="中文名称"/>
      <el-table-column prop="ename" label="英文名称"/>
      <el-table-column prop="price" label="价格"/>
      <el-table-column prop="discount" label="折扣"/>
      <el-table-column prop="point" label="point价格"/>
      <el-table-column prop="isPromote" label="是否优惠卷"/>
      <el-table-column prop="promotePrice" label="优惠价"/>
      <el-table-column prop="cost" label="成本"/>
      <el-table-column prop="currency" label="货币"/>
      <el-table-column prop="unit" label="货币表示"/>
      <el-table-column prop="edescription" label="英文描述" v-if="hidden" />
      <el-table-column prop="cdescription" label="中文描述"  v-if="hidden" />
      <el-table-column v-if="checkPermission(['ADMIN','SHOPGOODS_ALL','SHOPGOODS_EDIT','SHOPGOODS_DELETE'])" label="操作" width="180px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ORDER_ALL','ORDER_EDIT']" size="mini" type="info" icon="el-icon-notebook-2" @click="showGoodsPic(scope.row)"/>
          <el-button v-permission="['ADMIN','SHOPGOODS_ALL','SHOPGOODS_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','SHOPGOODS_ALL','SHOPGOODS_DELETE']"
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
import { del } from '@/api/shopGoods'
import eForm from './form'

import listDrawer from '../shopGoodsPicture/index'

export default {
  components: { eForm,listDrawer },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'catagroryId', display_name: '菜肴分类' },
        { key: 'shopId', display_name: '店铺ID' },
        { key: 'cname', display_name: '中文名称' },
        { key: 'ename', display_name: '英文名称' },
        { key: 'price', display_name: '价格' },
        { key: 'discount', display_name: '折扣' },
        { key: 'point', display_name: 'point价格' },
        { key: 'isPromote', display_name: '是否优惠卷' },
        { key: 'promotePrice', display_name: '优惠价' },
        { key: 'cost', display_name: '成本' },
        { key: 'currency', display_name: '货币' },
        { key: 'unit', display_name: '货币表示' },
        { key: 'edescription', display_name: '英文描述' },
        { key: 'cdescription', display_name: '中文描述' }
      ],
      isShowChildList:false,
      goodsId:'',
      shopId:''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
     showGoodsPic(data){
        this.isShowChildList = true
        this.goodsId = data.id
        this.shopId = data.shop.id
    },
    handleListClose(done){
        done()
    },
    checkPermission,
    beforeInit() {
      this.url = 'api/shopGoods'
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
        catagroryId: data.goodsCatagrory.id,
        shopId: data.shop.id,
        cname: data.cname,
        ename: data.ename,
        price: data.price,
        discount: data.discount,
        point: data.point,
        isPromote: data.isPromote,
        promotePrice: data.promotePrice,
        cost: data.cost,
        currency: data.currency,
        unit: data.unit,
        edescription: data.edescription,
        cdescription: data.cdescription
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
