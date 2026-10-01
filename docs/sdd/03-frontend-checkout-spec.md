# Especificaciones del Frontend (UI & Integración)

Esta sección define cómo deben comportarse las pantallas faltantes dentro del SPA de React, respetando las dependencias instaladas y los componentes del ecosistema.

## 1. Pantalla: Checkout (`CheckoutPage.tsx`)

### 1.1 Estado Inicial y Dependencias
- Recibe la selección de tickets por medio del React Router (`location.state` casteado a `CheckoutState`).
- Si se accede directamente sin datos de selección, debe redirigir a la vista principal (`/`).

### 1.2 Interfaz Visual
- **Columna Izquierda (Formulario):** 
  - Título del Evento.
  - Campos: Nombre (texto) y Email (correo).
  - Botón de "Pagar".
- **Columna Derecha (Resumen):**
  - Lista de localidades (ej. "2x General - $50.00").
  - Desglose: Subtotal, Cargo por Servicio (10%) y Total a Pagar.
  - *Dependencia útil:* Reutilizar la función `feeFromSubtotal` de `~/lib/money` para consistencia.

### 1.3 Lógica del Formulario
- Utilizar `react-hook-form` administrado por `yup`.
- **Reglas:**
  - `name`: string, required.
  - `email`: string, formato de email, required.

### 1.4 Lógica de Envío (Integración API)
1. Se desactiva el botón de envío y cambia a estado de carga (ej. "Procesando...").
2. Llamada a `createOrder` pasándole el arreglo de `items` y el `eventId`.
3. Una vez retornada la orden creada, llamada inmediata a `confirmOrder` usando el `id` devuelto.
4. Navegar programáticamente a `/orders/:orderId`.
5. *Manejo de Errores:* Cualquier fallo en los pasos 2 o 3 (ej. 400 Bad Request por falta de stock) debe detener la ejecución y plasmar el mensaje de error de la API visualmente en una caja de alerta.

---

## 2. Pantalla: Confirmación (`ConfirmationPage.tsx`)

### 2.1 Carga de Datos
- Lee el parámetro dinámico `:orderId` desde la URL (React Router `useParams`).
- Usa el hook `useApiQuery` llamando al endpoint `orderById` configurando `enabled: Boolean(orderId)`.

### 2.2 Estados de Representación
- **Estado Pending:** Mostrar indicador simple de "Cargando comprobante...".
- **Estado Error / Orden no existe:** Mostrar "No se pudo cargar la orden" con un botón/enlace para volver a eventos.
- **Estado Éxito:** Renderizar una interfaz que presente:
  - Número de Orden (ID).
  - Datos del comprador (Nombre y Correo devueltos por el backend en el objeto `buyer`).
  - Total pagado (utilizando `formatUsd`).
  - Lista de tickets comprados.
