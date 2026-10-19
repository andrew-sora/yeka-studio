// Analytics & Ad Event Tracking Utility for Yeka Creative Studio
// Supports Google Analytics 4 (gtag) and Meta / Facebook Pixel (fbq)

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export type EventName =
  | 'whatsapp_click'
  | 'view_package'
  | 'select_slot'
  | 'open_booking_modal'
  | 'submit_review';

export interface EventParams {
  category?: string;
  package_id?: string;
  package_title?: string;
  price?: string;
  slot_date?: string;
  slot_time?: string;
  source?: string;
  [key: string]: any;
}

export function trackEvent(eventName: EventName | string, params: EventParams = {}) {
  try {
    // 1. Log in dev console for live client demonstrations
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
      console.log(`[📊 Analytics Tracked] Event: "${eventName}"`, params);
    }

    if (typeof window === 'undefined') return;

    // 2. Fire Google Analytics Event (gtag) if installed
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }

    // 3. Fire Meta / Facebook Pixel Event (fbq) if installed
    if (typeof window.fbq === 'function') {
      if (eventName === 'whatsapp_click' || eventName === 'open_booking_modal') {
        window.fbq('track', 'Lead', {
          content_name: params.package_title || 'WhatsApp Inquiry',
          content_category: params.category,
          value: params.price ? parseFloat(params.price.replace(/[^0-9]/g, '')) : 0,
          currency: 'IDR',
        });
      } else {
        window.fbq('trackCustom', eventName, params);
      }
    }
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
}
