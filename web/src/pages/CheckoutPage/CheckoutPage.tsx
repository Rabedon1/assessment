import { Navigate, useLocation, useNavigate } from 'react-router';
import { CheckoutState, Order } from '~/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApiMutation, createOrder, confirmOrder } from '~/api';
import { ConfirmOrderBody, CreateOrderBody } from '~/api/endpoints/orders';
import { feeFromSubtotal, formatUsd } from '~/lib/money';
import { useState, useEffect } from 'react';

const schema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
}).required();

type FormData = yup.InferType<typeof schema>;

export function CheckoutPage() {
  const location = useLocation();
  const selection = location.state as CheckoutState | null;
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [pendingConfirmationData, setPendingConfirmationData] = useState<{id: string, data: FormData} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const { mutateAsync: create } = useApiMutation<Order, Record<string, never>, CreateOrderBody>(createOrder);
  
  const confirmOrderId = pendingConfirmationData ? pendingConfirmationData.id : '';
  const { mutateAsync: confirm, isPending: isConfirming } = useApiMutation<Order, { id: string }, ConfirmOrderBody>(confirmOrder, { id: confirmOrderId });

  useEffect(() => {
    if (pendingConfirmationData && confirmOrderId === pendingConfirmationData.id) {
      confirm(pendingConfirmationData.data)
        .then(() => {
          navigate(`/orders/${pendingConfirmationData.id}`);
        })
        .catch((err) => {
          setApiError(err.message || 'Error al confirmar la orden');
          setPendingConfirmationData(null);
        });
    }
  }, [pendingConfirmationData, confirmOrderId, confirm, navigate]);

  if (!selection?.items.length) {
    return <Navigate to="/" replace />;
  }

  const subtotalCents = selection.items.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0,
  );
  const feeCents = feeFromSubtotal(subtotalCents);
  const totalCents = subtotalCents + feeCents;

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      const order = await create({
        eventId: selection.eventId,
        items: selection.items.map((item) => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
        })),
      });

      setPendingConfirmationData({ id: order.id, data });
    } catch (err: any) {
      setApiError(err.message || 'Error al procesar la compra');
    }
  };

  const isLoading = isSubmitting || isConfirming || pendingConfirmationData !== null;

  return (
    <main className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1fr_280px]">
      <section className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
        <h1 className="text-2xl font-semibold tracking-tight">Tus datos</h1>
        <p className="mt-2 text-sm text-ink/70">
          Completa el checkout para <strong>{selection.eventTitle}</strong>.
        </p>
        
        {apiError && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              disabled={isLoading}
              {...register('name')}
              className="mt-1 block w-full rounded-lg border-black/10 shadow-sm focus:border-accent focus:ring-accent sm:text-sm disabled:opacity-50"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              disabled={isLoading}
              {...register('email')}
              className="mt-1 block w-full rounded-lg border-black/10 shadow-sm focus:border-accent focus:ring-accent sm:text-sm disabled:opacity-50"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          >
            {isLoading ? 'Procesando...' : 'Pagar'}
          </button>
        </form>
      </section>
      
      <aside className="h-max rounded-2xl bg-white p-5 ring-1 ring-black/5">
        <h2 className="font-semibold">Resumen</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {selection.items.map((item) => (
            <li key={item.ticketTypeId} className="flex justify-between">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatUsd(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-black/10 pt-4">
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatUsd(subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Cargo por servicio</dt>
              <dd>{formatUsd(feeCents)}</dd>
            </div>
            <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-black/10">
              <dt>Total</dt>
              <dd>{formatUsd(totalCents)}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </main>
  );
}
