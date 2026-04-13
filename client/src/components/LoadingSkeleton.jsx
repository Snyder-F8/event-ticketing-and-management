// src/components/LoadingSkeleton.jsx
import React from "react";

export function EventCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-blue-20">
      <div className="h-48 animate-shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
        <div className="h-3 w-full rounded animate-shimmer" />
        <div className="h-3 w-2/3 rounded animate-shimmer" />
        <div className="flex gap-4 mt-4">
          <div className="h-3 w-1/3 rounded animate-shimmer" />
          <div className="h-3 w-1/3 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div className="rounded-2xl border border-blue-20 bg-white p-6">
      <div className="flex gap-4">
        <div className="h-16 w-16 rounded-xl animate-shimmer flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded animate-shimmer" />
          <div className="h-3 w-1/2 rounded animate-shimmer" />
          <div className="h-3 w-1/3 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-surface-main flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-20 border-t-primary animate-spin" />
        <p className="text-muted text-sm">Loading...</p>
      </div>
    </div>
  );
}
