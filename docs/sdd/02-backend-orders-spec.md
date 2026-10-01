# Especificaciones del Backend (Orders API)

El módulo `OrdersService` (`api/src/orders/orders.service.ts`) es el responsable de manejar el negocio de las órdenes. Actualmente tiene fallos y lógica faltante que se debe implementar basándonos en las siguientes reglas estrictas.

## 1. Crear Orden (`POST /v1/orders`)

### 1.1 Validaciones de Entrada (Errores 400 y 404)
Antes de crear la orden, el sistema debe validar íntegramente el request:
- **Evento inexistente:** Si `eventId` no coincide con ninguno en el Store -> `404 NotFoundException`.
- **Localidad inexistente:** Si algún `ticketTypeId` del request no existe en el evento -> `404 NotFoundException`.
- **Items vacíos:** Si la propiedad `items` tiene longitud 0 -> `400 BadRequestException`.
- **Items duplicados:** Si hay dos objetos en `items` con el mismo `ticketTypeId` -> `400 BadRequestException`.
- **Inventario Excedido:** Si la cantidad solicitada (`quantity`) > inventario disponible (`remaining`) -> `400 BadRequestException`.
- **Límite Excedido:** Si la cantidad solicitada (`quantity`) > máximo permitido por orden (`maxPerOrder`) -> `400 BadRequestException`.

### 1.2 Cálculos Matemáticos
- **Manejo de Moneda:** Todo cálculo de dinero DEBE hacerse en **centavos enteros** (ej. $25.00 es 2500).
- **Subtotal de la Orden:** Sumatoria de `(quantity * priceCents)` de cada localidad seleccionada.
- **Cargo por Servicio (Fee):** `10%` del subtotal.
  - *Fórmula estricta:* `Math.round((subtotalCents * 10) / 100)`.
- **Total:** `Subtotal + Fee`.

### 1.3 Mutación de Estado
- **Reserva de Inventario:** Restar la cantidad solicitada del inventario del evento: `ticketType.remaining -= quantity`.
- **Creación de Orden:** Guardar en memoria con estado inicial `"pending"`, con un ID único (`ord_UUID`) y `buyer: null`.

---

## 2. Confirmar Orden (`POST /v1/orders/:id/confirm`)

### 2.1 Validaciones
- **Orden Inexistente:** Si el `id` no está en el Store -> `404 NotFoundException`.
- **Doble Confirmación:** Si el estado de la orden ya no es `"pending"` (ej. ya dice `"confirmed"`) -> `400 BadRequestException`.

### 2.2 Mutación de Estado
- Asignar el nombre (`name`) y correo (`email`) al campo `buyer`.
- Cambiar `status` a `"confirmed"`.
