<template>
  <div class="profile-info">
    <van-nav-bar title="个人信息" left-arrow @click="goBack"/>
    <div class="header">
      <div class="avatar">😀</div>
      <div class="username">{{ userInfo.username }}</div>
    </div>

    <div class="stats">
      <div class="stat-item">
        <div class="stat-number">{{ userInfo.borrowedBooks }}</div>
        <div class="stat-label">已借图书</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ userInfo.totalBooks }}</div>
        <div class="stat-label">总借书量</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ userInfo.postedReviews }}</div>
        <div class="stat-label">发表评论</div>
      </div>
    </div>

    <div class="info">
      <p>
        <strong>用户名：</strong>
        <template v-if="isEditing">
          <input v-model="editInfo.username" type="text"/>
        </template>
        <template v-else>
          {{ userInfo.username }}
        </template>
      </p>
      <p>
        <strong>昵称：</strong>
        <template v-if="isEditing">
          <input v-model="editInfo.nickname" type="text"/>
        </template>
        <template v-else>
          {{ userInfo.nickname }}
        </template>
      </p>
      <p>
        <strong>生日：</strong>
        <template v-if="isEditing">
          <input v-model="editInfo.birthday" type="date"/>
        </template>
        <template v-else>
          {{ userInfo.birthday }}
        </template>
      </p>
      <p>
        <strong>性别：</strong>
        <template v-if="isEditing">
          <select v-model="editInfo.gender">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </template>
        <template v-else>
          {{ userInfo.gender }}
        </template>
      </p>
      <p>
        <strong>学号：</strong>
        <template v-if="isEditing">
          <input v-model="editInfo.studentID" type="text"/>
        </template>
        <template v-else>
          {{ userInfo.studentID }}
        </template>
      </p>
      <p>
        <strong>邮箱：</strong>
        <template v-if="isEditing">
          <input v-model="editInfo.email" type="email"/>
        </template>
        <template v-else>
          {{ userInfo.email }}
        </template>
      </p>
      <!-- 新增偏好栏目 -->
      <p>
        <strong>我的兴趣爱好：</strong>
        <template v-if="isEditing">
          <div class="preferences">
            <label v-for="(category, index) in categories" :key="index" class="checkbox-label">
              <input
                  type="checkbox"
                  :value="category"
                  v-model="editHobbies"
              />
              {{ category }}
            </label>
          </div>
        </template>
        <template v-else>
          {{ userInfo.hobbies }} <!-- 显示已选择的偏好 -->
        </template>
      </p>
    </div>


    <!-- 按钮 -->
    <div class="actions">
      <button v-if="!isEditing" @click="startEditing" class="edit-button">修改信息</button>
      <div v-else>
        <button @click="saveChanges" class="save-button">保存</button>
        <button @click="cancelEditing" class="cancel-button">取消</button>
      </div>
    </div>

  </div>
</template>

<script setup>

import {ref, onMounted} from 'vue';
import {post} from '../net';
import {useStore} from "../stores";
import router from "../router/index.js";


const store = useStore()
const userInfo = ref({hobbies: []}); // 确保 hobbies 是空数组而不是 undefined
const categories = [
  "马克思主义", "列宁主义", "毛泽东思想", "邓小平理论",
  "哲学", "宗教", "社会科学总论", "政治", "法律",
  "军事", "经济", "文化", "科学", "教育", "体育",
  "语言", "文字", "文学", "艺术", "历史", "地理",
  "自然科学总论", "数理科学和化学", "天文学", "地球科学",
  "生物科学", "医药", "卫生", "农业科学", "工业技术",
  "交通运输", "航空", "航天", "环境科学", "安全科学",
  "综合性图书"
];


async function fetchUserInfo() {
  post(`/api/profile/getUserInfo/`, {
    userId: store.auth.user.userId
  }, (message, data) => {
    userInfo.value = data.userInfo
  });
}

const isEditing = ref(false); // 是否处于编辑模式
const editInfo = ref({}); // 编辑中的用户信息
const editHobbies = ref([]);

// 开始编辑
function startEditing() {
  isEditing.value = true;
  editInfo.value = {...userInfo.value}; // 初始化编辑信息
  editHobbies.value = userInfo.value.hobbies.split(',');
  console.log(editHobbies.value);
}

// 取消编辑
function cancelEditing() {
  isEditing.value = false;
}

// 保存修改
function saveChanges() {
  editInfo.value.hobbies = editHobbies.value.join(',').toString();
  post(
      `/api/profile/editInfo/`,
      {
        userId: store.auth.user.userId,
        //hobbies : editHobbies.value.join(',').toString(),
        ...editInfo.value,
      },
      () => {
        // 更新成功后同步用户信息
        userInfo.value = {...editInfo.value};
        userInfo.value.hobbies = editHobbies.value.join(',').toString();
        isEditing.value = false;
      }
  );
}

function goBack() {
  router.push('/home/profile');
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-info {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 10px;
}

.avatar {
  width: 80px;
  height: 80px;
  background-color: #cce5ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
}

.username {
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
}

.stat-item {
  flex: 1;
  padding: 20px;
  text-align: center;
  border: 1.5px solid rgba(175, 175, 160, 0.42);
  margin: 5px;
  border-radius: 20px;
}

.stat-item:nth-child(1) {
  background-color: rgba(202, 200, 239, 0.49);
}

.stat-item:nth-child(2) {
  background-color: rgba(238, 202, 64, 0.49);
}

.stat-item:nth-child(3) {
  background-color: rgba(201, 239, 190, 0.54);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  color: #666;
}

.info p {
  align-items: center;
  line-height: 2;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(115, 127, 141, 0.57);
  margin: 0;
}

.info strong {
  color: #333;
}

.actions {
  margin-top: 30px;
}

.edit-button,
.save-button,
.cancel-button {
  padding: 10px 20px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  background-color: rgba(93, 165, 248, 0.17);
  color: #000049;
}

.save-button {
  background-color: rgba(68, 147, 83, 0.96);
  color: white;
}

.cancel-button {
  background-color: #e87075;
  color: white;
}

.preferences {
  display: flex;
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: end;
  margin-right: 60px;
  font-size: 12px;
}

.checkbox-label input {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-label input:checked {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.checkbox-label input:hover {
  background-color: #ddd;
}

.checkbox-label input:focus {
  outline: none;
  border-color: #4CAF50;
}
</style>