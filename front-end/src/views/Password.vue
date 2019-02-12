<template>
    <v-container
            fill-height
            fluid
            grid-list-xl>
        <v-layout
                justify-center
                wrap
        >
            <v-flex
                    xs12
            >
                <material-card
                        :color="color"
                        title="密码修改"
                >
                    <v-form
                            ref="form"
                            v-model="valid"
                    >
                        <v-container py-0>
                            <v-layout wrap>
                                <v-flex xs6>
                                    <v-text-field
                                            label="新密码"
                                            v-model="password1"
                                            type="password"
                                            :rules="pwdRules1"
                                            required
                                            />
                                </v-flex>
                                <v-flex xs6>
                                    <v-text-field
                                            label="重复密码"
                                            type="password"
                                            v-model="password2"
                                            :rules="pwdRules2"
                                            required
                                            />
                                </v-flex>
                                <v-flex
                                        xs12
                                        text-xs-right
                                >
                                    <v-btn
                                            block
                                            :disabled="!valid"
                                            :color="color"
                                            @click="update"
                                    >
                                        修改
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </material-card>
            </v-flex>
        </v-layout>
        <v-snackbar
                :color="alertColor"
                top
                v-model="snackbar"
                dark
        >
            <v-icon
                    color="white"
                    class="mr-3"
            >
                mdi-bell-plus
            </v-icon>
            <div>{{alertMessage}}</div>
            <v-icon
                    size="16"
                    @click="snackbar = false"
            >
                mdi-close-circle
            </v-icon>
        </v-snackbar>
    </v-container>
</template>

<script>
    import $http from  '../plugins/axios'
    import * as _utilService from "../utils";
    export default {
        data: () => ({
            valid:false,
            alertMessage:'信息修改成功！',
            alertColor:'success',
            snackbar:false,
            utilService:_utilService,
            password1:'',
            password2:'',
            pwdRules1: [
                v => !!v || '密码不能为空',
                v => (v && v.length >= 6) || '密码不得小于6个字符'
            ],
            pwdRules2: [
                v => !!v || '密码不能为空',
                v => (v && v.length >= 6) || '密码不得小于6个字符'
            ]
        }),
        computed: {
            color() {
                return this.$store.state.app.color
            }
        },
        methods:{
            update(){
                if(this.password1!==this.password2) {
                    this.alertMessage = '两次秘密输入不一致';
                    this.alertColor = 'error';
                    this.snackbar = true;
                    return;
                }
                $http.post('/auth/update_pwd',{password:this.password2}).then(res=>{
                    if(res.code!==0){
                        this.alertMessage='修改失败，稍后再试！';
                        this.alertColor='error';
                    }else{
                        this.alertMessage = '密码修改成功,请重新登录!';
                        this.alertColor = 'success';
                    }
                    sessionStorage.removeItem('access_token');
                    this.snackbar=true;
                    setTimeout(()=>{
                        this.$router.replace({ path: '/login' })
                    },500)
                });
            }

        }
    }
</script>
