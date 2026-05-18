import { useState, useEffect } from 'react';

export function useBookingCalendar(apartmentPrice: number, bookedDates: any[]) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (startDate && endDate) {
      const nights = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setNumberOfNights(nights);
      setTotalPrice(nights * (apartmentPrice || 0));
    } else {
      setNumberOfNights(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, apartmentPrice]);

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booking) => {
      const start = new Date(booking.start);
      const end = new Date(booking.end);
      return date >= start && date <= end;
    });
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    return date > startDate && date < endDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return;

    if (!startDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (!endDate) {
      if (date > startDate) {
        setEndDate(date);
      } else {
        setStartDate(date);
        setEndDate(null);
      }
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  return {
    startDate,
    endDate,
    numberOfNights,
    totalPrice,
    currentMonth,
    setCurrentMonth,
    isDateBooked,
    isDateInRange,
    handleDateClick,
    resetDates: () => { setStartDate(null); setEndDate(null); }
  };
}