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
      isAuthenticated: false as Boolean,
      lastRefresh: null as Dayjs | null,
      lastRefreshRelative: "" as String,
      relativeRefreshInterval: setInterval(() => {}),
    };
  },
  mounted: function () {
    ipcRenderer.on("token-received", (event) => {
      this.isAuthenticated = true;
    });
    ipcRenderer.on("token-revoked", (event) => {
      this.isAuthenticated = false;
    });
    ipcRenderer.on("match-history-refreshed", (event) => {
      this.lastRefresh = dayjs(store.get("last-refresh") as string);
    });

    this.isAuthenticated = store.has("token");
    this.lastRefresh = dayjs(store.get("last-refresh") as string);
    this.recomputeRelativeTime();

    this.relativeRefreshInterval = setInterval(
      this.recomputeRelativeTime,
      1000
    );
  },
  methods: {
    login: function () {
      ipcRenderer.send("login");
    },
    logout: function () {
      ipcRenderer.send("logout");
    },
    recomputeRelativeTime: function () {
      console.log("TEST");
      if (this.lastRefresh) {
        this.lastRefreshRelative = this.lastRefresh.fromNow();
      }
    },
  },
});
</script>

<template>
  <div class="login-panel">
    <template v-if="isAuthenticated">
      <span>Logged In</span>
      <button type="button" @click="logout()">Logout</button>
    </template>
    <template v-else>
      <span>Not Logged In</span>
      <button type="button" @click="login()">Login</button>
    </template>

    <template v-if="lastRefresh">
      <span> Last Refresh: {{ lastRefreshRelative }} </span>
    </template>
  </div>
</template>

<style scoped>
.login-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}
</style>
