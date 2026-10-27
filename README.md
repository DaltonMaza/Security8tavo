# 🛡️ Práctica en Aula — Simulaciones del OWASP Top 10:2025

**Universidad Nacional de Loja · Carrera de Computación**  
**Asignatura:** Software Security (Ciclo 8 A) · **Docente:** Ing. Valeria Herrera Salazar  
**Fecha de reporte:** 27 de octubre de 2026  
**Integrantes de la pareja APE:** Dalton Maza y Leonardo Peralta, Gabriel Espinoza  
**Aplicación auditada (Proyecto APE):** Helios  
**Repositorio GitHub:** https://github.com/DaltonMaza/Security8tavo  
**Progreso completado:** 10 / 10 categorías

---

## 📋 1. Lista de Cotejo (Autorregistro de la Pareja)

| Nro. | Categoría OWASP Top 10:2025 | Práctica Realizada | Estado en Proyecto APE | Resumen de Hallazgo / Observación |
|:---:|:---|:---:|:---|:---|
| 1 | **A01** — La factura ajena *(Broken Access Control)* | ✅ Sí | Vulnerabilidad encontrada | COMPONENTES AFECTADOS: - code/back-end_PIS6TO/src/routes/account.routes.js - code/back-end_PIS6TO/src/controllers/accountController.js - code/back-end_PIS6TO/src/routes/Placa.js - code/back-end_PIS6TO/src/routes/weatherState.routes.js  IDOR y Asignación de roles por el usuario La API expone operaciones de cuentas, placas y estados meteorológicos sin controles de autenticación y autorización consistentes. GET /account y GET /account/:external pueden enumerar cuentas. La creación de cuentas acepta un rol enviado por el cliente, incluido Administrador. Las rutas de placas permiten consultar, crear, modificar y eliminar recursos sin una política de acceso. La creación de estados meteorológicos también es pública. |
| 2 | **A02** — La radiografía del servidor *(Security Misconfiguration)* | ✅ Sí | Vulnerabilidad encontrada | COMPONENTES AFECTADOS: - code/back-end_PIS6TO/app.js - code/back-end_PIS6TO/src/config/index.js - code/simulacion_mqtt/broker.js - code/front-end_PIS6TO/src/app/hooks/Conexion.js  La configuración permite CORS abierto, valores inseguros por defecto, comunicaciones HTTP/MQTT sin cifrado y acceso anónimo al broker cuando no se define MQTT_USERNAME. El broker escucha en 0.0.0.0. Estas opciones pueden terminar activas en entornos no locales si no existe una validación estricta de configuración. |
| 3 | **A03** — El escáner de dependencias *(Software Supply Chain Failures)* | ✅ Sí | Vulnerabilidad encontrada | - APE1/FASE4/software-supply-chain-auditoria.txt - code/back-end_PIS6TO/package.json - code/front-end_PIS6TO/package.json - code/simulacion_mqtt/package.json - code/front-end_PIS6TO/azure-pipelines.yml - code/back-end_PIS6TO/.github/workflows/sonarqube.yml  El informe de npm audit documenta 28 vulnerabilidades, incluidas 15 de severidad alta y 3 críticas. También documenta vulnerabilidades de Mongoose y de xlsx, incluyendo prototype pollution sin corrección disponible en el estado auditado. Los manifiestos usan rangos mutables con ^ y el pipeline utiliza npm install en vez de npm ci. Los lockfiles y un SHA de SonarQube aportan integridad parcial, pero no eliminan dependencias vulnerables ni garantizan una política de actualización segura. |
| 4 | **A04** — La carrera del hash *(Cryptographic Failures)* | ✅ Sí | Vulnerabilidad encontrada | - code/arduino_Pis6to/Pis_6to/Pis_6to.ino - code/front-end_PIS6TO/src/app/hooks/Conexion.js - code/back-end_PIS6TO/src/controllers/authController.js  El firmware contiene credenciales Wi-Fi. La conexión MQTT utiliza el puerto 1883 sin TLS. El frontend usa HTTP y el controlador de autenticación contiene credenciales SMTP en texto claro. Los secretos quedan expuestos en el código, en el binario del firmware o en la red. |
| 5 | **A05** — El login que se deja engañar *(Injection)* | ✅ Sí | Vulnerabilidad encontrada | - code/back-end_PIS6TO/src/controllers/accountController.js - code/back-end_PIS6TO/src/controllers/roleController.js - code/back-end_PIS6TO/src/services/roleServices.js - code/back-end_PIS6TO/src/controllers/datosController.js  Los parámetros de consulta se convierten directamente en filtros MongoDB y los cuerpos HTTP se transfieren directamente a operaciones de actualización. Esto permite intentar introducir operadores como $ne, $regex, $where o campos anidados y modificar propiedades no destinadas al cliente. |
| 6 | **A06** — Dos diseños, dos finales *(Insecure Design)* | ✅ Sí | Vulnerabilidad encontrada | - code/back-end_PIS6TO/src/routes/auth.routes.js - code/back-end_PIS6TO/src/controllers/authController.js  El diseño de recuperación de contraseña almacena el token en claro, lo mantiene válido durante varias horas y no lo invalida después del cambio de contraseña. La activación de cuenta se basa únicamente en el correo recibido, sin una prueba de posesión mediante token. El flujo tampoco evidencia invalidación de sesiones existentes después de la recuperación. |
| 7 | **A07** — Fuerza bruta con y sin freno *(Authentication Failures)* | ✅ Sí | Vulnerabilidad encontrada | - code/back-end_PIS6TO/src/routes/auth.routes.js - code/back-end_PIS6TO/src/controllers/authController.js - code/back-end_PIS6TO/src/policies/isLoggedIn.js - code/back-end_PIS6TO/src/policies/isAdmin.js - code/back-end_PIS6TO/src/helpers/tokenGeneration.js  La activación de cuentas no requiere autenticación ni token. Las respuestas de login y recuperación difieren cuando el usuario existe, permitiendo enumeración. La autenticación usa cabeceras inconsistentes y el middleware administrativo importa validateToken desde un módulo que aparentemente exporta solamente generateToken. |
| 8 | **A08** — El paquete alterado *(Software or Data Integrity Failures)* | ✅ Sí | Vulnerabilidad encontrada | - code/simulacion_mqtt/broker.js - code/arduino_Pis6to/Pis_6to/Pis_6to.ino - code/simulacion_mqtt/emulador_placa.js  El broker MQTT puede operar sin autenticación ni ACL por tópico. El firmware declara credenciales MQTT pero no las utiliza efectivamente. El emulador acepta mensajes de control y los marca como ejecutados sin comprobar emisor, firma, nonce, timestamp, autorización o replay. |
| 9 | **A09** — El ataque invisible *(Security Logging & Alerting Failures)* | ✅ Sí | Vulnerabilidad encontrada | - code/back-end_PIS6TO/src/controllers/authController.js - code/back-end_PIS6TO/src/middlewares/errorHandler.js - code/simulacion_mqtt/broker.js  El flujo de recuperación registra objetos completos de cuenta, que pueden contener hashes, tokens, expiraciones y datos personales. El manejador de errores registra y expone message/details. El broker registra payloads MQTT sin redacción. No se evidencia monitoreo suficiente para cambios de privilegios, fallos JWT o publicaciones MQTT no autorizadas. |
| 10 | **A10** — Dos pantallas de error *(Mishandling of Exceptional Conditions)* | ✅ Sí | Vulnerabilidad encontrada | - code/back-end_PIS6TO/src/middlewares/errorHandler.js - code/back-end_PIS6TO/src/controllers/datosController.js - code/back-end_PIS6TO/src/routes/Placa.js - code/back-end_PIS6TO/src/controllers/accountController.js - code/back-end_PIS6TO/src/controllers/weatherStateController.js - code/simulacion_mqtt/emulador_placa.js  Las respuestas HTTP devuelven directamente objetos o mensajes de excepción. Varias rutas y controladores asíncronos carecen de un wrapper uniforme. En Express 4, un rechazo de una función async puede no llegar al middleware de errores si no se propaga explícitamente. El simulador ignora excepciones durante el cierre. |

