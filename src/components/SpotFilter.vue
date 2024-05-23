<template>
  <div id="filterWrapper">
    <button class="filter-button toggle-filters-button" @click="toggleFilters">
      {{ showFilters ? "필터 닫기" : "필터 열기" }}
    </button>
    <div v-if="showFilters">
      <!-- 검색창 -->
      <div class="filter-search">
        <input
          type="text"
          placeholder="관광지명을 검색하세요"
          v-model="title"
          @input="emitFilterUpdate"
        />
      </div>

      <!-- 태그 필터 -->
      <div class="filterGroup">
        <label class="filter-label">태그</label>
        <div class="tagBox">
          <button
            v-for="tag in filteredTags"
            :key="tag.value"
            :class="['filter-button', { active: selectedTag === tag.value }]"
            @click="toggleTag(tag.value)"
          >
            #{{ tag.label }}
          </button>
        </div>
      </div>

      <!-- 지역 필터 -->
      <div class="filterGroup">
        <label class="filter-label">지역</label>
        <div class="regionBox">
          <button
            v-for="region in regions"
            :key="region.value"
            :class="[
              'filter-button',
              { active: selectedRegion === region.value },
            ]"
            @click="toggleRegion(region.value)"
          >
            #{{ region.label }}
          </button>
        </div>
        <div
          v-if="selectedRegion && subregions[selectedRegion]"
          class="subregionBox"
        >
          <button
            v-for="subregion in subregions[selectedRegion]"
            :key="subregion.value"
            :class="[
              'filter-button',
              { active: selectedSubregion === subregion.value },
            ]"
            @click="toggleSubregion(subregion.value)"
          >
            #{{ subregion.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showFilters: true, // 필터 표시 여부 초기값
      selectedTag: "",
      selectedRegion: "",
      selectedSubregion: "",
      title: "",
      tags: {
        c1: [
          { label: "전체", value: "" },
          { label: "액티비티", value: "액티비티" },
          { label: "실내관광지", value: "실내관광지" },
          { label: "무장애관광", value: "무장애관광" },
          { label: "러닝홀리데이인제주", value: "러닝홀리데이인제주" },
          { label: "안전여행스탬프", value: "안전여행스탬프" },
          { label: "오름", value: "오름" },
          { label: "포토스팟", value: "포토스팟" },
          { label: "숲", value: "숲" },
          { label: "유네스코", value: "유네스코" },
          { label: "마을관광", value: "마을관광" },
          { label: "드라이브", value: "드라이브" },
          { label: "반려동물동반_관광지", value: "반려동물동반_관광지" },
        ],
        c2: [
          { label: "전체", value: "" },
          { label: "럭셔리트래블인제주", value: "럭셔리트래블인제주" },
          { label: "무장애관광", value: "무장애관광" },
          { label: "관광기념품", value: "관광기념품" },
          { label: "특산품", value: "특산품" },
          { label: "전통시장", value: "전통시장" },
          { label: "상점/상가", value: "상점/상가" },
          { label: "오일장", value: "오일장" },
          { label: "플리마켓", value: "플리마켓" },
          { label: "면세점", value: "면세점" },
        ],
        c3: [
          { label: "전체", value: "" },
          { label: "착한가격업소", value: "착한가격업소" },
          { label: "반려동물동반입장", value: "반려동물동반입장" },
          { label: "럭셔리트래블인제주", value: "럭셔리트래블인제주" },
          { label: "안전여행스탬프", value: "안전여행스탬프" },
          { label: "우수관광사업체", value: "우수관광사업체" },
          { label: "4성급호텔", value: "4성급호텔" },
          { label: "5성급호텔", value: "5성급호텔" },
          { label: "독채", value: "독채" },
          { label: "가족호텔", value: "가족호텔" },
          { label: "게스트하우스", value: "게스트하우스" },
          { label: "농어촌민박", value: "농어촌민박" },
          { label: "안전인증민박", value: "안전인증민박" },
          { label: "리조트", value: "리조트" },
          { label: "공공와이파이존", value: "공공와이파이존" },
        ],
        c4: [
          { label: "전체", value: "" },
          { label: "착한가격업소", value: "착한가격업소" },
          { label: "반려동물동반입장", value: "반려동물동반입장" },
          { label: "럭셔리트래블인제주", value: "럭셔리트래블인제주" },
          { label: "안전여행스탬프", value: "안전여행스탬프" },
          { label: "우수관광사업체", value: "우수관광사업체" },
          { label: "무장애관광", value: "무장애관광" },
          { label: "향토음식", value: "향토음식" },
          { label: "한식", value: "한식" },
          { label: "카페", value: "카페" },
          { label: "해물뚝배기", value: "해물뚝배기" },
          { label: "몸국", value: "몸국" },
          { label: "해장국", value: "해장국" },
          { label: "수제버거", value: "수제버거" },
          { label: "흑돼지", value: "흑돼지" },
          { label: "일식", value: "일식" },
          { label: "해산물", value: "해산물" },
        ],
      },
      regions: [
        { label: "제주시", value: "제주시" },
        { label: "서귀포시", value: "서귀포시" },
        { label: "섬 속의 섬", value: "섬 속의 섬" },
      ],
      subregions: {
        제주시: [
          { label: "제주시내", value: "제주시내" },
          { label: "애월", value: "애월" },
          { label: "한림", value: "한림" },
          { label: "한경", value: "한경" },
          { label: "조천", value: "조천" },
          { label: "구좌", value: "구좌" },
        ],
        서귀포시: [
          { label: "성산", value: "성산" },
          { label: "서귀포시내", value: "서귀포시내" },
          { label: "대정", value: "대정" },
          { label: "안덕", value: "안덕" },
          { label: "중문", value: "중문" },
          { label: "남원", value: "남원" },
          { label: "표선", value: "표선" },
        ],
        '섬 속의 섬': [
          { label: "우도", value: "우도" },
          { label: "추자도", value: "추차도" },
          { label: "마라도", value: "마라도" },
          { label: "비양도", value: "비양도" },
          { label: "가파도", value: "가파도" },
        ]
      },
    };
  },
  computed: {
    filteredTags() {
      return this.tags[this.type] || [];
    },
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    toggleTag(tag) {
      this.selectedTag = this.selectedTag === tag ? "" : tag;
      this.emitFilterUpdate();
    },
    toggleRegion(region) {
      this.selectedRegion = this.selectedRegion === region ? "" : region;
      this.selectedSubregion = ""; // 하위 지역 초기화
      this.emitFilterUpdate();
    },
    toggleSubregion(subregion) {
      this.selectedSubregion =
        this.selectedSubregion === subregion ? "" : subregion;
      this.emitFilterUpdate();
    },
    emitFilterUpdate() {
      this.$emit("update-filter", {
        tag: this.selectedTag,
        reg1: this.selectedRegion,
        reg2: this.selectedSubregion,
        title: this.title,
        type: this.type,
      });
    },
  },
};
</script>

<style scoped>
#filterWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
}

.toggle-filters-button {
  margin-bottom: 2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.toggle-filters-button:hover {
  background-color: #e0e0e0;
}

.filter-search {
  display: flex;
  justify-content: center;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 1rem;
}

.filter-search input {
  width: 50%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: black;
  transition: background-color 0.3s, color 0.3s;
  text-align: center;
}

.filter-search input:focus {
  background-color: white;
  outline: none;
}

.filter-label {
  width: 100%;
  text-align: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.filterGroup {
  width: 100%;
  margin-bottom: 1rem;
}

.tagBox,
.regionBox,
.subregionBox {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-button {
  margin: 0.5rem;
  padding: 5px 10px;
  background-color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border: solid 1px;
  color: black;
}

.filter-button.active {
  background-color: #ff5722;
  border: #ff5722 1px;
  color: white;
}
</style>
