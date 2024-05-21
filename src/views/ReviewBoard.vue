<template>
  <div>
    <HeaderOne />
    <BreadCrumb />
    
    <div class="review-list">
      <h2>여행 리뷰</h2>
      <button @click="openModal" class="write-review-button">
        리뷰 작성하기
      </button>
      <!-- 모달 -->
      <div class="modal" v-if="isModalOpen">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3>리뷰 작성</h3>
          <Datepicker v-model="visitDate" placeholder="방문 날짜를 선택하세요" />
          <textarea
            v-model="newReviewTitle"
            placeholder="제목"
            class="input-title"
          ></textarea>
          <textarea
            v-model="newReviewContent"
            placeholder="내용"
            class="input-content"
          ></textarea>
          <input type="file" multiple @change="handleFileUpload" />
          <ul v-if="selectedFiles.length > 0" class="file-list">
            <li v-for="(file, index) in selectedFiles" :key="index">
              {{ file.name }}
            </li>
          </ul>
          <button @click="submitReview" class="submit-button">작성 완료</button>
        </div>
      </div>
      <!-- 기존 리뷰 목록 -->
      <div v-if="reviews.length > 0" class="reviews-container">
        <ul class="reviews">
          <li v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <h3 class="review-title">{{ review.title }}</h3>
              <!-- 좋아요 개수와 버튼을 담는 컨테이너 -->
              <div class="like-container">
                <!-- 좋아요 개수 표시 -->
                <div class="heart-count">{{ review.heartCnt }}</div>
                <!-- 좋아요 버튼 -->
                <button @click="toggleLike(review)" class="like-button">
                  <i v-if="review.liked" class="fas fa-heart liked"></i>
                  <i v-else class="far fa-heart"></i>
                </button>
              </div>
            </div>

            <p class="review-content">{{ review.content }}</p>
            <ul
              v-if="review.fileInfos && review.fileInfos.length > 0"
              class="image-list"
            >
              <li
                v-for="(file, index) in review.fileInfos"
                :key="index"
                class="image-item"
              >
                <img
                  :src="`http://localhost:8080/file/download/${file.saveFolder}/${file.originalFile}/${file.saveFile}`"
                  class="review-image"
                />
              </li>
            </ul>
            <div>
              <!-- 삭제 버튼을 특정 조건에 따라 렌더링 -->
              <button
                v-if="review.userId === userId"
                @click="deleteReview(review.id)"
                class="delete-button"
              >
                삭제
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>아직 작성된 리뷰가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderOne from "@/components/header/HeaderOne.vue";
import BreadCrumb from "@/components/BreadCrumb.vue";
import axios from "axios";
import { ref, onMounted } from "vue";
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref();
const visitDate = ref();
const reviews = ref([]);
const isModalOpen = ref(false);
const newReviewTitle = ref("");
const newReviewContent = ref("");
const selectedFiles = ref([]);
const userId = ref(0);

const currentUrl = new URL(window.location.href);
const id = currentUrl.searchParams.get("id");

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const submitReview = () => {
  const formData = new FormData();
  const data = {
    spotId: id,
    userId: userId.value,
    title: newReviewTitle.value,
    content: newReviewContent.value,
  };
  formData.append(
    "post",
    new Blob([JSON.stringify(data)], {
      type: "application/json",
    })
  );
  selectedFiles.value.forEach((file) => {
    formData.append("upfile", file);
  });

  axios
    .post(`http://localhost:8080/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("리뷰가 성공적으로 제출되었습니다.", response.data);
      reviews.value.push(response.data); // 서버로부터 받은 리뷰를 목록에 추가
      closeModal(); // 모달 닫기
      selectedFiles.value = []; // 선택한 파일 목록 초기화

      // 리뷰 제출 후 방문 날짜 정보도 전송
      if (visitDate.value) {
        axios.post(`http://localhost:8080/visit`, {
          userId: userId.value,
          postId: response.data.id,
          visitDate: visitDate.value,
        }).then(() => {
          console.log("방문 날짜가 성공적으로 제출되었습니다.");
        }).catch((error) => {
          console.error("방문 날짜 제출 중 오류가 발생했습니다.", error.response.data);
        });
      }
    })
    .catch((error) => {
      console.error("리뷰 제출 중 오류가 발생했습니다.", error.response.data);
    });
};

const deleteReview = (reviewId) => {
  axios
    .delete(`http://localhost:8080/post/${reviewId}`)
    .then(() => {
      console.log("리뷰가 성공적으로 삭제되었습니다.");
      // Remove the deleted review from the reviews array
      reviews.value = reviews.value.filter((review) => review.id !== reviewId);
    })
    .catch((error) => {
      console.error("리뷰 삭제 중 오류가 발생했습니다.", error.response.data);
    });
};

