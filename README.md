# 🎨 Lettering Shop

E-commerce de ropa única con diseños de lettering y caligrafía.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Base de datos**: Supabase (local con Docker)
- **Autenticación**: Supabase Auth
- **Estilos**: TailwindCSS + shadcn/ui
- **Lenguaje**: TypeScript
- **Iconos**: Lucide React

## ✨ Características Implementadas

- ✅ Sistema de autenticación completo (registro e inicio de sesión)
- ✅ Protección de rutas con middleware
- ✅ Base de datos con Row Level Security (RLS)
- ✅ Interfaz moderna y responsiva
- ✅ Gestión de cuentas de usuario

## 📋 Requisitos Previos

- Node.js 20+
- pnpm
- Docker Desktop (para Supabase local)

## 🛠️ Instalación

1. **Clonar e instalar dependencias**:
```bash
pnpm install
```

2. **Configurar variables de entorno**:
```bash
# Copiar el archivo de ejemplo
cp env.example.txt .env.local

# Iniciar Supabase local
pnpm supabase:start

# Copiar el "anon key" mostrado en la terminal y pegarlo en .env.local
```

3. **Iniciar el servidor de desarrollo**:
```bash
pnpm dev
```

4. **Abrir en el navegador**: [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo

# Supabase
pnpm supabase:start   # Iniciar Supabase local
pnpm supabase:stop    # Detener Supabase
pnpm supabase:status  # Ver estado de Supabase
pnpm supabase:reset   # Resetear base de datos
pnpm supabase:typegen # Generar tipos TypeScript

# Build
pnpm build            # Compilar para producción
pnpm start            # Iniciar servidor de producción
```

## 📖 Documentación

Para información detallada sobre el sistema de autenticación, consulta [CONFIGURACION_AUTH.md](./CONFIGURACION_AUTH.md)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
