<script setup>

import { onMounted } from 'vue'

onMounted(() => {     

	$('.homepage-slides').owlCarousel({
		items: 1,
		dots: false,
		nav: true,
		loop: true,
		autoplay: true,
		autoplayTimeout: 5000,
		smartSpeed: 2000,
		slideSpeed: 600,
		animateOut: 'fadeOut',
		navText: ["<i class='la la-angle-left'></i>", "<i class='la la-angle-right'></i>"],
		responsive: {
			0: {
				items: 1,
				nav: false,
				dots: false,
			},
			600: {
				items: 1,
				nav: false,
				dots: false,
			},
			768: {
				items: 1,
				nav: false,
				dots: false,
			},
			1100: {
				items: 1,
				nav: true,
				dots: false,
			}
		}
	});


	$(".homepage-slides").on("translate.owl.carousel", function () {
		$(".single-slide-item h1").removeClass("animated fadeInUp").css("opacity", "1");
		$(".single-slide-item h6").removeClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item p").removeClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item a.main-btn").removeClass("animated fadeInDown").css("opacity", "1");
	});

	$(".homepage-slides").on("translated.owl.carousel", function () {
		$(".single-slide-item h1").addClass("animated fadeInUp").css("opacity", "1");
		$(".single-slide-item h6").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item p").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item a.main-btn").addClass("animated fadeInDown").css("opacity", "1");
	});
	$(".homepage-slides").on("translated.owl.carousel", function () {
		$(".single-slide-item h1").addClass("animated fadeInUp").css("opacity", "1");
		$(".single-slide-item h6").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item p").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item a.main-btn").addClass("animated fadeInDown").css("opacity", "1");
	});
	$(".homepage-slides").on("translated.owl.carousel", function () {
		$(".single-slide-item h1").addClass("animated fadeInUp").css("opacity", "1");
		$(".single-slide-item h6").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item p").addClass("animated fadeInDown").css("opacity", "1");
		$(".single-slide-item a.main-btn").addClass("animated fadeInDown").css("opacity", "1");
	});
  
});

</script>

<template>
    <div class="homepage-slides owl-carousel">
 		<div class="single-slide-item">
 			<div class="overlay"></div>
 			<div class="hero-area-content">
 				<div class="container">
 					<div class="row justify-content-center">
 						<div class="col-lg-12 wow fadeInUp animated" data-wow-delay=".2s">
 							<div class="section-title">
								<h6 class="text-white">Trip Jeju</h6>
 								<h1>제주도 관광지<br> 어디로 가야할까?</h1>
 								
 							</div>
 							<router-link :to="{name:'tour'}" class="main-btn">Learn More</router-link>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>

 		<div class="single-slide-item hero-area-bg-2">
 			<div class="overlay"></div>
 			<div class="hero-area-content">
 				<div class="container">
 					<div class="row justify-content-center">
 						<div class="col-lg-12 wow fadeInUp animated" data-wow-delay=".2s">
 							<div class="section-title">
								<h6 class="text-white">Trip Jeju</h6>
 								<h1>맛있는 음식<br> 찾으러 가기</h1>
 			
 							</div>
 							<router-link :to="{name:'food'}" class="main-btn">Learn More</router-link>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>

		 <div class="single-slide-item hero-area-bg-3">
 			<div class="overlay"></div>
 			<div class="hero-area-content">
 				<div class="container">
 					<div class="row justify-content-center">
 						<div class="col-lg-12 wow fadeInUp animated" data-wow-delay=".2s">
 							<div class="section-title">
								<h6 class="text-white">Trip Jeju</h6>
 								<h1>제주도 예쁜숙소<br> 가고싶을 땐?</h1>
 			
 							</div>
 							<router-link :to="{name:'lodge'}" class="main-btn">Learn More</router-link>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>

		 <div class="single-slide-item hero-area-bg-4">
 			<div class="overlay"></div>
 			<div class="hero-area-content">
 				<div class="container">
 					<div class="row justify-content-center">
 						<div class="col-lg-12 wow fadeInUp animated" data-wow-delay=".2s">
 							<div class="section-title">
								<h6 class="text-white">Trip Jeju</h6>
 								<h1>가족들 기념품<br> 구매하셨나요?</h1>
 			
 							</div>
 							<router-link :to="{name:'shop'}" class="main-btn">Learn More</router-link>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 	</div>
</template>