---

## 🧠 2. Respuestas a las Preguntas de Control y Evidencias APE

### A01 · Broken Access Control (Control de acceso roto)
- **Simulación:** La factura ajena (3/3 pasos completados)
- **Pregunta de Control:** *A01: Si un usuario puede ver la factura de otro cambiando solo el número de la dirección, ¿qué control falta y en qué capa debe vivir?*
- **Respuesta de la pareja:** Falta control de acceso, este tiene que estar implementado en todas las rutas privadas del backend, verificando el acceso a los datos y que le pertenezcan para permitir el acceso.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** COMPONENTES AFECTADOS:
- code/back-end_PIS6TO/src/routes/account.routes.js
- code/back-end_PIS6TO/src/controllers/accountController.js
- code/back-end_PIS6TO/src/routes/Placa.js
- code/back-end_PIS6TO/src/routes/weatherState.routes.js

IDOR y Asignación de roles por el usuario
La API expone operaciones de cuentas, placas y estados meteorológicos sin controles de autenticación y autorización consistentes. GET /account y GET /account/:external pueden enumerar cuentas. La creación de cuentas acepta un rol enviado por el cliente, incluido Administrador. Las rutas de placas permiten consultar, crear, modificar y eliminar recursos sin una política de acceso. La creación de estados meteorológicos también es pública.

