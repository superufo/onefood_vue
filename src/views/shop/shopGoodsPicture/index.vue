<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container"  v-if="!goodsId"    >
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
        <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <div class="head-container"  v-else >
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
                v-permission="['ADMIN','SHOPGOODSPICTURE_ALL','SHOPGOODSPICTURE_CREATE']"
                class="filter-item"
                size="mini"
                type="primary"
                icon="el-icon-plus"
                @click="add">新增</el-button>
      </div>
    </div>

    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :goods-id="goodsId" :shop-id="shopId" />
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="shopId" label="Shop ID"/>
      <el-table-column prop="goodsId" label="Goods ID"/>

      <el-table-column prop="picId" label="Picture Id"/>
      <el-table-column prop="url" label="Url"/>
      <el-table-column v-if="checkPermission(['ADMIN','SHOPGOODSPICTURE_ALL','SHOPGOODSPICTURE_EDIT','SHOPGOODSPICTURE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','SHOPGOODSPICTURE_ALL','SHOPGOODSPICTURE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','SHOPGOODSPICTURE_ALL','SHOPGOODSPICTURE_DELETE']"
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
import { del } from '@/api/shopGoodsPicture'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  props: {
      goodsId: {
          type: Number,
      },
      shopId: {
          type: Number,
      },
  },
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'shopId', display_name: 'Shop ID' },
        { key: 'goodsId', display_name: 'Goods ID' },
        { key: 'picId', display_name: 'Picture  Id' },
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
      this.url = 'api/shopGoodsPicture'
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      const query = this.query
      const type = query.type
      const value = query.value

      if  ( typeof(this.goodsId) !=  undefined && this.goodsId!=''){
          this.params['goodsId'] = this.goodsId
      }else {
          if (type && value) {
              this.params[type] = value
          }
      }

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
        goodsId: data.goodsId,
        createTime: data.createTime,
        deleteUrl: data.deleteUrl,
        filename: data.filename,
        height: data.height,
        size: data.size,
        url: data.url,
        width: data.width
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>
