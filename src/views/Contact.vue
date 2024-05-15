<script setup>
import { HeaderOne, BreadCrumb } from "../components";
</script>

<template>
	<div>
	  <HeaderOne/>
	  <div class="container">
		<div class="row">
		  <div class="col-lg-12">
			<div class="login-title text-center" style="padding: 30px; margin: 30px;">
			  <h2>로그인</h2>
			  <p>로그인하려면 아래를 누르십시오</p>
			  <div class="login-buttons">
				<!-- 카카오 로그인 버튼 -->
				<p><img src="/assets/img/logo/kakao_login_large_narrow.png" alt="카카오 로그인" @click="redirectToKakao" style="cursor: pointer; width: 150px; height: 50px;"></p>
				<!-- 네이버 로그인 버튼 -->
				<p><img src="/assets/img/logo/btnG_naver.png" alt="네이버 로그인" @click="redirectToNaver" style="cursor: pointer; width: 150px; height: 50px;"></p>
				<!-- 구글 로그인 버튼 -->
				<p><img src="/assets/img/logo/web_light_sq_ctn@1x.png" alt="구글 로그인" @click="redirectToGoogle" style="cursor: pointer; width: 150px; height: 50px;"></p>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
	</div>
</template>

<script>
export default {
	methods: {
      redirectToGoogle() {
        window.location.href = 'http://localhost:8080/oauth2/authorization/google';
      },
      redirectToNaver() {
        window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
      },
      redirectToKakao() {
        window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
      }
    }
  }
</script>
