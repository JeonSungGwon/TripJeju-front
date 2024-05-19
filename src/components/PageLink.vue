<template>
  <ul class="pagination justify-content-center">
    <li class="page-item" v-if="prev">
      <router-link
        :to="`/tripReview?no=${(startPageIndex - 1) * listRowCount}`"
        class="page-link"
        aria-label="Previous"
        @click="movePage(startPageIndex - 1)"
      >
        <span aria-hidden="true">&laquo;</span>
      </router-link>
    </li>

    <li
      v-for="index in endPageIndex - startPageIndex + 1"
      :key="index"
      class="page-item"
      :class="{ active: startPageIndex + index - 1 == currentPageIndex }"
    >
      <router-link
        :to="`/tripReview?no=${(startPageIndex + index - 1) * listRowCount}`"
        class="page-link"
        @click="movePage(startPageIndex + index - 1)"
        >{{ startPageIndex + index - 1 }}</router-link
      >
    </li>

    <li class="page-item" v-if="next">
      <router-link
        :to="`/tripReview?no=${(endPageIndex + 1) * listRowCount}`"
        class="page-link"
        aria-label="Next"
        @click.native="movePage(endPageIndex + 1)"
      >
        <span aria-hidden="true">&raquo;</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import axios from 'axios'
import { ref, watch, defineProps, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  searchTerm: String
})


const totalListItemCount = ref(0)
const listRowCount = ref(12)
const pageLinkCount = ref(12)
const currentPageIndex = ref(1)
const pageCount = ref(0)
const startPageIndex = ref(0)
const endPageIndex = ref(0)
const prev = ref(false)
const next = ref(false)

const router = useRouter()

const movePage = (param) => {
  currentPageIndex.value = param
  initComponent()
}

const initComponent = () => {
  axios
    .get('http://localhost:8080/spots/count', {
      params: { search: props.searchTerm }
    })
    .then(({ data }) => {
      totalListItemCount.value = data
      initUI()
    })
    .catch(() => {
      alert('에러가 발생했습니다.')
    })
}

const initUI = () => {
  pageCount.value = Math.ceil(totalListItemCount.value / listRowCount.value)

  if (currentPageIndex.value % pageLinkCount.value === 0) {
    startPageIndex.value =
      (currentPageIndex.value / pageLinkCount.value - 1) * pageLinkCount.value + 1
  } else {
    startPageIndex.value =
      Math.floor(currentPageIndex.value / pageLinkCount.value) * pageLinkCount.value + 1
  }

  if (currentPageIndex.value % pageLinkCount.value === 0) {
    endPageIndex.value =
      (currentPageIndex.value / pageLinkCount.value - 1) * pageLinkCount.value + pageLinkCount.value
  } else {
    endPageIndex.value =
      Math.floor(currentPageIndex.value / pageLinkCount.value) * pageLinkCount.value +
      pageLinkCount.value
  }

  if (endPageIndex.value > pageCount.value) {
    endPageIndex.value = pageCount.value
  }

  prev.value = currentPageIndex.value > pageLinkCount.value
  next.value = endPageIndex.value < pageCount.value
}

watch(currentPageIndex, initUI)

watch(() => props.searchTerm, () => {
  initComponent();
})

// function updateFilteredTeam(newValue) {
//   console.log("Search term changed:", newValue);
// }

onMounted(() => {
  initComponent()
  router.push({ path: 'tripReview', query: { no: listRowCount.value } })
})
</script>
