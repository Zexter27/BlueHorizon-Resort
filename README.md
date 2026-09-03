# 🏨 BlueHorizon Resort API

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

La configuración global actual es:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Estas opciones permiten:

* Validar automáticamente los DTOs.
* Eliminar propiedades no declaradas.
* Rechazar propiedades desconocidas.
* Transformar determinados valores recibidos por la API.

Ejemplo:

```json
{
  "numero": "101",
  "piso": 1,
  "tipo_habitacion_id": 1
}
```

Si el cliente envía información inválida, la API responde con un error antes de ejecutar la lógica principal.

---

# 🚨 Manejo de Errores

La API utiliza excepciones HTTP de NestJS y un filtro global personalizado para mantener una estructura uniforme en las respuestas de error.

Los errores utilizan códigos HTTP apropiados:

| Código | Significado           | Ejemplo                                                 |
| ------ | --------------------- | ------------------------------------------------------- |
| `400`  | Bad Request           | Datos inválidos                                         |
| `404`  | Not Found             | Recurso inexistente                                     |
| `409`  | Conflict              | Registro duplicado o conflicto con una regla de negocio |
| `500`  | Internal Server Error | Error inesperado del servidor                           |

Ejemplo de respuesta:

```json
{
  "statusCode": 404,
  "mensaje": "No existe la habitación con ID 25.",
  "ruta": "/habitaciones/25",
  "fecha": "2026-09-03T18:30:00.000Z"
}
```

Para errores de validación:

```json
{
  "statusCode": 400,
  "mensaje": "Ha ocurrido un error.",
  "errores": [
    "El número de habitación es obligatorio.",
    "El piso debe ser mayor o igual a 1."
  ],
  "ruta": "/habitaciones",
  "fecha": "2026-09-03T18:30:00.000Z"
}
```

---

# 📦 Funcionalidades

## 🛏️ Gestión de Tipos de Habitación

El sistema permite registrar y administrar diferentes categorías de habitaciones.

Ejemplos:

* Suite Presidencial.
* Suite.
* Doble Estándar.
* Sencilla.

Cada tipo de habitación contiene:

* Identificador.
* Nombre o categoría.
* Precio base por noche.

### Endpoints

```text
POST   /tipos-habitacion
GET    /tipos-habitacion
GET    /tipos-habitacion/:id
PATCH  /tipos-habitacion/:id
DELETE /tipos-habitacion/:id
```

---

# 🚪 Gestión de Habitaciones

Permite administrar las habitaciones físicas del hotel.

Cada habitación está asociada a un tipo de habitación.

Información principal:

* Identificador.
* Número de habitación.
* Piso.
* Tipo de habitación.

### Endpoints

```text
POST   /habitaciones
GET    /habitaciones
GET    /habitaciones/:id
PATCH  /habitaciones/:id
DELETE /habitaciones/:id
```

### Validaciones

El backend controla:

* Número obligatorio.
* Número máximo de 10 caracteres.
* Piso mayor o igual a `1`.
* Tipo de habitación válido.
* Número de habitación único.
* Tipo de habitación existente.

### Regla de integridad histórica

Una habitación que tenga información relacionada con estadías no debe eliminarse.

La arquitectura utiliza además:

```sql
ON DELETE RESTRICT
```

para proteger la integridad referencial de la base de datos.

La regla conceptual es:

```text
Habitación
     │
     ├── Sin estadías
     │       ↓
     │    Puede eliminarse
     │
     └── Con estadías
             ↓
        No puede eliminarse
```

Esto evita perder información histórica relacionada con huéspedes y estadías.

---

# 👤 Gestión de Huéspedes

El sistema permite registrar y administrar los huéspedes del hotel.

Información prevista:

* Identificador.
* Nombre.
* Apellido.
* Documento.
* Teléfono.
* Correo electrónico.

El documento del huésped debe ser único.

### Endpoints previstos

```text
POST   /huespedes
GET    /huespedes
GET    /huespedes/:id
PATCH  /huespedes/:id
DELETE /huespedes/:id
```

---

# 📅 Gestión de Estadías

Una estadía representa la permanencia de un huésped en una habitación durante un periodo determinado.

Cada estadía estará relacionada con:

* Un huésped.
* Una habitación.
* Fecha de entrada.
* Fecha de salida.
* Precio por noche aplicado.

