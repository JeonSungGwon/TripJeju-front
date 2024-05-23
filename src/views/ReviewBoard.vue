<template>
  <div>
    <HeaderOne />
    <BreadCrumb />

    <div class="review-list">
      <h2>여행 리뷰</h2>
      <div class="review-list-header">
        <button @click="openModal(null)" class="write-review-button">리뷰 작성하기</button>
        <div class="sort-buttons">
          <button @click="sortByRecent" class="sort-button">최신순</button>
          <button @click="sortByLikes" class="sort-button">좋아요순</button>
        </div>
      </div>

      <!-- 모달 -->
      <div class="modal" v-if="isModalOpen">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h3 class="review-main" v-if="!isEditMode">리뷰 작성</h3>
          <h3 class="review-main" v-else>리뷰 수정</h3>
          <Datepicker class="date"v-model="visitDate" :timepicker="false" placeholder="방문 날짜를 선택하세요" v-if="!isEditMode" />
          <textarea v-model="newReviewTitle" :placeholder="isEditMode ? '제목을 수정하세요' : '제목'" class="input-title" style="height: 44px;"></textarea>
          <textarea v-model="newReviewContent" :placeholder="isEditMode ? '내용을 수정하세요' : '내용'" class="input-content"></textarea>
          <ul v-if="selectedFiles.length > 0" class="file-list">
            <li v-for="(file, index) in selectedFiles" :key="index">
              <img v-if="file.type === 'image'" :src="file.preview" class="file-preview" height="100" />
            </li>
          </ul>

          <input type="file" multiple @change="handleFileUpload" v-if="!isEditMode" />
          <ul v-if="selectedFiles.length > 0" class="file-list">
            <li v-for="(file, index) in selectedFiles" :key="index">
              <img v-if="file.type.startsWith('image/')" :src="previewImage(file)" class="file-preview" height="100" />
            </li>
          </ul>
          <button @click="isEditMode ? updateReview() : submitReview()" class="submit-button">{{ isEditMode ? '수정 완료' : '작성 완료' }}</button>
        </div>
      </div>

      <!-- 기존 리뷰 목록 -->
      <div v-if="reviews.length > 0" class="reviews-container">
        <ul class="reviews">
          <li v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <h3 class="review-title">
                {{ review.title }}
                <small class="review-date">{{ formatDate(review.createdAt) }}</small>
              </h3>
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
            <ul v-if="review.fileInfos && review.fileInfos.length > 0" class="image-list">
              <li v-for="(file, index) in review.fileInfos" :key="index" class="image-item">
                <img :src="`http://localhost:8080/file/download/${file.saveFolder}/${file.originalFile}/${file.saveFile}`" class="review-image" />
              </li>
            </ul>
            <div>
              <!-- 수정 버튼 -->
              <button v-if="review.userId === userId" @click="openModal(review)" class="edit-button">수정</button>
              <!-- 삭제 버튼을 특정 조건에 따라 렌더링 -->
              <button v-if="review.userId === userId" @click="deleteReview(review.id)" class="delete-button">삭제</button>
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
import dayjs from 'dayjs';

const visitDate = ref(dayjs().toDate());
const reviews = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const newReviewTitle = ref("");
const newReviewContent = ref("");
const selectedFiles = ref([]);
const userId = ref(0);
let editingReviewId = null;

const currentUrl = new URL(window.location.href);
const id = currentUrl.searchParams.get("id");