### A02 · Security Misconfiguration (Configuración insegura)
- **Simulación:** La radiografía del servidor (3/3 pasos completados)
- **Pregunta de Control:** *A02: Menciona dos piezas de información que regala una cabecera como X-Powered-By: y explica por qué eso ayuda a un atacante.*
- **Respuesta de la pareja:** Conocer el motor del lenguaje y el servidor con sus versiones, permite al atacante identificar y buscar posibles vulnerabilidades en la red, conociendo así como vulnerar la aplicación solamente con la información de la cabecera.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** COMPONENTES AFECTADOS:
- code/back-end_PIS6TO/app.js
- code/back-end_PIS6TO/src/config/index.js
- code/simulacion_mqtt/broker.js
- code/front-end_PIS6TO/src/app/hooks/Conexion.js

La configuración permite CORS abierto, valores inseguros por defecto, comunicaciones HTTP/MQTT sin cifrado y acceso anónimo al broker cuando no se define MQTT_USERNAME. El broker escucha en 0.0.0.0. Estas opciones pueden terminar activas en entornos no locales si no existe una validación estricta
de configuración.

### A03 · Software Supply Chain Failures (Fallos de la cadena de suministro de software)
- **Simulación:** El escáner de dependencias (3/3 pasos completados)
- **Pregunta de Control:** *A03: ¿Por qué una aplicación puede contener código vulnerable que ningún integrante del equipo escribió? ¿Qué herramienta revisa esa situación en la Guía 04?*
- **Respuesta de la pareja:** El código vulnerable puede venir desde las dependencias necesarias para la aplicación, npm audit ayuda a escanear todas las dependencias para identificar vulnerabilidades.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - APE1/FASE4/software-supply-chain-auditoria.txt
- code/back-end_PIS6TO/package.json
- code/front-end_PIS6TO/package.json
- code/simulacion_mqtt/package.json
- code/front-end_PIS6TO/azure-pipelines.yml
- code/back-end_PIS6TO/.github/workflows/sonarqube.yml

El informe de npm audit documenta 28 vulnerabilidades, incluidas 15 de severidad alta y 3 críticas. También documenta vulnerabilidades de Mongoose y de xlsx, incluyendo prototype pollution sin corrección disponible en el estado auditado. Los manifiestos usan rangos mutables con ^ y el pipeline utiliza
npm install en vez de npm ci. Los lockfiles y un SHA de SonarQube aportan integridad parcial, pero no eliminan dependencias vulnerables ni garantizan una política de actualización segura.

