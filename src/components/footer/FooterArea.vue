<template>
    <footer class="footer-area">
 		<div class="container">
 			<div class="footer-up">
 				<div class="row gy-5">
 					<div class="col-lg-3 col-md-6 col-sm-12">
 						<div class="logo">
 							<img src="/assets/img/logo-white.png" alt="dustrian-logo">
 						</div>
 						<p>We are the leaders in the building <br> construction and factories. We’re <br> around over the worldwide. </p>
 						<div class="social-area">
 							<a href=""><i class="lab la-facebook-f"></i></a>
 							<a href=""><i class="lab la-instagram"></i></a>
 							<a href=""><i class="lab la-twitter"></i></a>
 							<a href=""><i class="la la-skype"></i></a>
 						</div>
 					</div>
 					<div class="col-lg-2 offset-lg-1 col-md-6 com-sm-12">
 						<h5>Explore</h5>
 						<ul>
 							<li>
 								<router-link :to="{name:'about'}">About Company</router-link>
 								<router-link :to="{name:'project'}">Latest Projects</router-link>
 								<router-link to="/">Get a Quote</router-link>
 								<router-link :to="{name:'price'}">Pricing Guide</router-link>
 								<router-link :to="{name:'faq'}">Helpful FAQ</router-link>
 								<router-link :to="{name:'service-1'}">Services</router-link>
 							</li>
 						</ul>
 					</div>
 					<div class="col-lg-3 col-md-6 col-sm-12">
 						<h5>Services</h5>
 						<ul>
 							<li>
 								<router-link :to="{name:'service-details'}"><span>-</span> Construction Engineering</router-link>
 								<router-link :to="{name:'service-details'}"><span>-</span> Oil & Gas Refinery</router-link>
 								<router-link :to="{name:'service-details'}"><span>-</span> Mechanical Engineering</router-link>
 								<router-link :to="{name:'service-details'}"><span>-</span> Chemical Research</router-link>
 								<router-link :to="{name:'service-details'}"><span>-</span> Civil Engineering</router-link>
 							</li>
 						</ul>
 					</div>
 					<div class="col-lg-3 col-md-6">
 						<div class="subscribe-form">
 							<h5>Newsletter</h5>
 							<p>Sign Up now for latest news update</p>
 							<form>
 								<input type="email" placeholder="Your email">
 								<button class="main-btn">Subscribe</button>
 							</form>
 						</div>
 					</div>
 				</div>
 			</div>
 		</div>
 	</footer>
</template>