La cantidad de noches será calculada automáticamente por el backend.

```text
Número de noches
=
Fecha de salida - Fecha de entrada
```

El subtotal de la habitación será calculado internamente:

```text
Subtotal habitación
=
Precio por noche aplicado × Número de noches
```

El cliente **no debe enviar el subtotal ni el número de noches como datos calculados**.

---

# 🛡️ Reglas de Negocio para Estadías

El módulo de estadías deberá garantizar:

### Fecha válida

```text
Fecha de salida > Fecha de entrada
```

### Prevención de sobreventa

Una misma habitación no puede tener dos estadías cuyos periodos se solapen.

Ejemplo:

```text
Habitación 101

Estadía A
01/09 ───────── 05/09

Estadía B
03/09 ───────── 07/09
```

Esto debe ser rechazado porque existe un solapamiento.

### Precio histórico

Cuando se crea una estadía se almacenará el precio aplicado en ese momento:

```text
precio_noche_aplicado
```

Esto permite conservar el valor histórico aunque posteriormente cambie el precio del tipo de habitación.

Ejemplo:

```text
Precio actual:
$400.000

Precio aplicado a una estadía anterior:
$350.000
```

La estadía histórica continuará utilizando:

```text
$350.000
```

---

# 🧾 Gestión de Consumos

Durante una estadía un huésped puede registrar múltiples consumos adicionales.

Ejemplos:

* Servicio al cuarto.
* Minibar.
* Lavandería.
* Restaurante.
* Otros servicios.

Cada consumo estará asociado a una estadía.

Información principal:

```text
Descripción
Precio
Cantidad
Fecha
Estadía
```

El subtotal de cada consumo será calculado mediante:

```text
Subtotal consumo
=
Precio × Cantidad
```

---

# 💰 Consulta de Cuenta del Huésped

El sistema permitirá consultar la cuenta completa de un huésped.

La consulta deberá mostrar:

* Huésped.
* Habitación.
* Tipo de habitación.
* Fecha de entrada.
* Fecha de salida.
* Número de noches.
* Precio por noche.
* Subtotal de habitación.
* Consumos.
* Subtotal de consumos.
* Total acumulado.

El total será:

```text
Total estadía
=
Subtotal habitación
+
Total consumos
```

Los valores derivados no se almacenarán innecesariamente en la base de datos.

---

# 🗂️ Modelo de Datos

El sistema está compuesto por cinco entidades principales:

```text
TipoHabitacion
       │
       │ 1:N
       ▼
Habitacion
       │
       │ 1:N
       ▼
Estadia ◄──────── Huesped
       │
       │ 1:N
       ▼
Consumo
```

Relaciones:

```text
TipoHabitacion 1 ──── N Habitacion

Huesped        1 ──── N Estadia

Habitacion     1 ──── N Estadia

Estadia        1 ──── N Consumo
```

---

# 🗃️ Entidades Principales

## TipoHabitacion

```text
id
nombre
precio_noche
```

## Habitacion

```text
id
numero
piso
tipo_habitacion_id
```

## Huesped

```text
id
nombre
apellido
documento
telefono
correo
```

## Estadia

```text
id
huesped_id
habitacion_id
fecha_entrada
fecha_salida
precio_noche_aplicado
```

## Consumo

```text
id
estadia_id
descripcion
precio
cantidad
fecha
```

---

# 🧠 Lógica de Negocio

La lógica de negocio se encuentra principalmente en los `Services` y no en los controladores.

Algunas reglas implementadas o previstas son:

* Los nombres de tipos de habitación deben ser únicos.
* Los números de habitación deben ser únicos.
* Un tipo de habitación debe existir antes de crear una habitación.
* Una habitación debe pertenecer a un tipo de habitación válido.
* Una habitación con historial relacionado no debe eliminarse.
* Un huésped no puede tener documentos duplicados.
* La fecha de salida debe ser posterior a la fecha de entrada.
* No se permiten estadías solapadas para una misma habitación.
* El número de noches se calcula automáticamente.
* El precio de la estadía se conserva como valor histórico.
* Los consumos pertenecen a una estadía.
* El total de la cuenta se calcula a partir de los datos relacionados.

---

# 🧮 Datos Derivados

El sistema evita almacenar información que puede calcularse a partir de otros datos.

