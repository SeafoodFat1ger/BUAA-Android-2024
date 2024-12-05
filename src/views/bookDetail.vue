<template>
  <van-nav-bar title="书籍详细" left-arrow @click-left="goBack"/>
  <div class="book-detail">
    <div class="book-info">
      <div class="info-text">
        <p><strong>书名:</strong> {{ book.title }}</p>
        <p><strong>类型:</strong> {{ book.type }}</p>
        <p><strong>作者:</strong> {{ book.author }}</p>
        <p><strong>位置:</strong> {{ book.location }}</p>
      </div>
      <img :src="book.image" alt="Book Cover" class="book-image"/>
    </div>

    <div class="book-summary">
      <h3>书籍简介</h3>
      <p>{{ book.summary }}</p>
      <van-button @click="startTextToSpeech"> 开始朗读</van-button>
    </div>

    <van-tabs v-model="activeTab">
      <!-- 评论区 Tab -->
      <van-tab title="评论">
        <div class="borrow-section">
          <!-- 评分组件 -->
          <van-rate v-model="rating" class="rating"/>

          <van-field
              v-model="newComment"
              rows="2"
              autosize
              clearable
              type="textarea"
              maxlength="150"
              placeholder="发表你的评论"
              show-word-limit
              class="comment-input"
          >
            <template #button>
              <van-button size="small" type="primary" @click="submitComment">提交评论</van-button>
            </template>
          </van-field>

          <div class="comments">
            <h3>评论区</h3>
            <van-list>
              <van-cell v-for="(comment, index) in book.comments" :key="index">
                <template #title>
                  <p>{{ comment.comment }}</p>
                  <van-rate v-model="comment.rate" readonly/>
                </template>
              </van-cell>
            </van-list>
          </div>
        </div>
      </van-tab>

      <!-- 借阅信息 Tab -->
      <van-tab title="借阅信息">
        <div class="borrow-section">
          <h3>借阅信息</h3>
          <div v-for="(instance, index) in book.bookInstance" :key="index" class="borrow-item">
            <p>位置: {{ instance.location }}</p>
            <p>状态: <span :class="{'available': instance.avlb, 'unavailable': !instance.avlb}">
              {{ instance.avlb ? '可借阅' : '已借出' }}
            </span></p>
            <van-button size="small" type="primary" :disabled="!instance.avlb"
                        @click="borrowBook(instance.instance_id)">
              借阅
            </van-button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRoute} from "vue-router";
import {get, post} from "../net/index.js";
import {showSuccessToast} from "vant";
import {useStore} from "../stores";

export default {
  setup() {
    const bookId = ref(0);
    const route = useRoute();
    const book = ref({
      title: '示例书名',
      type: '小说',
      summary: '这是一段关于书籍的简介。',
      author: '作者姓名',
      location: '图书馆位置',
      image: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
      comments: [],
      bookInstance: [
        {instance_id: 1, location: 'A区 1楼', avlb: true},
        {instance_id: 2, location: 'B区 3楼', avlb: false}
      ]
    });


    const startTextToSpeech = () => {
      const speech = new SpeechSynthesisUtterance();
      speech.text = book.value.summary;
      window.speechSynthesis.speak(speech);
    };


    const newComment = ref('');
    const rating = ref(0);
    const activeTab = ref(0);

    const store = useStore();

    const goBack = () => {
      window.history.back();
    };

    const submitComment = () => {
      if (newComment.value !== '') {
        post(
            `/api/bookDetail/addComment/`,
            {
              user: store.auth.user.userId,
              book: bookId.value,
              comment: newComment.value,
              rate: rating.value
            },
            (message, data) => {
              showSuccessToast(message);
              fetchBookDetails();
            }
        );

        newComment.value = '';
        rating.value = 0;
      } else {
        showSuccessToast('请填写评论和评分');
      }
    };

    const borrowBook = (instance_id) => {
      post(
          `/api/bookDetail/borrow/`,
          {user_id: store.auth.user.userId, instance_id: instance_id},
          (message) => {
            showSuccessToast(message);
            fetchBookDetails();
          }
      );
    };

    const fetchBookDetails = () => {
      get(`/api/bookDetail/${bookId.value}/`, (message, data) => {
        book.value = data.book;
      });
    };

    onMounted(() => {
      bookId.value = route.params.bookId;
      fetchBookDetails();
    });

    return {
      book,
      newComment,
      rating,
      activeTab,
      submitComment,
      borrowBook,
      goBack,
      startTextToSpeech
    };
  }
};
</script>

<style scoped>
.book-detail {
  padding: 16px;
  background-color: #f5f5f5;
}

.book-info {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.info-text {
  flex: 1;
}

.book-image {
  width: 120px;
  height: auto;
  margin-left: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.book-summary {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.book-summary h3 {
  margin-bottom: 8px;
}

.comment-section {
  margin-top: 16px;
}

.comment-input {
  margin-top: 8px;
}

.rating {
  margin-top: 8px;
}

.comments {
  margin-top: 16px;
}

h3 {
  margin-bottom: 8px;
}

.borrow-section {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
}

.borrow-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.borrow-item p {
  margin: 0;
  flex: 1;
}

.borrow-item .available {
  color: green;
}

.borrow-item .unavailable {
  color: red;
}
</style>
