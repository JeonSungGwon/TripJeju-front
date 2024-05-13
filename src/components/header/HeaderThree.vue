<script setup>

import { onMounted } from 'vue'

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

	$('.sticky-area').sticky({
		topSpacing: 0,
	});
  
});

</script>

<template>
    <header id="header-3" class="header-area absolate-header">
 		<div class="sticky-area">
 			<div class="navigation">
 				<div class="container">
 					<div class="row align-items-center">
 						<div class="col-lg-3">
 							<div class="logo"> 								
								 <router-link class="navbar-brand" :to="{name:'home3'}"><img src="/assets/img/logo-white.png" alt=""></router-link>
 							</div>
 						</div>
 						<div class="col-lg-6">
							<div class="main-menu">
 								<nav class="navbar navbar-expand-lg">
 									<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
 										<span class="navbar-toggler-icon"></span>
 										<span class="navbar-toggler-icon"></span>
 										<span class="navbar-toggler-icon"></span>
 									</button>

 									<div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
 										<ul class="navbar-nav m-auto">
 											<li class="nav-item">
 												<a class="nav-link active" href="#">Home
 													<span class="sub-nav-toggler">
 													</span>
 												</a>
 												<ul class="sub-menu">
 													<li><router-link :to="{name:'home'}">Home-Main</router-link></li>
 													<li><router-link :to="{name:'home2'}">Home-Industry</router-link></li>
 													<li><router-link :to="{name:'home3'}">Home-Construction</router-link></li>
 												</ul>
 											</li>

 											<li class="nav-item">
 												<a class="nav-link" href="#">Pages
 													<span class="sub-nav-toggler">
 													</span>
 												</a>
 												<ul class="sub-menu">
 													<li><router-link :to="{name:'about'}">About us</router-link></li>
 													<li><router-link :to="{name:'choose-us'}">Why Choose Us</router-link></li>
 													<li><router-link :to="{name:'team'}">Our Team</router-link></li>
 													<li><router-link :to="{name:'price'}">Pricing</router-link></li>
 													<li><router-link :to="{name:'faq'}">FAQ</router-link></li>
 												</ul>
 											</li>
 											<li class="nav-item">
 												<a class="nav-link" href="#">Services
 													<span class="sub-nav-toggler">
 													</span>
 												</a>
 												<ul class="sub-menu">
 													<li><router-link :to="{name:'service-1'}">Services-01</router-link></li>
 													<li><router-link :to="{name:'service-2'}">Services-02</router-link></li>
 													<li><router-link :to="{name:'service-details'}">Service Details</router-link></li>
 												</ul>

 											</li>

 											<li class="nav-item">
 												<a class="nav-link" href="#">Projects
 													<span class="sub-nav-toggler">
 													</span>
 												</a>
 												<ul class="sub-menu">
 													<li><router-link :to="{name:'project'}">Projects</router-link></li>
 													<li><router-link :to="{name:'project-details'}">Project Details</router-link></li>
 												</ul>
 											</li>

 											<li class="nav-item">
 												<a class="nav-link" href="#">Blog
 													<span class="sub-nav-toggler">
 													</span>
 												</a>
 												<ul class="sub-menu">
 													<li><router-link :to="{name:'blog'}">Blog</router-link></li>
 													<li><router-link :to="{name:'blog-details'}">Blog Details</router-link></li>
 												</ul>
 											</li>
 											<li class="nav-item">
 												<router-link class="nav-link" :to="{name:'contact'}">Contact</router-link>
 											</li>
 										</ul>

 									</div>
 								</nav>
 							</div>
 						</div>
 						<div class="col-lg-3 text-end">
 							<div class="header-right-content">
 								<router-link :to="{name:'contact'}" class="header-btn main-btn">Get a Quote</router-link>
 							</div>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 	</header>
</template>