### A04 · Cryptographic Failures (Fallos criptográficos)
- **Simulación:** La carrera del hash (3/3 pasos completados)
- **Pregunta de Control:** *A04: Explica con tus palabras por qué MD5 sirve para verificar la descarga de un archivo, pero no para guardar contraseñas.*
- **Respuesta de la pareja:** Sirve para verificar la firma de un paquete o archivo para verificar que es correcto, además, que sea rápido lo hace útil en este escenario. Pero, para almacenar contraseñas no sirve, al ser instantáneo y fácil de calcular, cualquier atacante con acceso al hash puede descifrar la contraseña.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/arduino_Pis6to/Pis_6to/Pis_6to.ino
- code/front-end_PIS6TO/src/app/hooks/Conexion.js
- code/back-end_PIS6TO/src/controllers/authController.js

El firmware contiene credenciales Wi-Fi. La conexión MQTT utiliza el puerto 1883 sin TLS. El frontend usa HTTP y el controlador de autenticación contiene credenciales SMTP en texto claro. Los secretos quedan expuestos en el código,
en el binario del firmware o en la red.

### A05 · Injection (Inyección)
- **Simulación:** El login que se deja engañar (3/3 pasos completados)
- **Pregunta de Control:** *A05: En una consulta que concatena el nombre de usuario dentro de las comillas, ¿qué hace cada parte del payload ' OR 1=1 -- y qué control lo detiene?*
- **Respuesta de la pareja:** la ' cierra el campo de texto que ingresa el usuario, permitiendo que lo demás que venga se ejecute como instrucción 
OR 1=1, es una condición siempre verdadera haciendo que la instrucción devuelva una ejecución correcta siempre
--, comenta todo lo consiguiente que tenga la instrucción original, evitando que se ejecute alguna validación más, como la validación de contraseñas

El control para detener este ataque se basa en parametrizar la entrada del usuario, haciendo que este no inyecte correctamente una instrucción, si no que todo se trate como texto
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/back-end_PIS6TO/src/controllers/accountController.js
- code/back-end_PIS6TO/src/controllers/roleController.js
- code/back-end_PIS6TO/src/services/roleServices.js
- code/back-end_PIS6TO/src/controllers/datosController.js

Los parámetros de consulta se convierten directamente en filtros MongoDB y los cuerpos HTTP se transfieren directamente a operaciones de actualización. Esto permite intentar introducir operadores como $ne, $regex, $where o campos anidados y modificar propiedades no destinadas al cliente.

### A06 · Insecure Design (Diseño inseguro)
- **Simulación:** Dos diseños, dos finales (3/3 pasos completados)
- **Pregunta de Control:** *A06: ¿Por qué el camino A de la práctica 6 era explotable aunque su código no tenía ningún error?*
- **Respuesta de la pareja:** El diseño de la solución era vulnerable, no se necesitaba ni siquiera implementar para poder evaluar porqué utilizar ese método de recuperación, el diseño estuvo mal desde del comienzo

Además se confió que el usuario mantenga en secreto su información de validación, el código puede ser perfecto, pero el peldaño más vulnerable siempre será el usuario humano
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/back-end_PIS6TO/src/routes/auth.routes.js
- code/back-end_PIS6TO/src/controllers/authController.js

El diseño de recuperación de contraseña almacena el token en claro, lo mantiene válido durante varias horas y no lo invalida después del cambio de contraseña. La activación de cuenta se basa únicamente en el correo recibido, sin una prueba de posesión mediante token. El flujo tampoco evidencia invalidación de sesiones existentes después de la recuperación.

### A07 · Authentication Failures (Fallos de autenticación)
- **Simulación:** Fuerza bruta con y sin freno (3/3 pasos completados)
- **Pregunta de Control:** *A07: ¿Qué tres capas de protección principales fortalecen la autenticación, y qué categoría hermana quedó registrando cada intento fallido en login.log?*
- **Respuesta de la pareja:** Las capas de protección principales son MFA, LÍMITE de intentos, SESIÓN SEGURA.
La categoría vinculada es A09.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/back-end_PIS6TO/src/routes/auth.routes.js
- code/back-end_PIS6TO/src/controllers/authController.js
- code/back-end_PIS6TO/src/policies/isLoggedIn.js
- code/back-end_PIS6TO/src/policies/isAdmin.js
- code/back-end_PIS6TO/src/helpers/tokenGeneration.js

