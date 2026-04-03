# Dashboard PBA (OpenPBA)

**Dashboard PBA** es una plataforma interactiva y open-source diseñada para explorar, visualizar y analizar datos públicos de la Provincia de Buenos Aires. Construida por el **Laboratorio Colossus**, esta herramienta facilita la transparencia y el acceso ciudadano a más de 140 conjuntos de datos gubernamentales a través de una interfaz moderna y de alto rendimiento.

## 🚀 Características Principales

- **Explorador de Datos Interactivo**: Permite sumergirse en cientos de bases de datos utilizando una interfaz de usuario fluida basada en React y CSS modular.
- **Motor de Datos Serverless**: Totalmente integrado con PostgreSQL (Vercel Postgres/Neon) en la nube, garantizando consultas rápidas mediante paginación dinámica sin agotar la memoria del navegador.
- **Diseño Glassmorphism**: Una estética elegante y responsiva inspirada en interfaces premium modernas (modo oscuro, gradientes armónicos y desenfoques).
- **Inyección ETL Automatizada**: Incluye un script en Python robusto (`csv_to_db.py`) capaz de ingerir gigabytes de información en CSV directamente a PostgreSQL, mapeando catálogos automáticamente y gestionando reintentos ante caídas de red.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, Vite, Recharts, Custom CSS (sin dependencias excesivas).
- **Backend / API**: Funciones Serverless de Vercel/Node.js.
- **Base de Datos**: Vercel Postgres / Neon Serverless.
- **Scripts de Datos**: Python, Pandas, SQLAlchemy.

## 💻 Instalación y Desarrollo Local

Para correr este proyecto en tu propia máquina, necesitarás Node.js y acceso a una base de datos PostgreSQL.

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/colossus-lab/monitor-pba.git
   cd monitor-pba
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar el entorno**
   Crea un archivo `.env.local` en la raíz del proyecto y agrega el string de conexión de tu base de datos:
   ```env
   POSTGRES_URL="postgres://usuario:contraseña@host:puerto/base_de_datos"
   ```

4. **Levantar el servidor local**
   Para emular correctamente las rutas de la API en local, te recomendamos utilizar Vercel CLI:
   ```bash
   npm install -g vercel
   vercel dev
   ```

5. **Inyección de Datos (Opcional)**
   Si necesitás inyectar los catálogos en tu base de datos, revisá el script de Python:
   ```bash
   pip install pandas psycopg2-binary sqlalchemy
   python csv_to_db.py
   ```

## ⚖️ Licencia

Distribuido bajo la Licencia **MIT**. Abierto a la comunidad para ser auditado, mejorado, y desplegado libremente. 

Desarrollado con ❤️ por el **Laboratorio Colossus**.
