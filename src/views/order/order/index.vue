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
          v-permission="['ADMIN','ORDER_ALL','ORDER_CREATE']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->

    <eForm ref="form" :is-add="isAdd" />


    <el-drawer
            :append-to-body="true"
            title="ORDER Goods Lists"
            :visible.sync="isShowChildList"
            custom-class="demo-drawer"
            ref="listDrawer"
            direction="rtl"
            :before-close="handleListClose"
            size="50%"
            @open="openDl(this)"
    >
      <listDrawer ref="list"  :order-id="orderId"   />
    </el-drawer>


    <el-drawer
            :append-to-body="true"
            title="ORDER DELIVERY"
            :visible.sync="isShowlistDelivery"
            custom-class="demo-drawer"
            ref="listDelivery"
            direction="rtl"
            :before-close="handleClose"
            size="50%"
    >
      <listDelivery ref="listDelivery"  :order-id="orderId"    />
    </el-drawer>


    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID" width="260" />
      <el-table-column prop="shopId" label="Shop Id" width="80" />
      <el-table-column prop="mid" label="Member Id" width="80" />
      <el-table-column prop="acount" label="Member Acount" width="110"/>
      <el-table-column prop="payType" label="Pay Type"/>
      <el-table-column prop="payId" label="Pay Id"/>
      <!--<el-table-column prop="payTime" label="Pay Time" width="100" />-->
      <!--<el-table-column prop="payTime" label="Pay Time" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTime(scope.row.payTime) }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="goodsPrice" label="Goods Price" width="100"/>
      <el-table-column prop="currency" label="Currency"/>
      <el-table-column prop="currencySymbol" label="Currency Symbol" width="120"/>
      <el-table-column prop="tax" label="Tax"/>
      <el-table-column prop="taxPrice" label="Tax Price"/>
      <el-table-column prop="pointPrice" label="Point Price " width="100" />
      <el-table-column prop="actualPrice" label="Actual Price" width="100" />
      <el-table-column prop="deliveryId" label="Delivery Id" width="100" />
      <el-table-column prop="deliveryTime" label="Delivery Time" width="100" />
      <!--<el-table-column prop="deliveryTime" label="Delivery Time" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTime(scope.row.deliveryTime) }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="deliveryPrice" label="Delivery Price" width="100" />
      <el-table-column prop="volume" label="Volume"/>
      <el-table-column prop="weight" label="Weight"/>
      <el-table-column prop="promotePrice" label="Promote Price" width="110" />
      <el-table-column prop="promoteCode" label="Promote Code" width="110" />
      <el-table-column prop="state" label="State">
          <template slot-scope="scope">
            <div v-for="item in stateOptions" :key="item.id">
              <el-tag v-if="scope.row.state === item.id" :type="scope.row.state ? '' : 'info'">{{ item.label }}</el-tag>
            </div>
          </template>
      </el-table-column>
      <el-table-column prop="orderTime" label="Order Time" width="100" />

      <!--<el-table-column prop="orderTime" label="Order Time" width="100">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{ parseTime(scope.row.orderTime) }}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column v-if="checkPermission(['ADMIN','ORDER_ALL','ORDER_EDIT','ORDER_DELETE'])" label="操作" width="260px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ORDER_ALL','ORDER_EDIT']" size="mini" type="primary" icon="el-icon-notebook-2" @click="showGoodsList(scope.row)"/>
          <el-button v-permission="['ADMIN','ORDER_ALL','ORDER_EDIT']" size="mini" type="primary" icon="el-icon-notebook-1" @click="showDelevery(scope.row)"/>
          <el-button v-permission="['ADMIN','ORDER_ALL','ORDER_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','ORDER_ALL','ORDER_DELETE']"
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
import { del } from '@/api/order'

import { parseTime } from '@/utils/index'
import eForm from './form'

import listDrawer from '../ordergoods/index'

import listDelivery from '../orderdelivery/index'

export default {
  //components: { eForm },
  components: { eForm,listDrawer, listDelivery},
  mixins: [initData],
  data() {
    return {
      isShowChildList:false,
      isShowlistDelivery:false,
      orderId:'',
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'shopId', display_name: 'Shop Id' },
        { key: 'mid', display_name: 'Member Id' },
        { key: 'acount', display_name: 'Member Acount' },
        { key: 'payType', display_name: 'Pay Type' },
        { key: 'payId', display_name: 'Pay Id' },
        { key: 'payTime', display_name: 'Pay Time' },
        { key: 'goodsPrice', display_name: 'Goods Price' },
        { key: 'currency', display_name: 'Currency' },
        { key: 'currencySymbol', display_name: 'Currency' },
        { key: 'tax', display_name: 'Tax' },
        { key: 'taxPrice', display_name: 'Tax Price' },
        { key: 'pointPrice', display_name: 'Point Price ' },
        { key: 'actualPrice', display_name: 'Actual Price' },
        { key: 'deliveryId', display_name: 'Delivery Id' },
        { key: 'deliveryTime', display_name: 'Delivery Time' },
        { key: 'deliveryPrice', display_name: 'Delivery Price' },
        { key: 'volume', display_name: 'Volume' },
        { key: 'weight', display_name: 'Weight' },
        { key: 'promotePrice', display_name: 'Promote Price' },
        { key: 'promoteCode', display_name: 'Promote Code' },
        { key: 'state', display_name: 'State' },
        { key: 'orderTime', display_name: 'Order Time' }
      ],
      stateOptions : [
          { id: 0,  label: 'NO PAY',value:0},
          { id: 1,  label: 'PAID',value:1},
          { id: 2,  label: 'FINISH',value:2},
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
    openDl(e){
    } ,
    showDelevery(data){
          this.isShowlistDelivery = true;
          this.orderId = data.id;
    },
    showGoodsList(data){
      this.isShowChildList = true;
      this.orderId = data.id;
    },
    handleListClose(done){
      done()
    } ,
    handleClose(done){
          done()
    } ,
    beforeInit() {
      this.url = 'api/order'
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
        this.$notify({
          title: '删除成功',
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
        mid: data.mid,
        acount: data.acount,
        mbInfo:  data.mid+"|"+data.account,
        payType: data.payType,
        payId: data.payId,
        payTime: data.payTime,
        goodsPrice: data.goodsPrice,
        currency: data.currency,
        currencySymbol: data.currencySymbol,
        tax: data.tax,
        taxPrice: data.taxPrice,
        pointPrice: data.pointPrice,
        actualPrice: data.actualPrice,
        deliveryId: data.deliveryId,
        deliveryTime: data.deliveryTime,
        deliveryPrice: data.deliveryPrice,
        volume: data.volume,
        weight: data.weight,
        promotePrice: data.promotePrice,
        promoteCode: data.promoteCode,
        state: data.state,
        orderTime: data.orderTime
      }
      _this.dialog = true
    }

  }
}
</script>

<style scoped>

</style>
