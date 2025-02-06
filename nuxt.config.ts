// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxtjs/seo", // Módulo SEO debe estar antes de auth si usas redirecciones
    "@sidebase/nuxt-auth",
  ],

  // Configuración SEO
  site: {
    url: "https://localhost",
    name: "Virtual RT",
    description: "We are the shoop online. Check our products!",
    defaultLocale: 'es',
  },

  schemaOrg: {
    identity: {
      type: "Organization", // ⚠️ Tipo debe ser uno oficial: Organization o Person
      name: "Virtual RT",
      url: "https://localhost",
    },
  },

  css: ["@/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      BACKEND_URL: process.env.backend_url,
    },
  },

  auth: {
    baseURL: process.env.backend_url,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/api/user/login", method: "post" },
        signUp: { path: "/api/user/add-usuario", method: "post" },
        signOut: { path: "/api/user/logout", method: "post" },
        getSession: { path: "/api/user/me", method: "get" }
      },
      pages: {
        login: "/login"
      },
      session: {
        dataType: {
          id: 'number',
          email: 'string',
          phone_number: 'string',
          username: 'string',
          rol: "'administrador' | 'usuario'",
          twoFactorEnabled: "boolean",
        },
        dataResponsePointer: "/"
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        maxAgeInSeconds: 3600,
        type: "Bearer",
        headerName: "Authorization"
      },
    },
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true
    },
  },
  
  compatibilityDate: '2025-01-15'
});