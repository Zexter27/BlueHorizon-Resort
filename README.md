# 🏨 BlueHorizon Resort API

## 📋 Descripción

**BlueHorizon Resort API** es una API REST desarrollada para automatizar la gestión hotelera de un hotel boutique frente al mar.

El sistema busca solucionar problemas relacionados con la sobreventa de habitaciones y la falta de control sobre los servicios consumidos por los huéspedes durante su estadía.

Actualmente, el registro manual de reservas dificulta conocer con exactitud:

* Qué habitaciones se encuentran disponibles.
* A qué categoría pertenece cada habitación.
* Qué huésped está asociado a una estadía.
* Qué servicios adicionales ha consumido cada huésped.
* El valor acumulado de la cuenta al momento del check-out.

La API permite gestionar habitaciones, huéspedes, estadías y consumos adicionales de manera organizada.

---

# 🎯 Objetivo del Proyecto

Desarrollar una API REST que permita automatizar:

* La gestión de tipos de habitación.
* El control de las habitaciones del hotel.
* El registro de huéspedes.
* La creación y administración de estadías.
* El registro de consumos adicionales.
* El cálculo automático del subtotal de una estadía.
* La consulta detallada de la cuenta de un huésped.

---

# 🛠️ Tecnologías Utilizadas

El proyecto utiliza el siguiente stack tecnológico:

* **Node.js**
* **NestJS**
* **TypeORM**
* **MySQL**
* **Variables de entorno (.env)**
* **DTOs (Data Transfer Objects)**

---

# 🏗️ Arquitectura

El proyecto utiliza la arquitectura modular proporcionada por NestJS.

Cada módulo está compuesto principalmente por:

* **Module**
* **Controller**
* **Service**
* **Entity**
* **DTOs**

También se utiliza la inyección de dependencias para administrar los servicios y repositorios.

---

# 📦 Funcionalidades

## 🛏️ Gestión de Tipos de Habitación

El sistema permite registrar diferentes categorías de habitaciones.

Ejemplos:

* Suite Presidencial.
* Doble Estándar.
* Sencilla.

Cada tipo de habitación cuenta con su respectivo:

* Nombre o categoría.
* Precio base por noche.

---

## 🚪 Gestión de Habitaciones

Permite administrar las habitaciones físicas del hotel.

Cada habitación está relacionada con un tipo de habitación y cuenta con información como:

* Tipo de habitación.
* Número de habitación.
* Número de piso.

---

## 👤 Gestión de Huéspedes

El sistema permite registrar y administrar la información de los huéspedes que realizan check-in en el hotel.

---

## 📅 Gestión de Estadías

Una estadía representa la permanencia de un huésped en una habitación.

Cada estadía está vinculada con:

* Un huésped.
* Una habitación específica.
* El número de noches registradas.

El sistema calcula automáticamente el subtotal de la estadía utilizando la siguiente lógica:

```text
Subtotal = Precio base por noche × Número de noches
```

Este cálculo se realiza internamente dentro de la lógica de negocio.

---

## 🧾 Gestión de Consumos

Durante una estadía, un huésped puede registrar múltiples consumos adicionales.

Algunos ejemplos son:

* Servicio al cuarto.
* Minibar.
* Lavandería.

Cada consumo queda asociado a la estadía correspondiente.

---

## 💰 Consulta de Cuenta del Huésped

El sistema permite obtener el detalle de la cuenta de un huésped.

La consulta debe mostrar:

* Número de habitación.
* Tipo de habitación.
* Lista de consumos adicionales.
* Subtotal de la estadía.
* Total acumulado.

---

# 🗂️ Modelo General del Sistema

Las principales entidades del sistema son:

```text
TipoHabitacion
       │
       │ 1
       │
       ▼
Habitacion
       │
       │
       ▼
Estadia ◄──────── Huesped
       │
       │ 1
       │
       ▼
    Consumos
```

Relaciones principales:

* Un **tipo de habitación** puede estar asociado a varias habitaciones.
* Una **habitación** pertenece a un tipo de habitación.
* Una **estadía** está asociada a un huésped.
* Una **estadía** está asociada a una habitación.
* Una **estadía** puede tener múltiples consumos adicionales.

---

# 🌿 Organización de Ramas

El proyecto se divide en cuatro ramas principales para facilitar el trabajo colaborativo.

### `feature/database-model`

Responsable de:

* Modelado de la base de datos.
* Relaciones entre entidades.
* Configuración de MySQL.
* Configuración de TypeORM.
* Variables de entorno.

---

### `feature/rooms`

Responsable de:

* Tipos de habitación.
* Habitaciones.
* CRUD correspondiente.
* DTOs, servicios y controladores.

---

### `feature/guests-stays`

Responsable de:

* Gestión de huéspedes.
* Gestión de estadías.
* Registro de reservas.
* Cálculo automático del subtotal.

---

### `feature/consumptions-account`

Responsable de:

* Registro de consumos.
* Relación entre consumos y estadías.
* Consulta detallada de la cuenta del huésped.
* Cálculo del total acumulado.

---

# 🔄 Flujo de Trabajo con Git

El orden recomendado para integrar las funcionalidades es:

```text
1. feature/database-model
            ↓
          main
            ↓
2. feature/rooms
            ↓
          main
            ↓
3. feature/guests-stays
            ↓
          main
            ↓
4. feature/consumptions-account
            ↓
          main
```

Antes de realizar un Pull Request, cada integrante debe actualizar su rama con los últimos cambios de `main`.

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

---

## 3. Configurar las variables de entorno

Crear un archivo llamado:

```text
.env
```

Las credenciales de conexión a la base de datos deben configurarse mediante variables de entorno.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password
DB_DATABASE=bluehorizon_resort
```

---

## 4. Ejecutar el proyecto

Para iniciar el servidor en modo desarrollo:

```bash
npm run start:dev
```

---

# 📚 Requerimientos Técnicos

El proyecto cumple con los siguientes requerimientos:

* Uso de **NestJS**.
* Arquitectura basada en módulos, controladores y servicios.
* Persistencia de datos mediante **TypeORM**.
* Base de datos **MySQL**.
* Uso de variables de entorno mediante `.env`.
* Implementación de **DTOs** para los endpoints de creación y actualización.
* Uso de inyección de dependencias.
* Uso de repositorios inyectados en los servicios.

---

# 👥 Equipo de Desarrollo

El proyecto es desarrollado de manera colaborativa por un equipo de cuatro integrantes.

| Integrante | Área de responsabilidad            | Rama                           |
| ---------- | ---------------------------------- | ------------------------------ |
| Sebas  | Base de datos y modelado           | `feature/modeloDB`       |
| Edwin  | Tipos de habitación y habitaciones | `feature/habitaciones`                |
| Dayra | Huéspedes y estadías               | `feature/huespedesYestadias`         |
| Paula  | Consumos y cuenta del huésped      | `feature/consumosYcuentas` |

---

# 🏨 BlueHorizon Resort

Sistema de Gestión Hotelera desarrollado como actividad práctica utilizando **NestJS, TypeORM y MySQL**.
