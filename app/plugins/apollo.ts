import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

export default defineNuxtPlugin((nuxtApp) => {
	const httpLink = createHttpLink({
		uri: 'https://api.spacex.land/graphql/',
	})

	const apolloClient = new ApolloClient({
		link: httpLink,
		cache: new InMemoryCache(),
	})

	// Provide the Apollo client to the app
	nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient)
})
