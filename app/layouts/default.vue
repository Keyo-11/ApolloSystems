<script>
import AppFooter from '~/components/footer.vue'
import Navbar from '~/components/navbar.vue'

export default {
	name: 'DefaultLayout',
	components: {
		Navbar,
		AppFooter,
	},
}
</script>

<template>
	<v-app>
		<!-- Navbar at the top -->
		<Navbar />

		<v-main>
			<slot />
		</v-main>

		<!-- Footer at the bottom -->
		<AppFooter />
	</v-app>
</template>
