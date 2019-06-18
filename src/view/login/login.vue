<template>
  <div class="loginwrap" :style="{ height: imgHeight + 'px' }">
    <div style="position: absolute;left: 0;height: 0;width: 100%;">
      <canvas id="loginwrap" :width="imgWidth" :height="imgHeight"></canvas>
    </div>
    <div class="logintop">
      <div class="fl loginlogo">
        <a class="fr logo" href="#">login_logo.png</a>
      </div>
      <a class="home-link fr" href="http://www.demogic.com/">返回首页</a>
    </div>
    <div class="login_contetnt">
      <h3 class="login-top">让信息连接一切</h3>
      <h4 class="login-bottom">GIC商户后台</h4>
      <div class="formlogin">
        <el-form ref="form" :model="form" label-width="">
          <el-form-item label="">
            <el-input class="forminput" v-model="form.loginName" placeholder="账号"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="form.password" type="password" placeholder="密码" @keyup.enter.native="submitLogin('form')"></el-input>
          </el-form-item>
          <el-form-item>
            <button class="submit" @click.prevent="submitLogin('form')">立即登录</button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
let qs = require('qs');
import * as types from '../../store/types';
import { checkSuccess, checkFalse, checkStatus } from '../../../static/js/checkStatus';
import { setCookie, getCookie } from '../../../static/js/cookie';
export default {
  name: 'login',
  data() {
    return {
      redirect: this.$route.query.redirect,
      token: '',
      form: {
        loginName: 'damogic',
        password: '1',
        eid: 'ff808081593917d90159398ec6340012'
      }
    };
  },
  computed: {
    imgHeight() {
      return document.body.clientHeight;
    },
    imgWidth() {
      return document.body.clientWidth;
    }
  },
  methods: {
    loginAnimate() {
      let animate = new LoginAnimate(loginwrap, {
        length: 90,
        LineWeight: 0.1,
        clicked: true,
        moveon: true
      });
      animate.Run();
    },
    submitLogin() {
      this.axios
        .post(
          '/api-auth/do-login',
          qs.stringify({
            loginName: this.form.loginName,
            password: this.form.password,
            eid: 'ff808081593917d90159398ec6340012'
          })
        )
        .then(res => {
          if (res.data.success) {
            checkSuccess(res.data.message);
            let redirect = decodeURIComponent(this.$route.query.redirect || '/index');
            this.$router.push({
              path: redirect
            });
          } else {
            checkFalse(res.data.message);
          }
        })
        .catch(err => {
          checkStatus(err);
        });
    },
    getMenu() {
      this.axios
        .get('/gic/get-menu')
        .then(res => {
          if (res.data.success) {
            this.menuList = res.data.list;
            sessionStorage.setItem('menuList', JSON.stringify(this.menuList));
            // let tempArr = [];
            // this.menuList.forEach(item => {
            //   item.rightDTOs.forEach(i => {
            //     let a = {
            //       path: '/'+ i.rtcode,
            //       name: i.rtname,
            //       component: _import(i.parentRtcode,i.rtcode)
            //     };
            //     tempArr.push(a);
            //   })
            // });
            //
            // let c = [
            //   {
            //     path: '/index',
            //     name: '总览',
            //     component: _import('index','index'),
            //     children: tempArr
            //   }
            // ]
            // let a = [
            //   {
            //     path: '/storeAdd',
            //     name: '门店新增',
            //     component: _import('index','index'),
            //     children: tempArr
            //   }
            // ];
            // console.log(c);
            // this.$router.addRoutes(c);
            let redirect = this.$route.query.redirect || '/index';
            this.$router.push({
              path: redirect
            });
          } else {
            checkFalse(res.data.errorMessage);
          }
        })
        .catch(err => {
          checkStatus(err);
        });
    }
  },
  mounted() {
    this.$store.commit(types.TITLE, 'login');
    document.title = this.$store.state.title;
    this.loginAnimate();
  }
};
</script>

<style lang="less">
.loginwrap {
  position: relative;
  width: 100%;
  background: url('./login_bg.jpg') no-repeat center center;
  overflow: hidden;
  text-align: center;
  .logo {
    display: block;
    float: left;
    margin-left: 100px;
    width: 150px;
    height: 80px;
    background: url('login_logo.png') no-repeat left center;
    text-indent: -999px;
  }
  .logintop {
    width: 100%;
    height: 80px;
    position: relative;
    z-index: 2;
  }
  .home-link {
    width: 80px;
    height: 32px;
    margin-top: 23px;
    margin-right: 135px;
    border-radius: 0;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
    color: rgba(255, 255, 255, 0.6);
    border: 1px solid #fede29;
    background: 0 0;
  }
}
.login_contetnt {
  width: 350px;
  margin: 0 auto;
}
.login-top {
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: normal;
  color: #ffffff;
  margin: 70px 0 20px;
}
.login-bottom {
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: normal;
  color: #fede29;
  margin-bottom: 40px;
}
.login-bottom {
  position: relative;
  z-index: 1;
  font-size: 16px;
  font-weight: normal;
  color: #fede29;
  margin-bottom: 40px;
}
.formlogin {
  position: relative;
  z-index: 3;
  width: 350px;
  margin: 0 auto;
  .el-input__inner {
    font-size: 14px;
    margin-bottom: 10px;
    font-weight: 100;
    width: 100%;
    height: 46px;
    line-height: 14px;
    text-indent: 15px;
    border-radius: 0;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid transparent;
    color: #fff;
    background-image: none;
    &:focus {
      border: 1px solid #fede29;
    }
  }
}
.submit {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  margin-top: 30px;
  margin-bottom: 36px;
  color: #000;
  outline: 0;
  border: 0;
  background-color: #fede29;
  cursor: pointer;
  &:hover {
    background-color: #fcd916;
  }
}
</style>
