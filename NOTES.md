# Notas sobre la Prueba Técnica

## ¿Qué hice?
- **Backend:** Se implementaron todas las reglas de negocio en `orders.service.ts` para que la compra se comporte correctamente y pasen los tests (`pnpm test`):
  - Validaciones de errores (no comprar boletos agotados o exceder límite, no permitir duplicados).
  - Cálculo del fee del 10% asegurando uso de enteros (`Math.round`).
  - Restar del inventario en memoria al crear la orden.
  - Validación de que la orden debe estar en `pending` antes de poderse confirmar.
  - *Funcionalidad Extra:* Se implementó el cupón `SAVE10` que reduce el 10% del subtotal antes del cargo por servicio. Esto implicó actualizar el DTO, el tipo de dato y la lógica interna de cálculo.
- **Frontend:** Se construyeron las pantallas restantes:
  - `CheckoutPage`: Formulario conectado con `react-hook-form` y `yup` para las validaciones. Muestra el resumen matemático de la compra reaccionando en vivo (incluyendo el ingreso dinámico del cupón `SAVE10`). Realiza de manera secuencial y segura las mutaciones de crear y confirmar.
  - `ConfirmationPage`: Carga de la orden mediante `useApiQuery` e interfaz de éxito.
- **Especificaciones (SDD):** Utilicé un enfoque de diseño guiado por especificaciones (creando la carpeta `docs/sdd/`) para trazar las reglas técnicas antes de codificarlas, asegurando la calidad del código.

## ¿Qué no me alcanzó?
- Si bien completé el flujo MVP y el extra del descuento `SAVE10`, no implementé la funcionalidad extra de la *liberación del inventario a los 15 minutos de reserva*. Elegí priorizar calidad y asegurar los tests al 100% sobre agregar demasiadas cosas a la vez.

## ¿Qué haría distinto con más tiempo?
1. **Base de datos real y persistencia:** Sustituiría el `store.ts` en memoria por una base de datos relacional (PostgreSQL) usando Prisma o TypeORM para asegurar la atomicidad mediante transacciones en la base de datos (vital para la venta concurrente de boletos).
2. **Caché y Concurrencia:** Aplicaría Redis para manejar las reservas temporales (los 15 minutos) con un TTL (Time-To-Live). Si el TTL caduca, un evento restaura automáticamente el inventario.
3. **Manejo de Errores UX:** En el frontend colocaría una librería de *Toast* notifications (como Sonner o react-hot-toast) para mostrar los errores y retroalimentación en un formato de notificaciones flotantes, mejorando la experiencia frente a la caja de alerta estática actual.
4. **Testing en Frontend:** Agregaría pruebas automatizadas (React Testing Library) para asegurar que el formulario muestra los errores si el usuario intenta enviar datos vacíos.
