<template>
  <router-view></router-view>
  <van-tabbar route>
    <van-tabbar-item replace to="/home/act" icon="home-o">讲座活动</van-tabbar-item>
    <van-tabbar-item replace to="/home/search" icon="search">图书检索</van-tabbar-item>
    <van-tabbar-item replace to="/home/seat" icon="setting-o">座位预约</van-tabbar-item>
    <van-tabbar-item replace to="/home/profile" icon="friends-o">个人中心</van-tabbar-item>
  </van-tabbar>

</template>

<script>

export default {
  setup() {
    const icon = {
      active: 'https://fastly.jsdelivr.net/npm/@vant/assets/user-active.png',
      inactive:
          'https://fastly.jsdelivr.net/npm/@vant/assets/user-inactive.png',
    };

    return {
      icon,
    };
  },
};

</script>