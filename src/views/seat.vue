<template>
  <div class="reservation-home">
    <van-nav-bar title="北航图书馆座位预约"/>

    <!-- 顶部功能图标 -->
    <div class="icon-row">
      <van-col span="6" v-for="(item, index) in icons" :key="index" @click="navigateTo(index)">
        <van-image :src="item.icon" width="40" height="40"/>
        <p>{{ item.name }}</p>
      </van-col>
    </div>

    <van-popup v-model:show="isPopupVisible" closeable position="bottom">
      <div class="popup-content" v-html="popupContent"></div>
    </van-popup>

    <!-- 当前预约 -->
    <p class="section-title">当前预约</p>
    <div class="current-reservation">
      <div class="no-reservation" v-if="currentReservation.length === 0">
        暂无预约
      </div>
      <div v-else class="reservation-item">
        <div class="reservation-header">
          <span class="seat-id">座位{{ currentReservation[0].seatId }}</span>
          <span class="reservation-time">{{ currentReservation[0].period }}</span>
        </div>
        <div class="reservation-details">
          <div class="area-info">{{ currentReservation[0].areaId }}F公共区域</div>
        </div>
      </div>
    </div>

    <!-- 最近预约 -->
    <p class="section-title">最近预约</p>
    <div class="recent-reservation" v-if="recentReservation">
      <div v-for="reservation in recentReservation" :key="reservation.id" class="reservation-item">
        <div class="reservation-header">
          <span class="seat-id">座位{{ reservation.seatId }}</span>
          <span class="reservation-time">{{ reservation.date }}/{{ reservation.period }}</span>
        </div>
        <div class="reservation-details">
          <div class="area-info">{{ reservation.areaId }}F公共区域</div>
        </div>
        <!-- 仅在预约未过期时显示取消按钮 -->
        <van-button v-if="!isExpired(reservation)" type="primary" size="small" class="rebook-btn"
                    @click="cancelReservation(reservation.id)">
          取消预约
        </van-button>

      </div>
    </div>


  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {showSuccessToast, showFailToast} from 'vant';
import router from "../router/index.js";
import selectSeatIcon from '../assets/icons/select-seat.svg';
import quickSeatIcon from '../assets/icons/quick-seat.svg';
import reservationHistoryIcon from '../assets/icons/reservation-history.svg';
import rulesIcon from '../assets/icons/rules.svg';
import {content} from './seat/content.js';
import {post, get} from '../net/index.js';
import {useStore} from "../stores";

const icons = ref([
  {name: '预约选座', icon: selectSeatIcon, path: '/select-seat'},
  {name: '预约记录', icon: reservationHistoryIcon, path: '/reservation-history'},
  {name: '规则说明', icon: rulesIcon, path: '/rules'},
]);

const currentReservation = ref([]);
const recentReservation = ref([]);

const isPopupVisible = ref(false);
const popupContent = ref('');

//获取当前预约信息
async function fetchCurrentReservation() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const nowtime = `${hours}:${minutes}:${seconds}`;

  post(`/api/seat/order/now/`,
      {
        userId: store.auth.user.userId,
        nowtime: nowtime,
      }, (message, data) => {
        currentReservation.value = data.recentReservation
      }
  )
}

function isExpired(reservation) {
  const currentDate = new Date(); // 获取当前时间
  const [startTime, endTime] = reservation.period.split('-'); // 分割开始时间和结束时间

  // 组合开始时间和结束时间的完整日期时间
  const startDate = new Date(`${reservation.date} ${startTime}`);
  const endDate = new Date(`${reservation.date} ${endTime}`);

  // 判断当前时间是否已经超过结束时间
  return currentDate > endDate; // 如果当前时间大于结束时间，则表示过期
}

const store = useStore()

// 模拟获取当前预约信息
async function fetchHistoryReservation() {
  post(`/api/seat/order/history/sample/`,
      {
        userId: store.auth.user.userId
      }, (message, data) => {
        recentReservation.value = data.reservations
      }
  )
}

// 导航到功能页
function navigateTo(index) {
  if (index === 0) {
    router.push(`/home/seat/select`)
  } else if (index === 1) {
    router.push(`/home/seat/history`)
  } else if (index === 2) {
    isPopupVisible.value = true;
    popupContent.value = content;
  }
}

// 重新预约
function cancelReservation(id) {
  // 在这里和后端交互，重新预约该座位
  post(`/api/seat/order/cancel/`,
      {
        orderId: id
      }, (message, data) => {
        showSuccessToast(message);
        fetchCurrentReservation();
        fetchHistoryReservation();
      }
  )
}

onMounted(() => {
  fetchCurrentReservation();
  fetchHistoryReservation();
});

</script>
<style scoped>
.reservation-home {
  padding: 10px;
}

.icon-row {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  text-align: center;
}

.icon-row p {
  margin-top: 5px;
  font-size: 14px;
}

.current-reservation {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.current-reservation p {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.no-reservation {
  font-size: 18px;
  text-align: center;
  color: #888;
}

.recent-reservation p {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}


.recent-reservation {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.reservation-item {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  transition: transform 0.2s ease-in-out;
}

.reservation-item:hover {
  transform: translateY(-5px);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: #444;
}

.seat-id {
  color: #1e90ff;
}

.reservation-time {
  color: #999;
}

.reservation-details {
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}

.area-info {
  font-size: 14px;
  margin-bottom: 8px;
}

.rebook-btn {
  margin-top: 16px;
  display: block;
  width: 100%;
  background-color: #1e90ff;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
}

.rebook-btn:hover {
  background-color: #0066cc;
}

</style>
