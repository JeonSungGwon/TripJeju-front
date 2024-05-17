<template>
  <div id="filterContainer">
    <button @click="toggleBox" class="toggle-button">{{ showBox ? '▲' : '▼' }} 검색 필터</button>
    <div v-show="showBox">
      <div class="search-box">
        <input type="text" placeholder="제목 검색" v-model="title" @input="debounceUpdateTitle" />
      </div>

      <div class="type-box">
        <label><input type="checkbox" value="c1" v-model="selectedTypes" @change="updateType"> 관광지</label>
        <label><input type="checkbox" value="c2" v-model="selectedTypes" @change="updateType"> 쇼핑</label>
        <label><input type="checkbox" value="c3" v-model="selectedTypes" @change="updateType"> 숙소</label>
        <label><input type="checkbox" value="c4" v-model="selectedTypes" @change="updateType"> 음식점</label>
      </div>

      <div class="tagBox box01">
        <input id="hashTagTypeA_all" type="radio" name="tag" value="" @change="setTag('')" checked>
        <button title="선택됨" class="bt2">#전체</button>
        <input id="hashTagTypeA_액티비티" type="radio" name="tag" value="액티비티" @change="setTag('액티비티')">
        <button class="bt2">#액티비티</button>
        <input id="hashTagTypeA_실내관광지" type="radio" name="tag" value="실내관광지" @change="setTag('실내관광지')">
        <button class="bt2">#실내관광지</button>
        <input id="hashTagTypeA_테마공원" type="radio" name="tag" value="테마공원" @change="setTag('테마공원')">
        <button class="bt2">#테마공원</button>
        <input id="hashTagTypeA_무장애관광" type="radio" name="tag" value="무장애관광" @change="setTag('무장애관광')">
        <button class="bt2">#무장애관광</button>
        <input id="hashTagTypeA_러닝홀리데이인제주" type="radio" name="tag" value="러닝홀리데이인제주" @change="setTag('러닝홀리데이인제주')">
        <button class="bt2">#러닝홀리데이인제주</button>
        <input id="hashTagTypeA_안전여행스탬프" type="radio" name="tag" value="안전여행스탬프" @change="setTag('안전여행스탬프')">
        <button class="bt2">#안전여행스탬프</button>
        <input id="hashTagTypeA_우수관광사업체" type="radio" name="tag" value="우수관광사업체" @change="setTag('우수관광사업체')">
        <button class="bt2">#우수관광사업체</button>
        <input id="hashTagTypeA_웰니스" type="radio" name="tag" value="웰니스" @change="setTag('웰니스')">
        <button class="bt2">#웰니스</button>
      </div>

      <div class="tagBox box02">
        <input id="hashTagTypeB_오름" type="radio" name="tag" value="오름" @change="setTag('오름')">
        <button class="bt2">#오름</button>
        <input id="hashTagTypeB_포토스팟" type="radio" name="tag" value="포토스팟" @change="setTag('포토스팟')">
        <button class="bt2">#포토스팟</button>
        <input id="hashTagTypeB_숲" type="radio" name="tag" value="숲" @change="setTag('숲')">
        <button class="bt2">#숲</button>
        <input id="hashTagTypeB_유네스코" type="radio" name="tag" value="유네스코" @change="setTag('유네스코')">
        <button class="bt2">#유네스코</button>
        <input id="hashTagTypeB_마을관광" type="radio" name="tag" value="마을관광" @change="setTag('마을관광')">
        <button class="bt2">#마을관광</button>
        <input id="hashTagTypeB_드라이브" type="radio" name="tag" value="드라이브" @change="setTag('드라이브')">
        <button class="bt2">#드라이브</button>
        <input id="hashTagTypeB_반려동물동반_관광지" type="radio" name="tag" value="반려동물동반_관광지" @change="setTag('반려동물동반_관광지')">
        <button class="bt2">#반려동물동반_관광지</button>
      </div>

      <div class="regionWrap">
        <div class="showRegion">
          <button @click="toggleRegion" class="bt1">지역별 태그 검색</button>
        </div>
        <div class="regionTags" v-show="showRegion">
          <div class="tagBox box01">
            <input id="region_0" type="radio" name="region1cd" value="제주시" @change="setRegion('제주시', '')">
            <button class="bt2 region_0">#제주시</button>
            <input id="region_0_0" type="radio" name="region2cd" value="제주시내" @change="setRegion('제주시', '제주시내')">
            <button class="bt2 region_0_0">#제주시내</button>
            <input id="region_0_1" type="radio" name="region2cd" value="애월" @change="setRegion('제주시', '애월')">
            <button class="bt2 region_0_1">#애월</button>
            <input id="region_0_2" type="radio" name="region2cd" value="한림" @change="setRegion('제주시', '한림')">
            <button class="bt2 region_0_2">#한림</button>
            <input id="region_0_3" type="radio" name="region2cd" value="한경" @change="setRegion('제주시', '한경')">
            <button class="bt2 region_0_3">#한경</button>
            <input id="region_0_4" type="radio" name="region2cd" value="조천" @change="setRegion('제주시', '조천')">
            <button class="bt2 region_0_4">#조천</button>
            <input id="region_0_5" type="radio" name="region2cd" value="구좌" @change="setRegion('제주시', '구좌')">
            <button class="bt2 region_0_5">#구좌</button>
            <input id="region_0_6" type="radio" name="region2cd" value="우도" @change="setRegion('제주시', '우도')">
            <button class="bt2">#우도</button>
            <input id="region_0_7" type="radio" name="region2cd" value="추자" @change="setRegion('제주시', '추자')">
            <button class="bt2">#추자</button>
          </div>
          <div class="tagBox box01">
            <input id="region_1" type="radio" name="region1cd" value="서귀포시" @change="setRegion('서귀포시', '')">
            <button class="bt2 region_1">#서귀포시</button>
            <input id="region_1_0" type="radio" name="region2cd" value="성산" @change="setRegion('서귀포시', '성산')">
            <button class="bt2 region_1_0">#성산</button>
            <input id="region_1_1" type="radio" name="region2cd" value="서귀포시내" @change="setRegion('서귀포시', '서귀포시내')">
            <button class="bt2 region_1_1">#서귀포시내</button>
            <input id="region_1_2" type="radio" name="region2cd" value="대정" @change="setRegion('서귀포시', '대정')">
            <button class="bt2 region_1_2">#대정</button>
            <input id="region_1_3" type="radio" name="region2cd" value="안덕" @change="setRegion('서귀포시', '안덕')">
            <button class="bt2 region_1_3">#안덕</button>
            <input id="region_1_4" type="radio" name="region2cd" value="중문" @change="setRegion('서귀포시', '중문')">
            <button class="bt2 region_1_4">#중문</button>
            <input id="region_1_5" type="radio" name="region2cd" value="남원" @change="setRegion('서귀포시', '남원')">
            <button class="bt2 region_1_5">#남원</button>
            <input id="region_1_6" type="radio" name="region2cd" value="표선" @change="setRegion('서귀포시', '표선')">
            <button class="bt2 region_1_6">#표선</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBox: false,
      showRegion: false,
      title: '',
      selectedTypes: [],
      debounceTimeout: null
    };
  },
  methods: {
    toggleBox() {
      this.showBox = !this.showBox;
    },
    setTag(tag) {
      this.$emit('update-filter', { tag });
    },
    setRegion(reg1, reg2) {
      this.$emit('update-filter', { reg1, reg2 });
    },
    updateTitle() {
      this.$emit('update-filter', { title: this.title });
    },
    debounceUpdateTitle() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.updateTitle();
      }, 2000); // 2000ms 지연
    },
    updateType() {
      this.$emit('update-filter', { type: this.selectedTypes });
    },
    toggleRegion() {
      this.showRegion = !this.showRegion;
    },
  },
};
</script>

<style scoped>
#filterContainer {
  width: 100%;
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.toggle-button {
  width: 100%;
  padding: 10px;
  background: #ccc;
  border: none;
  cursor: pointer;
  text-align: left;
}

.search-box {
  margin: 10px 0;
}

.type-box {
  margin: 10px 0;
}

.tagBox {
  display: flex;
  flex-wrap: wrap;
}

.tagBox input {
  margin-right: 5px;
}

.tagBox button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
