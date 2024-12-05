<template>
  <div class="reservation-page">
    <van-nav-bar title="楼层列表" left-arrow @click-left="goBack"/>

    <div class="reservation-list">
      <van-cell-group>
        <van-cell
            v-for="(area, index) in areas"
            :key="index"
            class="reservation-item"
            :title="area.name"
            :label="`开放时间: ${area.openTime} 空余座位数: ${area.seats}`"
        >
          <template #right-icon>
            <van-button :disabled="area.seats === 0" type="primary" size="small" @click="selectSeat(area.id)">选座
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
import {get} from "../../net/index.js";

const areas = ref([
  {id: 1, name: '1F公共区域', openTime: '08:00-23:00', seats: 30},
  {id: 2, name: '2F公共区域', openTime: '09:00-22:00', seats: 30},
  {id: 3, name: '3F公共区域', openTime: '09:00-22:00', seats: 30},
  {id: 4, name: '4F公共区域', openTime: '09:00-22:00', seats: 30},
  {id: 5, name: '5F公共区域', openTime: '09:00-22:00', seats: 30},
  {id: 6, name: '6F公共区域', openTime: '09:00-22:00', seats: 30},
]);

// 获取图书馆座位信息
async function fetchAreas() {
  get(`/api/seat/getArea/`, (message, data) => {
        areas.value = data.areas
      }
  )
}


function selectSeat(areaId) {
  // 传入区域的ID
  router.push({name: 'seatSelection', params: {areaId}});
}

function goBack() {
  window.history.back();
}

onMounted(fetchAreas);
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
