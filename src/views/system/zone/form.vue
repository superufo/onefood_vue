<template>
    <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="500px"   @open = "callback()">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
            <el-form-item v-if="false"> <el-input type="hidden" v-model="form.parentId" style="width: 370px;"/></el-form-item>

            <el-form-item label="类型" prop="type">
                <!--<el-input v-model="form.type" style="width: 370px;"/>-->
                <el-select v-model="form.type" style="width: 370px" ref="type" placeholder="请选择类型"
                           @change="getCountryInfo()">
                    <el-option
                            v-for="item in typeOptions"
                            :key="item.key" :label="item.display_name" :value="item.key"/>
                </el-select>
            </el-form-item>
            <el-form-item label="country" prop="country">
                <el-select v-model="form.zonevo.countryId" style="width: 370px" ref="country" placeholder="choose country"
                           @change="getProvinces()">
                    <el-option
                            v-for="item in countryOptions"
                            :key="item.key" :label="item.display_name" :value="item.key"/>
                </el-select>
            </el-form-item>

            <el-form-item label="Province" prop="provice">
                <el-select v-model="form.zonevo.proviceId" style="width: 370px" ref="provice" placeholder="choose province" @change="getCityes()">
                    <el-option
                            v-for="item in provinceOptions"
                            :key="item.key" :label="item.display_name" :value="item.key"/>
                </el-select>
            </el-form-item>

            <el-form-item label="City" prop="city">
                <el-select v-model="form.zonevo.cityId" style="width: 370px" ref="city" placeholder="choose city" @change="setParentId()">
                    <el-option
                            v-for="item in citiesOptions"
                            :key="item.key" :label="item.display_name" :value="item.key"/>
                </el-select>
            </el-form-item>

            <el-form-item label="中文名称" prop="cname">
                <el-input v-model="form.cname" ref="cname"  style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="英文名称" prop="form.ename">
                <el-input v-model="form.ename" ref="ename"  style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="经度">
                <el-input v-model="form.latitude" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="纬度">
                <el-input v-model="form.longitude" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" style="width: 370px;"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {add, edit, getZoneByType,getCountry, getProvince,getCity,getDistrict} from '@/api/zone'
    import {validatAlphabets} from '@/utils/validate'

    export default {
        props: {
            isAdd: {
                type: Boolean,
                required: true
            }
        },
        data() {
            const CheckCountry = (rule, value, callback) => {
                if (!value && this.form.type > 1) {
                    callback(new Error('Please Input right country'))
                } else {
                    callback()
                }
            }
            const CheckProvice = (rule, value, callback) => {
                if (!value && this.form.type > 2) {
                    callback(new Error('Please Input  right Province'))
                } else {
                    callback()
                }
            }
            const CheckCity = (rule, value, callback) => {
                if (!value && this.form.type > 3) {
                    callback(new Error('Please Input  right City'))
                } else {
                    callback()
                }
            }
            const CheckEname = (rule, value, callback) => {
                if (!validatAlphabets(rule, value)) {
                    callback(new Error('请输入英文名称'))
                } else {
                    callback()
                }
            }
            return {
                loading: false,
                dialog: false,
                form: {
                    id: '',
                    type: '',
                    parentId: '',
                    cname: '',
                    ename: '',
                    zonevo:{
                        countryId:'',
                        proviceId:'',
                        cityId:'',
                    },
                    latitude: '',
                    longitude: '',
                    remark: ''
                },
                countryOptions: [],
                provinceOptions: [],
                citiesOptions: [],
                typeOptions: [
                    {key: 1, display_name: 'country'},
                    {key: 2, display_name: 'Province'},
                    {key: 3, display_name: 'City'},
                    {key: 4, display_name: 'district'},
                ],
                parentIdOptions: [],
                rules: {
                    type: [
                        {required: true, message: '请输入类型', trigger: 'blur'},
                        {type: 'integer', message: '类型必须为数字', trigger: 'blur'},
                    ],
                    country: [
                        {required: true, trigger: 'blur', validator: CheckCountry},
                    ],
                    provice: [
                        {required: true, trigger: 'blur', validator: CheckProvice},
                    ],
                    city: [
                        {required: true, trigger: 'blur', validator: CheckCity},
                    ],
                    cname: [
                        {required: true, message: '请输入中文名称', trigger: 'blur'},
                        {type: 'string', min: 5, message: '中文名称不允许小于5位', trigger: 'blur'},
                    ],
                    ename: [
                        {required: true, trigger: 'blur', validator: CheckEname}
                    ]
                }
            }
        },
        methods: {
            async callback(){
                await  this.getCountryInfo();
                await  this.getProvinces();
                await  this.getCityes();
            },
            getCountryInfo() {
                this.countryOptions = [];
                this.provinceOptions = [];
                this.citiesOptions = [];
                getCountry().then(res => {
                    for (var item of res) {
                        let temp = {display_name: item.ename, key: item.id}
                        this.countryOptions.push(temp)
                    }
                    this.form.zonevo.countryId = this.form.zonevo.countryId> 0 ? this.form.zonevo.countryId : this.countryOptions[0].key;

                    this.getProvinces();
                    this.getCityes();
                });
                this.setParentId();
            },
            getProvinces() {
                let that = this
                this.provinceOptions = [];
                this.citiesOptions = [];
                //alert(this.form.zonevo.countryId);
                if (this.form.zonevo.countryId) {
                    getProvince(this.form.zonevo.countryId).then(res => {
                        for (var item of res) {
                            let temp = {display_name: item.ename, key: item.id}
                            this.provinceOptions.push(temp)
                        }

                        if( this.provinceOptions.length>0 ) {
                            this.form.zonevo.proviceId = this.form.zonevo.proviceId> 0 ? this.form.zonevo.proviceId : this.provinceOptions[0].key;
                            this.getCityes();
                        }
                    });
                }
                this.setParentId();
            },
            getCityes() {
                this.citiesOptions = [];
                if (this.form.zonevo.proviceId) {
                    getCity(this.form.zonevo.proviceId).then(res => {
                        for (var item of res) {
                            let temp = {display_name: item.ename, key: item.id}
                            this.citiesOptions.push(temp)
                        }

                        if( this.citiesOptions.length>0 ) {
                            this.form.zonevo.cityId = this.citiesOptions[0].key;
                        }
                    });
                }
                this.setParentId();
            },
            setParentId() {
                if ( this.form.type == 2 ) {
                    this.form.parentId = this.form.zonevo.countryId
                } else if ( this.form.type == 3 ) {
                    this.form.parentId = this.form.zonevo.proviceId
                }else if ( this.form.type == 4 ) {
                    this.form.parentId = this.form.zonevo.cityId
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
                    type: '',
                    parentId: '',
                    cname: '',
                    ename: '',
                    latitude: '',
                    longitude: '',
                    remark: ''
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
