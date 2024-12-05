<template>
  <div class="borrowed-books-page">
    <!-- 页面标题 -->
    <van-nav-bar title="当前借阅" left-arrow @click="goBack"/>

    <!-- 借阅信息概览 -->
    <div class="borrow-summary">
      <p>当前借阅({{ borrowedBooks && borrowedBooks.length }}) | 最大借阅数量为999999</p>
      <div>
        <span class="status not-due">未到期</span>
        <span class="status overdue">已到期</span>
        <span class="status near-due">即将到期</span>
      </div>
    </div>
    <div v-if="borrowedBooks.length === 0" class="no-books">
      <p>诶，你还没有借过书哦~</p>
    </div>
    <!-- 借阅书籍列表 -->
    <div v-for="(book, index) in borrowedBooks" :key="index" class="book-card"
         :class="{ 'near-due': book.status === '即将到期', 'overdue': book.status === '已到期', 'not-due': book.status === '未到期' }">
      <h3>{{ book.title }}</h3>
      <p>作者：{{ book.author }}</p>
      <p>条码号：{{ book.book_id }}</p>
      <p>类别：{{ book.type }}</p>
      <p>馆藏地：{{ book.location }}</p>
      <p>借阅日期：{{ book.borrowedDate }}</p>
      <p>应还日期：{{ book.dueDate }}</p>
      <button class="return-button" @click="returnBook(book.instance_id)">还书</button>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useStore} from "../stores/index.js";
import {post, get} from '../net';
import router from "../router/index.js";
import {showSuccessToast} from "vant";

const borrowedBooks = ref([])
const store = useStore()

/**************获取当前借阅的书籍数据列表**********/
async function fetchBorrowedBooks() {
  post(`/api/profile/getAllBorrowed/`,
      {
        userId: store.auth.user.userId
      },
      (message, data) => {
        borrowedBooks.value = data
      }
  )
}

/******* 还书 *********/
async function returnBook(instance_id) {
  post(`/api/profile/return/`,
      {
        user_id: store.auth.user.userId,
        instance_id: instance_id
      },
      (message) => {
        showSuccessToast(message);
        fetchBorrowedBooks();
      }
  );
}

onMounted(() => {
  fetchBorrowedBooks();
});

function goBack() {
  router.push('/home/profile');
}
</script>

<style scoped>
.no-books {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 20px;
}

.borrowed-books-page {
  padding: 10px;
}

.borrow-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.status {
  margin-left: 10px;
  font-size: 12px;
  color: #888;
}

.near-due {
  background-color: #FFFBEA;
}

.overdue {
  background-color: #FFE8E8;
}

.not-due {
  background-color: #e0f7fa;
}

.book-card {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #333;
  transition: background-color 0.3s ease;
}


/* 未到期的书籍卡片样式 */
.book-card.not-due {
  background-color: #e0f7fa;
}

/* 即将到期的书籍卡片样式 */
.book-card.near-due {
  background-color: #fffadc;
}

/* 已到期的书籍卡片样式 */
.book-card.overdue {
  background-color: #ffe7e1;
}

.book-card h3 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.book-card p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.van-button {
  width: 100%;
  margin-top: 20px;
}

.return-button {
  background-color: #52bd57;
  color: white;
  border: none;
  padding: 7px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.return-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.return-button:active {
  background-color: #388e3c;
  transform: scale(0.98);
}
</style>