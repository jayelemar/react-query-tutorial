import axiosInstance from "@/lib/axios/axiosInstance";
import { queryKeys } from "@/lib/react-query/queryKey";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";

export interface Id {
  id: number;
}

export interface Appointment extends Id {
  dateTime: Date;
  treatmentName: string;
  userId?: number;
}

export type AppointmentDateMap = Record<number, Appointment[]>;

export interface MonthYear {
  startDate: dayjs.Dayjs; // first day of the month
  firstDOW: number; // day of week; 0 === Sunday
  lastDate: number; // last date of the month
  monthName: string; // name of the month
  month: string; // two digit month number
  year: string; // four digit year
}

const commonOptions = {
  staleTime: 0,
  gcTime: 30000, // 5 minutes
};

export function getMonthYearDetails(initialDate: dayjs.Dayjs): MonthYear {
  const month = initialDate.format("MM");
  const year = initialDate.format("YYYY");
  const startDate = dayjs(`${year}${month}01`);
  const firstDOW = Number(startDate.format("d"));
  const lastDate = Number(startDate.clone().endOf("month").format("DD"));
  const monthName = startDate.format("MMMM");
  return { startDate, firstDOW, lastDate, monthName, month, year };
}
export function getNewMonthYear(
  prevData: MonthYear,
  monthIncrement: number,
): MonthYear {
  // update the monthYear by the specified increment
  const newMonthYear = getUpdatedMonthYear(prevData, monthIncrement);

  // return object with the details for the new monthYear
  return getMonthYearDetails(newMonthYear);
}

export function getUpdatedMonthYear(
  monthYear: MonthYear,
  monthIncrement: number,
): dayjs.Dayjs {
  // the clone is necessary to prevent mutation
  return monthYear.startDate.clone().add(monthIncrement, "months");
}

export function appointmentInPast(appointmentData: Appointment): boolean {
  const now = dayjs();
  return dayjs(appointmentData.dateTime) < now;
}

export function getAvailableAppointments(
  appointments: AppointmentDateMap,
  userId: number | null,
): AppointmentDateMap {
  // clone so as not to mutate argument directly
  const filteredAppointments = { ...appointments };

  // only keep appointments that are open (or taken by the logged-in user) and are not in the past)
  Object.keys(filteredAppointments).forEach((date) => {
    const dateNum = Number(date);
    filteredAppointments[dateNum] = filteredAppointments[dateNum].filter(
      (appointment: Appointment) =>
        (!appointment.userId || appointment.userId === userId) &&
        !appointmentInPast(appointment),
    );
  });

  return filteredAppointments;
}

async function getAppointments(
  year: string,
  month: string,
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

export function useAppointments() {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  const [showAll, setShowAll] = useState(false);
  // const { userId } = useLoginData();

  const selectFn = useCallback(
    (data: AppointmentDateMap, showAll: boolean) => {
      if (showAll) return data;
      return getAvailableAppointments(data, userId);
    },
    [userId],
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    // assume increment of one month
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery({
      queryKey: [
        queryKeys.appointments,
        nextMonthYear.year,
        nextMonthYear.month,
      ],
      queryFn: () => getAppointments(nextMonthYear.year, nextMonthYear.month),
      ...commonOptions,
    });
  }, [queryClient, monthYear]);

  const fallback: AppointmentDateMap = {};

  const { data: appointments = fallback } = useQuery({
    queryKey: [queryKeys.appointments, monthYear.year, monthYear.month],
    queryFn: () => getAppointments(monthYear.year, monthYear.month),
    select: (data) => selectFn(data, showAll),
    refetchInterval: 60_000, // every minute
    staleTime: 0, // so that the data is always fresh
    gcTime: 30_000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}