const openModal = (review = null) => {
  if (review) {
    visitDate.value =
      isEditMode.value = true;
    editingReviewId = review.id;
    newReviewTitle.value = review.title;
    newReviewContent.value = review.content;

    // 이미지 파일 정보 가져오기
    selectedFiles.value = review.fileInfos.map(fileInfo => {
      return {
        type: 'image', // 이미지 타입 여부를 나타내는 플래그 추가
        preview: `http://localhost:8080/file/download/${fileInfo.saveFolder}/${fileInfo.originalFile}/${fileInfo.saveFile}`
      };
    });
  }
  else {
    isEditMode.value = false;
    editingReviewId = null;
    newReviewTitle.value = "";
    newReviewContent.value = "";
    selectedFiles.value = [];
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleFileUpload = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const previewImage = (file) => {
  return URL.createObjectURL(file);
};

const sortByRecent = () => {
  reviews.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const sortByLikes = () => {
  reviews.value.sort((a, b) => b.heartCnt - a.heartCnt);
};
const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('ko-KR', options);
  }

const submitReview = () => {
  const formData = new FormData();
  const formattedDate = dayjs(visitDate.value).format('YYYY-MM-DD');
  console.log(formattedDate);
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
    .post(`/post`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data)
      response.data.createdAt = new Date().toISOString();
      reviews.value.unshift(response.data);
      closeModal();
      selectedFiles.value = [];
      if (formattedDate) {
        console.log(formattedDate)
        axios.post(`/visit`, {
          userId: userId.value,
          placeId: response.data.spotId,
          visitDate: formattedDate,
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

const updateReview = () => {
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

  axios
    .put(`/post/${editingReviewId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data)
      const index = reviews.value.findIndex(review => review.id === editingReviewId);
      if (index !== -1) {
        // 기존 리뷰의 liked 상태와 heartCnt 값을 유지
        response.data.liked = reviews.value[index].liked;
        response.data.heartCnt = reviews.value[index].heartCnt;
        reviews.value[index] = response.data;
      }
      closeModal();
      selectedFiles.value = [];
    })
    .catch((error) => {
      console.error("리뷰 수정 중 오류가 발생했습니다.", error.response.data);
    });
};


const deleteReview = (reviewId) => {
  axios
    .delete(`/post/${reviewId}`)
    .then(() => {
      console.log("리뷰가 성공적으로 삭제되었습니다.");
      reviews.value = reviews.value.filter((review) => review.id !== reviewId);
    })
    .catch((error) => {
      console.error("리뷰 삭제 중 오류가 발생했습니다.", error.response.data);
    });
};

const checkLikeStatus = async (userId, postId) => {
  try {
    const response = await axios.get(
      `/like/exists?userId=${userId}&postId=${postId}`
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
    review.heartCnt--;
    review.liked = false;
    axios
      .delete(`/like/delete`, {
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
    review.heartCnt++;
    review.liked = true;
    axios
      .post(`/like/add`, {
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

const fetchReviews = async () => {
  try {
    const response = await axios.get(`/post/spot/${id}`);
    const fetchedReviews = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // 각 리뷰에 대해 좋아요 상태를 확인하고 설정
    for (const review of fetchedReviews) {
      review.liked = await checkLikeStatus(userId.value, review.id);
    }

    // 설정된 리뷰 목록을 reviews에 할당
    reviews.value = fetchedReviews;
  } catch (error) {
    console.error("리뷰 목록을 가져오는 중 오류가 발생했습니다.", error.response.data);
  }
};



const fetchUserData = async () => {
  try {
    const response = await axios.get("/users/myInfo", {
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
  fetchUserData();
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
.date{
  margin-top: 20px;
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
.like-container :hover{
  background-color: white;
}

.heart-count {
  font-size: 20px;
  /* 크기 조정 */
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
  font-size: 24px;
  /* 크기 조정 */
}

.like-button .far.fa-heart {
  color: grey;
  font-size: 24px;
  /* 크기 조정 */
}

.edit-button,
.delete-button {
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button:hover,
.delete-button:hover {
  opacity: 0.8;
}

.delete-button {
  background-color: #ff6347;
  color: white;
  margin-right: 5px;
}



.edit-button {
  background-color: #4caf50;
  color: white;
  width: 55px;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #ff6347;
  /* 삭제 버튼 색상 변경 */
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.review-main{
  margin-top: 10px;
}
.delete-button:hover {
  background-color: #d63b20;
  /* 호버 시 색상 변경 */
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
  border-color: #4caf50;
  /* 입력 필드 포커스 시 색상 변경 */
}

.file-list {
  margin-bottom: 10px;
}

.file-list li {
  margin-bottom: 5px;
  margin-left: 5px;
}

.file-list li:last-child {
  margin-bottom: 0;
}

.file-list li::before {
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

.sort-buttons {
  margin-bottom: 10px;
  /* 버튼과 아래 내용 사이 여백 */
}

.sort-button {
  margin-right: 5px;
  /* 각 버튼 사이 간격 */
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
.review-date{
  font-size: 12px;
}

.submit-button:disabled:hover {
  background-color: #cccccc;
}

.no-reviews {
  font-style: italic;
  color: #666;
}

.review-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center; /* 버튼들을 수직으로 정렬하기 위해 추가 */
}


@media screen and (max-width: 768px) {
  .modal-content {
    width: 90%;
  }
}
</style>