No se almacenan como campos permanentes:

```text
numero_noches
subtotal_habitacion
subtotal_consumos
total_estadia
```

Estos valores se calculan cuando son necesarios.

Esto reduce la posibilidad de inconsistencias.

---

# 🗄️ Base de Datos

La aplicación utiliza:

```text
MySQL
   │
   └── hotel_boutique
```

La conexión se configura mediante variables de entorno.

La aplicación utiliza:

```text
TypeORM
   │
   ├── Entities
   ├── Repositories
   └── Relaciones
```

La configuración actual utiliza:

```typescript
synchronize: false
```

para evitar que TypeORM modifique automáticamente el esquema de producción.

La estructura de la base de datos se mantiene mediante SQL y posteriormente podrá gestionarse mediante migraciones.

---

# 🔐 Variables de Entorno

Crear un archivo:

```text
.env
```

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=hotel_boutique
```

El archivo `.env` no debe subirse al repositorio.

Debe estar incluido en:

```text
.gitignore
```

Por ejemplo:

```text
.env
```

---

# 📁 Estructura del Proyecto

La estructura general del backend es:

```text
src/
│
├── database/
│   └── database.module.ts
│
├── common/
│   └── filters/
│       └── http-exception.filter.ts
│
├── tipo-habitacion/
│   ├── dto/
│   │   ├── create-tipo-habitacion.dto.ts
│   │   └── update-tipo-habitacion.dto.ts
│   │
│   ├── entities/
│   │   └── tipo-habitacion.entity.ts
│   │
│   ├── tipo-habitacion.controller.ts
│   ├── tipo-habitacion.service.ts
│   └── tipo-habitacion.module.ts
│
├── habitacion/
│   ├── dto/
│   │   ├── create-habitacion.dto.ts
│   │   └── update-habitacion.dto.ts
│   │
│   ├── entities/
│   │   └── habitacion.entity.ts
│   │
│   ├── habitacion.controller.ts
│   ├── habitacion.service.ts
│   └── habitacion.module.ts
│
├── huesped/
│   ├── dto/
│   ├── entities/
│   ├── huesped.controller.ts
│   ├── huesped.service.ts
│   └── huesped.module.ts
│
├── estadia/
│   ├── dto/
│   ├── entities/
│   ├── estadia.controller.ts
│   ├── estadia.service.ts
│   └── estadia.module.ts
│
├── consumo/
│   ├── dto/
│   ├── entities/
│   ├── consumo.controller.ts
│   ├── consumo.service.ts
│   └── consumo.module.ts
│
├── app.module.ts
└── main.ts
```

Los módulos de **Huésped, Estadía y Consumo** se encuentran contemplados en la arquitectura y serán implementados progresivamente.

---

# 🌿 Organización de Ramas

El proyecto se divide en ramas principales para facilitar el trabajo colaborativo.

### `feature/database-model`

Responsable de:

* Modelado de la base de datos.
* Entidades y relaciones.
* Configuración de MySQL.
* Configuración de TypeORM.
* Variables de entorno.
* Integridad referencial.

---

### `feature/rooms`

Responsable de:

* Tipos de habitación.
* Habitaciones.
* CRUD correspondiente.
* DTOs.
* Servicios.
* Controladores.
* Validaciones.

---

### `feature/guests-stays`

Responsable de:

* Gestión de huéspedes.
* Gestión de estadías.
* Registro de reservas.
* Disponibilidad de habitaciones.
* Prevención de sobreventa.
* Cálculo automático del subtotal.

---

### `feature/consumptions-account`

Responsable de:

* Registro de consumos.
* Relación entre consumos y estadías.
* Consulta detallada de la cuenta.
* Cálculo del total acumulado.

---

# 🔄 Flujo de Trabajo con Git

El orden recomendado para integrar las funcionalidades es:

```text
1. feature/database-model
            │
            ▼
          main
            │
            ▼
2. feature/rooms
            │
            ▼
          main
            │
            ▼
3. feature/guests-stays
            │
            ▼
          main
            │
            ▼
4. feature/consumptions-account
            │
            ▼
          main
```

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

## 3. Configurar las variables de entorno

Crear:

```text
.env
```

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=hotel_boutique
```

---

## 4. Configurar la base de datos

Crear la base de datos:

```text
hotel_boutique
```

