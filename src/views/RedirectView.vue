<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const accessToken = ref(null)
const router = useRouter()

onMounted(() => {
  const currentUrl = new URL(window.location.href)
  accessToken.value = currentUrl.searchParams.get('accessToken');

  // accessToken이 존재하면 로컬 스토리지에 저장
  if (accessToken.value) {
    localStorage.setItem('accessToken', accessToken.value);
    // 다른 페이지로 이동
    router.replace('/')
  }
})
</script>

<template>
  <main>
    <div>
      <h1>하이하이하이</h1>
      <h2>{{accessToken}}</h2>
    </div>
  </main>
</template>
