<template>
  <div class="container">
    <van-nav-bar :title="this.mapIntToType(this.selectedCategory)" left-arrow @click-left="goBack"/>

    <!-- 图书列表 -->
    <div class="book-list">
      <div
          class="book-item"
          v-for="book in books"
          :key="book.book_id"
          @click="goToBookDetail(book.book_id)"
      >
        <img class="book-image" :src="book.image" alt="book image" />
        <div class="book-details">
          <div class="book-title">{{ book.title }}</div>
          <div class="book-info">作者：{{book.author }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {get} from "../../net/index.js";

export default {
  data() {
    return {
      typeName :[],
      selectedCategory: 0,
      books: []
    };
  },

  methods: {
    goBack() {
      this.$router.back();
    },
    goToBookDetail(bookId) {

      console.log(bookId)
      // 跳转到书籍详细信息页面
      this.$router.push({ name: "bookDetail", params: { bookId: bookId } });
    },
    async fetchCategoryBooks(category) {
      get(`/api/category/categoryBooks/${category}/`, (message, data) => {
            this.books = data.book
          }
      )
    },
    mapIntToType(typeNum) {
      // 获取类别的第一个字符
      const typeMapping = {
        1:"A 马克思主义、列宁主义、毛泽东思想、邓小平理论",
        2:"B 哲学、宗教",
        3:"C 社会科学总论",
        4:"D 政治、法律",
        5:"E 军事",
        6:"F 经济",
        7:"G 文化、科学、教育、体育",
        8:"H 语言、文字",
        9:"I 文学",
        10:"J 艺术",
        11:"K 历史、地理",
        12:"N 自然科学总论",
        13:"O 数理科学和化学",
        14:"P 天文学、地球科学",
        15:"Q 生物科学",
        16:"R 医药、卫生",
        17:"S 农业科学",
        18:"T 工业技术",
        19:"U 交通运输",
        20:"V 航空、航天",
        21:"X 环境科学、安全科学",
        22:"Z 综合性图书"
      };
      // 返回对应的整数值，找不到则返回 0
      return typeMapping[typeNum] || "no type";
    },

  },

  mounted() {
    this.selectedCategory = this.$route.params.typeName;

    this.fetchCategoryBooks(this.selectedCategory);
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
</style>