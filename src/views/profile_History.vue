<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <div class="navigation-bar">
      <div class="left-section" @click="goBack">
        <span class="arrow">&lt;</span>
      </div>
      <div class="tabs">
        <span class="tab" @click="navigateTo('/home/profile_History')" :class="{ active: activeTab === 'history' }">借阅历史</span>
        <span class="tab" @click="navigateTo('/home/profile_Cluster')" :class="{ active: activeTab === 'analysis' }">聚类分析</span>
      </div>
    </div>
    <div class="borrowed-books-page">
      <div v-if="borrowedBooks.length === 0" class="no-books">
        <p>诶，你还没有借过书哦~</p>
      </div>
      <div v-else v-for="(book, index) in borrowedBooks" :key="index" class="book-card">
        <h3>{{ book.title }}</h3>
        <p>作者：{{ book.author }}</p>
        <p>条码号：{{ book.book_id }}</p>
        <p>类别：{{ book.type }}</p>
        <p>馆藏地：{{ book.location }}</p>
        <p>借阅日期：{{ book.borrowedDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "../router/index.js";
import {onMounted, ref} from "vue";
import {useStore} from "../stores/index.js";
import {post} from "../net/index.js";
const borrowedBooks = ref([])
const store = useStore()

async function fetchBorrowedBooks() {
  post(`api/profile/getBorrowHistory/`,
      {
        userId: store.auth.user.userId
      },
      (message, data) => {
        borrowedBooks.value = data
      }
  )
}

onMounted(() => {
  fetchBorrowedBooks();
});

/////////////////////////
const activeTab = "history"; // 当前激活的标签页
function navigateTo(path) {
  if (path) {
    router.push(path);
  }
}

function goBack() {
  router.push("/home/profile");
}

onMounted(() => {

});
</script>

<style scoped>
.no-books {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
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

.borrowed-books-page {
  padding: 10px;
}

.book-card {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #333;
  background-color: #ece5ff;
}

.book-card h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.book-card p {
  margin: 5px 0;
  font-size: 10px;
  color: #666;
}
</style>
