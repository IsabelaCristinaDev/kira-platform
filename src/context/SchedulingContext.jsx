// Agendamento: profissional, serviço, data, horário, aba da agenda e confirmação · API: nenhuma (horários vêm de api.availability)
import { createContext, useContext, useState } from "react";
import { startOfMonth } from "../shared/utils/date";

const SchedulingContext = createContext(null);

export function SchedulingProvider({ children }) {
  const [selectedProId, setSelectedProId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [bookedSlot, setBookedSlot] = useState(null);
  const [viewMonth, setViewMonth] = useState(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);
  const [scheduleTime, setScheduleTime] = useState(null);
  const [agendaTab, setAgendaTab] = useState("proximo");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const selectScheduleDate = (date) => {
    setSelectedDate(date);
    setScheduleTime(null);
  };
  const changeMonth = (delta) => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  // Volta ao começo do fluxo: ao abrir o perfil de uma profissional
  const resetScheduling = () => {
    setBookedSlot(null);
    setSelectedServiceId(null);
    setSelectedDate(null);
    setScheduleTime(null);
    setViewMonth(startOfMonth(new Date()));
  };

  const value = {
    selectedProId,
    setSelectedProId,
    selectedServiceId,
    setSelectedServiceId,
    bookedSlot,
    setBookedSlot,
    viewMonth,
    setViewMonth,
    selectedDate,
    setSelectedDate,
    scheduleTime,
    setScheduleTime,
    agendaTab,
    setAgendaTab,
    selectedAppointmentId,
    setSelectedAppointmentId,
    selectScheduleDate,
    changeMonth,
    resetScheduling,
  };
  return <SchedulingContext.Provider value={value}>{children}</SchedulingContext.Provider>;
}

export const useScheduling = () => {
  const ctx = useContext(SchedulingContext);
  if (!ctx) throw new Error("useScheduling precisa estar dentro de <SchedulingProvider>");
  return ctx;
};
