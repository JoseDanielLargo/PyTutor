# Modelo de datos - PyTutor

## 1. Estudiante

Representa a una persona que recibe tutorías.

### Atributos

- id
- nombre
- telefono
- correo
- nivel
- estado
- cantidadClasesVistas
- cantidadHorasVistas
- yaTuvoPrimeraClase
- observaciones

### Estados posibles

- Activo
- Inactivo

### Niveles posibles

- Básico
- Medio
- Avanzado
- Personalizado

---

## 2. Materia

Representa el área o tema general de la tutoría.

### Atributos

- id
- nombre
- descripcion

### Ejemplos

- Programación
- Java
- Python
- Cálculo
- Probabilidad
- Excel

---

## 3. Clase

Representa una sesión de tutoría agendada o realizada.

### Atributos

- id
- fecha
- horaInicio
- horaFin
- duracionHoras
- tipoClase
- estadoClase
- valorBase
- descuentoGrupo
- descuentoPrimeraVez
- descuentoManual
- valorTotal
- temaTrabajado
- logClase
- dificultadesDetectadas
- proximosTemas
- observaciones
- materiaId

### Tipos de clase

- Individual
- Grupal
- Especial

### Estados de clase

- Programada
- Realizada
- Cancelada
- No asistió

---

## 4. ClaseEstudiante

Representa la relación entre una clase y sus estudiantes.

Se necesita porque una clase puede tener varios estudiantes y un estudiante puede estar en muchas clases.

### Atributos

- id
- claseId
- estudianteId
- valorIndividual
- descuentoPrimeraVezAplicado
- asistio

---

## 5. Pago

Representa un pago hecho por un estudiante.

### Atributos

- id
- estudianteId
- claseId
- fechaPago
- valorPagado
- metodoPago
- estadoPago
- observaciones

### Métodos de pago

- Nequi
- Efectivo
- Bancolombia
- Llave

### Estados de pago

- Pendiente
- Parcial
- Pagado

---

## 6. Material

Representa material recomendado o enviado a un estudiante.

### Atributos

- id
- titulo
- tipoMaterial
- tema
- nivelRecomendado
- descripcion
- enlace
- materiaId

### Tipos de material

- PDF
- Link
- Video
- Ejercicio
- Taller
- Otro

---

## 7. MaterialClase

Representa qué material fue sugerido o enviado en una clase específica.

### Atributos

- id
- claseId
- materialId
- enviado
- observaciones

---

# Relaciones principales

- Un estudiante puede estar en muchas clases.
- Una clase puede tener uno o varios estudiantes.
- Una clase pertenece a una materia.
- Un estudiante puede tener muchos pagos.
- Una clase puede tener varios pagos.
- Una materia puede tener varios materiales.
- Una clase puede tener varios materiales sugeridos o enviados.