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

    <div  style="padding-top: 30px" >
        <!--<el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增' : '编辑'" width="1000px">-->

        <el-form ref="form" :model="form" :rules="rules" size="small"   style="max-height:800px;overflow: auto;"    label-width="80px">
            <el-row>
                <el-col :span="10">
                    <el-form-item label="店名">
                        <el-input v-model="form.name" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="英文店名">
                        <el-input v-model="form.ename" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="店主">
                        <el-input v-model="form.owner" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="logo">
                        <!--<el-input v-model="form.logo" style="width: 320px;"/>-->
                        <img :src="form.logo"   ref="logo"   />
                        <el-button
                                v-permission="['ADMIN','PICTURE_ALL','PICTURE_UPLOAD']"
                                class="filter-item"
                                size="mini"
                                type="primary"
                                icon="el-icon-upload"
                                @click="imgDialog = true">上传图片
                        </el-button>
                        <!--上传图片-->
                        <el-dialog :visible.sync="imgDialog" append-to-body width="600px" @close="doSubmit">
                            <el-upload
                                    :on-preview="handlePictureCardPreview"
                                    :before-remove="handleBeforeRemove"
                                    :on-success="handleSuccess"
                                    :on-error="handleError"
                                    :headers="headers"
                                    :file-list="fileList"
                                    :action="imagesUploadApi"
                                    :limit=1
                                    list-type="picture-card">
                                <i class="el-icon-plus"/>
                            </el-upload>
                            <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
                                <img :src="dialogImageUrl" width="100%" alt="">
                            </el-dialog>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="doSubmit">确认</el-button>
                            </div>
                        </el-dialog>

                    </el-form-item>
                </el-col>
            </el-row>


            <el-row>
                <el-col :span="10">
                    <el-form-item label="菜肴种类">
                        <!--<el-input v-model="form.type" style="width: 320px;"/>-->
                        <!--<treeselect v-model="form.type" :options="allTypes"  style="width: 370px" placeholder="请选择" />-->
                        <el-select v-model="form.type" style="width: 320px"  clearable placeholder="请选择菜肴种类" >
                            <el-option
                                    v-for="item in typesOptions"
                                    :key="item.key" :label="item.display_name" :value="item.key"    />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="电话号码">
                        <el-input v-model="form.telphone" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="国家">
                        <el-select v-model="form.country" style="width: 320px"  ref="country"   placeholder="请选择国家"  @change="getProvinces" >
                            <el-option
                                    v-for="item in countryOptions"
                                    :key="item.key" :label="item.display_name" :value="item.key"  />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="省份">
                        <el-select v-model="form.provice" style="width: 320px"  ref="provice"  placeholder="请选择省份"    @change="getCityes"  >
                            <el-option
                                    v-for="item in provinceOptions"
                                    :key="item.key" :label="item.display_name" :value="item.key" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="城市">
                        <el-select v-model="form.city" style="width: 320px"  ref="city"   placeholder="请选择城市"    @change="getDistricts">
                            <el-option
                                    v-for="item in citiesOptions"
                                    :key="item.key" :label="item.display_name" :value="item.key"  />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="地区">
                        <el-select v-model="form.street" style="width: 320px"    ref="street"   placeholder="请选择地区" >
                            <el-option
                                    v-for="item in distractOptions"
                                    :key="item.key" :label="item.display_name" :value="item.key" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="详细地址">
                        <el-input v-model="form.address" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="状态">
                        <el-radio v-for="item in stateOptions" :key="item.id" v-model="form.state" :label="item.value">{{ item.label }}</el-radio>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="经度">
                        <el-input v-model="form.longitude" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="纬度">
                        <el-input v-model="form.latitude" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="税收">
                        <el-input v-model="form.tax" style="width: 320px;"/>
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="开始时间">
                        <!--<el-input v-model="form.workStart" style="width: 320px;"/>-->
                        <el-time-picker placeholder="营业开始时间" v-model="form.workStart"  format='HH:mm'   value-format="HH:mm"  style="width: 320px;" />
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="10">
                    <el-form-item label="结束时间">
                        <!--<el-input v-model="form.workEnd" style="width: 320px;"/>-->
                        <el-time-picker placeholder="营业结束时间" style="width: 320px;" format='HH:mm'   value-format="HH:mm"  v-model="form.workEnd" />
                    </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="创建时间">
                        <el-date-picker type="date" placeholder="店铺创建时间" v-model="form.createdAt"
                                        style="width: 320px;"/>
                        </el-date-picker>
                        <!--<el-input v-model="form.createdAt" style="width: 320px;"/>-->
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="20">
                    <el-form-item label="介绍">
                        <!--<el-input v-model="form.introduce" style="width: 320px;"/>-->
                        <div ref="editor"  class="toolbar"   v-html="form.introduce"   >
                        </div>
                        <el-input type="text" v-if="false" ref="introduce"  v-model="form.introduce" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer" style="position: fixed;margin-left: 30%">
            <el-button type="text" @click="cancel">取消</el-button>
            <el-button  type="primary" @click="save">确认</el-button>
        </div>
        <!--</el-dialog>-->
    </div>
    </el-drawer>
