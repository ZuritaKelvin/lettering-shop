# 🔐 Configuración de Autenticación - Lettering Shop

## Configuración completada

Se ha implementado un sistema completo de autenticación con Supabase local para tu e-commerce de ropa con lettering y caligrafía.

## ✅ Componentes implementados

### 1. **Páginas de autenticación**

- `/auth/sign-up` - Registro de nuevos usuarios
- `/auth/sign-in` - Inicio de sesión

### 2. **Componentes UI (shadcn/ui)**

- `Button` - Botones con variantes
- `Input` - Campos de entrada
- `Label` - Etiquetas de formulario
- `Card` - Tarjetas contenedoras

### 3. **Acciones del servidor**

- `signUp()` - Registrar nuevo usuario
- `signIn()` - Iniciar sesión
- `signOut()` - Cerrar sesión

### 4. **Middleware de protección**

- Protege rutas privadas
- Redirige usuarios no autenticados a `/auth/sign-in`
- Redirige usuarios autenticados desde `/auth/sign-in` y `/auth/sign-up` al home

### 5. **Base de datos**

Ya configurada con:

- Tabla `accounts` para información de usuario
- Trigger automático `setup_new_user` que crea una cuenta cuando se registra un usuario
- Row Level Security (RLS) configurado
- Políticas de acceso definidas

## 📋 Variables de entorno necesarias

Asegúrate de tener estas variables en tu archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54361
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_publica_aqui
```

### Obtener las claves de Supabase local:

1. Inicia Supabase local:

   ```bash
   pnpm supabase:start
   ```

2. Obtendrás una salida similar a:

   ```
   API URL: http://127.0.0.1:54361
   anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Crea el archivo `.env.local` en la raíz del proyecto:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54361
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<tu_anon_key>
   ```

## 🚀 Cómo usar

### 1. Iniciar Supabase (si no está corriendo)

```bash
pnpm supabase:start
```

### 2. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

### 3. Acceder a la aplicación

- Abre http://localhost:3000
- Serás redirigido a `/auth/sign-in` si no estás autenticado
- Regístrate en `/auth/sign-up` o inicia sesión en `/auth/sign-in`

## 🎨 Diseño

El diseño utiliza:

- **Gradientes** de purple a pink para el branding
- **Iconos** de Lucide React
- **TailwindCSS** para estilos
- **Diseño responsivo** que se adapta a móviles y desktop

## 🔒 Seguridad implementada

1. **Validación de formularios** con Zod
2. **Row Level Security (RLS)** en la base de datos
3. **Middleware** que protege rutas automáticamente
4. **Sesiones seguras** manejadas por Supabase
5. **Cookies HTTP-only** para tokens de autenticación

## 📊 Flujo de autenticación

### Registro:

1. Usuario completa el formulario en `/auth/sign-up`
2. Se validan los datos con Zod
3. Supabase crea el usuario en `auth.users`
4. Trigger automático crea el registro en `public.accounts`
5. Usuario es redirigido al home autenticado

### Inicio de sesión:

1. Usuario completa el formulario en `/auth/sign-in`
2. Se validan las credenciales
3. Supabase crea una sesión
4. Usuario es redirigido al home autenticado

### Protección de rutas:

1. Middleware intercepta cada request
2. Verifica si hay una sesión activa
3. Redirige según el estado de autenticación

## 🎯 Próximos pasos recomendados

1. **Página de perfil de usuario**: Mostrar y editar información de la cuenta
2. **Recuperación de contraseña**: Implementar flujo de reset password
3. **Página de productos**: Crear catálogo de productos
4. **Carrito de compras**: Sistema de shopping cart
5. **Checkout**: Integración con pasarela de pagos
6. **Dashboard**: Panel de administración para gestionar productos

## 📝 Comandos útiles de Supabase

```bash
# Ver estado de Supabase
pnpm supabase:status

# Parar Supabase
pnpm supabase:stop

# Resetear base de datos
pnpm supabase:reset

# Generar tipos TypeScript
pnpm supabase:typegen
```

## 🐛 Troubleshooting

### Error: "Invalid API key"

- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que Supabase está corriendo (`pnpm supabase:start`)

### Error: "Connection refused"

- Verifica que Docker esté corriendo
- Verifica que los puertos no estén ocupados (54361, 54362, etc.)
- Reinicia Supabase: `pnpm supabase:stop && pnpm supabase:start`

### No se crea la cuenta en `public.accounts`

- Verifica que la migración se aplicó correctamente
- Revisa los logs de Supabase para ver errores en el trigger

## 📚 Recursos

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)

---

¡Tu sistema de autenticación está listo! 🎉
