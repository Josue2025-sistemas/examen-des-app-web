<template>
  <div>
    <nav v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container-fluid px-3 px-md-4">
        <span class="navbar-brand fw-bold">
          <i class="bi bi-gear-fill me-2"></i>GestiónApp
        </span>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/usuarios">
                <i class="bi bi-people-fill me-1"></i>Usuarios
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/productos">
                <i class="bi bi-box-seam-fill me-1"></i>Productos
              </router-link>
            </li>
          </ul>
          <div class="d-flex align-items-center gap-2">
            <small class="text-white">
              <i class="bi bi-person-circle me-1"></i>{{ username }}
            </small>
            <button class="btn btn-outline-light btn-sm" @click="logout">
              <i class="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>
        </div>
      </div>
    </nav>

    <router-view @login="onLogin" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: !!sessionStorage.getItem('token'),
      username: sessionStorage.getItem('username') || 'Usuario'
    }
  },
  methods: {
    onLogin() {
      this.isLoggedIn = true
      this.username = sessionStorage.getItem('username') || 'Usuario'
    },
    logout() {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('username')
      this.isLoggedIn = false
      this.$router.push('/login')
    }
  },
  watch: {
    $route() {
      this.isLoggedIn = !!sessionStorage.getItem('token')
      this.username = sessionStorage.getItem('username') || 'Usuario'
    }
  }
}
</script>