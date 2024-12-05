<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <div class="navigation-bar">
      <div class="left-section" @click="goBack">
        <span class="arrow">&lt;</span>
      </div>
      <div class="tabs">
        <span class="tab" @click="navigateTo('/home/profile_History')"
              :class="{ active: activeTab === 'history' }">借阅历史</span>
        <span class="tab" @click="navigateTo('/home/profile_Cluster')" :class="{ active: activeTab === 'analysis' }">聚类分析</span>
      </div>
    </div>

    <!-- 我的借阅分析部分 -->
    <div class="section">
      <h2 class="section-title">
        <span class="highlight"></span>我的借阅分析
      </h2>
      <div v-if="neverBorrowed" class="no-books">
        <p>诶，你还没有借过书哦~</p>
        <p>去借两本书再来看看吧~</p>
      </div>
      <div id="chart" class="chart-container"></div>
    </div>

    <!-- 和我类似的用户部分 -->
    <div class="section">
      <h2 class="section-title">
        <span class="highlight"></span>和我类似的用户
      </h2>
      <div v-if="similarUsers.length > 0" class="similar-users">
        <div v-for="user in similarUsers" :key="user.name" class="user-card">
          <!-- 用户头像和名称 -->
          <div class="user-info">
            <span class="username">{{ user.name }}</span>
            <div class="view-more">
              <span @click="viewMoreBooks(user.name)">🔎ta的书单</span>
            </div>
          </div>

          <!-- 用户书籍 -->
          <div class="books">
            <div v-for="book in user.books" :key="book.book_id" class="book">
              <span class="book-title">{{ book.book_title }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-books">
        <p>还没发现和你有类似爱好的同学哦~</p>
      </div>
    </div>
    <!-- 弹窗部分 -->
    <van-dialog v-model:show="isDialogVisible" title="书籍信息" show-confirm-button width="500px">
      <div class="book-list-container">
        <div v-for="(book, index) in selectedBooks" :key="index" class="book-card">
          <h3>{{ book.book_title }}</h3>
          <p>作者：{{ book.book_author }}</p>
          <p>条码号：{{ book.book_id }}</p>
          <p>类别：{{ book.book_type }}</p>
          <p>馆藏地：{{ book.book_location }}</p>
        </div>
      </div>
      <template #footer>
        <van-button type="default" @click="isDialogVisible = false">关闭</van-button>
      </template>
    </van-dialog>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import router from "../router/index.js";
import {reactive, onMounted, ref} from "vue";
import {post} from "../net/index.js";
import {useStore} from "../stores/index.js";

const activeTab = "analysis"; // 当前激活的标签页
const similarUsersTest = reactive([
  {name: "Bob", books: ["书2", "书2", "书2", "书2"]},
  {name: "Charlie", books: ["书3", "书3", "书3", "书3"]},
]);
const store = useStore()
/********* 获取相似用户 **************/
const similarUsers = ref([])

async function fetchSimilarUsers() {
  post(`/api/profile/getSimilarUsers/`, {
    userId: store.auth.user.userId
  }, (message, data) => {
    similarUsers.value = data
    console.log(similarUsers.value);
  });
}

/******** 查看她的书单 **************/
const isDialogVisible = ref(false);
const selectedBooks = ref([]);

function viewMoreBooks(name) {
  const user = similarUsers.value.find(user => user.name === name);
  selectedBooks.value = user.books;
  isDialogVisible.value = true;
}

/********* 绘制雷达图 ************/
const typeDataTest = [
  {name: "政史哲", max: 100},
  {name: "数理、科学", max: 100},
  {name: "工具、教材", max: 100},
  {name: "中国文学", max: 100},
  {name: "外国文学", max: 100},
]

async function fetchTypeData() {
  const typeData = ref([]);
  return new Promise((resolve, reject) => {
    post(`/api/profile/getAllBorrowedType/`, {
      userId: store.auth.user.userId
    }, (message, data) => {
      if (message === '操作成功') {
        typeData.value = data
        resolve(typeData);
      } else {
        reject('Failed to fetch type data');
      }
    });
  });
}

const neverBorrowed = ref(false);

async function renderRadarChart() {
  const data = await fetchTypeData();
  const chartDom = document.getElementById("chart");
  if (!chartDom) return;
  const values = data.value.map(item => item.value);
  const maxValue = values.length > 0 ? Math.max(...values) : 1;
  if (maxValue === 0) {
    neverBorrowed.value = true;
  }
  const indicators = data.value.map(item => ({
    name: item.name,
    max: Math.max(Math.ceil(maxValue * 1.2), 5), // 将最大值扩大 20%，留出显示空间
  }));
  const option = {
    title: {
      text: "",
      left: "center",
      textStyle: {
        fontSize: 15,
      },
    },
    tooltip: {
      trigger: "item", // 悬停提示
    },
    radar: {
      shape: "polygon",
      indicator: indicators,
      radius: "60%",
      axisName: {
        color: "#333",
        fontSize: 12,
      },
      splitLine: {
        lineStyle: {
          color: ["rgba(36,85,94,0.5)"], // 网格线颜色
        },
      },
      splitArea: {
        areaStyle: {
          color: ["#f9f9f9", "rgba(194,234,238,0.35)"], // 网格区域交替颜色
        },
      },
    },
    series: [
      {
        name: "用户分析",
        type: "radar",
        data: [
          {
            value: values,
            name: "借阅情况",
            areaStyle: {
              opacity: 0.2,
            },
            lineStyle: {
              color: "#5470C6",
            },
          },
        ],
      },
    ],
  };
  const myChart = echarts.init(chartDom);
  myChart.setOption(option);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
}


onMounted(() => {
  fetchSimilarUsers()
  renderRadarChart()
});


function navigateTo(path) {
  if (path) {
    router.push(path);
  }
}

function goBack() {
  router.push("/home/profile");
}
</script>

<style scoped>
.close-button {
  background-color: #007aff;
  color: #fff;
  border-radius: 5px;
  padding: 3px 6px;
  text-align: center;
  display: inline-block;
  margin: 0 auto;
}

.close-button --default {
  background-color: rgba(244, 244, 244, 0.01);
  color: #333;
  margin-left: auto;
  margin-right: auto;
}

.book-list-container {
  max-height: 600px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  max-width: 500px;
}

.page-container {
  font-family: Arial, sans-serif;
}

.navigation-bar {
  display: flex;
  align-items: center;
  background-color: #f4f4f4;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.left-section {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.arrow {
  margin-right: 5px;
}

.tabs {
  display: flex;
  margin-left: auto;
  margin-right: auto;
}

.tab {
  cursor: pointer;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
}

.tab.active {
  background-color: #add8e6;
}

.section {
  margin: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.highlight {
  width: 5px;
  height: 20px;
  background-color: #f06292;
  margin-right: 5px;
}

.chart-container {
  height: 250px;
  background-color: rgba(240, 253, 251, 0.68);
  border-radius: 10px;
  padding: 10px;
}

.similar-users {
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.user-card {
  border: 1px solid #f4f4f4;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  background-color: rgba(248, 232, 238, 0.48);
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-right: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  margin-bottom: 10px;
}

.username {
  font-size: 8px;
  font-weight: bold;
  color: #333;
}

.books {
  display: flex;
  flex-wrap: wrap;
}

.book {
  width: 60px;
  height: 90px;
  background-color: rgba(255, 215, 83, 0.37);
  margin-right: 15px;
  margin-bottom: 0px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
  border: solid 2px rgba(0, 50, 101, 0.61);
}

.book-cover {
  width: 100%;
  height: 100%;
  background-color: #ddd;
  margin-bottom: 1px;
  border-radius: 5px;
}

.book-title {
  text-align: center;
  font-size: 16px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 20px;
}


.view-more {
  margin-top: 10px;
  text-align: center;
  font-size: 8px;
  color: #007bff;
  cursor: pointer;
}

.view-more span:hover {
  text-decoration: underline;
}

.book-detail p {
  font-size: 9px;
  color: #333;
  margin-bottom: 10px;
}

.book-detail strong {
  color: #555;
}

.no-books {
  text-align: left;
  font-size: 18px;
  color: #888;
  margin-top: 50px;
}

.book-card {
  padding: 5px;
  border-radius: 8px;
  margin-bottom: 5px;
  color: #333;
  background-color: rgba(255, 195, 225, 0.42);
  font-size: 13px;
}

.no-books {
  text-align: center;
  font-size: 16px;
  color: #888;
  margin-top: 5px;
}
</style>
