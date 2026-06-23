# Historias de usuario - PyTutor

## 1. Gestión de estudiantes

### HU01 - Crear estudiante

Como tutor, quiero registrar un estudiante con su información básica para poder llevar seguimiento de sus clases.

### Criterios de aceptación

- Debo poder guardar nombre, teléfono, correo, nivel y observaciones.
- El estudiante debe quedar en estado activo por defecto.
- La cantidad de clases y horas vistas debe iniciar en 0.
- El estudiante debe quedar marcado como que aún no ha tomado su primera clase.

---

### HU02 - Consultar estudiantes

Como tutor, quiero ver la lista de mis estudiantes para revisar rápidamente quiénes están activos y su progreso.

### Criterios de aceptación

- Debo poder ver nombre, nivel, estado, clases vistas y horas vistas.
- Debo poder diferenciar estudiantes activos e inactivos.

---

### HU03 - Ver detalle de estudiante

Como tutor, quiero ver el historial de un estudiante para saber qué clases ha tomado, cuánto ha pagado y qué temas hemos trabajado.

### Criterios de aceptación

- Debo poder ver sus datos básicos.
- Debo poder ver sus clases realizadas.
- Debo poder ver sus pagos.
- Debo poder ver observaciones y nivel estimado.

---

## 2. Gestión de clases

### HU04 - Registrar clase

Como tutor, quiero registrar una clase para guardar fecha, duración, estudiantes, materia y tema trabajado.

### Criterios de aceptación

- Debo poder seleccionar uno o varios estudiantes.
- Debo poder seleccionar la materia.
- Debo poder registrar fecha, hora de inicio y hora de fin.
- El sistema debe calcular la duración de la clase.
- El sistema debe calcular el valor total de la clase.

---

### HU05 - Registrar clase grupal

Como tutor, quiero registrar clases grupales de máximo 4 estudiantes para calcular correctamente el valor por persona.

### Criterios de aceptación

- La clase grupal normal debe permitir máximo 4 estudiantes.
- Si hay más de 4 estudiantes, debe marcarse como sesión especial.
- En grupos de 2 a 4 personas se debe aplicar descuento grupal.

---

### HU06 - Guardar log de clase

Como tutor, quiero guardar lo que se hizo en cada clase para llevar seguimiento académico del estudiante.

### Criterios de aceptación

- Debo poder guardar tema trabajado.
- Debo poder guardar dificultades detectadas.
- Debo poder guardar próximos temas sugeridos.
- Debo poder guardar observaciones generales.
- Debo poder asociar material recomendado o enviado.

---

## 3. Reglas de cobro

### HU07 - Calcular valor de clase individual

Como tutor, quiero que el sistema calcule automáticamente el valor de una clase individual según su duración.

### Criterios de aceptación

- Si la clase dura 1 hora, debe costar $50.000.
- Si la clase dura 2 horas, debe costar $80.000.
- Si el estudiante es primera vez, se debe descontar $10.000.

---

### HU08 - Calcular valor de clase grupal

Como tutor, quiero que el sistema calcule automáticamente el valor de una clase grupal según cantidad de estudiantes y duración.

### Criterios de aceptación

- El valor base se calcula por persona.
- En grupos se descuenta $10.000 por cada estudiante.
- Si algún estudiante es primera vez, se descuentan $10.000 adicionales por ese estudiante.
- El total debe mostrar valor base, descuentos y valor final.

---

### HU09 - Aplicar descuento manual

Como tutor, quiero aplicar descuentos manuales cuando un estudiante paga de contado o cuando se acuerda una tarifa especial.

### Criterios de aceptación

- Debo poder ingresar un descuento manual.
- El descuento manual debe restarse del valor total.
- El sistema debe guardar la razón del descuento.

---

## 4. Gestión de pagos

### HU10 - Registrar pago

Como tutor, quiero registrar pagos para saber cuánto ha pagado cada estudiante.

### Criterios de aceptación

- Debo poder seleccionar estudiante y clase.
- Debo poder ingresar valor pagado.
- Debo poder seleccionar método de pago.
- Los métodos permitidos son Nequi, Efectivo, Bancolombia y Llave.

---

### HU11 - Consultar deuda

Como tutor, quiero ver cuánto debe cada estudiante para hacer seguimiento de pagos pendientes.

### Criterios de aceptación

- El sistema debe calcular total generado.
- El sistema debe calcular total pagado.
- El sistema debe mostrar saldo pendiente.
- El pago puede estar pendiente, parcial o pagado.

---

## 5. Material de trabajo

### HU12 - Registrar material

Como tutor, quiero guardar material de práctica para asociarlo a materias, temas y niveles.

### Criterios de aceptación

- Debo poder guardar título, tipo, tema, nivel y enlace.
- El material puede ser PDF, link, video, ejercicio, taller u otro.
- El material debe estar asociado a una materia.

---

### HU13 - Sugerir material

Como tutor, quiero que el sistema sugiera material según el tema trabajado y nivel del estudiante.

### Criterios de aceptación

- El sistema debe filtrar material por materia.
- El sistema debe filtrar material por nivel.
- El sistema debe permitir asociar material a una clase.
- El sistema debe indicar si el material fue enviado o solo recomendado.

---

## 6. Reportes

### HU14 - Ver ingresos generales

Como tutor, quiero ver mis ingresos para saber si las tutorías son rentables.

### Criterios de aceptación

- Debo poder ver ingresos generados.
- Debo poder ver ingresos pagados.
- Debo poder ver dinero pendiente.
- Debo poder filtrar por mes.

---

### HU15 - Ver rentabilidad por estudiante

Como tutor, quiero ver cuánto genera cada estudiante para saber qué tan rentable es.

### Criterios de aceptación

- El sistema debe mostrar total generado por estudiante.
- El sistema debe mostrar horas vistas por estudiante.
- El sistema debe calcular promedio ganado por hora.