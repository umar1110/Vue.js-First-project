<script setup lang="ts">
import { storeToRefs } from "pinia";
const email = ref<string>("");
const password = ref<string>("");
const name = ref<string>("");
const activeTab = ref<"login" | "sign-up">("login");
const auth = useAuthStore();
const router = useRouter();
const { login, signUp, clearErrors } = auth;
const { errorMessage, isAuthenticated, loading } = storeToRefs(auth);

const toast = useToast();

const handleSignIn = async () => {
  const response = await login(email.value, password.value);

  if (response.success) {
    router.push("/"); 
    toast.add({
      color: "success",
      title: "Login successful!",
    });
  }
};

const handleSignUp = async () => {
  await signUp(name.value, email.value, password.value, "employee");
};

// if error than prompt error and clear the error again
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
    router.push("/");
  }
});
</script>

<template>
  <div
    class="blabla h-screen w-screen text-gray-700 bg-white flex items-center justify-center"
  >
    <form
      @submit.prevent="handleSignIn"
      v-if="activeTab == 'login'"
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
      <p class="text-center">
        Don't have an account?
        <span
          class="text-green-500 cursor-pointer"
          @click="activeTab = 'sign-up'"
        >
          Sign Up
        </span>
      </p>
    </form>
    <form
      @submit.prevent="handleSignUp"
      v-if="activeTab == 'sign-up'"
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
        <span
          class="text-green-500 cursor-pointer"
          @click="activeTab = 'login'"
        >
          {{ loading ? "Signing Up..." : "Sign Up" }}
        </span>
      </p>
    </form>
  </div>
</template>
