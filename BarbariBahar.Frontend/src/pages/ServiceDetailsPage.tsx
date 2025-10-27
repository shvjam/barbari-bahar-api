// src/pages/ServiceDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MessageSquare, ArrowLeft, MapPin, ShoppingCart } from 'lucide-react';
import { Calendar as PersianCalendar } from '../components/ui/persian-calendar';
import { useOrder, type ScheduleDetails } from '../context/OrderContext';

const ServiceDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { origin, destination, schedule: initialSchedule, setScheduleDetails } = useOrder();

  const [schedule, setSchedule] = useState<ScheduleDetails>(initialSchedule);

  // The new calendar returns a Date object. We need to handle it.
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSchedule.date ? new Date(initialSchedule.date) : new Date()
  );

  useEffect(() => {
    // Update the main schedule state when the date picker's state changes
    if (selectedDate) {
      // Format date as YYYY-MM-DD string or any format you prefer
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setSchedule(prev => ({ ...prev, date: formattedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    // Update context whenever local schedule state changes
    setScheduleDetails(schedule);
  }, [schedule, setScheduleDetails]);

  const handleNextStep = () => {
    navigate('/order/quote');
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Vazirmatn']">
      <header className="bg-[#221896] text-white text-center p-6 shadow-md">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          جزئیات و زمان‌بندی
        </motion.h1>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <ShoppingCart className="ml-3 text-[#FF8B06]" />
            خلاصه سفارش شما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-start">
              <MapPin size={20} className="text-[#001AA8] mt-1 ml-2" />
              <div>
                <strong className="block">مبدأ:</strong>
                <p>{origin.fullAddress || 'انتخاب نشده'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin size={20} className="text-[#001AA8] mt-1 ml-2" />
              <div>
                <strong className="block">مقصد:</strong>
                <p>{destination.fullAddress || 'انتخاب نشده'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date Picker */}
            <div className="flex flex-col items-center">
              <label className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="ml-2 text-[#FF8B06]" />
                تاریخ را انتخاب کنید
              </label>
              <PersianCalendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>

            {/* Time and Description */}
            <div className="space-y-6">
              <div>
                <label htmlFor="time" className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Clock className="ml-2 text-[#FF8B06]" />
                  ساعت را مشخص کنید
                </label>
                <input
                  id="time"
                  type="time"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8B06] focus:border-transparent transition text-lg"
                  value={schedule.time}
                  onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="description" className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="ml-2 text-[#FF8B06]" />
                  توضیحات (اختیاری)
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8B06] focus:border-transparent transition"
                  placeholder="جزئیاتی که به ما در ارائه سرویس بهتر کمک می‌کند را اینجا بنویسید."
                  value={schedule.description}
                  onChange={(e) => setSchedule(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleNextStep}
              className="bg-[#221896] text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-[#001AA8] transition-all duration-300 transform hover:scale-105 disabled:bg-gray-400 mx-auto"
              disabled={!schedule.date || !schedule.time}
            >
              <span>مشاهده قیمت و تأیید</span>
              <ArrowLeft size={22} />
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ServiceDetailsPage;
