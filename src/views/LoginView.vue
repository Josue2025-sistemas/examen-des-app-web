<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center px-3 py-5">
   <div class="card shadow border-0 rounded-4 login-card-width">
     <!-- Encabezado -->
     <div class="card-header bg-primary text-white text-center py-4 rounded-top-4 border-0">
       <div class="mb-3">
         <i class="bi bi-shield-lock-fill fs-2"></i>
       </div>
       <h4 class="mb-0 fw-bold">GestiónApp</h4>
       <small>Sistema de Gestión</small>
     </div>

     <div class="card-body p-4">
       <!-- Alerta de error -->
       <div v-if="errorMsg" class="alert alert-danger alert-dismissible fade show" role="alert">
         <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ errorMsg }}
         <button type="button" class="btn-close" @click="errorMsg = ''"></button>
       </div>

       <!-- Formulario de Login -->
       <div class="mb-3">
         <label class="form-label fw-semibold">
           <i class="bi bi-person-fill me-2 icon-accent"></i>Usuario
         </label>
         <input
           v-model="form.username"
           type="text"
           class="form-control form-control-lg"
           placeholder="Tu usuario"
           @keyup.enter="login"
           autocomplete="username"
         />
       </div>

       <div class="mb-4">
         <label class="form-label fw-semibold">
           <i class="bi bi-key-fill me-2" style="color: #2563eb;"></i>Contraseña
         </label>
         <div class="input-group input-group-lg">
           <input
             v-model="form.password"
             :type="showPassword ? 'text' : 'password'"
             class="form-control"
             placeholder="Tu contraseña"
             @keyup.enter="login"
             autocomplete="current-password"
           />
           <button
             class="btn btn-outline-secondary"
             type="button"
             @click="showPassword = !showPassword"
           >
             <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
           </button>
         </div>
       </div>

       <button
         class="btn btn-primary btn-lg w-100 fw-bold"
         @click="login"
         :disabled="loading"
       >
         <span v-if="loading">
           <span class="spinner-border spinner-border-sm me-2"></span>Verificando...
         </span>
         <span v-else>
           <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
         </span>
       </button>

      
     </div>

     <div class="card-footer text-center text-muted small py-3 rounded-bottom-4 bg-light border-0">
       Desarrollo de Aplicaciones Web
     </div>
   </div>
  </div>
</template>

<script>
import { usuariosService } from '../services/api.js'

export default {
  name: 'LoginView',
  data() {
   return {
     form: { username: '', password: '' },
     errorMsg: '',
     loading: false,
     showPassword: false
   }
  },
  methods: {
   async login() {
     if (!this.form.username || !this.form.password) {
       this.errorMsg = 'Por favor completa todos los campos.'
       return
     }

     this.loading = true
     this.errorMsg = ''

     try {
       const response = await usuariosService.getAll()
       const usuarios = response.data

       const usuarioEncontrado = usuarios.find(
         (u) =>
           u.username === this.form.username &&
           u.password === this.form.password
       )

       if (usuarioEncontrado) {
         sessionStorage.setItem('token', `token_${usuarioEncontrado.id}_${Date.now()}`)
         sessionStorage.setItem('username', usuarioEncontrado.username)
         
         this.$emit('login')
         this.$router.push('/productos')
       } else {
         this.errorMsg = 'Usuario o contraseña incorrectos.'
       }
     } catch (error) {
       this.errorMsg = 'Error al conectar con el servidor. Verifica tu conexión.'
       console.error('Login error:', error)
     } finally {
       this.loading = false
     }
   }
  }
}
</script>
