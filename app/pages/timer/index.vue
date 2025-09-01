<script setup lang="ts">
import { getAssignedProjectsWithTasksAction } from "~/actions/projectActions";
import { computed } from "vue";

import {
  getAlltimeLogsOfProjectAction,
  getRunningTimeLogAction,
  startNewTimeOffAction,
  stopRunningTimeLogAction,
} from "~/actions/timeLogsAcitons";
import routes from "~/constants/routes";
import type { TimeLogsType } from "~/types/timeLogs.types";

// Composables
const toast = useToast();
// Refs
const existingTimeLogLoading = ref(true);
const startingNewTimeLog = ref(false);
const existingTimeLog = reactive<TimeLogsType>({
  id: undefined,
  description: "",
  durationSec: 0,
  status: "STOPPED",
  project: undefined,
  task: undefined,
});
const projectsWithTasks = ref<
  {
    id: string;
    name: string;
    color: string;
    tasks: { id: string; title: string }[];
  }[]
>([]);
const allTimeLogs = ref<{ date: string; logs: TimeLogsType[] }[]>([]);
const allTimeLogsLoading = ref(true);
let timer: NodeJS.Timeout | null = null;
const booleans = reactive({
  isAssignProjectModalOpen: false,
});

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

    const response = await getRunningTimeLogAction();
    if (response.statusCode === 200) {
      existingTimeLog.description = response.timeLog.description;
      existingTimeLog.status = response.timeLog.status;
      existingTimeLog.id = response.timeLog.id;
      existingTimeLog.project = response.timeLog.project;
      existingTimeLog.task = response.timeLog.task;
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
    const response = await stopRunningTimeLogAction({
      timeLogId: existingTimeLog.id,
      description: existingTimeLog.description,
      projectId: existingTimeLog.project?.id,
      taskId: existingTimeLog.task?.id,
    });
    toast.clear();
    if (response.statusCode === 200) {
      existingTimeLog.status = "STOPPED";
      existingTimeLog.description = "";
      existingTimeLog.durationSec = 0;
      existingTimeLog.id = undefined;
      existingTimeLog.project = response.timeLog.project;
      existingTimeLog.task = response.timeLog.task;
      stopTimer();
      toast.add({
        color: "success",
        title: "Timer stopped successfully",
      });
      // Add Time log in Today's

      const today = "Today";

      let found = false;
      const updatedTimeLogs = allTimeLogs.value.map((day) => {
        if (day.date === today) {
          found = true;
          return {
            ...day,
            logs: [response.timeLog, ...day.logs],
          };
        }
        return day;
      });

      if (!found) {
        // If "Today" doesn't exist, create it and add at the top
        allTimeLogs.value = [
          {
            date: today,
            logs: [response.timeLog],
          },
          ...updatedTimeLogs,
        ];
      } else {
        allTimeLogs.value = updatedTimeLogs;
      }
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
    const response = await startNewTimeOffAction({
      description: existingTimeLog.description,
      projectId: existingTimeLog.project?.id,
      taskId: existingTimeLog.task?.id,
    });
    toast.clear();
    if (response.statusCode === 201) {
      existingTimeLog.id = response.timeLog.id;
      existingTimeLog.status = response.timeLog.status;
      existingTimeLog.description = response.timeLog.description;
      existingTimeLog.durationSec = 0;
      existingTimeLog.project = response.timeLog.project;
      existingTimeLog.task = response.timeLog.task;
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
    const response = await getAlltimeLogsOfProjectAction();
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
const fetchAssignedProjectsWithTasks = async () => {
  try {
    const response = await getAssignedProjectsWithTasksAction();
    if (response.statusCode == 200) {
      projectsWithTasks.value = response.projects;
    } else {
      toast.add({
        color: "error",
        title: response.message || "Failed to load projects and tasks",
      });
    }
  } catch (error) {
    toast.add({
      color: "error",
      title: "Failed to load projects and tasks",
    });
  }
};

const accordionItems = computed(() =>
  projectsWithTasks.value.map((p) => ({
    label: `${p.name} · ${p.tasks.length} task${
      p.tasks.length === 1 ? "" : "s"
    }`,
    // store original project on `meta` so the slot can use it
    meta: p,
  }))
);
onMounted(() => {
  getRunningTimeOff();
  fetchAllTimeLogs();
  fetchAssignedProjectsWithTasks();
});
onUnmounted(() => {
  stopTimer();
});
</script>

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

      <div class="flex items-center space-x-8">
        <button
          @click="
            {
              booleans.isAssignProjectModalOpen = true;
            }
          "
          class="cursor-pointer"
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 192.00 192.00"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="#ffffff"
            stroke-width="2.88"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fill="#ffffff"
                d="m80 38 4.243-4.243A6 6 0 0 0 80 32v6Zm16 16-4.243 4.243A6 6 0 0 0 96 60v-6Zm58 94H38v12h116v-12ZM28 138V54H16v84h12Zm10-94h42V32H38v12Zm37.757-1.757 16 16 8.486-8.486-16-16-8.486 8.486ZM164 70v68h12V70h-12ZM96 60h58V48H96v12Zm-58 88c-5.523 0-10-4.477-10-10H16c0 12.15 9.85 22 22 22v-12Zm116 12c12.15 0 22-9.85 22-22h-12c0 5.523-4.477 10-10 10v12Zm22-90c0-12.15-9.85-22-22-22v12c5.523 0 10 4.477 10 10h12ZM28 54c0-5.523 4.477-10 10-10V32c-12.15 0-22 9.85-22 22h12Z"
              ></path>
            </g>
          </svg>
        </button>
        <div>
          <div
            v-if="existingTimeLog.task && existingTimeLog.project"
            :style="{ color: existingTimeLog?.project?.color }"
          >
            {{ existingTimeLog?.project?.name }} :
            {{ existingTimeLog?.task?.title }}
          </div>
          <div
            v-else-if="existingTimeLog?.project"
            class="text-xs"
            :style="{ color: existingTimeLog?.project?.color }"
          >
            {{ existingTimeLog?.project?.name }}
          </div>
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
      </div>
    </header>

    <section class="p-4">
      <h2 class="text-2xl font-semibold text-center">
        Time Logs
        <span v-if="!allTimeLogsLoading"> ({{ allTimeLogs.length }}) </span>
      </h2>
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
                    <span class="text-gray-400">Project: </span>
                    <span
                      v-if="log.task"
                      :style="{ color: log.project?.color }"
                      class="text-sm"
                    >
                      {{
                        log.project?.name + " : " + log.task?.title || "Unknown"
                      }}
                    </span>
                    <span
                      v-else-if="log.project"
                      :style="{ color: log.project?.color }"
                      class="text-sm"
                    >
                      {{ log.project?.name || "Unknown" }}
                    </span>
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
  <UModal
    title="Add Time Off In"
    :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
    v-model:open="booleans.isAssignProjectModalOpen"
  >
    <template #content>
      <div class="p-6 min-h-60 min-w-60">
        <!-- Accordion built from projectsWithTasks -->
        <UAccordion :items="accordionItems">
          <!-- body slot receives the item (our object with label + meta) -->
          <template #body="{ item }">
            <div class="p-2">
              <!-- top row inside the panel: show project header + select button -->
              <div class="flex items-center justify-between px-3 py-2">
                <div class="flex items-center gap-3 min-w-0">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    :style="{ backgroundColor: item.meta.color || '#0ea5a4' }"
                  >
                    <span class="text-xs font-medium text-white">
                      {{ item.meta.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div class="min-w-0">
                    <div
                      class="text-sm font-semibold truncate"
                      :title="item.meta.name"
                    >
                      {{ item.meta.name }}
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ item.meta.tasks.length }} task{{
                        item.meta.tasks.length === 1 ? "" : "s"
                      }}
                    </div>
                  </div>
                </div>

                <!-- Select project button (inline assignment) -->
                <button
                  class="ml-3 px-2 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700"
                  @click.stop="
                    (existingTimeLog.project = {
                      id: item.meta.id,
                      name: item.meta.name,
                      color: item.meta.color,
                    }),
                      (existingTimeLog.task = undefined),
                      (booleans.isAssignProjectModalOpen = false)
                  "
                >
                  Select project
                </button>
              </div>

              <div class="border-t border-gray-800 mt-2"></div>

              <!-- Tasks list -->
              <div class="mt-2 max-h-48 overflow-auto">
                <button
                  v-for="task in item.meta.tasks"
                  :key="task.id"
                  class="w-full text-left px-3 py-2 hover:bg-gray-800 flex items-center justify-between gap-2"
                  @click.stop="
                    (existingTimeLog.project = {
                      id: item.meta.id,
                      name: item.meta.name,
                      color: item.meta.color,
                    }),
                      (existingTimeLog.task = {
                        id: task.id,
                        title: task.title,
                      }),
                      (booleans.isAssignProjectModalOpen = false)
                  "
                >
                  <div class="min-w-0">
                    <div class="text-sm truncate">{{ task.title }}</div>
                  </div>

                  <div
                    v-if="existingTimeLog.task?.id === task.id"
                    class="text-primary text-sm"
                  >
                    <UIcon name="i-lucide-check" class="size-4" />
                  </div>
                </button>

                <!-- if no tasks, show helpful CTA (should never be inside the panel if 0 tasks; accordion label will show 0) -->
                <div
                  v-if="item.meta.tasks.length === 0"
                  class="p-3 text-sm text-gray-400"
                >
                  No tasks for this project.
                </div>
              </div>
            </div>
          </template>
        </UAccordion>
      </div>
    </template>
  </UModal>
</template>
