<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <!--<el-form-item label="account"  >-->
        <!--<el-input v-model="form.account" style="width: 320px;"/>-->
      <!--</el-form-item>-->

      <el-form-item label="mid"  v-if="false" >
        <el-input v-model="form.mid" style="width: 120px;"  />
      </el-form-item>

      <el-form-item label="search"  >
        <el-input v-model="form.searchmid"  placeholder="member id" style="width: 120px;"  />
        <el-input v-model="form.searchAccount" placeholder="member name" style="width: 120px;"  />
        <el-button :loading="loading"  @click="getMembers()">search</el-button>
      </el-form-item>

      <el-form-item label="account"  >
        <el-select v-model="form.account" style="width: 320px"  ref="account"   placeholder="choose account"  @change="getMembers()" >
          <el-option
                  v-for="item in memberOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"  />
        </el-select>
      </el-form-item>


      <el-form-item label="country" >
        <el-select v-model="form.country" style="width: 320px"  ref="country"   placeholder="choose country"  @change="getProvinces()" >
          <el-option
                  v-for="item in countryOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"  />
        </el-select>
      </el-form-item>

      <el-form-item label="province" >
        <el-select v-model="form.province" style="width: 320px"  ref="province"  placeholder="choose province"    @change="getCityes()"  >
          <el-option
                  v-for="item in provinceOptions"
                  :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>


      <el-form-item label="City">
        <el-select v-model="form.city" style="width: 320px"  ref="city"   placeholder="choose City"    @change="getDistricts()">
          <el-option
                  v-for="item in citiesOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"  />
        </el-select>
      </el-form-item>

      <el-form-item label="street" >
      <el-select v-model="form.street" style="width: 320px"    ref="street"   placeholder="choose distract"  >
          <el-option
                  v-for="item in distractOptions"
                  :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>

      <el-form-item label="detail" >
        <el-input v-model="form.detail" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="is default" >
        <!--<el-input v-model="form.isDefault" style="width: 370px;"/>-->
        <el-radio v-for="item in isDefaultOption" :key="item.id" v-model="form.isDefault" :label="item.value">{{ item.label }}</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">cancel</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">save</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/address'

import {getZoneByType,getCountry, getProvince,getCity,getDistrict} from '@/api/zone'

import {getMembers} from '@/api/member'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        mid: '',
        country: '',
        province: '',
        city: '',
        street: '',
        detail: '',
        isDefault: 0
      },

      countryOptions:[],
      provinceOptions:[],
      citiesOptions:[],
      distractOptions:[],
        memberOptions:[],
      isDefaultOption: [
          {id: 0, label: 'Default Address' ,value:0  },
          {id: 1, label: 'NOt Default Address' ,value:1 },
      ],
      rules: {
      }
    }
  },
  methods: {
      getMembers() {
          this.memberOptions = [];
          var mid = this.form.searchmid ? this.form.searchmid : 0 ;
          var midName = this.form.searchAccount ? this.form.searchAccount : 0 ;

          getMembers(mid,midName).then(res => {
              for (var item of res) {
                  let temp = {display_name: item.mid+"|" + item.account, key: item.mid}
                  this.memberOptions.push(temp)
              }
              this.form.mid = this.form.mid> 0 ? this.form.mid : this.memberOptions[0].key;
          });
      },
      getCountryInfo() {
          this.countryOptions = [];
          this.provinceOptions = [];
          this.citiesOptions = [];
          this.distractOptions = [];
          getCountry().then(res => {
              for (var item of res) {
                  let temp = {display_name: item.ename, key: item.id}
                  this.countryOptions.push(temp)
              }
              this.form.country = this.form.country> 0 ? this.form.country : this.countryOptions[0].key;

              this.getProvinces();
              this.getCityes();
          });
      },
      getProvinces() {
          this.provinceOptions = [];
          this.citiesOptions = [];
          this.distractOptions = [];

          if (this.form.country>0) {
              getProvince(this.form.country).then(res => {
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.provinceOptions.push(temp)
                  }

                  if( this.provinceOptions.length>0 ) {
                      this.form.province = this.form.province> 0 ? this.form.province : this.provinceOptions[0].key;
                      this.getCityes();
                  }
              });
          }
      },
      getCityes() {
          this.citiesOptions = [];
          this.distractOptions = [];
          if (this.form.province>0) {
              getCity(this.form.province).then(res => {
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.citiesOptions.push(temp)
                  }

                  if( this.citiesOptions.length>0 ) {
                      this.form.city = this.citiesOptions[0].key;
                      this.getDistricts();
                  }
              });
          }
      },
      getDistricts() {
          this.distractOptions = [];
          if ( this.form.city >0 ) {
              getCity(this.form.city).then(res => {
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.distractOptions.push(temp)
                  }

                  if( this.distractOptions.length>0 ) {
                      this.form.street = this.distractOptions[0].key;
                  }
              });
          }
      },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.loading = true
      if (this.isAdd) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
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
        this.$notify({
          title: '修改成功',
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
      this.form = {
        id: '',
        mid: '',
        country: '',
        province: '',
        city: '',
        street: '',
        detail: '',
        isDefault: ''
      }
    }
  },
  mounted() {
      this.getCountryInfo();
      this.getMembers();
  }
}
</script>

<style scoped>

</style>
