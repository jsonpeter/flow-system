<template>
  <v-container
          fill-height
          fluid
          grid-list-xl
  >
    <v-layout wrap>
      <v-form
              ref="form"
              class="login"
              v-model="valid"
      >
        <material-card
                color="dark"
                title="用户登录"
        >
        <v-text-field

                v-model="name"
                :rules="nameRules"
                label="用户名"
                required
        ></v-text-field>

        <v-text-field
                v-model="pwd"
                :rules="pwdRules"
                type="password"
                 label="密 码"
                required
        ></v-text-field>
        <v-btn
                block
                :disabled="!valid"
                color="success"
                @click="validate"
        >
          确定登录
        </v-btn>
        </material-card>
      </v-form>
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
    export default {
        data: () => ({
            valid: true,
            alertMessage:'用户名密码错误，或账号未激活！',
            alertColor:'error',
            snackbar:false,
            show1: false,
            name: '',
            pwd: '',
            nameRules: [
                v => !!v || '用户名不能为空'
            ],
            pwdRules: [
                v => !!v || '密码不能为空',
                v => (v && v.length >= 6) || '密码不得小于6个字符'
            ]
        }),
        methods: {
            validate() {
                if (this.$refs.form.validate()) {
                    $http.post('/login',{username:this.name,password:this.pwd}).then(res=>{
                        if(res.success){
                            this.$store.state.token = res.data.token;
                            sessionStorage.setItem('access_token',res.data.token);
                            sessionStorage.setItem('storeId',res.data.id);
                            this.$router.push({ path: '/main' })
                        }else{
                            this.snackbar=true;
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss">
  body {
    color: #ffffff;
    background: #f3f3f3;

  }
  .v-form.login{

    width: 80%;
    height: 380px;
    max-width: 400px;
    z-index: 1;
    position: absolute;
    top:0;
    bottom:0;
    left:0;
    right:0;
    margin: auto;
  }
</style>
