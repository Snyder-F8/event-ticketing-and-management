import React from "react";
import { ticketsData } from "../../utils/constant";
import { MdPayment } from "react-icons/md";

const BookingHistory = () => {
  return (
    <div className="px-6 rounded-md">
      <h3 className="text-xl font-semibold mb-4">My Tickets</h3>
      {ticketsData.map((ticket) => (
        <>
          <div
            key={ticket.id}
            className="bg-white p-5 rounded-md mb-2 overflow-hidden"
          >
            <div className="flex items-start gap-10">
              {/* Poster container */}
              <div className="w-32 h-40 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={ticket.poster}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dashed divider */}
              <div className="h-40 border border-gray-300 border-dashed flex-shrink-0"></div>

              {/* Ticket info */}
              <div className="flex items-start justify-between w-full">
                <div className="flex-1">
                  <p className="font-normal text-lg">{ticket.title}</p>
                  <p className="text-sm text-gray-500">{ticket.tickets}</p>
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    {ticket.datetime} - {ticket.location}
                  </p>
                  <small className="text-gray-700 mt-1">
                    Quantity: {ticket.quantity}
                  </small>
                </div>
                <p>M-Ticket</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 mt-4 text-sm text-gray-700">
              <div className="flex flex-col">
                <span className="font-semibold mb-1">Booking Date & Time</span>
                <span>{ticket.bookingTime}</span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold mb-1">Payment Method</span>
                <span className="flex items-center gap-1">
                  <MdPayment className="inline text-gray-500" size={16} />
                  {ticket.paymentMethod}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold mb-1">Booking ID</span>
                <span>{ticket.id}</span>
              </div>
            </div>

            <div className="p-4 text-right">
              <p className="text-sm text-gray-500">
                Ticket: Ksh {ticket.ticket.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Tax: Ksh {ticket.fee.toFixed(2)}
              </p>
              <p className="text-lg font-bold text-gray-700">
                Total: Ksh {ticket.total.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default BookingHistory;
