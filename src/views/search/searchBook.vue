<template>
  <div class="container">
    <van-nav-bar title="搜索结果" left-arrow @click-left="goBack"/>

    <!-- 图书列表 -->
    <div class="book-list">
      <!-- 如果没有匹配的图书，则显示无结果提示 -->
      <div v-if="books.length === 0" class="no-results">
        查询无结果
      </div>
      <!--遍历筛选后的图书-->
      <div
          class="book-item"
          v-for="book in books"
          :key="book.book_id"
          @click="goToBookDetail(book.book_id)"
      >
        <img class="book-image" :src="book.image" alt="book image" />
        <div class="book-details">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-info">{{ book.author }} | {{ book.publisher }} | {{ book.year }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {get, post} from "../../net/index.js";

export default {
  data() {
    return {
      selectedCategoryData: '',
      selectedFilter: '',
      books: []
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
    goToBookDetail(bookId) {
      // 跳转到书籍详细信息页面
      this.$router.push({ name: "bookDetail", params: { bookId: bookId } });
    },
    async fetchSearchBooks(info) {
      console.log(info);
      post(`/api/searchBook/searchBooks/`, {
        info: info
      }, (message, data) => {
        this.books = data.book
      });
    },
  },

  mounted() {
    this.selectedCategoryData = this.$route.params.info;
    this.fetchSearchBooks(this.selectedCategoryData);
  }
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

.book-item {
  display: flex;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.book-item:hover {
  transform: scale(1.02);
}

.book-image {
  width: 80px;
  height: 100px;
  background-color: #ddd;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.book-title {
  font-weight: bold;
  margin-bottom: 4px;
}

.book-info {
  color: #666;
  font-size: 0.9em;
}
.no-results {
  text-align: center;
  font-size: 1.2em;
  color: #888;
  padding: 20px;
}
</style>