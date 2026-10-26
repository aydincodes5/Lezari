/**
 * Site-wide settings with in-memory store.
 * These persist for the lifetime of the server process.
 * Admin can toggle them via /admin panel.
 */

export interface SiteSettings {
  reviewsVisible: boolean;
  announcementText: string;
  heroSlideImages: string[];
  categoryImages: Record<string, string>;
}

const defaultSettings: SiteSettings = {
  reviewsVisible: false, // Hidden by default; admin can enable
  announcementText: "Free Shipping on orders above ₹1999 · Stainless Steel Fashion Jewellery",
  heroSlideImages: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1920&auto=format&fit=crop",
  ],
  categoryImages: {
    necklaces: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    earrings: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
    rings: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    bracelets: "https://images.unsplash.com/photo-1611591475878-83804868f060?q=80&w=800&auto=format&fit=crop",
    anklets: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
    combos: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
  },
};

// In-memory singleton — survives hot reloads in dev via global
const globalKey = "__lezari_site_settings__";

declare global {
  // eslint-disable-next-line no-var
  var __lezari_site_settings__: SiteSettings | undefined;
}

function getStore(): SiteSettings {
  if (!global[globalKey]) {
    global[globalKey] = { ...defaultSettings };
  }
  return global[globalKey]!;
}

export function getSettings(): SiteSettings {
  return { ...getStore() };
}

export function updateSettings(patch: Partial<SiteSettings>): SiteSettings {
  const store = getStore();
  Object.assign(store, patch);
  return { ...store };
}