</template>

<script>
    import {mapGetters} from 'vuex'
    import E from 'wangeditor'
    import {add, edit,getFromId} from '@/api/shop'
    import {getToken} from '@/utils/auth'

    import axios from 'axios'
    import {del} from '@/api/picture'

    import {getCountry, getProvince,getCity,getDistrict} from '@/api/zone'

    export default {
        props: {
            isAdd: {
                type: Boolean,
                required: true
            },
        },
        data() {
            return {
                loading: false,
                dialog: false,
                imgDialog:false,
                //form:this.getInfoFromId(),
                form: {
                    id:       '',
                    name:     '',
                    ename:    '',
                    owner:    '',
                    logo:     '',
                    type:     '',
                    telphone: '',
                    country:  '',
                    provice:  '',
                    city:     '',
                    street:   '',
                    address:  '',
                    state:    '',
                    longitude:'',
                    latitude: '',
                    tax:      '',
                    workStart:'',
                    workEnd:  '',
                    introduce:'',
                    createdAt:'',
                    createDate:'',
                    updateAt: '',
                },
                editContent:'',
                typesOptions:[
                                { key: 1, display_name: '湘菜' },
                                { key: 2, display_name: '鲁菜' },
                                { key: 3, display_name: '粤菜' },
                                { key: 4, display_name: '川菜' },
                                { key: 20, display_name: '美国口味' }
                             ],
                stateOptions:[
                                { id: 1,  label: '正常',value:0},
                                { id: 2,  label: '关闭',value:1},
                             ],
                countryOptions:[],
                provinceOptions:[],
                citiesOptions:[],
                distractOptions:[],
                rules: {},
                headers: {
                    'Authorization': 'Bearer ' + getToken()
                },
                dialogImageUrl: '',
                dialogVisible: false,
                fileList: [],
            }
        },
        methods: {
            callback(){
                this.$nextTick(() => {
                        var editor = new E(this.$refs['editor']);
                        editor.customConfig.uploadImgShowBase64 = true; // 使用 base64 保存图片
                        // 不可修改
                        editor.customConfig.uploadImgHeaders = this.headers;
                        // 自定义文件名，不可修改，修改后会上传失败
                        editor.customConfig.uploadFileName = 'file';
                        // 上传到哪儿，按需选择
                        editor.customConfig.uploadImgServer = this.imagesUploadApi;// 上传图片到服务器

                        editor.customConfig.onchange = (html) => {
                            //this.form.introduce = html
                            //this.$refs['introduce'].value = html
                            this.editContent = html
                        };

                        editor.create();
                        //editor.txt.html(this.form.introduce);
                })
            },
            handleClose(done) {
                done();
                location.reload();
            },
            getInfoFromId() {
                var id = this.form.id;//this.$route.query['id']
                getFromId(id).then(res => {
                    this.form = res;

                    this.getCountryInfo();
                    this.getProvinces();
                    this.getCityes();
                    this.getDistricts();
                });
            },
            getCountryInfo() {
                getCountry().then(res => {
                    this.countryOptions = []
                    for (var item of res) {
                        let  temp = {display_name:item.cname,key:item.id}
                        this.countryOptions.push(temp)
                    }
                    //this.$refs['country'].$el.change();
                    this.form.country = this.countryOptions[0].key;
                    this.getProvinces();
                    this.getCityes();
                });
            },
            getProvinces(){
                if (!this.form.country && this.countryOptions.length > 0 ) {
                    this.form.country = this.countryOptions[0].key;
                }

                if(this.form.country) {
                    getProvince(this.form.country).then(res => {
                        this.provinceOptions = []
                        for (var item of res) {
                            let temp = {display_name: item.cname, key: item.id}
                            this.provinceOptions.push(temp)
                        }

                        if ( this.provinceOptions.length > 0 ) {
                            this.form.province = this.provinceOptions[0].key;
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
                        for (var item of res) {
                            let temp = {display_name: item.cname, key: item.id}
                            this.citiesOptions.push(temp)
                        }
                        if ( this.citiesOptions.length > 0 ) {
                            this.form.city = this.citiesOptions[0].key;
                            this.getDistricts();
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
                        for (var item of res) {
                            let temp = {display_name: item.cname, key: item.id}
                            this.distractOptions.push(temp)
                        }
                        if ( this.distractOptions.length > 0 ) {
                            this.form.street = this.distractOptions[0].key;
                        }
                    });
                }
            },
            cancel() {
                this.resetForm()
            },
            save() {
                this.form.introduce = this.editContent;

                if (this.isAdd==true) {
                    this.doAdd();
                } else {
                    this.doEdit();
                }
                parent.location.reload();
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
                    this.dialog = false
                    this.$parent.init()
                }).catch(err => {
                    this.loading = false
                    console.log(err.response.data.message)
                })
            },
            doEdit() {
                edit(this.form).then(res => {
                    //alert(this.form.provice)
                    this.resetForm()
                    this.$message({
                        message: 'Edit  Success',
                        type: 'success',
                        duration: 2500
                    })
                    this.dialog = false
                }).catch(err => {
                    this.loading = false
                    console.log(err.response.data.message)
                })
            },
            resetForm() {
                this.$refs['form'].resetFields();
                //this.form = this.getInfoFromId();
            },
            handleSuccess(response) {
                console.log("response:",response)
                this.$refs['logo'].src = response.data[0]
                this.form.logo = response.data[0]

                //console.log("this.form.logo:",this.form.logo)
            },
            handleBeforeRemove(file, fileList) {
                for (let i = 0; i < this.pictures.length; i++) {
                    if (this.pictures[i].uid === file.uid) {
                        del(this.pictures[i].id).then(res => {
                        })
                        return true
                    }
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url
                this.dialogVisible = true
            },
            // 刷新列表数据
            doSubmit() {
                this.fileList = []
                this.dialogVisible = false
                this.dialogImageUrl = ''
                this.imgDialog = false
            },
            // 监听上传失败
            handleError(e, file, fileList) {
                const msg = JSON.parse(e.message)
                this.$message({
                    title: msg.message,
                    type: 'error',
                    duration: 2500
                })
            },
        },
        computed: {
            ...mapGetters([
                // sm.ms图床
                'imagesUploadApi',
                // 七牛云 按需选择
                `qiNiuUploadApi`
            ])
        },
        wathch:{
            editContent: function() {

            }
        },
        mounted() {
            //this.getInfoFromId();
            this.getCountryInfo();
            this.getProvinces();
            this.getCityes();
            this.getDistricts();

        }
    }
</script>

<style  type="text/css">
    .toolbar {
          border: 0px solid #ccc;/*设置下拉棒*/
    }
    .w-e-text-container{
        height: 200px !important;/*!important是重点，因为原div是行内样式设置的高度300px*/
    }
</style>
