<template>
  <div class="profile-page">
    <!-- 用户信息部分 -->
    <div class="user-info">
      <div class="user-avatar">👤</div>
      <p class="user-name">{{ userInfo.username }}</p>
    </div>

    <!-- 功能图标栏 -->
    <div class="icon-row">
      <div
          v-for="(item, index) in icons"
          :key="index"
          class="icon-item"
          @click="navigateTo(item.path)"
      >
        <div class="icon">{{ item.icon }}</div>
        <p>{{ item.name }}</p>
      </div>
    </div>

    <!-- 借阅数据统计 -->
    <div class="data-section">
      <p class="section-title">借阅时间分布</p>
      <!-- 借阅时间分布柱状图容器 -->
      <div id="borrow-time-chart" class="chart-container"></div>

      <p class="section-title">借阅类型分布</p>
      <!-- 类型分布饼状图容器 -->
      <div id="borrow-type-chart" class="chart-container"></div>
    </div>

<!--    &lt;!&ndash; 我与图书馆 &ndash;&gt;-->
<!--    <div class="relationship-section">-->
<!--      <p class="section-title">我与图书馆</p>-->
<!--      <p>这里是一些关于用户和图书馆的文字描述。</p>-->
<!--    </div>-->
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import * as echarts from 'echarts';
import {post, get} from '../net';
import {useStore} from "../stores";
// todo 没借书就不渲染
const store = useStore()
// 模拟的用户数据
const router = useRouter();

// 图标数组
const icons = ref([
  { name: '当前借阅', icon: '📖', path: '/home/profile_BooksList' },
  { name: '智能问答', icon: '🤖', path: '/home/hot' },
  { name: '借阅统计', icon: '📊', path: '/home/profile_History' },
  { name: '个人信息', icon: '👤', path: '/home/profile_info' },
]);

/**************绘制借阅时间分布图**************/
const monthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
async function fetchTimeData() {
    const timeData = ref([]);
  return new Promise((resolve, reject) => {
    post(`/api//profile/timeData/`, {
      userId: store.auth.user.userId
    }, (message, data) => {
      if (message === '操作成功') {
        timeData.value = data.timeData
        resolve(timeData);
      } else {
        reject('Failed to fetch type data');
      }
    });
  });
}
async function renderBarChart() {
  const timeData = await fetchTimeData()
  const chartDom = document.getElementById('borrow-time-chart');
  const myChart = echarts.init(chartDom);
  const option = {
    // title: {
    //   text: '借阅时间分布',
    //   left: 'center'
    // },
    xAxis: {
      type: 'category',
      data: timeData.value.map(item => monthNames[item.month - 1]),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: timeData.value.map(item => item.borrowed),
        type: 'bar',
        color: 'rgba(115,192,222,0.78)',
      }
    ]
  };
  myChart.setOption(option);
}

/**************绘制借阅类型饼状图**************/
const typeDataTest = [
  { type_name: '小说', borrowedNum: 10 },
  { type_name: '科学', borrowedNum: 15 },
  { type_name: '历史', borrowedNum: 5 },
  { type_name: '艺术', borrowedNum: 10 },
];
async function fetchTypeData() {
  const typeData = ref([]);
  return new Promise((resolve, reject) => {
    post(`/api/profile/typeData/`, {
      userId: store.auth.user.userId
    }, (message, data) => {
      if (message === '操作成功') {
        typeData.value = data.typeData;
        resolve(typeData);
      } else {
        reject('Failed to fetch type data');
      }
    });
  });
}

// 初始化类型分布饼状图
async function renderPieChart() {
  const typeData = await fetchTypeData();
  typeData.value = typeData.value.filter(item => item.borrowedNum > 0);
  const chartDom = document.getElementById('borrow-type-chart');
  const myChart = echarts.init(chartDom);
  const pieData = typeData.value.map(item => ({
    name: item.typename,
    value: item.proportion // 使用 proportion 作为饼图的值
  }));
  // 设置ECharts配置项
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: typeData.value.map(item => item.typename) // 图例显示每个类型的名称
    },
    series: [
      {
        name: '借阅类型',
        type: 'pie',
        radius: '50%',
        data: pieData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
};

/************用户信息****************/
const userInfo = ref([])
async function fetchUserInfo() {
  post(`/api/profile/getUserInfo/`, {
    userId: store.auth.user.userId
  }, (message, data) => {
    userInfo.value = data.userInfo
  });
}

// 跳转函数
function navigateTo(path) {
  if (path) {
    router.push(path);
  } else {
    showToast('功能开发中');
  }
}
onMounted(() => {
  fetchUserInfo()
  renderPieChart()
  renderBarChart()
})
</script>

<style scoped>
.profile-page {
  padding: 10px;
}

.user-info {
  display: flex;
  align-items: center;
  background-color: #e0f7fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.user-avatar {
  font-size: 40px;
  margin-right: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
}

.icon-row {
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  text-align: center;
}

.icon-item {
  text-align: center;
}

.icon {
  font-size: 30px;
  margin-bottom: 5px;
}

.data-section {
  margin-top: 20px;
}

.relationship-section {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart-container {
  background-color: #ffffff;
  height: 300px;
  margin: 10px 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}
</style>
