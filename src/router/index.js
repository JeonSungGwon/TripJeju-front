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
    path: "/index-2",
    name: "home2",
    component: HomeTwo,
  },    
  {
    path: "/index-3",
    name: "home3",
    component: HomeThree,
  },    
  {
    path: "/about",
    name: "about",
    component: About,
  },    
  {
    path: "/choose-us",
    name: "choose-us",
    component: ChooseUs,
  },    
  {
    path: "/team",
    name: "team",
    component: Team,
  },
  {
    path: "/festival",
    name: "festival",
    component: Festival,
  },    
  {
    path: "/price",
    name: "price",
    component: Price,
  },    
  {
    path: "/faq",
    name: "faq",
    component: Faq,
  },    
  {
    path: "/service-1",
    name: "service-1",
    component: ServiceOne,
  },    
  {
    path: "/service-2",
    name: "service-2",
    component: ServiceTwo,
  },    
  {
    path: "/service-details",
    name: "service-details",
    component: ServiceDetails,
  },    
  {
    path: "/project",
    name: "project",
    component: Project,
  },    
  {
    path: "/project-details",
    name: "project-details",
    component: ProjectDetails,
  },    
  {
    path: "/blog",
    name: "blog",
    component: Blog,
  },    
  {
    path: "/blog-details",
    name: "blog-details",
    component: BlogDetails,
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
    component: TripReview
  },
  {
    path: "/reviewBoard",
    name: "reviewBoard",
    component: ReviewBoard
  },
  {
    path: "/myPageReview",
    name: "myPageReview",
    component: MyPageReview
  },
  {
    path: "/myPageBookmark",
    name: "myPageBookmark",
    component: MypageBookmark
  },
  {
    path: "/myPagePlan",
    name: "myPagePlan",
    component: MypagePlan
  },
  {
    path: "/myPageVisited",
    name: "myPageVisited",
    component: MypageVisited
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

export default router;
