<template>
  <main>
    <header
      class="py-4 px-3 bg-[#141414] w-full items-center flex justify-between"
    >
      <div v-if="existingTimeLogLoading">
        <USkeleton class="h-8 w-70" />
      </div>
      <div v-else class="w-[40%]">
        <input
          v-model="existingTimeLog.description"
          class="focus:outline-none focus:ring-0 text-gray-400 text-2xl w-full"
          placeholder="What are you working on ?"
        />
      </div>
      <div v-if="existingTimeLogLoading">
        <USkeleton class="h-8 w-40" />
      </div>
      <div v-else class="flex items-center space-x-4">
        <p class="text-xl">
          {{ formatSecondsToTime(existingTimeLog.durationSec) }}
        </p>
        <button
          :disabled="existingTimeLogLoading"
          @click="handleStopRunningTimeOff"
          v-if="existingTimeLog.status == 'RUNNING'"
          class="w-10 cursor-pointer h-10 rounded-full bg-white flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 1200 1200"
          >
            <path
              fill="#000"
              d="M600 0C268.629 0 0 268.629 0 600s268.629 600 600 600s600-268.629 600-600S931.371 0 600 0M300 300h600v600H300z"
            />
          </svg>
        </button>
        <button
          @click="handleStartNewTimeLog"
          :disabled="existingTimeLogLoading"
          v-else
          class="w-10 cursor-pointer h-10 rounded-full bg-white flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="96"
            height="96"
            viewBox="0 0 24 24"
          >
            <path
              fill="#000"
              d="M7.23 16.616V7.385h1v9.23zm3.386 0L18.327 12l-7.712-4.615z"
            />
          </svg>
        </button>
      </div>
    </header>

    <section class="p-4">
      <h2 class="text-2xl font-semibold text-center">Time Logs <span v-if="!allTimeLogsLoading" > ({{ allTimeLogs.length }}) </span> </h2>
      <div v-if="allTimeLogsLoading" class="space-y-4 my-5 px-3">
        <!-- 10 skeletons with map -->
        <USkeleton class="h-8 w-full" v-for="index in 10" :key="index" />
      </div>
      <div v-else>
        <div v-if="allTimeLogs.length === 0" class="my-5 px-3">
          <p class="text-gray-400">No time logs found.</p>
        </div>
        <div v-else class="space-y-6 my-5">
          <div
            v-for="(logGroup, index) in allTimeLogs"
            :key="index"
            class="space-y-3"
          >
            <h3 class="text-xl font-medium">
              {{ logGroup.date }}
            </h3>
            <div class="space-y-2">
              <div
                v-for="log in logGroup.logs"
                :key="log.id"
                class="p-3 border border-gray-700 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p class="font-semibold">
                    {{ log.description || "No description" }}
                  </p>
                  <p>
                    <span class="text-gray-400">By: </span>
                    <span class="text-sm text-gray-500">{{
                      log.user?.name || "Unknown"
                    }}</span>
                  </p>
                </div>
                <div class="text-right flex space-x-10">
                  <p class="text-sm text-gray-400">
                    {{
                      new Date(log.startTime!).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    }}
                    -
                    {{
                      log.endTime
                        ? new Date(log.endTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Ongoing"
                    }}
                  </p>

                  <p class="text-sm text-gray-400">
                    {{ formatSecondsToTime(log.durationSec) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  getAlltimeLogsOfProjectAction,
  getRunningTimeLogAction,
  startNewTimeOffAction,
  stopRunningTimeLogAction,
} from "~/actions/timeLogsAcitons";
import routes from "~/constants/routes";
import type { TimeLogsType } from "~/types/timeLogs.types";

// Composables
const route = useRoute();
const projectId = route.params.id as string;
const toast = useToast();
// Refs
const existingTimeLogLoading = ref(true);
const startingNewTimeLog = ref(false);
const existingTimeLog = reactive<TimeLogsType>({
  id: undefined,
  description: "",
  durationSec: 0,
  status: "STOPPED",
});
const allTimeLogs = ref<{ date: string; logs: TimeLogsType[] }[]>([]);
const allTimeLogsLoading = ref(true);
let timer: NodeJS.Timeout | null = null;

// Functions
function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    existingTimeLog.durationSec++;
  }, 1000);
}
function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
const getRunningTimeOff = async () => {
  try {
    existingTimeLogLoading.value = true;
    if (!projectId) {
      navigateTo(routes.client.project.assigned.index);
      return;
    }
    const response = await getRunningTimeLogAction(projectId);
    if (response.statusCode === 200) {
      existingTimeLog.description = response.timeLog.description;
      existingTimeLog.status = response.timeLog.status;
      existingTimeLog.id = response.timeLog.id;
      // Get secs from currect time
      const currentTime = Date.now();
      const startTime = new Date(response.timeLog.startTime).getTime();
      existingTimeLog.durationSec = Math.floor(
        (currentTime - startTime) / 1000
      );
      if (existingTimeLog.status === "RUNNING") {
        startTimer();
      } else {
        stopTimer();
      }
    }
  } catch (error) {
    stopTimer();
  } finally {
    existingTimeLogLoading.value = false;
  }
};
const handleStopRunningTimeOff = async () => {
  try {
    if (!existingTimeLog.id) return;
    toast.add({
      color: "info",
      title: "Stopping timer...",
    });
    const response = await stopRunningTimeLogAction(
      existingTimeLog.id,
      existingTimeLog.description
    );
    toast.clear();
    if (response.statusCode === 200) {
      existingTimeLog.status = "STOPPED";
      existingTimeLog.description = "";
      existingTimeLog.durationSec = 0;
      existingTimeLog.id = undefined;
      stopTimer();
      toast.add({
        color: "success",
        title: "Timer stopped successfully",
      });
      // Add Time log in Today's
      const updatedTimeLogs = allTimeLogs.value.map((day) => {
        if (day.date === "Today") {
          return {
            ...day,
            logs: [response.timeLog, ...day.logs],
          };
        }
        return day;
      });
      allTimeLogs.value = updatedTimeLogs;
    } else {
      toast.add({
        color: "error",
        title: response.message,
      });
    }
  } catch (error) {
    toast.clear();
    toast.add({
      color: "error",
      title: "Something went wrong",
    });
  }
};
const handleStartNewTimeLog = async () => {
  try {
    startingNewTimeLog.value = true;
    toast.add({
      color: "info",
      title: "Starting timer...",
    });
    const response = await startNewTimeOffAction(
      projectId,
      existingTimeLog.description
    );
    console.log(response);
    toast.clear();
    if (response.statusCode === 201) {
      existingTimeLog.id = response.timeLog.id;
      existingTimeLog.status = response.timeLog.status;
      existingTimeLog.description = response.timeLog.description;
      existingTimeLog.durationSec = 0;
      startTimer();
      toast.add({
        color: "success",
        title: "Timer started successfully",
      });
    } else {
      toast.clear();
      toast.add({
        color: "error",
        title: response.message || "Something went wrong",
      });
    }
  } catch (error) {
    toast.clear();
    toast.add({
      color: "error",
      title: "Something went wrong",
    });
  } finally {
    startingNewTimeLog.value = false;
  }
};
const fetchAllTimeLogs = async () => {
  try {
    allTimeLogsLoading.value = true;
    const response = await getAlltimeLogsOfProjectAction(projectId);
    if (response.statusCode === 200) {
      allTimeLogs.value = response.timeLogs;
    } else {
      toast.add({
        color: "error",
        title: response.message || "Something went wrong",
      });
      navigateTo(routes.client.project.assigned.index);
    }
  } catch (error) {
    toast.add({
      color: "error",
      title: "Something went wrong",
    });
  } finally {
    allTimeLogsLoading.value = false;
  }
};
watch(
  () => projectId,
  () => {
    getRunningTimeOff();
    fetchAllTimeLogs();
  },
  { immediate: true }
);

onUnmounted(() => {
  stopTimer();
});
</script>