const checkLikeStatus = async (userId, postId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/like/exists?userId=${userId}&postId=${postId}`
    );
    const exists = response.data;
    return exists;
  } catch (error) {
    console.error("Failed to check like status:", error);
    return false;
  }
};

const toggleLike = async (review) => {
  const exists = await checkLikeStatus(userId.value, review.id);
  if (exists) {
    // 좋아요가 이미 눌려있는 경우, 좋아요 취소
    review.heartCnt--;
    review.liked = false;
    axios
      .delete(`http://localhost:8080/like/delete`, {
        data: {
          userId: userId.value,
          postId: review.id,
        },
      })
      .then(() => {
        console.log("좋아요가 취소되었습니다.");
      })
      .catch((error) => {
        console.error(
          "좋아요 취소 중 오류가 발생했습니다.",
          error.response.data
        );
      });
  } else {
    // 좋아요가 눌려있지 않은 경우, 좋아요 추가
    review.heartCnt++;
    review.liked = true;
    axios
      .post(`http://localhost:8080/like/add`, {
        userId: userId.value,
        postId: review.id,
      })
      .then(() => {
        console.log("좋아요가 추가되었습니다.");
      })
      .catch((error) => {
        console.error(
          "좋아요 추가 중 오류가 발생했습니다.",
          error.response.data
        );
      });
  }
};

const fetchReviews = () => {
  axios
    .get(`http://localhost:8080/post/spot/${id}`)
    .then((response) => {
      console.log(response.data);
      reviews.value = response.data;
      // 좋아요 상태 확인
      reviews.value.forEach(async (review) => {
        review.liked = await checkLikeStatus(userId.value, review.id);
      });
    })
    .catch((error) => {
      console.error(
        "리뷰 목록을 가져오는 중 오류가 발생했습니다.",
        error.response.data
      );
    });
};

const fetchUserData = async () => {
  try {
    const response = await axios.get("http://localhost:8080/users/myInfo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    const userData = response.data;
    userId.value = userData.id;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  }
};

onMounted(() => {
  fetchReviews();
  fetchUserData(); // 사용자 데이터 가져오기
});
</script>

<style scoped>
/* 모달 스타일 */
.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 60%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.input-title,
.input-content {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

.file-list {
  margin-bottom: 10px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
/* 리뷰 목록 스타일 */
.review-list {
  margin: 20px;
  padding: 20px;
  background: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.write-review-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

.write-review-button:hover {
  background-color: #45a049;
}

.reviews-container {
  margin-top: 20px;
}

.reviews {
  list-style: none;
  padding: 0;
}

.review-item {
  background-color: #fff;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
}

.review-item:hover {
  transform: translateY(-5px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.review-title {
  font-size: 1.5em;
  margin: 0;
  color: #333;
}

.review-content {
  margin: 10px 0;
  font-size: 1em;
  color: #555;
}

.image-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-item {
  width: 100px;
  height: 100px;
}

.review-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  transition: transform 0.2s;
}

.review-image:hover {
  transform: scale(1.05);
}

.modal-content h3,
.modal-content textarea,
.modal-content button {
  color: black;
}

.like-container {
  display: flex;
  margin-right: 5px;
  align-items: center;
}

.heart-count {
  font-size: 20px; /* 크기 조정 */
  /* margin-right: 10px;  */
}

.like-button {
  margin-left: auto;
  margin-bottom: 7px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
}

.like-button .fas.fa-heart {
  color: red;
  font-size: 24px; /* 크기 조정 */
}

.like-button .far.fa-heart {
  color: grey;
  font-size: 24px; /* 크기 조정 */
}

.delete-button {
  background-color: #ff6347; /* 삭제 버튼 색상 변경 */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #d63b20; /* 호버 시 색상 변경 */
}

.delete-button:focus {
  outline: none;
}

.modal {
  display: block;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.input-title,
.input-content {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  resize: vertical;
}

.input-title:focus,
.input-content:focus {
  border-color: #4caf50; /* 입력 필드 포커스 시 색상 변경 */
}

.file-list {
  margin-bottom: 10px;
}

.file-list li {
  margin-bottom: 5px;
}

.file-list li:last-child {
  margin-bottom: 0;
}

.file-list li::before {
  content: "\2022"; /* 원형 마커 추가 */
  color: #4caf50; /* 원형 마커 색상 변경 */
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #45a049;
}

.submit-button:focus {
  outline: none;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-button:disabled:hover {
  background-color: #cccccc;
}

.no-reviews {
  font-style: italic;
  color: #666;
}

@media screen and (max-width: 768px) {
  .modal-content {
    width: 90%;
  }
}
</style>
