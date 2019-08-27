<template>
  <!--<el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px">-->
    <!--<el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">-->

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

        <el-row>
          <el-col :span="10">
            <el-form-item label="country">
              <el-select v-model="country" style="width: 200px"  ref="country"   placeholder="choose country"  @change="getProvinces" >
                <el-option
                        v-for="item in countryOptions"
                        :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="province">
              <el-select v-model="provice" style="width: 200px"  ref="provice"  placeholder="choose province"    @change="getCityes"  >
                <el-option
                        v-for="item in provinceOptions"
                        :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="city" prop="city">
              <el-select v-model="city" style="width: 200px"  ref="city"   placeholder="choose city"    @change="getDistricts">
                <el-option
                        v-for="item in citiesOptions"
                        :key="item.key" :label="item.display_name" :value="item.key"  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="地区">
              <el-select v-model="street" style="width: 200px"    ref="street"   placeholder="choose street" >
                <el-option
                        v-for="item in distractOptions"
                        :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="Shop Id"   prop="shopId" >
              <el-select  v-model="form.shopId" style="width: 200px"    ref="shopId"   placeholder="choose shop" @change="getGoods()" >
                <el-option
                        v-for="item in shopOptions"
                        :key="item.key" :label="item.display_name" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Goods Id" prop="goodsId" >
              <el-input  v-if="false" v-model="form.goodsName" style="width: 200px;"/>
              <el-select v-model="form.goodsId" style="width: 200px"  ref="goodsId"   placeholder="choose goods" label="Goods Id"  @change="setGoods">
                <el-option
                        v-for="item in goodsOptions"
                        :key="item.id" :label="item.display_name" :value="item.goodsId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="Cost Type" >
              <el-radio  @change="setCosttype" style="width: 100px;" v-for="item in costTypeOptions" :key="item.id" v-model="form.costType" :label="item.value">{{ item.label }}</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="Unit Point" >
              <el-input v-model="form.unitPoint" style="width: 200px;" readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Unit Price" >
            <el-input v-model="form.unitPrice" style="width: 200px;"  readonly="true"  />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Quantity" prop="quantity">
            <el-input v-model="form.quantity" style="width: 200px;" @change="setCosttype" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Sum Price" >
            <el-input v-model="form.price" style="width: 200px;"  readonly="true"  />
          </el-form-item>
        </el-col>

        <el-col :span="10">
          <el-form-item label="Sum Point" >
            <el-input v-model="form.point" style="width: 200px;"  readonly="true"  />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row  v-if="!orderId" >
        <el-col :span="10">
          <el-form-item label="search"  >
            <el-input v-model="searchOrderId"  placeholder="Order Id" style="width: 120px;"  />
            <el-button :loading="loading"   @click="getOrders()">search</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Order Id" >
            <!--<el-input v-model="form.orderId" style="width: 220px;"/>-->
            <el-select v-model="form.orderId" style="width: 220px"  ref="orderId"   placeholder="choose orderId" label="Order Id" >
              <el-option
                      v-for="item in ordersOptions"
                      :key="item.orderId" :label="item.orderId" :value="item.orderId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
     <el-row     v-else >
       <el-col :span="20">
         <el-input v-model="form.orderId" style="width: 200px;"/>
       </el-col>
     </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Volume" prop="volume">
            <el-input v-model="form.volume" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Weight" prop="weight">
            <el-input v-model="form.weight" style="width: 200px;"/>
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
import { add, edit } from '@/api/orderGoods'

import {getToken} from '@/utils/auth'
import {getCountry, getProvince,getCity,getDistrict} from '@/api/zone'
import {getShopByZone} from '@/api/shop'
import {getMembers} from '@/api/member'

import { initData } from '@/api/data'

