import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import {
  defaultStudio,
  type Booking,
  type Promo,
  type Service,
  type StudioData,
  type WorkItem,
} from "@/lib/studio";

type StudioState = StudioData & {
  patch: (partial: Partial<StudioData>) => void;
  setServices: (services: Service[]) => void;
  upsertService: (service: Service) => void;
  removeService: (id: string) => void;
  upsertWork: (work: WorkItem) => void;
  removeWork: (id: string) => void;
  upsertPromo: (promo: Promo) => void;
  removePromo: (id: string) => void;
  addBooking: (booking: Booking) => void;
  setBookingStatus: (id: string, status: Booking["status"]) => void;
  restoreCatalog: () => void;
};

export const useStudio = create<StudioState>()(
  persist(
    (set) => ({
      ...defaultStudio(),
      patch: (partial) => set(partial),
      setServices: (services) => set({ services }),
      upsertService: (service) =>
        set((s) => ({
          services: s.services.some((x) => x.id === service.id)
            ? s.services.map((x) => (x.id === service.id ? service : x))
            : [...s.services, service],
        })),
      removeService: (id) => set((s) => ({ services: s.services.filter((x) => x.id !== id) })),
      upsertWork: (work) =>
        set((s) => ({
          works: s.works.some((x) => x.id === work.id)
            ? s.works.map((x) => (x.id === work.id ? work : x))
            : [...s.works, work],
        })),
      removeWork: (id) => set((s) => ({ works: s.works.filter((x) => x.id !== id) })),
      upsertPromo: (promo) =>
        set((s) => ({
          promos: s.promos.some((x) => x.id === promo.id)
            ? s.promos.map((x) => (x.id === promo.id ? promo : x))
            : [...s.promos, promo],
        })),
      removePromo: (id) => set((s) => ({ promos: s.promos.filter((x) => x.id !== id) })),
      addBooking: (booking) => set((s) => ({ bookings: [booking, ...s.bookings] })),
      setBookingStatus: (id, status) =>
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        })),
      restoreCatalog: () => {
        const fresh = defaultStudio();
        set((s) => ({
          ...fresh,
          bookings: s.bookings,
          logoImage: s.logoImage,
          hero: s.hero,
          works: s.works,
        }));
      },
    }),
    { name: "koreafan-studio-v1", skipHydration: true },
  ),
);

if (typeof window !== "undefined") {
  void useStudio.persist.rehydrate();
}

export function useRehydrate() {
  useEffect(() => {
    void useStudio.persist.rehydrate();
  }, []);
}

export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (useStudio.persist.hasHydrated()) {
      setReady(true);
      return;
    }
    return useStudio.persist.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}
