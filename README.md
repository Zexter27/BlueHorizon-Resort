

![](blueHorizon.png)

## 📋 Descripción

**BlueHorizon Resort API** es una API REST desarrollada con **NestJS, TypeORM y MySQL** para automatizar la gestión de un hotel boutique frente al mar.

El sistema busca solucionar problemas relacionados con la gestión manual de habitaciones, estadías y consumos, especialmente:

* Sobreventa de habitaciones.
* Dificultad para conocer la disponibilidad real.
* Falta de organización de las habitaciones por categoría.
* Falta de control sobre los huéspedes registrados.
* Falta de control sobre los servicios y consumos adicionales.
* Dificultad para conocer el valor acumulado de la cuenta de un huésped.

La API está diseñada bajo una arquitectura modular y utiliza **DTOs, validación de datos, inyección de dependencias, repositorios de TypeORM y reglas de negocio en el backend**.

---

# 🎯 Objetivo del Proyecto

Desarrollar una API REST que permita automatizar y centralizar la gestión hotelera mediante:

* Gestión de tipos de habitación.
* Gestión de habitaciones físicas.
* Registro y administración de huéspedes.
* Creación y administración de estadías.
* Control de disponibilidad de habitaciones.
* Prevención de sobreventa.
* Registro de consumos adicionales.
* Cálculo automático del costo de las estadías.
* Consulta detallada de la cuenta de los huéspedes.
* Protección de la integridad histórica de la información.

---

# 🛠️ Tecnologías Utilizadas

| Tecnología               | Uso                                         |
| ------------------------ | ------------------------------------------- |
| **Node.js**              | Entorno de ejecución de JavaScript          |
| **NestJS**               | Framework para desarrollar la API REST      |
| **TypeScript**           | Lenguaje principal del backend              |
| **TypeORM**              | ORM para la comunicación con MySQL          |
| **MySQL**                | Sistema gestor de base de datos             |
| **class-validator**      | Validación de datos recibidos por la API    |
| **class-transformer**    | Transformación de datos de los DTOs         |
| **DTOs**                 | Transferencia y validación de datos         |
| **Variables de entorno** | Configuración de credenciales y parámetros  |
| **Postman**              | Pruebas de los endpoints de la API          |
| **Git / GitHub**         | Control de versiones y trabajo colaborativo |

---

# 🏗️ Arquitectura

El proyecto utiliza la arquitectura modular proporcionada por **NestJS**.

Cada módulo está organizado principalmente mediante:

```text
Module
 ├── Controller
 ├── Service
 ├── Entity
 └── DTOs
```

La responsabilidad de cada componente es:

### Controller

Se encarga de recibir las solicitudes HTTP y enviar las respuestas correspondientes.

Ejemplo:

```text
POST /habitaciones
GET /habitaciones
PATCH /habitaciones/:id
DELETE /habitaciones/:id
```

### Service

Contiene la lógica de negocio de cada módulo.

Por ejemplo:

* Comprobar si una habitación ya existe.
* Comprobar si existe un tipo de habitación.
* Evitar registros duplicados.
* Controlar reglas de eliminación.
* Coordinar consultas entre diferentes entidades.

### Entity

Representa las tablas de la base de datos y sus relaciones mediante TypeORM.

### DTO

Define la estructura de los datos que puede recibir cada endpoint y permite validar la información antes de procesarla.

---

# 🔐 Validación de Datos

El proyecto utiliza `ValidationPipe` de NestJS junto con `class-validator`.

Estas opciones permiten:

* Validar automáticamente los DTOs.
* Eliminar propiedades no declaradas.
* Rechazar propiedades desconocidas.
* Transformar determinados valores recibidos por la API.

---


Antes de realizar un Pull Request, cada integrante debe actualizar su rama con los últimos cambios de `main`.

Ejemplo:

```bash
git checkout main
git pull origin main

git checkout feature/rooms
git merge main
```

---

# ⚙️ Configuración del Proyecto

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Entrar al directorio:

```bash
cd <NOMBRE_DEL_PROYECTO>
```

---

## 2. Instalar dependencias

```bash
npm install
```

Dependencias principales:

```bash
npm install @nestjs/typeorm typeorm mysql2
npm install class-validator class-transformer
npm install @nestjs/mapped-types
```

---
## 5. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

---

# 👥 Equipo de Desarrollo

El proyecto es desarrollado de manera colaborativa por un equipo de cuatro integrantes.

| Integrante | Área de responsabilidad            | Rama                         |
| ---------- | ---------------------------------- | ---------------------------- |
| **Sebas**  | Base de datos y modelado           | `feature/modeloDB`           |
| **Edwin**  | Tipos de habitación y habitaciones | `feature/habitaciones`       |
| **Dayra**  | Huéspedes y estadías               | `feature/huespedesYestadias` |
| **Paula**  | Consumos y cuenta del huésped      | `feature/consumosYcuentas`   |