import { isDecimal,isFinteger } from '@/utils/validate'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    orderId: {
        type: String,
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        id: '',
        goodsId: '',
        goodsName: '',
        shopId: '',
        quantity: '',
        unitPrice: '',
        price: '',
        unitPoint: '',
        point: '',
        orderId: (typeof(this.orderId) !=  undefined && this.orderId!='') ? this.orderId : '',
        volume: '',
        weight: ''
      },
      searchOrderId:0,
      costTypeOptions:[
            { id: 0,  label: 'cach',value:0},
            { id: 1,  label: 'point',value:1},
       ],
      countryOptions:[],
      provinceOptions:[],
      citiesOptions:[],
      distractOptions:[],
      country:'',
      provice:'',
      city:'',
      shopOptions:[],
      goodsOptions:[],
      ordersOptions:[],
      street:'',
      headers: {
          'Authorization': 'Bearer ' + getToken()
      },
      rules: {
          city: [
              { required: true, message: 'city cannot be empty', trigger: 'blur' }
          ],
          quantity: [
              { required: true, message: 'quantity cannot be empty', trigger: 'blur' },
              { required: true, message: isFinteger, trigger: 'blur' },
              { min: 1, max: 4, message: ' quantity length 1 to 5 ', trigger: 'blur' }
           ],
          shopId: [
              { required: true, message: 'shopId cannot be empty', trigger: 'blur' }
          ],
          goodsId: [
              { required: true, message: 'goodsId cannot be empty', trigger: 'blur' }
          ],

      }
    }
  },
  methods: {
      getOrders(){
          var params = { page: 0, size: 1000, sort: "asc" ,'id':this.searchOrderId}
          initData('api/order/',params).then((res)=>{
              this.ordersOptions = []
              this.form.orderId = '';
              for (var item of res.content) {
                  let  temp = {orderId:item.id}
                  this.ordersOptions.push(temp)
              }
              if ( this.ordersOptions.length >0 )
                  this.form.orderId = this.ordersOptions[0].orderId;
          })
      },
      handleClose(done) {
          done();
      },
      setCosttype(){
          if (this.form.costType==0){
              this.setTotalPrice()
          }else{
              this.setTotalPoint()
          }
      },
      setTotalPoint(){
          this.form.point = parseFloat(this.form.unitPoint*this.form.quantity);
          this.form.price = 0;
      },
      setTotalPrice(){
          this.form.price = parseFloat(this.form.unitPrice*this.form.quantity);
          this.form.point = 0;
      },
      setGoods(val){
          for (var item of this.goodsOptions ) {
              if  ( item.goodsId==this.form.goodsId ) {
                  this.form.goodsName =  item.goodsEname;
                  this.form.unitPrice =  item.unitPrice;
                  this.form.unitPoint =  item.unitPoint;
                  break;
              }
          }
      },
      async getGoods() {
          var params = { page: 0, size: 1000, sort: "asc" ,'shopId':this.form.shopId}

          var res = await initData('api/shopGoods/',params)
          this.goodsOptions = []
          for (var item of res.content) {
              var unitPrice = item.promotePrice> 0 ? item.promotePrice: item.price;
              let  temp = {display_name:item.ename+"|"+item.id,goodsId:item.id,goodsEname:item.ename,unitPrice:unitPrice,unitPoint:item.point}
              this.goodsOptions.push(temp)
          }
      },
      async getShops() {
          var country = this.country>0  ?  this.country : 0;
          var provice = this.provice>0  ?  this.provice : 0;
          var city = this.city >0    ?  this.city  : 0;
          var street = this.street>0   ?  this.street : 0;

          var res = await  getShopByZone(country,provice,city,street)
          this.shopOptions = []
          for (var item of res) {
              let  temp = {display_name:item.ename+"|"+item.id,key:item.id}
              this.shopOptions.push(temp)
          }

          this.getGoods();
      },
      async getCountryInfo() {
          var res = await  getCountry()
          this.countryOptions = []
          for (var item of res) {
              let  temp = {display_name:item.ename,key:item.id}
              this.countryOptions.push(temp)
          }
          this.country = this.countryOptions[0].key;
          this.getProvinces();
          this.getCityes();
      },
      getProvinces(){
          if (!this.country && this.countryOptions.length > 0 ) {
              this.country = this.countryOptions[0].key;
          }

          if(this.country) {
              getProvince(this.country).then(res => {
                  this.provinceOptions = [];
                  this.citiesOptions = [];
                  this.distractOptions = [];
                  this.street = '';
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.provinceOptions.push(temp)
                  }

                  if ( this.provinceOptions.length > 0 ) {
                      this.province = this.provinceOptions[0].key;
                      this.getCityes();
                  }
              });
          }
      },
      getCityes(){
          if (!this.provice && this.provinceOptions.length > 0 ) {
              this.provice = this.provinceOptions[0].key;
          }

          if(this.provice) {
              getCity(this.provice).then(res => {
                  this.citiesOptions = [];
                  this.distractOptions = [];
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.citiesOptions.push(temp)
                  }
                  if ( this.citiesOptions.length > 0 ) {
                      this.city = this.citiesOptions[0].key;
                      this.getDistricts();

                      this.getShops();
                  }
              });
          }
      },
      getDistricts(){
          if ( !this.city && this.citiesOptions.length > 0 ) {
              this.city = this.citiesOptions[0].key;
          }

          if(this.city) {
              getDistrict(this.city).then(res => {
                  this.distractOptions = [];
                  this.street = '';
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.distractOptions.push(temp)
                  }
                  if ( this.distractOptions.length > 0 ) {
                      this.street = this.distractOptions[0].key;
                  } else {
                      this.street = '';
                  }
              });
          }
      },
      async callback(){
          await  this.getCountryInfo();
          await  this.getProvinces();
          await  this.getCityes();
          await  this.getDistricts();
          await  this.getShops();
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
        this.$message({
          message: 'Save Success',
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
          message: 'Save Success',
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
        goodsId: '',
        goodsName: '',
        shopId: '',
        quantity: '',
        unitPrice: '',
        price: '',
        unitPoint: '',
        point: '',
        orderId: '',
        volume: '',
        weight: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
