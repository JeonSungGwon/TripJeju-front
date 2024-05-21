import { createRouter, createWebHistory } from 'vue-router';

import {
  HomeOne, HomeTwo, HomeThree, About, ChooseUs, Team, Price, Faq, ServiceOne, ServiceTwo, ServiceDetails, Project, ProjectDetails, Blog, BlogDetails, Contact,
  RedirectView, Festival, TripReview, ReviewBoard, Spot, Tour, Food, Lodge, Shop, Route
} from "../views";

import MyPageReview from '@/views/MyPageReview.vue';
import MypageBookmark from '@/views/MypageBookmark.vue';
import MypagePlan from '@/views/MypagePlan.vue';
import MypageVisited from '@/views/MypageVisited.vue';

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeOne,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/festival",
    name: "festival",
    component: Festival,
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
  },
  {
    path: "/index",
    component: RedirectView
  },
  {
    path: "/tripReview",
    name: "tripReview",
    component: TripReview,
    meta: { requiresAuth: true }
  },
  {
    path: "/reviewBoard",
    name: "reviewBoard",
    component: ReviewBoard
  },
  {
    path: "/myPageReview",
    name: "myPageReview",
    component: MyPageReview,
    meta: { requiresAuth: true }
  },
  {
    path: "/myPageBookmark",
    name: "myPageBookmark",
    component: MypageBookmark,
    meta: { requiresAuth: true }
  },
  {
    path: "/myPagePlan",
    name: "myPagePlan",
    component: MypagePlan,
    meta: { requiresAuth: true }
  },
  {
    path: "/myPageVisited",
    name: "myPageVisited",
    component: MypageVisited,
    meta: { requiresAuth: true }
  },
  {
    path: "/spot",
    name: "spot",
    component: Spot
  },
  {
    path: "/tour",
    name: "tour",
    component: Tour
  },
  {
    path: "/food",
    name: "food",
    component: Food
  },
  {
    path: "/lodge",
    name: "lodge",
    component: Lodge
  },
  {
    path: "/shop",
    name: "shop",
    component: Shop
  },
  {
    path: "/route",
    name:"route",
    component: Route
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  },
});

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken');
  
  if (to.matched.some(record => record.meta.requiresAuth) && !accessToken) {
    // 액세스 토큰이 없으면 로그인 페이지로 리디렉션
    next({ path: '/contact' });
  } else {
    // 그렇지 않으면 요청한 라우트로 이동
    next();
  }
});

export default router;
