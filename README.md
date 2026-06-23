# PyTutor

PyTutor es una aplicación web para gestionar tutorías particulares, estudiantes, clases, pagos, materiales de trabajo y rentabilidad.

## Objetivo del proyecto

El objetivo de PyTutor es ayudar a un tutor particular a organizar sus clases, llevar seguimiento académico de sus estudiantes y analizar cuánto dinero está generando por estudiante, por clase y por periodo de tiempo.

## Problema que resuelve

Cuando se dan tutorías particulares, muchas veces la información queda dispersa en chats, notas, calendarios o recuerdos. PyTutor busca centralizar:

- Estudiantes.
- Clases realizadas y programadas.
- Pagos pendientes o completados.
- Reglas de cobro.
- Descuentos.
- Material recomendado.
- Historial académico.
- Rentabilidad por estudiante.

## Funcionalidades principales

- Registro y consulta de estudiantes.
- Registro de clases individuales y grupales.
- Cálculo automático del valor de una clase.
- Aplicación de descuentos por primera clase.
- Aplicación de descuentos por grupo.
- Registro de pagos por Nequi, efectivo, Bancolombia o Llave.
- Control de pagos pendientes, parciales y completados.
- Historial de clases por estudiante.
- Log académico de cada clase.
- Registro y sugerencia de material de trabajo.
- Reportes de ingresos y rentabilidad.

## Reglas principales de cobro

- Clase individual de 1 hora: $50.000.
- Clase individual de 2 horas: $80.000.
- En grupos de 2 a 4 personas se cobra por persona.
- En clases grupales se descuenta $10.000 por estudiante.
- Si un estudiante toma clase por primera vez, se descuenta $10.000 adicionales.
- Si son más de 4 estudiantes, se considera una sesión especial con valor manual.
- Si un estudiante paga varias clases de contado, se puede aplicar un descuento manual.

## Tecnologías planeadas

### Backend

- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Swagger

### Frontend

- Angular
- TypeScript
- HTML
- CSS

### Herramientas

- Git
- GitHub
- Postman
- Render / Railway
- Vercel / Netlify

## Estructura del proyecto

```text
PyTutor/
├── backend/
├── frontend/
├── docs/
│   ├── reglas-negocio.md
│   ├── modelo-datos.md
│   └── historias-usuario.md
└── README.md