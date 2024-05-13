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
    <header id="header-2" class="header-area">
 		<div class="container">
 			<div class="row align-items-center">
 				<div class="col-lg-3">
 					<div class="logo"> 						
						 <router-link class="navbar-brand" :to="{name:'home2'}"><img src="/assets/img/logo.png" alt=""></router-link>
 					</div>
 				</div>
 				<div class="col-lg-9 text-end">
 					<div id="header-aside">
 						<div class="aside-content">
 							<div class="inner">
 								<div class="info-one">
 									<div class="info-wrap">
 										<div class="info-i"><span><i class="las la-clock"></i></span></div>
 										<div class="info-c">Monday-Friday<br><span>08.00-20.00</span></div>
 									</div>
 								</div>
 								<div class="info-two">
 									<div class="info-wrap">
 										<div class="info-i"><span><i class="las la-map-marker"></i></span></div>
 										<div class="info-c">New York, USA<br><span>66, Broklyn St.</span></div>
 									</div>
 								</div>
 								<div class="info-three">
 									<div class="info-wrap">
 										<div class="info-i"><span><i class="las la-mobile"></i></span></div>
 										<div class="info-c">(+1)212-946-2064<br><span>info@dustrian.com</span></div>
 									</div>
 								</div>
 							</div>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 		<div class="container-fluid">
 			<div class="sticky-area">
 				<div class="navigation">
 					<div class="row">
 						<div class="col-lg-8">
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
 						<div class="col-lg-4 text-center">
 							<div class="header-right-content">
 								<router-link :to="{name:'contact'}"class="header-btn main-btn">Get a Quote</router-link>
 							</div>
 						</div>
 						<!-- Responsive Logo-->
 						<div class="col-md-4 col-sm-4">
 							<div class="responsive-logo">
 								<img src="/assets/img/logo.png" alt="dustrian-logo">
 							</div>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 	</header>
</template>