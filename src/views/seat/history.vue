<template>
  <div class="reservation-page">
    <van-nav-bar title="预约历史" left-arrow @click-left="goBack"/>

    <div class="reservation-list">
      <van-cell-group>
        <van-cell
            v-for="(res, index) in recentReservation"
            :key="index"
            class="reservation-item"
            :title="`${res.areaId}F公共区域 座位${res.seatId}`"
            :label="`预约时间: ${res.date}/${res.period}`"
        >
          <template #right-icon>
            <van-button :disabled="isExpired(res)" type="primary" size="small" @click="cancelReservation(res.id)">
              取消预约
            </van-button>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted} from 'vue';
import router from "../../router/index.js";
import {get, post} from "../../net/index.js";
import {useStore} from "../../stores/index.js";
import {showSuccessToast} from "vant";

const recentReservation = ref([]);

function isExpired(reservation) {
  const currentDate = new Date();
  const [startTime, endTime] = reservation.period.split('-'); // 分割开始时间和结束时间

  const startDate = new Date(`${reservation.date} ${startTime}`);
  const endDate = new Date(`${reservation.date} ${endTime}`);

  // 判断当前时间是否已经超过结束时间
  return currentDate > endDate;
}

const store = useStore()

async function fetchHistoryReservation() {
  post(`/api/seat/order/history/`,
      {
        userId: store.auth.user.userId
      }, (message, data) => {
        recentReservation.value = data.reservations
      }
  )
}

function cancelReservation(id) {
  post(`/api/seat/order/cancel/`,
      {
        orderId: id
      }, (message, data) => {
        showSuccessToast(message);
        fetchHistoryReservation()
      }
  )
}


function goBack() {
  // 返回上一级
  window.history.back();
}

onMounted(fetchHistoryReservation);
</script>
<style scoped>
.reservation-page {
  padding: 10px;
}

.reservation-list {
  margin-top: 10px;
}

.reservation-item {
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
