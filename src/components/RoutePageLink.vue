<template>
  <ul class="pagination justify-content-center">
    <li class="page-item" v-if="prev">
      <router-link
        :to="`/tripRoute?no=${(startPageIndex - 1) * listRowCount}`"
        class="page-link"
        aria-label="Previous"
        @click.native="movePage(startPageIndex - 1)"
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
        :to="`/tripRoute?no=${(startPageIndex + index - 1) * listRowCount}`"
        class="page-link"
        @click.native="movePage(startPageIndex + index - 1)"
      >{{ startPageIndex + index - 1 }}</router-link>
    </li>

    <li class="page-item" v-if="next">
      <router-link
        :to="`/tripRoute?no=${(endPageIndex + 1) * listRowCount}`"
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
const listRowCount = 12 // Fixed value as it's not supposed to change
const pageLinkCount = 10 // Number of page links to display
const currentPageIndex = ref(1)
const pageCount = ref(0)
const startPageIndex = ref(1)
const endPageIndex = ref(0)
const prev = ref(false)
const next = ref(false)

const router = useRouter()

const movePage = (page) => {
  currentPageIndex.value = page
  router.push({ path: '/tripRoute', query: { no: (page - 1) * listRowCount } })
  initComponent()
}

const initComponent = () => {
  axios
    .get('http://localhost:8080/travel-route/count', {
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
  pageCount.value = Math.ceil(totalListItemCount.value / listRowCount)

  const currentChunk = Math.ceil(currentPageIndex.value / pageLinkCount)

  startPageIndex.value = (currentChunk - 1) * pageLinkCount + 1
  endPageIndex.value = Math.min(currentChunk * pageLinkCount, pageCount.value)

  prev.value = startPageIndex.value > 1
  next.value = endPageIndex.value < pageCount.value
}

watch(currentPageIndex, initUI)

watch(() => props.searchTerm, () => {
  currentPageIndex.value = 1 // Reset to first page on search term change
  initComponent()
})

onMounted(() => {
  initComponent()
})
</script>
