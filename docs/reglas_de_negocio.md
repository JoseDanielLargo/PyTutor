# Reglas de negocio - TutorFlow

## 1. Tarifas base

- Clase individual de 1 hora: $50.000
- Clase individual de 2 horas: $80.000
- Para grupos de 2 a 4 personas, se cobra por persona.
- El grupo normal máximo es de 4 personas.
- Si son más de 4 personas, se considera una sesión especial y el valor se acuerda manualmente.

## 2. Descuento por primera clase

- Si un estudiante toma clase por primera vez, recibe un descuento de $10.000.
- Este descuento aplica solo una vez por estudiante.
- En clases grupales, el descuento se aplica individualmente a cada estudiante que sea primera vez.

## 3. Descuento por grupo

- En clases grupales de 2 a 4 personas, se descuenta $10.000 por cada estudiante.
- Este descuento se suma al descuento de primera vez si aplica.

## 4. Fórmula general de cálculo

valorBaseTotal = valorPorDuracion * cantidadEstudiantes

descuentoGrupo = 10000 * cantidadEstudiantes

descuentoPrimeraVez = 10000 * cantidadEstudiantesPrimeraVez

totalClase = valorBaseTotal - descuentoGrupo - descuentoPrimeraVez - descuentoManual

## 5. Métodos de pago

Los métodos de pago permitidos son:

- Nequi
- Efectivo
- Bancolombia
- Llave

## 6. Estados de pago

Una clase puede tener uno de estos estados de pago:

- Pendiente
- Pago parcial
- Pagado

## 7. Descuento por pago de contado

- Si un estudiante agenda varias clases y paga de contado, se puede aplicar un descuento manual.
- Este descuento lo define directamente el tutor.

## 8. Datos del estudiante

De cada estudiante se debe guardar:

- Nombre
- Nivel estimado
- Cantidad de clases vistas
- Cantidad de horas vistas
- Estado: activo o inactivo
- Observaciones generales
- Si ya tomó su primera clase o no

## 9. Log de clase

Por cada clase se debe guardar:

- Fecha
- Duración
- Estudiantes asistentes
- Tema trabajado
- Qué se hizo durante la clase
- Dificultades detectadas
- Material recomendado
- Material enviado
- Próximos temas sugeridos
- Observaciones

## 10. Material de trabajo

El sistema debe permitir guardar o sugerir material según:

- Materia
- Tema
- Nivel del estudiante
- Historial de clases
