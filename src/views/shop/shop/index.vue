<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        <el-button
          v-permission="['ADMIN','SHOP_ALL','SHOP_CREATE']"
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
      <el-table-column prop="name" label="店名"/>
      <el-table-column prop="ename" label="英文店名"/>
      <el-table-column prop="owner" label="店主"/>
      <el-table-column prop="logo" label="logo">
      <template slot-scope="scope">
        <img  style="width:30px; height:30px"  :src="scope.row.logo"/>
      </template>
      </el-table-column>
      <el-table-column prop="type" label="菜肴种类"/>
      <el-table-column prop="telphone" label="电话号码"/>
      <el-table-column prop="country" label="国家">
        <template slot-scope="scope">
          <span>{{ scope.row.zonevo.countryName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="provice" label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.zonevo.proviceName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="city" label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.zonevo.cityName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="street" label="街道">
      <template slot-scope="scope">
        <span>{{ scope.row.zonevo.streetName }}</span>
      </template>
      </el-table-column>

      <el-table-column prop="address" label="详细地址"/>
      <el-table-column prop="state" label="状态"/>
      <el-table-column prop="longitude" label="经度"/>
      <el-table-column prop="latitude" label="纬度"/>
      <el-table-column prop="tax" label="税收"/>
      <el-table-column prop="workStart" label="营业开始时间"/>
      <el-table-column prop="workEnd" label="营业结束时间"/>
      <el-table-column prop="introduce" label="介绍"    v-if="false"/>
      <el-table-column prop="createdAt" label="店铺创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="系统创建时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateAt" label="系统更新时间">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['ADMIN','SHOP_ALL','SHOP_EDIT','SHOP_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','SHOP_ALL','SHOP_EDIT']" size="mini" type="primary"  v-if="isShow(scope.row)"  icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','SHOP_ALL','SHOP_DELETE']"
            :ref="scope.row.id"
            placement="top"
            v-if="isShow(scope.row)"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0"  >
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
import { del } from '@/api/shop'
import { parseTime } from '@/utils/index'
import eForm from './form'

export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
            { key: 'id', display_name: '店铺ID' },
            { key: 'cname', display_name: '中文名称' },
            { key: 'ename', display_name: '英文名称' },
      ],
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    isShow:function(row){
       if (row.id==1){
           return false;
       }else {
           return true;
       }
    },
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'api/shop'
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
        this.isAdd = false;
        const _this = this.$refs.form;

        _this.form = {
            id: data.id,
            name: data.name,
            ename: data.ename,
            owner: data.owner,
            logo: data.logo,
            type: data.type,
            telphone: data.telphone,
            country: data.country,
            provice: data.provice,
            city: data.city,
            street: data.street,
            address: data.address,
            state: data.state,
            longitude: data.longitude,
            latitude: data.latitude,
            tax: data.tax,
            workStart: data.workStart,
            workEnd: data.workEnd,
            createdAt: data.createdAt,
            introduce: data.introduce,
        };

        _this.editContent =  data.introduce ;

        _this.dialog = true;

    }
  }
}
</script>

<style scoped>

</style>
