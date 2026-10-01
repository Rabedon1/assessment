# Plan de Pruebas y Tareas Extra

## 1. Estrategia de Pruebas Automáticas
- Las pruebas del sistema backend están orquestadas con **Jest** en `api/src/orders/orders.service.spec.ts`.
- Las especificaciones del backend (Documento 02) deben mapear 1:1 con estas pruebas.
- No se procederá con la etapa Frontend hasta que el comando `pnpm test` de la suite de `OrdersService` pase al 100%.

## 2. Desarrollo Funcional Interactivo (Checklist)
Una vez superada la prueba unitaria, la revisión funcional abarcará:
- [ ] Intentar enviar el formulario vacío en Checkout (debe saltar `yup`).
- [ ] Modificar manualmente en React DevTools una cantidad de tickets más alta que el inventario, intentar pagar (debe ser atajado por el Backend con 400 y el UI de react debe mostrar el error).
- [ ] Completar flujo feliz, y ver visualmente en ConfirmationPage los datos correctos.

## 3. Funcionalidad Extra Opcional (Post-MVP)
Si queda tiempo, se seleccionará **una** funcionalidad extra.
- *Propuesta elegida (Reserva de 15 min):* Implementar que la creación de orden almacene temporalmente un timestamp `expiresAt`. Usar lógica para reponer los `remaining` tickets si han pasado 15 minutos sin confirmar la orden, y hacer fallar el `confirmOrder` informando "El tiempo límite ha expirado".