La activación de cuentas no requiere autenticación ni token. Las respuestas de login y recuperación difieren cuando el usuario existe, permitiendo enumeración. La autenticación usa cabeceras inconsistentes y el middleware administrativo importa validateToken desde un módulo que aparentemente exporta solamente generateToken.

### A08 · Software or Data Integrity Failures (Fallos de integridad de software o datos)
- **Simulación:** El paquete alterado (3/3 pasos completados)
- **Pregunta de Control:** *A08: Un instalador cambia en un solo byte durante la descarga. ¿Qué le pasa al hash SHA-256 y qué decisión toma el usuario al verificarlo?*
- **Respuesta de la pareja:** El hash funciona bajo un efecto avalancha, haciendo que si cambia un solo byte de la descarga, la firma cambie completamente, ante esto, el usuario verifica que el hash sea el mismo publicado por el sitio de descarga, si no lo es, no se recomienda instalar eso.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/simulacion_mqtt/broker.js
- code/arduino_Pis6to/Pis_6to/Pis_6to.ino
- code/simulacion_mqtt/emulador_placa.js

El broker MQTT puede operar sin autenticación ni ACL por tópico. El firmware declara credenciales MQTT pero no las utiliza efectivamente. El emulador acepta mensajes de control y los marca como ejecutados sin comprobar emisor, firma, nonce, timestamp, autorización o replay.

### A09 · Security Logging & Alerting Failures (Fallos de registro y alerta)
- **Simulación:** El ataque invisible (3/3 pasos completados)
- **Pregunta de Control:** *A09: ¿Qué tres preguntas fundamentales responde una bitácora de seguridad que una pantalla vacía no puede?*
- **Respuesta de la pareja:** ¿Quién? está realizando la tarea
¿Cuando? se está realizando (fecha y hora)
¿Desde donde? dirección IP que permite identificar si es desde la misma red o desde fuera
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/back-end_PIS6TO/src/controllers/authController.js
- code/back-end_PIS6TO/src/middlewares/errorHandler.js
- code/simulacion_mqtt/broker.js

El flujo de recuperación registra objetos completos de cuenta, que pueden contener hashes, tokens, expiraciones y datos personales. El manejador de errores registra y expone message/details. El broker registra payloads MQTT sin redacción. No se evidencia monitoreo suficiente para cambios de privilegios, fallos JWT o publicaciones MQTT no autorizadas.

### A10 · Mishandling of Exceptional Conditions (Excepciones y errores mal gestionados)
- **Simulación:** Dos pantallas de error (3/3 pasos completados)
- **Pregunta de Control:** *A10: ¿A dónde se va el detalle técnico de un error cuando al usuario se le muestra un mensaje genérico, y por qué es mejor así?*
- **Respuesta de la pareja:** El detalle técnico se va a log interno (bitácora interna) del sistema, mostrando al usuario únicamente la información necesaria. Evita entregar información de más.
- **Estado en la aplicación APE:** `Vulnerabilidad encontrada`
- **Detalle del hallazgo / evidencia en nuestro proyecto:** - code/back-end_PIS6TO/src/middlewares/errorHandler.js
- code/back-end_PIS6TO/src/controllers/datosController.js
- code/back-end_PIS6TO/src/routes/Placa.js
- code/back-end_PIS6TO/src/controllers/accountController.js
- code/back-end_PIS6TO/src/controllers/weatherStateController.js
- code/simulacion_mqtt/emulador_placa.js

Las respuestas HTTP devuelven directamente objetos o mensajes de excepción. Varias rutas y controladores asíncronos carecen de un wrapper uniforme. En Express 4, un rechazo de una función async puede no llegar al middleware de errores si no se propaga explícitamente. El simulador ignora excepciones durante el cierre.

---
*Reporte generado desde el Simulador Autoguiado OWASP Top 10:2025 — Software Security UNL.*
