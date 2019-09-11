<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="角色级别" prop="sort">
        <el-input-number v-model.number="form.level" :min="1" controls-position="right" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="所在地区" >
        <!--<el-input v-model="form.shopId" style="width: 370px;"/>-->
        <el-select v-model="country" style="width: 160px" ref="country" placeholder="请选择国家"
                   @change="getProvinces()">
          <el-option
                  v-for="item in countryOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>

        <el-select v-model="provice" style="width: 160px" ref="provice" placeholder="请选择省份" @change="getCityes()">
          <el-option
                  v-for="item in provinceOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>

        <el-select v-model="city" style="width: 160px" ref="city" placeholder="请选择城市" @change="getDistricts()">
          <el-option
                  v-for="item in citiesOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>

        <el-select v-model="street" style="width: 160px" ref="street" placeholder="请选择街道" @change="setShopId()">
          <el-option
                  v-for="item in streetOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item label="所在店铺" >
        <el-select  style="width: 370px" ref="city" placeholder="请选择店铺" @change="setShopId()"  v-model="form.shopId">
          <el-option
                  v-for="item in shopOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>

      <el-form-item label="数据范围">
        <el-select v-model="form.dataScope" style="width: 370px" placeholder="请选择数据范围" @change="changeScope">
          <el-option
            v-for="item in dateScopes"
            :key="item"
            :label="item"
            :value="item"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.dataScope === '自定义'" label="数据权限">
        <treeselect v-model="deptIds" :options="depts" multiple style="width: 370px" placeholder="请选择" />
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/dept'
import { add, edit } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import {getCountry, getProvince,getCity,getDistrict} from '@/api/zone'
import {getShopByZone} from '@/api/shop'

export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3 ,shopId:"1"},
      countryOptions: [],
      provinceOptions: [],
      citiesOptions: [],
      streetOptions:[],
      country: '',
      provice: '',
      city: '',
      street:'',
      shopOptions:[],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getCountryInfo() {
        this.countryOptions = [];
        this.provinceOptions = [];
        this.citiesOptions = [];
        this.streetOptions = [];
        getCountry().then(res => {
            for (var item of res) {
                let temp = {display_name: item.cname, key: item.id}
                this.countryOptions.push(temp)
            }
            this.country = this.countryOptions[0].key;
            this.getProvinces();
            this.getCityes();
        });
    },
    getProvinces() {
        this.provinceOptions = [];
        this.citiesOptions = [];
        this.streetOptions = [];
        if (this.country) {
            getProvince(this.country).then(res => {
                for (var item of res) {
                    let temp = {display_name: item.cname, key: item.id}
                    this.provinceOptions.push(temp)
                }

                if( this.provinceOptions.length>0 ) {
                    this.provice = this.provinceOptions[0].key;
                    this.getCityes();
                }
            });
        }
        //this.setShopId();
    },
    getCityes() {
        this.citiesOptions = [];
        this.streetOptions = [];
        if (this.provice) {
            getCity(this.provice).then(res => {
                for (var item of res) {
                    let temp = {display_name: item.cname, key: item.id}
                    this.citiesOptions.push(temp)
                }

                if( this.citiesOptions.length>0 ) {
                    this.city = this.citiesOptions[0].key;
                    this.getStreets();
                }
            });
        }
        this.setShopId();
    },
    getStreets() {
        this.streetOptions = [{display_name:"全部",key:""}];
        if (this.provice) {
            getCity(this.city).then(res => {
                for (var item of res) {
                    let temp = {display_name: item.cname, key: item.id}
                    this.streetOptions.push(temp)
                }

                if( this.streetOptions.length>0 ) {
                    this.street = this.streetOptions[0].key;
                }
            });
        }
        this.setShopId();
    },
    setShopId() {
        var qcountry = this.country==""  ? 0 : this.country;
        var qprovice = this.provice==""  ? 0 : this.provice;
        var qcity    = this.city==""  ? 0 : this.city;
        var qstreet  = this.street==""  ? 0 : this.street;
        this.shopOptions = [{display_name:"super shop", key: '1'}];
        getShopByZone(qcountry,qprovice,qcity,qstreet).then(res => {
            for (var item of res) {
                let temp = {display_name: item.ename, key: item.id}
                this.shopOptions.push(temp)
            }

            if( this.shopOptions.length>0 ) {
                this.form.shopId = this.shopOptions[0].key;
            }else{
                this.form.shopId = this.shopOptions[0].key;
            }
        });
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.form.dataScope === '自定义' && this.deptIds.length === 0) {
        this.$message({
          message: '自定义数据权限不能为空',
          type: 'warning'
        })
      } else {
        this.form.depts = []
        if (this.form.dataScope === '自定义') {
          for (let i = 0; i < this.deptIds.length; i++) {
            this.form.depts.push({
              id: this.deptIds[i]
            })
          }
        }
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
          } else {
            return false
          }
        })
      }
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$message({
          message: 'Add  Success',
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
        this.$message({
          message: 'Edit  Success',
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
      this.form = { name: '', depts: [], remark: '', dataScope: '本级', level: 3 }
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content
      })
    },
    changeScope() {
      if (this.form.dataScope === '自定义') {
        this.getDepts()
      }
    }
  },
  mounted() {
      this.getCountryInfo();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
