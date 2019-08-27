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
          v-permission="['ADMIN','ZONE_ALL','ZONE_CREATE']"
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
      <el-table-column prop="type" label="类型" >
        <template slot-scope="scope">
          <div v-for="item in typeOptions" :key="item.id">
            <el-tag v-if="scope.row.type === item.id" :type="scope.row.type ? '' : 'info'">{{ item.label }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="parentId" label="父ID"/>
      <el-table-column prop="cname" label="中文名称"/>
      <el-table-column prop="ename" label="英文名称"/>
      <el-table-column prop="latitude" label="经度"/>
      <el-table-column prop="longitude" label="纬度"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column v-if="checkPermission(['ADMIN','ZONE_ALL','ZONE_EDIT','ZONE_DELETE'])" label="操作" width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-permission="['ADMIN','ZONE_ALL','ZONE_EDIT']" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            v-permission="['ADMIN','ZONE_ALL','ZONE_DELETE']"
            :ref="scope.row.id"
            placement="top"
            width="180"   v-if="isShow(scope.row)" >
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
import { del } from '@/api/zone'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      delLoading: false,
      queryTypeOptions: [
        { key: 'id', display_name: 'ID' },
        { key: 'type', display_name: '类型' },
        { key: 'parentId', display_name: '父ID' },
        { key: 'cname', display_name: '中文名称' },
        { key: 'ename', display_name: '英文名称' },
        { key: 'latitude', display_name: '经度' },
        { key: 'longitude', display_name: '纬度' },
        { key: 'remark', display_name: '备注' }
      ],
      typeOptions : [
          {id: 1, label: 'country'},
          {id: 2, label: 'Province'},
          {id: 3, label: 'City'},
          {id: 4, label: 'district'},
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    })
  },
  methods: {
    isShow:function(row){
        if ( row.type==1 || row.type==2 ){
            return false;
        }else {
            return true;
        }
    },
    checkPermission,
    beforeInit() {
      this.url = 'api/zone'
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
        type: data.type,
        parentId: data.parentId,
        cname: data.cname,
        ename: data.ename,
        zonevo:data.zonevo,
        latitude: data.latitude,
        longitude: data.longitude,
        remark: data.remark
      }
      _this.dialog = true
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
