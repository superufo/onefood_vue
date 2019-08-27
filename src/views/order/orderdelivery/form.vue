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

     <el-row>
      <el-col :span="10">
        <el-form-item label="country">
          <el-select v-model="form.country" style="width: 200px"  ref="country"   placeholder="choose country"  @change="getProvinces" >
            <el-option
                    v-for="item in countryOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"  />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="province">
          <el-select v-model="form.province" style="width: 200px"  ref="provice"  placeholder="choose province"    @change="getCityes"  >
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
          <el-select v-model="form.city" style="width: 200px"  ref="city"   placeholder="choose city"    @change="getDistricts">
            <el-option
                    v-for="item in citiesOptions"
                    :key="item.key" :label="item.display_name" :value="item.key"  />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="地区">
          <el-select v-model="form.street" style="width: 200px"    ref="street"   placeholder="choose street" >
            <el-option
                    v-for="item in distractOptions"
                    :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
        <el-col :span="20">
          <el-form-item label="Shop Id"   prop="shopId" >
            <el-select  v-model="form.shopId" style="width: 200px"    ref="shopId"   placeholder="choose shop" @change="getGoods()" >
              <el-option
                      v-for="item in shopOptions"
                      :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
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
        <el-col :span="20" >
          <el-form-item label="Order Id"   prop="OrderId"  >
            <el-input v-model="form.orderId" style="width: 400px;"/>
          </el-form-item>
        </el-col>
      </el-row>


          <el-row>
            <el-col :span="20">
              <el-form-item label="Address"   prop="address" >
                <el-input v-model="form.address" style="width: 400px;"/>
              </el-form-item>
            </el-col>
          </el-row>


          <el-row>
         <el-col :span="12">
           <el-form-item label="search"  >
             <el-input v-model="searchmid"  placeholder="member id" style="width: 80px;"  />
             <el-input v-model="searchAccount" placeholder="member name" style="width: 100px;"  />
             <el-button :loading="loading"   @click="getMembers()">search</el-button>
           </el-form-item>
         </el-col>

         <el-col :span="8">
           <el-form-item  prop="account" >
             <el-select  v-model="form.mbInfo"  style="width: 250px"  ref="mid"   placeholder="choose account" label="Member"  @change="showMeMber" >
               <el-option
                       v-for="item in memberOptions"
                       :key="item.display_name" :label="item.display_name" :value="item.display_name" />
             </el-select>
             <el-input  v-if="false" v-model="form.mid"  placeholder="member id" style="width: 120px;"  />
             <el-input  v-if="false" v-model="form.account" placeholder="member name" style="width: 120px;"  />
           </el-form-item>
         </el-col>
       </el-row>


     <el-row>
       <el-col :span="10">
        <el-form-item label="Delivery Time" >
          <el-date-picker type="datetime" placeholder="input DeliveryTime" v-model="form.deliveryTime"
                          style="width: 200px;"/>
        </el-form-item>
       </el-col>

       <el-col :span="10">
        <el-form-item label="Price" >
          <el-input v-model="form.price" style="width: 200px;"/>
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
import { add, edit } from '@/api/orderDelivery'

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
      loading: false, dialog: false,
      form: {
        id: '',
        shopId: '',
        orderId: (typeof(this.orderId) !=  undefined && this.orderId!='') ? this.orderId : '',
        mid: '',
        deliveryTime: '',
        country: '',
        province: '',
        city: '',
        address: '',
        price: ''
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
      shopOptions:[],
      searchmid:"",
      searchAccount:"",
      memberOptions:[],
      headers: {
          'Authorization': 'Bearer ' + getToken()
      },
      rules: {
          city: [
              { required: true, message: 'city cannot be empty', trigger: 'blur' }
          ],
          price: [
              { required: true, message: 'price cannot be empty', trigger: 'blur' },
              { required: true, message: isDecimal, trigger: 'blur' },
          ],
          shopId: [
              { required: true, message: 'shopId cannot be empty', trigger: 'blur' }
          ],
          address: [
              { required: true, message: 'Address cannot be empty', trigger: 'blur' }
          ],
          mid: [
              { required: true, message: 'Member Id cannot be empty', trigger: 'blur' }
          ],
      }
    }
  },
  methods: {
    showMeMber(displayName){
        alert(displayName)
        //this.$el.member
        var arr = displayName.split("|")
        this.form.mid = arr[0]
        this.form.account = arr[1]
    },
    getMembers() {
        this.memberOptions = [];
        var mid = this.searchmid ? this.searchmid : 0 ;
        var midName = this.searchAccount ? this.searchAccount : 0 ;

        getMembers(mid,midName).then(res => {
            for (var item of res) {
                let temp = {display_name: item.mid+"|" + item.account, account: item.account,mid:item.mid}
                this.memberOptions.push(temp)
            }
            this.mbInfo = this.mbInfo ? this.mbInfo : this.memberOptions[0].display_name;
            this.form.mid = this.form.mid> 0 ? this.form.mid : this.memberOptions[0].mid;
            this.form.account = this.form.account> 0 ? this.form.account : this.memberOptions[0].account;
        });
    },
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
      async getShops() {
          var country = this.form.country>0  ?  this.form.country : 0;
          var provice = this.form.provice>0  ?  this.form.provice : 0;
          var city = this.form.city >0    ?  this.form.city  : 0;
          var street = this.form.street>0   ?  this.form.street : 0;

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
          this.form.country = this.countryOptions[0].key;
          this.getProvinces();
          this.getCityes();
      },
      getProvinces(){
          if (!this.form.country && this.countryOptions.length > 0 ) {
              this.form.country = this.countryOptions[0].key;
          }

          if(this.form.country) {
              getProvince(this.form.country).then(res => {
                  this.provinceOptions = [];
                  this.citiesOptions = [];
                  this.distractOptions = [];
                  this.form.street = '';
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
          if (!this.form.provice && this.provinceOptions.length > 0 ) {
              this.form.provice = this.provinceOptions[0].key;
          }

          if(this.form.provice) {
              getCity(this.form.provice).then(res => {
                  this.citiesOptions = [];
                  this.distractOptions = [];
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.citiesOptions.push(temp)
                  }
                  if ( this.citiesOptions.length > 0 ) {
                      this.form.city = this.citiesOptions[0].key;
                      this.getDistricts();

                      this.getShops();
                  }
              });
          }
      },
      getDistricts(){
          if ( !this.form.city && this.citiesOptions.length > 0 ) {
              this.form.city = this.citiesOptions[0].key;
          }

          if(this.form.city) {
              getDistrict(this.form.city).then(res => {
                  this.distractOptions = [];
                  this.form.street = '';
                  for (var item of res) {
                      let temp = {display_name: item.ename, key: item.id}
                      this.distractOptions.push(temp)
                  }
                  if ( this.distractOptions.length > 0 ) {
                      this.form.street = this.distractOptions[0].key;
                  } else {
                      this.form.street = '';
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
    handleClose(done) {
        done();
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
          message: '添加成功',
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
          message: '修改成功',
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
        shopId: '',
        orderId: '',
        mid: '',
        deliveryTime: '',
        country: '',
        province: '',
        city: '',
        address: '',
        price: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
