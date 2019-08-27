<template>
  <!--<el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">-->

    <el-drawer
            :append-to-body="true"
            :title="isAdd ? 'ADD' : 'EDIt'"
            :visible.sync="dialog"
            custom-class="demo-drawer"
            ref="drawer"
            direction="ltr"
            :before-close="handleClose"
            size="50%"
            @open = "callback()"
    >
    <div style="margin-right: 10px,margin-bottom: -50px; " >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="150px"  style="max-height:800px;overflow: auto; " >

    <!--<el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">-->
      <el-input type="hidden"   v-model="form.catagroryId" style="width: 100px;"/>
     <el-row>
        <el-col :span="12">
            <el-form-item label="菜肴分类"  prop="flevel">
              <!--<el-input v-model="form.catagroryId" style="width: 300px;"/>-->
                <el-select v-model="flevel" style="width: 200px" ref="flevel" placeholder="please choose first menu"
                           @change="getsecond()">
                  <el-option
                          v-for="item in fOptions"
                          :key="item.key" :label="item.display_name" :value="item.key"/>
                </el-select>
            </el-form-item>
            </el-col>
     </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="    " prop="slevel">
          <el-select v-model="slevel" style="width: 200px" ref="slevel" placeholder="please choose second menu"
                     @change="getthree()">
            <el-option
                    v-for="item in sOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="" prop="tlevel">
          <el-select v-model="tlevel" style="width: 200px" ref="tlevel" placeholder="please choose third menu"
                     @change="setPid()">
            <el-option
                    v-for="item in tOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>


     <el-row>
       <el-col :span="12">
          <el-form-item label="所在地区" >
            <!--<el-input v-model="form.shopId" style="width: 300px;"/>-->
            <el-select v-model="country" style="width: 200px" ref="country" placeholder="请选择国家"
                       @change="getProvinces()">
              <el-option
                      v-for="item in countryOptions"
                      :key="item.key" :label="item.display_name" :value="item.key"/>
            </el-select>
          </el-form-item>
       </el-col>

       <el-col :span="12">
         <el-form-item label="" >
          <el-select v-model="provice" style="width: 200px" ref="provice" placeholder="请选择省份" @change="getCityes()">
            <el-option
                    v-for="item in provinceOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
         </el-form-item>
       </el-col>
     </el-row>

    <el-row>
      <el-col :span="12">
      <el-form-item label="     " prop="city">
        <el-select v-model="city" style="width: 180px" ref="city" placeholder="请选择城市" @change="getDistricts()">
          <el-option
                  v-for="item in citiesOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
      </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="" >
        <el-select v-model="street" style="width: 200px" ref="street" placeholder="请选择街道" @change="setShopId()">
          <el-option
                  v-for="item in streetOptions"
                  :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="店铺ID" prop="shopId">
          <el-select  style="width: 200px" ref="shopId" placeholder="请选择店铺" v-model="form.shopId">
            <el-option
                    v-for="item in shopOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
          <el-form-item label="中文名称" prop="cname">
            <el-input v-model="form.cname" style="width: 200px;"/>
          </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="英文名称" prop="ename" >
          <el-input v-model="form.ename" style="width: 200px;"/>
        </el-form-item>
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="24">
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price" style="width: 300px;"/>
          </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
      <el-form-item label="折扣" prop="discount" >
        <el-input v-model="form.discount" style="width: 300px;"/>
      </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
          <el-form-item label="point价格" prop="point" >
            <el-input v-model="form.point" style="width: 300px;"/>
          </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="是否优惠卷" >
          <!--<el-input v-model="form.isPromote" style="width: 300px;"/>-->
          <el-select v-model="form.isPromote" style="width: 300px"  ref="isPromote"   placeholder="choose isPromote" label="Is Promote"  >
            <el-option
                    v-for="item in isPromoteOptions"
                    :key="item.id" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="优惠价"  prop="promotePrice">
          <el-input v-model="form.promotePrice" style="width: 300px;"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-form-item label="成本" prop="cost">
          <el-input v-model="form.cost" style="width: 300px;"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="12">
        <el-form-item label="Currency"  prop="currency">
          <el-select v-model="form.currency" style="width: 200px"  ref="currency"   placeholder="choose Currency" label="Currency"  @change="changeCurent" >
            <el-option
                    v-for="item in CurentOptions"
                    :key="item.currency" :label="item.currency" :value="item.currency" />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="12">
          <el-form-item label="Symbol" >
            <el-input v-model="form.currencySymbol"  readonly="true"  style="width: 200px;"/>
          </el-form-item>
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="12">
        <el-form-item label="英文描述" >
          <el-input v-model="form.edescription" style="width: 200px;"/>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="中文描述" >
          <el-input v-model="form.cdescription" style="width: 200px;"/>
        </el-form-item>
      </el-col>
    </el-row>
        

    </el-form>
      <div slot="footer" class="dialog-footer" style="position: fixed;margin-left: 30%; margin-bottom: 10px">
        <el-button type="text" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
     </div>
    </div>
    </el-drawer>
</template>
<script>
import { add, edit } from '@/api/shopGoods'

