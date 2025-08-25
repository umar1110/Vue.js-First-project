// // plugins/auth.client.ts
// import { useAuthStore } from "~/stores/auth.store";

// export default defineNuxtPlugin(async (nuxtApp) => {
//   const authStore = useAuthStore();

//   // only run once
//   await authStore.init();
// });

export default defineNuxtPlugin(async (nuxtApp) => {
  // Skip plugin when rendering error page
  if (nuxtApp.payload.error) return {}  
  const protectedRoutes = ["/timer"]

  const authStore = useAuthStore()
  const supabase = useSupabase()

  // ✅ Fetch Supabase session
  const { data, error } = await supabase.auth.getSession()

  if (data.session?.user) {
    const user = data.session.user
    authStore.setUser({
      id: user.id,
      name: user.user_metadata?.name || "",
      email: user.email || "",
      role: user.user_metadata?.role || "employee",
      avatar: user.user_metadata?.avatar || "",
    })
    authStore.setIsAuthenticated(true)
  } else {
    authStore.setIsAuthenticated(false)
  }

  authStore.setLoading(false)

  const loggedIn = computed(() => authStore.isAuthenticated)
  const redirectTo = useState('authRedirect')

  // ✅ Global route middleware
  addRouteMiddleware(
    'auth',
    (to) => {
      if (to.meta.auth && !loggedIn.value) {
        redirectTo.value = to.path
        return '/auth/login'
      }
    },
    { global: true }
  )

  const currentRoute = useRoute()

  // ✅ React to login/logout changes in client
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user
        authStore.setUser({
          id: user.id,
          name: user.user_metadata?.name || "",
          email: user.email || "",
          role: user.user_metadata?.role || "employee",
          avatar: user.user_metadata?.avatar || "",
        })
        authStore.setIsAuthenticated(true)
      } else {
        authStore.setUser(null)
        authStore.setIsAuthenticated(false)
      }
    })

    watch(loggedIn, async (isLoggedIn) => {
      if (!isLoggedIn && currentRoute.meta.auth) {
        redirectTo.value = currentRoute.path
        await navigateTo('/auth/login')
      }
    })
  }

  // ✅ Prevent logged-in users from visiting /auth/login
  if (loggedIn.value && currentRoute.path  === '/auth/login') {
    await navigateTo(redirectTo.value || '/')
  }
  if (!loggedIn.value && currentRoute.path === '/timer') {
    await navigateTo(redirectTo.value || '/auth/login')
  }
  

  return {
    provide: {
      auth: {
        loggedIn,
        user: computed(() => authStore.user),
        redirectTo,
      },
    },
  }
})
