<template>
  <div class="reservation-page">

    <van-nav-bar title="预约座位" left-arrow @click-left="goBack"/>
    <!-- 状态指示 -->
    <h2>{{ areaId }}F公共区域</h2>
    <div class="status-indicators">
      <span class="color-box available"></span>空闲
      <span class="color-box booked"></span>已预约
      <span class="color-box unavailable"></span>不开放

      <van-button @click="show = true">{{ date }}</van-button>

      <van-calendar v-model:show="show" @confirm="onConfirm"/>
    </div>


    <!-- 时间/座位表格 -->
    <table class="schedule-table">
      <thead>
      <tr>
        <th>座位/时间</th>
        <th v-for="timeSlot in timeSlots" :key="timeSlot">{{ timeSlot }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="seat in seats" :key="seat.id">
        <td>{{ "座位" + seat.id }}</td>
        <td v-for="status in seat.statuses" :key="status.time"
            :class="statusClass(seat.id,status.time,status.type)"
            @click="status.type === 'available' ? selectSeat(seat.id, status.time) : null">
          <span v-if="status.type === 'available'">{{ status.type }}</span>
          <span v-else>{{ status.type }}</span>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 底部确认按钮 -->
    <div class="footer">
      <van-checkbox v-model="hasRead">已阅读并同意</van-checkbox>
      <van-button :disabled="!hasRead || !selectedSeat" type="primary" @click="showPopup = true">预约</van-button>
    </div>

    <!-- popup -->
    <van-popup v-model:show="showPopup" position="bottom" style="height: 200px;">
      <div class="popup-content">
        <p>您确认预约该座位吗？</p>
        <van-button type="primary" @click="confirmBooking">确认</van-button>
        <van-button @click="showPopup = false">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {ref, onMounted} from 'vue';
import {useRoute} from 'vue-router';
import {showToast} from 'vant';
import {post, get} from "../../net/index.js";
import {useStore} from "../../stores";

export default {
  setup() {
    const store = useStore()
    const areaId = ref(0);
    const route = useRoute();
    const timeSlots = ref(['08:00-10:00', '10:00-12:00', '12:00-14:00', '14:00-16:00', '16:00-18:00', '18:00-20:00', '20:00-22:00']);
    const seats = ref(Array.from({length: 30}, (_, i) => ({
      id: i + 1,
      statuses: [
        {time: '08:00-10:00', type: 'available'},
        {time: '10:00-12:00', type: 'unavailable'},
        {time: '12:00-14:00', type: 'booked'},
        {time: '14:00-16:00', type: 'available'},
        {time: '16:00-18:00', type: 'available'},
        {time: '18:00-20:00', type: 'available'},
        {time: '20:00-22:00', type: 'available'},
      ],
    })));
    const hasRead = ref(false);
    const selectedSeat = ref(null);
    const showPopup = ref(false);

    function goBack() {
      window.history.back();
    }

    const formatDate = (date) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    };

    const date = ref(formatDate(new Date()));
    const show = ref(false);


    const onConfirm = (value) => {
      show.value = false;
      date.value = formatDate(value);
      fetchSeatStatus(areaId.value, date.value)
    };

    function selectSeat(seatId, timeSlot) {
      selectedSeat.value = {seatId, timeSlot};
    }

    function confirmBooking() {
      post(`/api/seat/order/add/`, {
        userId: store.auth.user.userId,
        seatId: selectedSeat.value.seatId,
        date: date.value,
        areaId: areaId.value,
        ordertime: selectedSeat.value.timeSlot,
      }, (message) => {
        showToast("预约成功");
        fetchSeatStatus(areaId.value, date.value)
      })
      selectedSeat.value = null;
      showPopup.value = false; // 隐藏弹窗
    }

    function statusClass(seatId, time, type) {
      return {
        'cell-available': type === 'available' && ((selectedSeat.value === null) || (selectedSeat.value.timeSlot !== time) || (selectedSeat.value.seatId !== seatId)),
        'cell-booked': type === 'booked',
        'cell-unavailable': type === 'unavailable',
        'cell-selected': (selectedSeat.value !== null) && (selectedSeat.value.seatId === seatId) && (selectedSeat.value.timeSlot === time), // 判断是否为选中状态
      };
    }

    async function fetchSeatStatus(AreaId = 0, Date) {
      get(`/api/seat/getStatus/${AreaId}/${Date}/`, (message, data) => {
            seats.value = data.seats
          }
      )
    }

    onMounted(() => {
      areaId.value = route.params.areaId;
      fetchSeatStatus(areaId.value, formatDate(new Date()));
    });

    return {
      areaId,
      date,
      show,
      timeSlots,
      seats,
      hasRead,
      selectedSeat,
      selectSeat,
      confirmBooking,
      statusClass,
      goBack,
      showPopup,
      onConfirm
    };
  },
};
</script>

<style scoped>
.reservation-page {
  padding-bottom: var(--footer-height);
  overflow-y: auto;
}

.status-indicators {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}


.color-box {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.available {
  background-color: #f0f8ff;
}

.unavailable {
  background-color: #f3f3f3;
}

.booked {
  background-color: #ffebeb;
}

.status {
  font-size: 14px;
}

.cell-available {
  background-color: #f0f8ff;
  cursor: pointer;
}

.cell-booked {
  background-color: #ffebeb;
}

.cell-unavailable {
  background-color: #f3f3f3;
  color: #b0b0b0;
}

.cell-selected {
  background-color: #5cb85c;
}


.schedule-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 60px;
}

.schedule-table th,
.schedule-table td {
  padding: 8px;
  text-align: center;
  border: 1px solid #ddd;
}


.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  border-top: 1px solid #ddd;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  line-height: var(--footer-height);
}


:root {
  --footer-height: 50px;
}


.popup-content {
  padding: 16px;
  text-align: center;
}
</style>
