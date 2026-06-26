// Brand list & price helpers shared across admin
export const BRANDS = [
  "K-Gas", "Total Gas", "Pro-Gas", "Afri-Gas", "Wanjiko", "Kerry Gas",
  "Sea Gas", "Taifa Gas", "Gasky", "Ker Gas", "Jamii Gas", "Hashi Gas",
  "Moto Gas", "Oilybia", "Mid Gas", "Lake Gas", "Supa Gas", "Other",
] as const;

export const ACCESSORIES = ["Single Burner", "Double Burner", "Gas Regulator"] as const;

export const TRANSACTION_TYPES = ["Refill", "New Cylinder", "Exchange", "Accessory"] as const;

export const CYLINDER_SIZES = ["6kg", "13kg"] as const;

export const PAYMENT_METHODS = ["Cash", "M-Pesa", "Credit"] as const;

export const PAYMENT_STATUSES = ["Paid in Full", "Partial", "Pending"] as const;

export const MEDIA_SECTIONS = [
  "Hero", "About Carousel", "6kg Gallery", "13kg Gallery",
  "Burners", "Regulators", "Brand Logos",
] as const;

export const MOVEMENT_TYPES = ["Purchase", "Sale", "Exchange", "Adjustment", "Return"] as const;

export const formatKsh = (n: number | null | undefined) =>
  `Ksh ${Number(n ?? 0).toLocaleString("en-KE")}`;

export const computePaymentStatus = (total: number, paid: number) => {
  if (paid >= total && total > 0) return "Paid in Full";
  if (paid > 0) return "Partial";
  return "Pending";
};

export const formatPhoneForWhatsApp = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("7") || digits.startsWith("1")) return "254" + digits;
  return digits;
};

export const daysSince = (dateStr: string | null) => {
  if (!dateStr) return 0;
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
};
