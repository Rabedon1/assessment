# Estrategia y Arquitectura del Checkout

## 1. Objetivo
Implementar el flujo completo de compra (checkout) de entradas para eventos en BuenPlan, asegurando integridad transaccional en la reserva de boletos y una experiencia de usuario clara.

## 2. Arquitectura General del Sistema
- **Backend (NestJS):** Expone la API RESTful bajo `/v1/`. Contiene un almacén de datos en memoria (`store.ts`) que simula una base de datos.
- **Frontend (React + Vite):** Consume la API usando `@tanstack/react-query` a través de los wrappers `useApiQuery` y `useApiMutation`.

## 3. Flujo de Datos (Data Flow)
1. El usuario selecciona entradas en `EventDetailPage`.
2. Se navega a `CheckoutPage` pasando la selección inicial en memoria (vía React Router State).
3. El usuario ingresa sus datos y hace submit.
4. **Mutación 1:** El frontend llama a `POST /v1/orders` (Crear orden).
   - El backend reserva el inventario.
5. **Mutación 2:** El frontend llama inmediatamente a `POST /v1/orders/:id/confirm` (Confirmar orden).
   - El backend liga la orden a los datos del comprador.
6. El frontend redirige a `ConfirmationPage`.
7. **Consulta:** El frontend llama a `GET /v1/orders/:id` para traer los datos finales e imprimirlos en pantalla.
