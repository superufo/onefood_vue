<template>
      <el-drawer
              :append-to-body="true"
              :title="isAdd ? '新增' : '编辑'"
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
          <el-form-item label="Shop Id"   prop="shopId">
            <el-select  v-model="form.shopId" style="width: 200px"    ref="street"   placeholder="choose shop" >
              <el-option
                    v-for="item in shopOptions"
                    :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Pay Type" prop="payType" >
            <!--<el-input v-model="form.payType" style="width: 200px;"/>-->
            <el-select v-model="form.payType" style="width: 200px"  ref="payType"   placeholder="choose Pay Type" label="Pay Type" >
              <el-option
                      v-for="item in payTypeOptions"
                      :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
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
            <el-select v-model="form.mbInfo" style="width: 250px"  ref="account"   placeholder="choose account" label="Member"  @change="showMeMber" >
              <el-option
                      v-for="item in memberOptions"
                      :key="item.display_name" :label="item.display_name" :value="item.display_name" />
            </el-select>
            <el-input  v-if="false" v-model="form.mid" placeholder="member id" style="width: 120px;"  />
            <el-input  v-if="false" v-model="form.account" placeholder="member name" style="width: 120px;"  />
          </el-form-item>
        </el-col>
      </el-row>


      <el-row>
        <el-col :span="10">
          <el-form-item label="Pay Id" >
            <el-input v-model="form.payId" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Pay Time" >
            <el-date-picker type="datetime" placeholder="input payTime" v-model="form.payTime"
                            style="width: 200px;"/>
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Goods Price" prop="goodsPrice">
            <el-input v-model="form.goodsPrice" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10" >
          <el-form-item label="Tax" prop="Tax">
            <el-input v-model="form.tax" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Currency"  prop="currency">
            <el-select v-model="form.currency" style="width: 200px"  ref="currency"   placeholder="choose Currency" label="Currency"  @change="changeCurent" >
              <el-option
                      v-for="item in CurentOptions"
                      :key="item.currency" :label="item.currency" :value="item.currency" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Currency SymBOl" >
            <el-input v-model="form.currencySymbol"  readonly="true"  style="width: 190px;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Tax Price"  prop="taxPrice">
            <el-input v-model="form.taxPrice" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Point Price " prop="pointPrice" >
            <el-input v-model="form.pointPrice" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Actual Price" prop="actualPrice">
            <el-input v-model="form.actualPrice" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Delivery Id" >
            <el-input v-model="form.deliveryId" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <el-form-item label="Delivery Time" >
            <el-date-picker type="datetime" placeholder="input deliveryTime" v-model="form.deliveryTime"
                            style="width: 200px;"/>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Delivery Price" prop="deliveryPrice">
            <el-input v-model="form.deliveryPrice" style="width: 200px;"/>
          </el-form-item>
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

      <el-row>
        <el-col :span="10">
          <el-form-item label="Promote Price" prop="promotePrice">
            <el-input v-model="form.promotePrice" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Promote Code" prop="promoteCode">
            <el-input v-model="form.promoteCode" style="width: 200px;"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10">
          <!--<el-form-item label="State" prop="State">-->
            <!--<el-input v-model="form.state" style="width: 200px;"/>-->
          <!--</el-form-item>-->

          <el-form-item label="状态" prop="state">
            <el-select v-model="form.state" style="width: 200px"  ref="state"   placeholder="choose state" label="state"  >
              <el-option
                      v-for="item in stateOptions"
                      :key="item.id" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

        </el-col>
        <el-col :span="10">
          <el-form-item label="Order Time" >
            <el-date-picker type="datetime" placeholder="input orderTime" v-model="form.orderTime"
                            style="width: 200px;"/>
            </el-date-picker>
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
import { add, edit } from '@/api/order'

import {getToken} from '@/utils/auth'
import {getCountry, getProvince,getCity,getDistrict} from '@/api/zone'
import {getShopByZone} from '@/api/shop'
import {getMembers} from '@/api/member'

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
      loading: false,
      dialog: false,
      countryOptions:[],
      provinceOptions:[],
      citiesOptions:[],
      distractOptions:[],
      CurentOptions:[
          { currency: "USD",  symbol:"$"},
          { currency: "RMB",  symbol:"¥"},
          { currency: "THB",  symbol:"฿"},
          { currency: "EURO", symbol:"€"},
      ],
      stateOptions:[
          { id: 1,  label: 'NO PAY',value:0},
          { id: 2,  label: 'PAID',value:1},
          { id: 3,  label: 'FINISH',value:2},
      ],
      payTypeOptions:[
          { id: 1,  label: 'CASH',value:0},
          { id: 2,  label: 'APPLE PAY',value:1},
          { id: 3,  label: 'VISA PAY',value:2},
          { id: 3,  label: 'GOOGLE PAY',value:3},
      ],
      country:'',
      provice:'',
      city:'',
      street:'',
      shopOptions:[],
      searchmid:"",
      searchAccount:"",
      memberOptions:[],
      form: {
        id: '',
        shopId: '',
        mid: '',
        acount: '',
        payType: '',
        payId: '',
        payTime: '',
        goodsPrice: '',
        currency: '',
        currencySymbol: '',
        tax: '',
        taxPrice: '',
        pointPrice: '',
        actualPrice: '',
        deliveryId: '',
        deliveryTime: '',
        deliveryPrice: '',
        volume: '',
        weight: '',
        promotePrice: '',
        promoteCode: '',
        state: '',
        orderTime: ''
      },
      headers: {
            'Authorization': 'Bearer ' + getToken()
      },
      rules: {
          city: [
              { required: true, message: 'city cannot be empty', trigger: 'blur' }
          ],
          account: [
              { required: true, message: 'city cannot be empty', trigger: 'blur' }
          ],
          payType: [
              { required: true, message: 'Pay Type cannot be empty', trigger: 'blur' }
          ],
          shopId: [
              { required: true, validator: 'shop cannot be empty', trigger: 'blur' }
          ],
          actualPrice: [
              { required: true, validator: 'shop cannot be empty', trigger: 'blur' }
          ],
          state: [
              { required: true, validator: 'state cannot be empty', trigger: 'blur' }
          ],
          goodsPrice: [
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
      showMeMber(displayName){
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
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 2000
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
          duration: 2000
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
        mid: '',
        acount: '',
        payType: '',
        payId: '',
        payTime: '',
        goodsPrice: '',
        currency: '',
        currencySymbol: '',
        tax: '',
        taxPrice: '',
        pointPrice: '',
        actualPrice: '',
        deliveryId: '',
        deliveryTime: '',
        deliveryPrice: '',
        volume: '',
        weight: '',
        promotePrice: '',
        promoteCode: '',
        state: '',
        orderTime: ''
      }
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>
