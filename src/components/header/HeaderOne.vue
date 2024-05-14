<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const nickname = ref(null);

const handleLogout = () => {
	// 로그아웃 시 로컬 스토리지에서 엑세스 토큰 삭제
	localStorage.removeItem("accessToken");
	// 로그인 버튼으로 변경
	nickname.value = null;
};

onMounted(() => {
	$(".navbar-toggler").on("click", function () {
		$(this).toggleClass("active");
	});

	$(".navbar-nav li a").on("click", function () {
		$(".sub-nav-toggler").removeClass("active");
	});

	var subMenu = $(".navbar-nav .sub-menu");

	if (subMenu.length) {
		subMenu
			.parent("li")
			.children("a")
			.append(function () {
				return '<button class="sub-nav-toggler"> <i class="fa fa-angle-down"></i> </button>';
			});

		var subMenuToggler = $(".navbar-nav .sub-nav-toggler");

		subMenuToggler.on("click", function () {
			$(this).parent().parent().children(".sub-menu").slideToggle();
			return false;
		});
	}

	$(".sticky-area").sticky({
		topSpacing: 0,
	});

	// Axios 요청
	// Existing code for menu toggler and Axios request
	axios
		.get("http://localhost:8080/users/myInfo", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
			},
		})
		.then((response) => {
			nickname.value = response.data.nickname;
		})
		.catch((error) => {
			// Do something with the error
		});

	const handleLogout = () => {
		// 로그아웃 시 로컬 스토리지에서 엑세스 토큰 삭제
		localStorage.removeItem("accessToken");
		// 로그인 버튼으로 변경
		$(".header-right-content").html(
			`<router-link :to="{name:'contact'}" class="header-btn main-btn">Login</router-link>`
		);
	};
});
</script>

<template>
	<header class="header-area">
		<div class="sticky-area">
			<div class="navigation">
				<div class="container">
					<div class="row align-items-center">
						<div class="col-lg-3">
							<div class="logo">
								<router-link class="navbar-brand" to="/"><img src="/assets/img/jeju/logo.png" width="100" height="150"
										alt="" /></router-link>
							</div>
						</div>
						<div class="col-lg-6">
							<div class="main-menu">
								<nav class="navbar navbar-expand-lg">
									<button class="navbar-toggler" type="button" data-bs-toggle="collapse"
										data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
										aria-expanded="false" aria-label="Toggle navigation">
										<span class="navbar-toggler-icon"></span>
										<span class="navbar-toggler-icon"></span>
										<span class="navbar-toggler-icon"></span>
									</button>

									<div class="collapse navbar-collapse justify-content-center"
										id="navbarSupportedContent">
										<ul class="navbar-nav m-auto">
											<li class="nav-item">
												<a class="nav-link" href="#">여행지
													<span class="sub-nav-toggler"> </span>
												</a>
												<ul class="sub-menu">
													<li>
														<router-link :to="{ name: 'home' }">관광지</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'home2' }">음식</router-link>
													</li>
													<li>
														<router-link
															:to="{ name: 'home3' }">숙박</router-link>
													</li>
													<li>
														<router-link
															:to="{ name: 'home3' }">쇼핑</router-link>
													</li>
												</ul>
											</li>

											<li class="nav-item">
												<router-link class="nav-link " :to="{ name: 'festival' }">축제 및 행사</router-link>
												<!-- <ul class="sub-menu">
													<li>
														<router-link :to="{ name: 'about' }">About us</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'choose-us' }">Why Choose
															Us</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'team' }">Our Team</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'price' }">Pricing</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'faq' }">FAQ</router-link>
													</li>
												</ul> -->
											</li>
											<li class="nav-item">
												<a class="nav-link" href="#">여행 게시판
													<span class="sub-nav-toggler"> </span>
												</a>
												<ul class="sub-menu">
													<li>
														<router-link
															:to="{ name: 'service-1' }">여행지 후기</router-link>
													</li>
													<li>
														<router-link
															:to="{ name: 'service-2' }">여행지 추천</router-link>
													</li>
		
												</ul>
											</li>

											<li class="nav-item">
												<a class="nav-link" href="#">나의 여행
													<span class="sub-nav-toggler"> </span>
												</a>
												<ul class="sub-menu">
													<li>
														<router-link :to="{ name: 'project' }">나의 여행일정</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'project-details' }">찜한 여행</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'project-details' }">나의 리뷰</router-link>
													</li>
													<li>
														<router-link :to="{ name: 'project-details' }">방문 여행지</router-link>
													</li>
												</ul>
											</li>

											
										</ul>
									</div>
								</nav>
							</div>
						</div>
						<div class="col-lg-3 text-end">
							<div class="header-right-content">
								<!-- 닉네임이 있는 경우 로그아웃 버튼을 렌더링하고, 아닌 경우 로그인 버튼을 렌더링합니다. -->
								<template v-if="nickname">
									<div>
										{{ nickname }}님 환영합니다.
										<button @click="handleLogout">로그아웃</button>
									</div>
								</template>
								<template v-else>
									<router-link :to="{ name: 'contact' }"
										class="header-btn main-btn">Login</router-link>
								</template>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
