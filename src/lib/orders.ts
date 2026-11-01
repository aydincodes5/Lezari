import prisma from "@/lib/prisma";

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItemDetail {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderRecord {
  id: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  phone?: string;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  trackingNumber?: string;
  courierPartner?: string;
  items: OrderItemDetail[];
  shippingAddress: OrderShippingAddress;
  createdAt: string;
  updatedAt: string;
}

const defaultOrders: OrderRecord[] = [
  {
    id: "ORD-LZR-98214",
    userId: "demo-user-1",
    customerName: "Pooja Mehta",
    customerEmail: "pooja.mehta@gmail.com",
    phone: "+91 98201 44521",
    total: 674,
    status: "DELIVERED",
    paymentMethod: "Cash on Delivery",
    trackingNumber: "DTDC-99281745",
    courierPartner: "DTDC Express",
    items: [
      {
        id: "item-1",
        productId: "lez-01",
        name: "Nale White Stone Huggies",
        price: 285,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: "item-2",
        productId: "lez-04",
        name: "Tulip Salene Pendant Necklace",
        price: 389,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: {
      fullName: "Pooja Mehta",
      phone: "+91 98201 44521",
      line1: "Flat 402, Sunshine Heights, Linking Road",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-LZR-87423",
    userId: "demo-user-2",
    customerName: "Rhea Sharma",
    customerEmail: "rhea.sharma@yahoo.com",
    phone: "+91 98112 33456",
    total: 399,
    status: "SHIPPED",
    paymentMethod: "UPI on Delivery",
    trackingNumber: "BLUEDART-8837190",
    courierPartner: "Blue Dart",
    items: [
      {
        id: "item-3",
        productId: "lez-08",
        name: "Green Laura Clover Necklace",
        price: 399,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: {
      fullName: "Rhea Sharma",
      phone: "+91 98112 33456",
      line1: "B-14, Defense Colony",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110024",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "ORD-LZR-76319",
    userId: "demo-user-3",
    customerName: "Sneha Nair",
    customerEmail: "sneha.nair@outlook.com",
    phone: "+91 97405 66789",
    total: 649,
    status: "PROCESSING",
    paymentMethod: "Cash on Delivery",
    courierPartner: "Delhivery",
    items: [
      {
        id: "item-4",
        productId: "lez-11",
        name: "Colette Charm Layered Set",
        price: 649,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: {
      fullName: "Sneha Nair",
      phone: "+91 97405 66789",
      line1: "Plot 88, 5th Cross, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

const globalKeyOrders = "__lezari_orders__";

declare global {
  // eslint-disable-next-line no-var
  var __lezari_orders__: OrderRecord[] | undefined;
}

function getOrdersStore(): OrderRecord[] {
  if (!globalThis[globalKeyOrders]) {
    globalThis[globalKeyOrders] = [...defaultOrders];
  }
  return globalThis[globalKeyOrders]!;
}

export function getAllOrders(): OrderRecord[] {
  const store = getOrdersStore();
  return [...store].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getOrderById(id: string): OrderRecord | undefined {
  if (!id) return undefined;
  const store = getOrdersStore();
  const normalized = id.trim().toUpperCase();
  return store.find((o) => o.id.toUpperCase() === normalized);
}

export function getOrdersByUser(userId?: string | null, email?: string | null): OrderRecord[] {
  const store = getOrdersStore();
  return store
    .filter((o) => {
      const matchUserId = userId && o.userId === userId;
      const matchEmail = email && o.customerEmail.toLowerCase() === email.toLowerCase();
      return matchUserId || matchEmail;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createOrderRecord(data: {
  id?: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  phone?: string;
  total: number;
  paymentMethod?: string;
  items: OrderItemDetail[];
  shippingAddress: OrderShippingAddress;
}): OrderRecord {
  const store = getOrdersStore();
  const orderId =
    data.id ||
    `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

  const newOrder: OrderRecord = {
    id: orderId,
    userId: data.userId || null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    phone: data.phone || data.shippingAddress.phone || "",
    total: data.total,
    status: "PENDING",
    paymentMethod: data.paymentMethod || "Cash on Delivery",
    courierPartner: "Standard Express",
    items: data.items,
    shippingAddress: data.shippingAddress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store.unshift(newOrder);
  return newOrder;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  trackingNumber?: string,
  courierPartner?: string
): OrderRecord | null {
  const store = getOrdersStore();
  const normalized = id.trim().toUpperCase();
  const idx = store.findIndex((o) => o.id.toUpperCase() === normalized);
  if (idx === -1) return null;

  store[idx] = {
    ...store[idx],
    status,
    ...(trackingNumber !== undefined && { trackingNumber }),
    ...(courierPartner !== undefined && { courierPartner }),
    updatedAt: new Date().toISOString(),
  };

  return store[idx];
}

export function deleteOrderRecord(id: string): boolean {
  const store = getOrdersStore();
  const normalized = id.trim().toUpperCase();
  const idx = store.findIndex((o) => o.id.toUpperCase() === normalized);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
