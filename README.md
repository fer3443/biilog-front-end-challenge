# Bilog Agenda de Turnos

Aplicación de agenda médica odontológica desarrollada como **challenge frontend**, enfocada en la gestión de profesionales, disponibilidad horaria y turnos de pacientes, con vistas diaria y semanal.

El objetivo principal es permitir a los usuarios **visualizar disponibilidad**, **agendar**, **editar** y **reprogramar turnos**, respetando reglas de negocio reales (horarios laborales, solapamientos, fechas pasadas, etc.).

---

## Stack Tecnológico

* **Next.js**
* **TypeScript**
* **React Hook Form + Zod** (formularios y validaciones)
* **Zustand** (estado global)
* **shadcn/ui** (UI components)
* **date-fns** (manejo de fechas)

Arquitectura basada en **Domain Driven Design liviano**, separando lógica de negocio del UI.


---

## Dominio (Lógica de Negocio)

Toda la lógica crítica vive en `/domain`, desacoplada del UI.

### Disponibilidad y Validaciones

* Validación de horarios laborales (`isWithInWorkingHours`)
* Validación de profesional habilitado (`isProfessionalAvailable`)
* Detección de ausencias (`hasAbsenceOnDate`)
* Prevención de solapamientos y turnos disponibles (`isSlotAvailable`)
* Bloqueo de fechas pasadas (`isInThePast`)
* Bloqueo de turnos en fechas pasadas (`canCreateAppointment`)

### Movimiento de Turnos

```ts
canMoveAppointment(
  appointment,
  professional,
  newDate,
  newFrom,
  appointments
)
```

Valida:

*  Turnos en el pasado
*  Fuera de horario laboral
*  Profesional no disponible
*  Horarios ocupados
*  Reprogramación válida

Retorna:

```ts
{
  canMove: boolean;
  reason?: string;
  updatedAppointment?: Appointment;
}
```

Esto permite:

* Reutilización en formulario
* Drag & drop
* UI consistente

---

## Vistas del Calendario

### Vista Diaria

* Columnas por profesional
* Filas por slots horarios
* Drag & Drop de slots
* Visualización de:

  * Slots disponibles
  * Slots ocupados (nombre del paciente + horario)
  * Slots no disponibles
* Click en slot:

  * Crear turno
  * Editar turno existente

### Vista Semanal

* Navegación por semanas
* Cada día reutiliza la lógica de slots (`timeSlot.tsx`)
* Drag & drop de slots

---

## Estado Global (Zustand)

### Professionals Store

* Lista de profesionales
* Filtros:

  * Por nombre
  * Solo habilitados
  * Disponibles en un día específico

### Appointments Store

* Crear turno
* Editar turno
* Reprogramar turno
* Eliminar turno
* Validaciones delegadas al dominio

### Calendar Store

* Fecha seleccionada
* Vista activa (diaria / semanal)
* Profesional seleccionado

---

## Formulario de Turnos

Implementado con **React Hook Form + Zod**:

* Selector de fecha
* Selector de horario de inicio (`from`)
* Duración fija (preparado para extender)
* Cálculo automático de `to`
* Validaciones en tiempo real

Soporta:

* Creación
* Edición de datos
* Reprogramación

---

## UI / UX

* Componentes de **shadcn/ui**
* Estados visuales claros:

  * Disponible
  * Ocupado
  * No disponible (Por profesional deshabilitado y ausente)
* Feedback inmediato con `sonner`
* Sheet reutilizable para crear / editar
* AlertaDialog para confirmar eliminación de turno

---

## Preparado para Drag & Drop

La arquitectura soporta:

* Validación centralizada en dominio
* Movimiento de turnos con `canMoveAppointment`
* Contrato claro para DnD:

```ts
{
  appointmentId,
  professionalId,
  from,
  to,
  date
}
```

Solo resta incorporar:

* `@dnd-kit/core`
* Visual feedback (slot válido / inválido)

---


## Conclusión

El proyecto prioriza:

* Separación de responsabilidades
* Lógica de negocio claras
* Escalabilidad
* Código mantenible

## Development

* Pasos para levantar la app en desarrollo

1. Ejecutar el comando ```npm install``` para reconstruir los modulos de node
2. Crear una copia del archivo ``.env.template`` y renombrarlo a ``.env``
3. Colocar los valores de las variables de entorno correspondientes.
4. Ejecutar el comando ```npm run dev``` para levantar la app en modo desarrollo
5. Todos los turnos generados son guardados de manera local en ``localStorage``


## NOTA

* La respuesta de la api esta validada con zod.