<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

interface Launch {
	id: string
	mission_name?: string
	launch_date_local?: string
	launch_site?: { site_name_long?: string }
	rocket?: {
		rocket_name?: string
		rocket_id?: string
		rocket?: { id?: string; name?: string } | null
	}
	details?: string
}

// GraphQL query
const GET_LAUNCHES = gql`
	query GetLaunches {
		launchesPast(limit: 200) {
			id
			mission_name
			launch_date_local
			launch_site {
				site_name_long
			}
			rocket {
				rocket_name
				rocket_type
				rocket {
					id
					name
				}
			}
			details
		}
	}
`

const { result, loading, error } = useQuery(GET_LAUNCHES)
const launches = computed<Launch[]>(() => result.value?.launchesPast || [])

// Filter + Sort state
const selectedYear = ref<string>('All')
const sortOrder = ref<'desc' | 'asc'>('desc')
const selectedRocket = ref<string>('All')

// Rocket list & mapping
const rocketsList = [
	{ id: 'falcon1', name: 'Falcon 1' },
	{ id: 'falcon9', name: 'Falcon 9' },
	{ id: 'falconheavy', name: 'Falcon Heavy' },
	{ id: 'starship', name: 'Starship' },
]

const rocketMap: Record<string, string> = {
	'Falcon 1': 'falcon1',
	'Falcon 9': 'falcon9',
	'Falcon Heavy': 'falconheavy',
	Starship: 'starship',
}

// Helper: get rocket ID for filtering/navigation
const getRocketId = (launch: Launch) => launch.rocket?.rocket?.id || launch.rocket?.rocket_id || null
const getRocketName = (launch: Launch) => launch.rocket?.rocket_name || launch.rocket?.rocket?.name || ''

// Filtered + Sorted Launches
const filteredLaunches = computed(() => {
	let filtered = launches.value

	if (selectedYear.value !== 'All') {
		filtered = filtered.filter(
			(l) =>
				l.launch_date_local &&
				new Date(l.launch_date_local).getFullYear() === Number(selectedYear.value),
		)
	}

	if (selectedRocket.value !== 'All') {
		filtered = filtered.filter((l) => rocketMap[getRocketName(l)] === selectedRocket.value)
	}

	return [...filtered].sort((a, b) => {
		const dateA = a.launch_date_local ? new Date(a.launch_date_local).getTime() : 0
		const dateB = b.launch_date_local ? new Date(b.launch_date_local).getTime() : 0
		return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
	})
})

// Launch years for filter
const launchYears = computed(() => {
	const years = launches.value
		.map((l) => (l.launch_date_local ? new Date(l.launch_date_local).getFullYear() : null))
		.filter((y): y is number => y !== null)
	return [
		'All',
		...Array.from(new Set(years))
			.sort((a, b) => b - a)
			.map(String),
	]
})

// Navigation
const router = useRouter()
const goToRocket = (launch: Launch) => {
	const rocketId = getRocketId(launch)
	if (!rocketId) return
	router.push(`/rockets/${rocketId}`)
}

// Format date nicely
const formatDate = (dateStr?: string) =>
	dateStr
		? new Date(dateStr).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		: 'Not Available'
</script>

<template>
	<v-container class="py-6" max-width="1200">
		<!-- Heading -->
		<v-row justify="center" class="mb-6">
			<v-col cols="12" class="text-center">
				<h1 class="text-h3 font-weight-bold mb-2">SpaceX Launches</h1>
				<p class="text-subtitle-1 text-grey">Explore past SpaceX missions and rockets</p>
			</v-col>
		</v-row>

		<!-- Filters -->
		<v-row class="mb-6" dense>
			<v-col cols="12" sm="6" md="3">
				<v-select
					v-model="selectedYear"
					:items="launchYears"
					label="Filter by Year"
					outlined
					dense
					clearable
				/>
			</v-col>
			<v-col cols="12" sm="6" md="3">
				<v-select
					v-model="selectedRocket"
					:items="[{ id: 'All', name: 'All Rockets' }, ...rocketsList]"
					item-title="name"
					item-value="id"
					label="Filter by Rocket"
					outlined
					dense
					clearable
				/>
			</v-col>
			<v-col cols="12" sm="6" md="3">
				<v-select
					v-model="sortOrder"
					:items="[
						{ label: 'Newest First', value: 'desc' },
						{ label: 'Oldest First', value: 'asc' },
					]"
					item-title="label"
					item-value="value"
					label="Sort by Date"
					outlined
					dense
				/>
			</v-col>
		</v-row>

		<!-- Loading/Error -->
		<v-row>
			<v-col v-if="loading" cols="12">
				<v-skeleton-loader type="card" class="mb-4" :loading="loading" />
			</v-col>
			<v-col v-if="error" cols="12">
				<v-alert type="error" dense>Error loading launches: {{ error.message }}</v-alert>
			</v-col>
		</v-row>

		<!-- Launch Cards -->
		<v-row>
			<v-col v-for="launch in filteredLaunches" :key="launch.id" cols="12" md="6" lg="4">
				<v-card class="mb-4 hoverable launch-card" elevation="3" @click="goToRocket(launch)">
					<v-card-title class="font-weight-bold text-primary">
						{{ launch.mission_name || 'Not Available' }}
					</v-card-title>
					<v-card-subtitle>📅 {{ formatDate(launch.launch_date_local) }}</v-card-subtitle>

					<v-card-text>
						<p>
							<strong>Launch Site:</strong>
							{{ launch.launch_site?.site_name_long || 'Not Available' }}
						</p>
						<p>
							<strong>Rocket:</strong>
							{{ launch.rocket?.rocket_name || 'Not Available' }}
						</p>
						<p class="text-truncate" style="max-height: 3em; overflow: hidden">
							<strong>Details:</strong>
							{{ launch.details || 'Not Available' }}
						</p>
					</v-card-text>

					<v-card-actions class="justify-center pb-2">
						<span class="text-caption font-medium text-primary" style="cursor: pointer">
							Click for more details ˅
						</span>
					</v-card-actions>
				</v-card>
			</v-col>

			<v-col v-if="!loading && filteredLaunches.length === 0" cols="12">
				<v-alert type="info" dense>No launches found with the selected filters.</v-alert>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.launch-card {
	cursor: pointer;
	transition: transform 0.2s;
}
.launch-card:hover {
	transform: scale(1.02);
}
.text-primary {
	color: #5c6bc0;
}
</style>