Ejecutar el script SQL correspondiente para crear:

```text
tipo_habitacion
habitacion
huesped
estadia
consumo
```

---

## 5. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

La API estará disponible normalmente en:

```text
http://localhost:3000
```

---

# 🧪 Pruebas con Postman

Los endpoints pueden probarse utilizando Postman.

Ejemplo:

```text
POST http://localhost:3000/tipos-habitacion
```

```json
{
  "nombre": "Suite",
  "precio_noche": 350000
}
```

Crear una habitación:

```text
POST http://localhost:3000/habitaciones
```

```json
{
  "numero": "101",
  "piso": 1,
  "tipo_habitacion_id": 1
}
```

Actualizar parcialmente:

```text
PATCH http://localhost:3000/habitaciones/1
```

```json
{
  "piso": 2
}
```

Consultar:

```text
GET http://localhost:3000/habitaciones
```

Eliminar:

```text
DELETE http://localhost:3000/habitaciones/1
```

---

# 📚 Requerimientos Técnicos

El proyecto cumple y/o contempla los siguientes requerimientos:

* Uso de **NestJS**.
* Uso de **TypeScript**.
* Arquitectura modular.
* Controladores y servicios separados.
* Persistencia mediante **TypeORM**.
* Base de datos **MySQL**.
* Uso de **DTOs**.
* Validación mediante `class-validator`.
* Transformación mediante `class-transformer`.
* Inyección de dependencias.
* Repositorios inyectados.
* Relaciones entre entidades.
* Variables de entorno mediante `.env`.
* Manejo de excepciones HTTP.
* Filtro global personalizado para errores.
* Integridad referencial mediante claves foráneas.
* Protección contra eliminación de registros relacionados.
* Separación entre lógica de presentación y lógica de negocio.
* Cálculo de datos derivados en el backend.
* Preparación para migraciones de base de datos.
* Pruebas de endpoints mediante Postman.

---

# 📌 Estado Actual del Proyecto

| Módulo                          | Estado         |
| ------------------------------- | -------------- |
| Configuración NestJS            | ✅ Completado   |
| Configuración `.env`            | ✅ Completado   |
| Configuración TypeORM           | ✅ Completado   |
| Conexión MySQL                  | ✅ Completado   |
| Modelo de base de datos         | ✅ Completado   |
| Tipo de habitación              | ✅ Completado   |
| Habitación                      | ✅ Completado   |
| DTOs                            | ✅ Completado   |
| Validación de datos             | ✅ Completado   |
| Manejo personalizado de errores | ✅ Completado   |
| Integridad referencial          | ✅ Implementado |
| Protección de eliminación       | ✅ Implementada |
| Huésped                         | 🔄 Pendiente   |
| Estadía                         | 🔄 Pendiente   |
| Control de disponibilidad       | 🔄 Pendiente   |
| Prevención de sobreventa        | 🔄 Pendiente   |
| Consumos                        | 🔄 Pendiente   |
| Cuenta del huésped              | 🔄 Pendiente   |
| Pruebas completas               | 🔄 Pendiente   |

---

# 👥 Equipo de Desarrollo

El proyecto es desarrollado de manera colaborativa por un equipo de cuatro integrantes.

| Integrante | Área de responsabilidad            | Rama                         |
| ---------- | ---------------------------------- | ---------------------------- |
| **Sebas**  | Base de datos y modelado           | `feature/modeloDB`           |
| **Edwin**  | Tipos de habitación y habitaciones | `feature/habitaciones`       |
| **Dayra**  | Huéspedes y estadías               | `feature/huespedesYestadias` |
| **Paula**  | Consumos y cuenta del huésped      | `feature/consumosYcuentas`   |

---

# 🏨 BlueHorizon Resort

**BlueHorizon Resort API** es un sistema de gestión hotelera desarrollado como actividad práctica utilizando:

```text
NestJS
   +
TypeScript
   +
TypeORM
   +
MySQL
```

El proyecto busca aplicar conceptos de:

* Desarrollo de APIs REST.
* Arquitectura modular.
* Programación orientada a objetos.
* Inyección de dependencias.
* Persistencia de datos.
* Modelado relacional.
* Validación de información.
* Reglas de negocio.
* Integridad de datos.
* Manejo de errores.
* Trabajo colaborativo con Git.
