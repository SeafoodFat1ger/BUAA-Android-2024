<template>
  <van-nav-bar :title="type == 'login' ? '登录' : '注册'"/>
  <div class="auth">
    <img class="logo" src="../../assets/icons/select-seat.svg" alt=""/>
    <!-- 登录界面 -->
    <van-form class="form-wrap" @submit="onSubmit" v-if="type == 'login'">
      <div class="form">
        <van-field
            clearable
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请填写账户' }]"
        />
        <van-field
            clearable
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </div>
      <div style="margin: 16px 0">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <p @click="chanegType('register')" class="change-btn">
          没有账号，前往注册
        </p>
      </div>
    </van-form>
    <!-- 注册页面的 -->
    <van-form class="form-wrap" @submit="onSubmit" v-if="type == 'register'">
      <div class="form">
        <van-field
            clearable
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请填写账号' }]"
        />
        <van-field
            clearable
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
            clearable
            v-model="passwordRepeat"
            type="password"
            name="password"
            label="确认密码"
            placeholder="请确认密码"
            :rules="[{ required: true, message: '请确认密码' },{validator, message: '请检查密码是否相同' }]"
        />

      </div>
      <div style="margin: 16px 0">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
        <p @click="chanegType('login')" class="change-btn">登录已有账号</p>
      </div>
    </van-form>
  </div>
</template>

<script>
import {reactive, toRefs, ref} from "vue";
import {showFailToast, showSuccessToast, Toast} from "vant";
import router from "../../router";
import {post, get} from "../../net/index.js";
import {useStore} from "../../stores";

const store = useStore()
export default {
  name: "Login",
  setup() {
    const validator = () => state.passwordRepeat === state.password;

    const state = reactive({
      username: "",
      password: "",
      passwordRepeat: "",
      type: "login", // 登录注册模式切换参数

    });

    const onSubmit = async (values) => {
      // 登录功能
      if (state.type == "login") {
        post('/api/users/login/', {
          username: state.username,
          password: state.password,
        }, (message, data) => {//登录成功
          //先获取用户信息
          get(`/api/users/get/${data}/`, (getMessage, getData) => {
            store.auth.user = getData
            localStorage.setItem("user", JSON.stringify(getData))//存在localStorage永久存储
            showSuccessToast(message)
            router.push('/home/act')
          }, () => {
            store.auth.user = null
          })
        })
      } else {
        post("/api/users/register/", {
          username: state.username,
          password: state.password,
        }, (message) => {
          showSuccessToast(message)
          state.type = 'login'
        })
      }
    };

    // 切换登录和注册两种模式
    const chanegType = (type) => {
      state.type = type;
    };

    return {
      validator,
      ...toRefs(state),
      onSubmit,
      chanegType,

    };
  },
};
</script>

<style lang='less' scoped>
.auth {
  height: calc(~"(100% - 46px)");
  padding: 30px 20px 0 20px;

  .logo {
    width: 150px;
    display: block;
    margin: 0 auto 30px;
  }

  .form-wrap {
    .form {
      border-radius: 10px;
      overflow: hidden;

      .van-cell:first-child {
        padding-top: 20px;
      }

      .van-cell:last-child {
        padding-bottom: 20px;
      }
    }
  }

  .change-btn {
    text-align: center;
    margin: 10px 0;
    font-size: 14px;
  }
}
</style>
