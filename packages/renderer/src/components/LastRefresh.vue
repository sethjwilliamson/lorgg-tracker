<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
import Store from "electron-store";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const store = new Store();

export default defineComponent({
  data: function () {
    return {
      lastRefresh: null as Dayjs | null,
      lastRefreshRelative: "" as String,
      relativeRefreshInterval: setInterval(() => {}),
    };
  },
  mounted: function () {
    ipcRenderer.on("match-history-refreshed", (event) => {
      this.updateLastRefresh();
    });

    this.updateLastRefresh();
    this.recomputeRelativeTime();

    this.relativeRefreshInterval = setInterval(
      this.recomputeRelativeTime,
      10000
    );
  },
  methods: {
    updateLastRefresh: function () {
      this.lastRefresh = dayjs(store.get("last-refresh") as string);
    },
    recomputeRelativeTime: function () {
      if (this.lastRefresh) {
        this.lastRefreshRelative = this.lastRefresh.fromNow();
      }
    },
  },
});
</script>

<template>
  <div class="last-refresh" v-if="lastRefresh">
    <span> Last Match History Refresh: <br />{{ lastRefreshRelative }} </span>
  </div>
</template>

<style scoped>
.last-refresh {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  text-align: center;
}
</style>
