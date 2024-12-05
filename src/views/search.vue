<template>
  <div class="container">
    <van-nav-bar title="北航图书检索系统"/>

    <!-- 搜索框 -->
    <div class="search-bar">
      <input type="text" placeholder="请输入关键词" v-model="searchQuery"/>
      <button class="search-button" @click="search(searchQuery)">
        <i class="fas fa-search"></i> <!-- 使用搜索图标 -->
      </button>
    </div>

    <!-- 热门图书 -->
    <div class="section hot-books">
      <h2><i class="fas fa-fire icon"></i> 热门图书</h2>

      <!-- 前三名图书，显示图片和书名 -->
      <div class="top-books">
        <div class="book-item featured" v-for="(book, index) in hotBooks.slice(0, 3)" :key="book.book_id">
          <div :class="['rank', index === 0 ? 'special-rank' : index === 1 ? 'rank_2' : 'rank_3']">
            <i v-if="index === 0" class="fas fa-trophy trophy-icon"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <img class="book-image" :src="book.image" alt="book image"/>
          <button class="book-title" @click="viewBookDetails(book.book_id)">{{ book.title }}</button>
        </div>
      </div>

      <!-- 第4到20名图书，显示排名和书名，无图片 -->
      <ul class="book-list">
        <li class="book-item" v-for="(book, index) in hotBooks.slice(3, 15)" :key="book.book_id">
          <div class="book-info">
            <div class="rank gray-rank">{{ index + 4 }}</div>
            <button class="book-title" @click="viewBookDetails(book.book_id)">{{ book.title }}</button>
          </div>
        </li>
      </ul>
    </div>


    <!-- 图书分类 -->
    <div class="section categories">
      <h2><i class="fas fa-list icon"></i> 图书分类</h2>
      <div class="category-grid">
        <button
            v-for="(category, index) in categoriesB"
            :key="index"
            class="category-button"
            @click="selectCategoryB(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {get, post} from "../net/index.js";

export default {
  data() {
    return {
      searchQuery: "",
      categoriesA: [
        "哲学", "经济学", "法学", "教育学", "文学", "历史学", "理学", "工学",
        "农学", "医学", "管理学", "艺术学"
      ],
      categoriesB: [
        "A 马克思主义、列宁主义、毛泽东思想、邓小平理论",
        "B 哲学、宗教", "C 社会科学总论", "D 政治、法律", "E 军事",
        "F 经济", "G 文化、科学、教育、体育", "H 语言、文字",
        "I 文学", "J 艺术", "K 历史、地理",
        "N 自然科学总论", "O 数理科学和化学", "P 天文学、地球科学",
        "Q 生物科学", "R 医药、卫生", "S 农业科学", "T 工业技术",
        "U 交通运输", "V 航空、航天", "X 环境科学、安全科学", "Z 综合性图书"
      ],
      hotBooks: []
    };
  },


  methods: {
    viewBookDetails(bookId) {
      this.$router.push({name: "bookDetail", params: {bookId: bookId}});
    },
    search(searchQuery) {
      this.$router.push({name: "searchBook", params: {info: searchQuery}});
    },
    mapTypeToInt(typeName) {
      const firstChar = typeName.charAt(0);

      // 映射第一个字符到整数值
      const typeMapping = {
        "A": 1,
        "B": 2,
        "C": 3,
        "D": 4,
        "E": 5,
        "F": 6,
        "G": 7,
        "H": 8,
        "I": 9,
        "J": 10,
        "K": 11,
        "N": 12,
        "O": 13,
        "P": 14,
        "Q": 15,
        "R": 16,
        "S": 17,
        "T": 18,
        "U": 19,
        "V": 20,
        "X": 21,
        "Z": 22
      };
      // 返回对应的整数值，找不到则返回 0
      return typeMapping[firstChar] || 0;
    },
    selectCategoryB(category) {
      //name指存储的路径名称，params为参数
      this.$router.push({name: "category", params: {typeName: this.mapTypeToInt(category)}});
    },
    async fetchHotBooks() {
      get(`/api/searchBook/hotBooks/`, (message, data) => {
            this.hotBooks = data.book
          }
      )
    },
  },
  mounted() {
    // 组件挂载时初始化 selectedCategoryData
    this.fetchHotBooks();
  }
};
</script>

<style scoped>

.container {
  background-color: #fff;
  padding: 16px;
  max-height: 100vh;
  overflow-y: auto;
}

/**********************搜索框***********************/
.search-bar {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 4px;
  background-color: #fff;
  //margin-bottom: 24px;
  margin: 0 auto 24px;
  box-shadow: 0 8px 7px rgba(0, 0, 0, 0.1);
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: none;
  outline: none;
  border-radius: 4px;
}

.section {
  margin-bottom: 24px;
}

.section h2 {
  font-size: 1.2em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.section h2 .icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  display: inline-block;
}

.search-button {
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;
  font-size: 1.2em;
  color: #888;
  border-left: 1px solid #ccc;
}

.search-button i {
  color: #888;
}

.search-button:hover i {
  color: #333;
}

.hot-books, .recommendations, .categories {
  border: 0.1px solid #ccc;
  background-color: #ffffff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 3px 10px 8px rgba(0, 0, 0, 0.1);
}

/*****************************热门图书*************************/
.hot-books {
  display: flex;
  flex-direction: column;
  gap: 20px;
}


.book-item {
  display: flex;
  flex: 1;
  text-align: center;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
  flex-direction: column;
}

.book-item.featured {
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-weight: bold;
  margin-bottom: 12px;
}

.special-rank {
  color: #ffd700;
  font-weight: bold;
  margin-right: 8px;
}

.trophy-icon {
  color: #ffd700;
  font-size: 1.5em;
  margin-right: 8px;
}

.book-title {
  background: none;
  border: none;
  color: black;
  font-size: 1em;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.book-title:hover {
  color: #0056b3;
}

.book-list {
  list-style: none;
  padding: 1px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.gray-rank {
  color: gray;
}

.book-image {
  width: 80px;
  height: 110px;
  background-color: #ddd;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
}

.book-info {
  display: flex;
  align-items: center;
  margin-right: 8px;
}

.top-books {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.rank {
  width: 24px;
  height: 24px;
  font-size: 1.2em;
  color: #888;
  display: flex;
  font-weight: bold;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
}

.rank.rank_2 {
  color: #7B3F00;
  width: 24px;
  height: 24px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.rank.rank_3 {
  color: #cd7f32;
  width: 24px;
  height: 24px;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

/*************************馆藏推荐***********************/

.category-tabs button {
  font-weight: bold;
  color: #666;
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 10px 15px;
  margin: 0 4px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}


.category-tabs button:hover {
  color: #0056b3;
}

.category-tabs {
  overflow-x: auto;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.category-tab-scroll {
  display: inline-flex;
  gap: 10px;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.book-grid {
  display: grid;
  list-style: none;
  padding: 1px;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  justify-content: center;
  align-items: center;
}

.book-grid .book-title {
  font-size: 13px;
  align-items: center;
  text-align: center;
  font-weight: bold;
}

.book-grid .book-image {
  margin-bottom: 4px;
}

/*****************************图书分类************************/
.category-grid {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-button {
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-button:hover {
  background-color: #0066cc;
  color: white;
}

</style>