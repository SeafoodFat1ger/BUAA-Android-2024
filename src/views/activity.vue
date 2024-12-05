<template>
  <div class="library-app">
    <van-nav-bar title="北航图书馆活动讲座推荐"/>
    <!-- 顶部公告 -->
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe
          vertical
          class="notice-swipe"
          :autoplay="3000"
          :touchable="false"
          :show-indicators="false"
      >
        <van-swipe-item>欢迎使用图书馆app！</van-swipe-item>
        <van-swipe-item>欢迎参加本月的图书馆活动！</van-swipe-item>
        <van-swipe-item>欢迎参加本月的图书馆讲座！</van-swipe-item>
      </van-swipe>
    </van-notice-bar>

    <!-- 走马灯展示活动 -->
    <div class="carousel">
      <h2>活动推荐</h2>
      <van-swipe :autoplay="3000">
        <van-swipe-item v-for="(activity, index) in activities" :key="index">
          <div class="carousel-item">
            <img :src="activity.image" alt="Activity"/>
            <div class="info">
              <h3>{{ activity.name }}</h3>
              <p>{{ activity.introduction }}</p>
              <p><strong>时间：</strong>{{ activity.date }}</p>
              <p><strong>组织者：</strong>{{ activity.organizer }}</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 讲座列表 -->
    <div class="lectures">
      <h2>讲座推荐</h2>
      <div v-for="(lecture, index) in lectures" :key="index" class="activity-card">
        <img :src="lecture.image" alt="Lecture"/>
        <div class="details">
          <h3>{{ lecture.name }}</h3>
          <p>{{ lecture.introduction }}</p>
          <p><strong>时间：</strong>{{ lecture.date }}</p>
          <p><strong>组织者：</strong>{{ lecture.organizer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {NoticeBar, Swipe, SwipeItem, Button, showSuccessToast} from "vant";
import {get} from '../net/index.js';

export default {
  components: {
    "van-notice-bar": NoticeBar,
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem,
    "van-button": Button,
  },
  data() {
    return {
      activities: [],
      lectures: [],
    };
  },
  methods: {
    fetchData() {
      get(`/api/activity/GetAllActivities/`, (message, data) => {
        this.activities = data
      })
      get(`/api/activity/GetAllLectures/`, (message, data) => {
        this.lectures = data
      })

    },


  },
  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
.library-app {
  padding: 20px;
}

.carousel .carousel-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.carousel-item .info {
  position: absolute;
  bottom: 10px;
  left: 20px;
  color: white;
}

.lectures {
  margin-top: 20px;
}

.activity-card {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  overflow: hidden;
}

.activity-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  margin-right: 15px;
}

.details {
  flex: 1;
  padding: 10px;
}

.details h3 {
  font-size: 18px;
  margin-bottom: 5px;
}

.details p {
  font-size: 14px;
  margin-bottom: 10px;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>
