<template>
	<v-app-bar app color="primary" dark>
		<v-toolbar-title>Apollo Systems</v-toolbar-title>
		<v-spacer />

		<v-btn to="/launches" text>Launches</v-btn>
		<v-btn to="/rockets/rocketslist" text>Rockets</v-btn>

		<!-- Favorites Button with Counter -->
		<v-btn to="/favorites" text class="favorites-btn d-flex align-center">
			<span class="favorites-text me-5">⭐ Favorites</span>
			<v-badge v-if="favoritesCount > 0" :content="favoritesCount" color="pink" />
		</v-btn>
	</v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFavoritesStore } from '~/stores/favorites'

const favoritesStore = useFavoritesStore()
const favoritesCount = computed(() => favoritesStore.count)
</script>

<style scoped>
.favorites-btn {
	align-items: center;
}
.favorites-text {
	font-weight: 500;
}
</style>
