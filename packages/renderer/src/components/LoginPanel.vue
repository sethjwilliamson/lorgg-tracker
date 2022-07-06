<script lang="ts">
import { defineComponent } from "vue";
import { ipcRenderer } from "electron";
import Store from "electron-store";

const store = new Store();

export default defineComponent({
  data: function () {
    return {
      isAuthenticated: false,
    };
  },
  mounted: function () {
    ipcRenderer.on("token-received", (event) => {
      this.isAuthenticated = true;
    });
    ipcRenderer.on("token-revoked", (event) => {
      this.isAuthenticated = false;
    });

    this.isAuthenticated = store.has("token");
  },
  methods: {
    login: function () {
      ipcRenderer.send("login");
    },
    logout: function () {
      ipcRenderer.send("logout");
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
