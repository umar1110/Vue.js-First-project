<script setup lang="ts">
import { NuxtLink } from "#components";
import { storeToRefs } from "pinia";

// Composables or plugins
const router = useRouter();
const toast = useToast();
// Refs
const email = ref<string>("");
const password = ref<string>("");
const name = ref<string>("");
const auth = useAuthStore();
const { signUp, clearErrors } = auth;
const { errorMessage, isAuthenticated, loading } = storeToRefs(auth);


// Functions
const handleSignUp = async () => {
  await signUp(name.value, email.value, password.value, "employee");
};

// Watches
watch(errorMessage, (newError) => {
  if (newError) {
    toast.add({
      color: "error",
      title: newError,
    });
    clearErrors();
  }
});
watch(isAuthenticated, (newVal) => {
  if (newVal) {
    toast.add({
      color: "success",
      title: "Registration successful!",
    });
    router.push("/");
  }
},{immediate: true});


</script>

<template>
  <div
    class="blabla h-screen w-screen text-gray-700 bg-white flex items-center justify-center"
  >
    <form
      @submit.prevent="handleSignUp"
      class="flex flex-col shadow-2xl max-w-[700px] px-20 py-10 bg-white rounded-xl border-gray-200 space-y-6"
    >
      <h2 class="text-2xl font-semibold text-center">TimeLoger</h2>
      <input
        type="text"
        class="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your name"
        name="name"
        id="name"
        v-model="name"
      />
      <input
        type="email"
        class="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your email"
        name="email"
        id="email"
        v-model="email"
      />
      <input
        type="password"
        class="border text-black border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="Enter your password"
        name="password"
        id="password"
        v-model="password"
      />
      <!-- Make it type submit -->
      <button type="submit" class="rounded-2xl py-4 px-32 w-full bg-green-300">
        Sign Up
      </button>
      <p class="text-center">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-green-500 cursor-pointer">
          Sign In
        </NuxtLink>
      </p>
    </form>
  </div>
</template>
