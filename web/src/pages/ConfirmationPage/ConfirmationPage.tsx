import { Link, useParams } from 'react-router';
import { orderById, useApiQuery } from '~/api';
import { Order } from '~/types';
import { formatUsd } from '~/lib/money';

export function ConfirmationPage() {
  const { orderId = '' } = useParams();

  const { data: order, isPending, isError } = useApiQuery<Order>(
    orderById,
    { id: orderId },
    { enabled: Boolean(orderId) },
  );

  if (isPending) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center text-ink/60">
        <p>Cargando comprobante...</p>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-red-600">No se pudo cargar la orden</h1>
        <p className="mt-3 text-ink/70">Revisa que la dirección sea la correcta o intenta nuevamente.</p>
        <Link to="/" className="mt-8 inline-block text-accent hover:underline">
          Volver a eventos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">¡Gracias por tu compra!</h1>
        <p className="mt-2 text-ink/70">
          Tu orden <strong>{order.id}</strong> ha sido confirmada.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
        <div className="px-6 py-5 border-b border-black/5">
          <h2 className="text-lg font-medium">Resumen del pedido</h2>
          <p className="text-sm text-ink/60 mt-1">
            Comprador: {order.buyer?.name} ({order.buyer?.email})
          </p>
        </div>
        
        <ul className="divide-y divide-black/5 px-6">
          {order.items.map((item) => (
            <li key={item.ticketTypeId} className="flex justify-between py-4 text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span className="font-medium">{formatUsd(item.lineTotalCents)}</span>
            </li>
          ))}
        </ul>

        <div className="bg-paper/50 px-6 py-5 border-t border-black/5">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-ink/70">
              <dt>Subtotal</dt>
              <dd>{formatUsd(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-ink/70">
              <dt>Cargo por servicio</dt>
              <dd>{formatUsd(order.feeCents)}</dd>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-black/10 text-ink">
              <dt>Total pagado</dt>
              <dd>{formatUsd(order.totalCents)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="inline-block text-accent hover:underline font-medium">
          ← Volver a eventos
        </Link>
      </div>
    </main>
  );
}
