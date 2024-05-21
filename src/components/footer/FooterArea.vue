<template>
    <footer class="footer-area font-freesentation">
         <div class="container">
             <div class="footer-up">
                 <div class="row gy-5">
                     <div class="col-lg-3 col-md-6 col-sm-12">
                         <div class="logo">
                             <img src="/assets/img/logo/logo1.png" alt="dustrian-logo">
                         </div>
                         <p>제주도 여행지 사이트 <br> 제주도 여행갈 땐  <br> 트립제주 </p>
                         <div class="social-area ">
                             <a href=""><i class="lab la-facebook-f"></i></a>
                             <a href=""><i class="lab la-instagram"></i></a>
                             <a href=""><i class="lab la-twitter"></i></a>
                             <a href=""><i class="la la-skype"></i></a>
                         </div>
                     </div>
                     <div class="col-lg-3 offset-lg-1 col-md-6 com-sm-12">
                         <h5>여행지</h5>
                         <ul>
                             <li>
                                 <router-link :to="{name:'tour'}"><span>-</span>관광지</router-link>
                                 <router-link :to="{name:'food'}"><span>-</span>음식</router-link>
                                 <router-link :to="{name:'lodge'}"><span>-</span>숙박</router-link>
                                 <router-link :to="{name:'shop'}"><span>-</span>쇼핑</router-link>
                             </li>
                         </ul>
                     </div>
                     <div class="col-lg-3 col-md-6 col-sm-12">
                         <h5>기타</h5>
                         <ul>
                             <li>
                                 <router-link :to="{name:'festival'}"><span>-</span> 축제 및 행사</router-link>
                                 <router-link :to="{name:'tripReview'}"><span>-</span> 여행지 후기</router-link>
                                 <router-link :to="{name:'route'}"><span>-</span> 여행지 추천</router-link>
                             </li>
                         </ul>
                     </div>
                     <div class="col-lg-2 col-md-6 col-sm-12">
                         <h5>내 정보</h5>
                         <ul>
                             <li>
                                 <router-link :to="{name:'myPagePlan'}"><span>-</span> 나의 여행일정</router-link>
                                 <router-link :to="{name:'myPageBookmark'}"><span>-</span> 찜한 여행</router-link>
                                 <router-link :to="{name:'myPageReview'}"><span>-</span> 나의 리뷰</router-link>
                                 <router-link :to="{name:'myPageVisited'}"><span>-</span> 방문 여행지</router-link>
                             </li>
                         </ul>
                     </div>
                     
                 </div>
             </div>
         </div>
     </footer>
</template>