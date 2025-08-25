<template>
  <div
    class="blabla h-screen w-screen text-gray-700 bg-white flex items-center justify-center"
  >
    <form
      @submit.prevent="handleSignIn"
      class="flex flex-col shadow-2xl max-w-[700px] px-20 py-10 bg-white rounded-xl border-gray-200 space-y-6"
    >
      <h2 class="text-2xl font-semibold text-center">TimeLoger</h2>
      <input
        type="email"
        class="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your email"
        name="email"
        required
        id="email"
        v-model="email"
      />
      <input
        type="password"
        class="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your password"
        name="password"
        required
        id="password"
        v-model="password"
      />
      <button
        type="submit"
        class="rounded-2xl cursor-pointer py-4 px-20 w-full bg-green-300"
      >
        Login with credentials
      </button>
      <div class="mt-6 text-center">
        <button
          @click="auth.signInWithGoogle"
          class="w-full cursor-pointer bg-gray-800 text-white p-2 rounded-md hover:bg-gray-900 flex items-center justify-center gap-2"
          :disabled="auth.loading"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.854L12.545,10.239z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
      <p class="text-center">
        Don't have an account?
        <NuxtLink to="/auth/signup" class="text-green-500 cursor-pointer">
          Sign Up
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { NuxtLink } from "#components";
import { useRouter, useToast } from "#imports";

// Composables
const router = useRouter();
const toast = useToast();

// Refs
const email = ref<string>("");
const password = ref<string>("");
const auth = useAuthStore();
const { login, clearErrors } = auth;

// Functions
const handleSignIn = async () => {
  const response = await login(email.value, password.value);
  if (response.success) {
    router.push("/");
    toast.add({ color: "success", title: "Logged in successfully" });
  }
};

// Watchers
watch(
  () => auth.errorMessage,
  (newError) => {
    if (newError) {
      toast.add({
        color: "error",
        title: newError,
      });
      clearErrors();
    }
  }
);
watch(
  () => auth.isAuthenticated,
  (newVal) => {
    if (newVal) {
      router.push("/");
    }
  },
  { immediate: true }
);
</script>