import {getCountry, getProvince,getCity,getDistrict,getZoneByType} from '@/api/zone'
import {getShopByZone} from '@/api/shop'
import {getChildren} from '@/api/shopGoodsCatagrory'
import { isCheckPrice,isDecimal } from '@/utils/validate'


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
        catagroryId: '',
        shopId: '',
        cname: '',
        ename: '',
        price: '',
        discount: '',
        point: '',
        isPromote: '',
        promotePrice: '',
        cost: '',
        currency: '',
        unit: '',
        edescription: '',
        cdescription: ''
      },
      countryOptions: [],
      provinceOptions: [],
      citiesOptions: [],
      streetOptions:[],
      CurentOptions:[
          { currency: "USD",  symbol:"$"},
          { currency: "RMB",  symbol:"¥"},
          { currency: "THB",  symbol:"฿"},
          { currency: "EURO", symbol:"€"},
      ],
      country: '',
      provice: '',
      city: '',
      street:'',
      shopOptions:[],
      flevel:'',
      slevel:'',
      tlevel:'',
      fOptions:[],
      sOptions:[],
      tOptions:[],
      isPromoteOptions:[
          { id: 0,  label: 'enable',value:0},
          { id: 1,  label: 'disabled',value:1},
      ],
      rules: {
          flevel: [
              { required: true, message: 'city cannot be empty', trigger: 'blur' }
          ],
          shopId: [
              { required: true, validator: 'shop cannot be empty', trigger: 'blur' }
          ],
          lPrice: [
              { required: true, validator: 'shop cannot be empty', trigger: 'blur' }
          ],
          state: [
              { required: true, validator: 'state cannot be empty', trigger: 'blur' }
          ],
          price: [
              { required: true, validator: isCheckPrice, trigger: 'blur' }
          ],
          taxPrice: [
              { required: true, validator: isCheckPrice, trigger: 'blur' }
          ],
          deliveryPrice: [
              { required: true, validator: isCheckPrice, trigger: 'blur' }
          ],
          Tax: [
              { required: true, validator: isDecimal, trigger: 'blur' }
          ],
      }
    }
  },
  methods: {
      changeCurent(current){
          for (var item of this.CurentOptions ) {
              if  ( item.currency==current ) {
                  this.form.currencySymbol =  item.symbol
                  break;
              }
          }
      },
      callback(){
          this.getCountryInfo();
          this.getfirst();

          this.getsecond();
          this.getthree();
      },
      getfirst(){
          this.fOptions = [];
          this.sOptions = [];
          this.tOptions = [];
          this.slevel = '';
          this.tlevel = '';
          this.getChildrenByPid(0,this.fOptions);

          if( this.fOptions.length>0 ) {
              this.flevel = this.fOptions[1].key;

              this.getsecond();
          }

          this.setPid();
      },
      getsecond(){
          this.sOptions = [];
          this.tOptions = [];
          this.slevel = '';
          this.tlevel = '';
          if ( this.flevel > 0 ) {
              this.getChildrenByPid(this.flevel, this.sOptions);
              if (this.sOptions.length > 0) {
                  this.slevel = this.sOptions[1].key;
                  this.getChildrenByPid(this.slevel, this.tOptions);
              }
              this.setPid();
          }
      },
      getthree(){
          this.tOptions = [];
          this.tlevel = '';
          if ( this.slevel > 0 ) {
              this.getChildrenByPid(this.slevel, this.tOptions);
              if (this.tOptions.length > 0) {
                  this.tlevel = this.tOptions[0].key;
              }
              this.setPid();
          }
      },
      async  getChildrenByPid(pid,options){
          var res = await   getChildren(pid);
          for (var item of res) {
                  let temp = {display_name: item.cname, key: item.id}
                  options.push(temp)
           }

          /*getChildren(pid).then(res => {
              for (var item of res) {
                  let temp = {display_name: item.cname, key: item.id}
                  options.push(temp)
              }
          });*/
      },
      setPid() {
          if ( this.tlevel!=""  )  {
              if( this.tlevel!=0 ) {
                  this.form.catagroryId = this.tlevel
                  return
              }
          }

          if ( this.slevel!=""  ) {
              if( this.slevel!=0 ) {
                  this.form.catagroryId = this.slevel
                  return
              }
          }

          if ( this.flevel!="" ) {
                  this.form.catagroryId = this.flevel
                  return
          }else{
              this.form.catagroryId = 0;
          }
      },
      getCountryInfo() {
          this.countryOptions = [];
          this.provinceOptions = [];
          this.citiesOptions = [];
          this.streetOptions = [];
          this.shopOptions = [];
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
          this.shopOptions = [];
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
      },
      getCityes() {
          this.citiesOptions = [];
          this.streetOptions = [];
          this.shopOptions = [];
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
          this.streetOptions = [];
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
          this.shopOptions = [];
          getShopByZone(qcountry,qprovice,qcity,qstreet).then(res => {
              for (var item of res) {
                  let temp = {display_name: item.ename, key: item.id}
                  this.shopOptions.push(temp)
              }

              if( this.shopOptions.length>0 ) {
                  this.form.shopId = this.shopOptions[0].key;
              }else{
                  this.shopOptions = [{display_name:"no shop in the zone", key: ''}];
                  this.form.shopId = this.shopOptions[0].key;
              }
          });
      },
      handleClose(done) {
          done();
          //location.reload();
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
        catagroryId: '',
        shopId: '',
        cname: '',
        ename: '',
        price: '',
        discount: '',
        point: '',
        isPromote: '',
        promotePrice: '',
        cost: '',
        currency: '',
        unit: '',
        edescription: '',
        cdescription: ''
      }
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
