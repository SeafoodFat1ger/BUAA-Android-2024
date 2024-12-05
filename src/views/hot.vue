<template>
  <div class="chat-box-container">
    <van-nav-bar title="图书推荐助手" left-arrow @click = "goBack"/>
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        <div v-if="msg.type === 'user'" class="user-message">
          <div class="avatar">🤠</div>
          <div class="message-content user-message-content">{{ msg.content }}</div>
        </div>
        <div v-if="msg.type === 'bot'" class="bot-message">
          <div class="avatar">🤖</div>
          <div class="message-content bot-message-content">{{ msg.content }}</div>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input
          v-model="input"
          type="text"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          class="input-field"
      />
      <button @click="sendMessage" class="send-button">发送</button>
    </div>
    <div class="input-area">
      <button @click="sendHistoryMsg" class="send-button">发送最近阅读历史</button>
      <button @click="sendHobbyMsg" class="send-button">发送我的兴趣爱好</button>
    </div>
  </div>
</template>

<script>
import {showFailToast} from "vant";
import {post} from "../net/index.js";
import {useStore} from "../stores/index.js";
import router from "../router/index.js";

export default {
  data() {

    return {
      input: '',
      messages: [],
    };
  },
  methods: {
    goBack() {
      router.push('/home/profile');
    },
    sendMessage() {
      if (this.input.trim() === '') return;
      if (this.input.length > 500) {
        showFailToast("输入过长，没有Token的米了呜呜");
        this.input = '';
        return;
      }
      this.messages.push({type: 'user', content: this.input});
      const store = useStore()
      post(`/api//LLM/postMessage/`,
          {
            userId: store.auth.user.userId,
            input: this.input,
          },
          (message, data) => {
            this.messages.push({type: 'bot', content: data.output});
            this.scrollToBottom();
          }
      )
      this.input = '';
      this.scrollToBottom();
    },

    sendHistoryMsg() {
      const store = useStore();
      post(`/api/LLM/getUserInfo/`,
          {
            userId: store.auth.user.userId,
          },
          (message, data) => {
            if (data.names.length === 0) {
              this.messages.push({type: 'bot', content: '你最近还没有借过书，去借一些书让我知道你的爱好吧！📕'});
              this.scrollToBottom();
            }else{
              this.input = "我感兴趣的类型是:";
              this.input += data.types.join(',');
              this.input += ";我最近阅读的书有:";
              this.input += data.names.join(',');
              this.input += ";请帮我推荐一些书籍";
              this.sendMessage();
            }
          })
    },

    sendHobbyMsg() {
      const store = useStore();
      post(`/api/LLM/getUserInfo/`,
          {
            userId: store.auth.user.userId,
          },
          (message, data) => {
            if (data.hobbies == null || data.hobbies.length === 0) {
              this.messages.push({type: 'bot', content: '你还没有设置兴趣爱好，去个人信息页面告诉我你喜欢什么样的书籍！🥰'});
            }else{
              this.input = "我的兴趣爱好包括:";
              this.input += data.hobbies;
              this.input += ";请帮我推荐一些书籍";
              this.sendMessage();
            }
          })
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
    }
  }
};
</script>

<style scoped>
.chat-box-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-box {
  height: calc(100vh - 210px);
  overflow-y: auto;
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
}

.input-area {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.message {
  margin: 10px 0;
  display: flex;
  align-items: center;
}

.user-message, .bot-message {
  margin-top: 2px;
  display: flex;
  align-items: center;
}

.avatar {
  border-radius: 50%;
  margin-right: 10px;
  font-size: 40px;
  width: 50px;
  height: 50px;
}

.input-field {
  flex: 1;
  margin-right: 10px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.send-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-button:hover {
  background-color: #0056b3;
}

.message-content {
  max-width: 100%;
  background-color: #f0f0f0;
  border-radius: 5px;
  padding: 10px;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.user-message-content {
  background-color: #d1e7dd;
}

.bot-message-content {
  background-color: #cfe2ff;
}
</style>
