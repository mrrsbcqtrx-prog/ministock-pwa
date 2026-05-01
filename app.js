// Configuración de Supabase
const SUPABASE_URL = 'https://tuglvhwytfwzuhxojufb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1Z2x2aHd5dGZ3enVoeG9qdWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjQzNjcsImV4cCI6MjA5MzIwMDM2N30.dwluBcqGxTdJD5YCUF7EfpZmUCgIofYJs3UhDi4144k'; // Copia la clave anon/public

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- AUTENTICACIÓN ----------
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// Redirigir si ya hay sesión (para la página de login)
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) window.location.href = 'dashboard.html';
  });
}

// Proteger páginas internas
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session.user;
}

// ---------- MANEJO DE FORMULARIO DE LOGIN (index.html) ----------
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const msgDiv = document.getElementById('message');
      const { data, error } = await signIn(email, password);
      if (error) {
        msgDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      } else {
        window.location.href = 'dashboard.html';
      }
    });
  }

  const signupLink = document.getElementById('signup-link');
  if (signupLink) {
    signupLink.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = prompt('Ingresa tu correo electrónico:');
      if (!email) return;
      const password = prompt('Crea una contraseña (mínimo 6 caracteres):');
      if (!password) return;
      const { data, error } = await signUp(email, password);
      const msgDiv = document.getElementById('message');
      if (error) {
        msgDiv.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
      } else {
        msgDiv.innerHTML = `<div class="alert alert-success">Registro exitoso. Revisa tu correo para confirmar. Luego inicia sesión.</div>`;
      }
    });
  }
});