# Notas sobre la Prueba Técnica
Para el desarrollo de esta prueba utilice un enfoque bajo el marco de trabajo SDD( desarrollo bajo especificaciones) en el cual lo primero que se hace es poder darle un contexto y pasos para darle claridad al proyecto, ademas tambien se le puede agregar las pruebas unitarias, pasos de configuraciones, y también restricciones y lógica de negocio, la idea es tener toda la esencia del proyecto escrita para poder desarrollador de mejor manera y con reglas claras y sobre todo con calidad. 

## ¿Qué hice?
- **Especificaciones (SDD):** Lo primero que utilicé fue un enfoque de diseño guiado por especificaciones (creando la carpeta `docs/sdd/`) para trazar las reglas técnicas antes de codificarlas, asegurando la calidad del código.
- **Backend:** Se implementaron todas las reglas de negocio en `orders.service.ts` para que la compra se comporte correctamente y pasen los tests (`pnpm test`):
  - Validaciones de errores (no comprar boletos agotados o exceder límite, no permitir duplicados).
  - Cálculo del fee del 10% asegurando uso de enteros (`Math.round`).
  - Restar del inventario en memoria al crear la orden.
  - Validación de que la orden debe estar en `pending` antes de poderse confirmar.
  - Se implementó el cupón `SAVE10` que reduce el 10% del subtotal antes del cargo por servicio. Esto implicó actualizar el DTO, el tipo de dato y la lógica interna de cálculo. Adicionalmente, se escribieron dos casos de prueba extra en la suite de Jest para asegurar matemáticamente este cálculo y verificar que el código funcione de forma 'case-insensitive'.
- **Frontend:** Se construyeron las pantallas restantes:
  - `CheckoutPage`: Formulario conectado con `react-hook-form` y `yup` para las validaciones. Muestra el resumen matemático de la compra reaccionando en vivo (incluyendo el ingreso dinámico del cupón `SAVE10`). Realiza de manera secuencial y segura las mutaciones de crear y confirmar.
  - `ConfirmationPage`: Carga de la orden mediante `useApiQuery` e interfaz de éxito.

## ¿Qué no me alcanzó?
- Si bien completé el flujo MVP y el extra del descuento `SAVE10`, no implementé la funcionalidad extra de la *liberación del inventario a los 15 minutos de reserva*. Elegí priorizar calidad y asegurar los tests al 100% sobre agregar demasiadas cosas a la vez.

## ¿Qué haría distinto con más tiempo?
1. **Base de datos real y persistencia:** El primer paso es persistencia de los datos, sustituiría el `store.ts` que esta en la memoria por una base de datos relacional (PostgreSQL) usando Prisma o TypeORM para asegurar la atomicidad mediante transacciones en la base de datos (vital para la venta concurrente de boletos).
2. **Caché y Concurrencia:** Tambien Aplicaría Redis para manejar las reservas temporales (los 15 minutos) con un TTL (Time-To-Live). Si el TTL caduca, un evento restaura automáticamente el inventario.
4. **Manejo de Errores UX:** En el frontend colocaría una librería de *Toast* notifications (como Sonner o react-hot-toast) para mostrar los errores y retroalimentación en un formato de notificaciones flotantes, mejorando la experiencia frente a la caja de alerta estática actual.
5. **Testing en Frontend:** Agregaría pruebas automatizadas (React Testing Library) para asegurar que el formulario muestra los errores si el usuario intenta enviar datos vacíos.

NOTA: Se podria dar mejoras al proyecto, pero para esta ocasión se implemento estrictamente lo que pedía las instrucciones de la prueba
