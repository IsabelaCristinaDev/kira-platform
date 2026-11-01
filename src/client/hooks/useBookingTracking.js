// Estado do acompanhamento do agendamento: carrega, escuta as etapas e avisa o pagamento · api.bookings
import { useCallback, useEffect, useState } from "react";
import { api } from "../../shared/api";

export function useBookingTracking(id) {
  const [state, setState] = useState({ status: "loading", booking: null });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);

  const load = useCallback(() => {
    setState({ status: "loading", booking: null });
    return api.bookings.get(id).then(
      (booking) => setState({ status: "ready", booking }),
      () => setState({ status: "error", booking: null }),
    );
  }, [id]);

  useEffect(() => {
    let active = true;
    load();
    const stop = api.bookings.subscribe(id, (booking) => {
      if (active) setState({ status: "ready", booking });
    });
    return () => {
      active = false;
      stop();
    };
  }, [id, load]);

  const reportPayment = useCallback(async () => {
    setPaying(true);
    setPayError(false);
    try {
      const booking = await api.bookings.reportPayment(id);
      setState({ status: "ready", booking });
    } catch {
      setPayError(true);
    } finally {
      setPaying(false);
    }
  }, [id]);

  return { ...state, reload: load, reportPayment, paying, payError };
}
