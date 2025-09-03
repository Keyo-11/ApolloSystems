export default defineNuxtRouteMiddleware((to) => {
	// If the route is not found, redirect to /launches
	if (!to.matched.length) {
		return navigateTo('/launches')
	}
})
