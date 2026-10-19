import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";

interface OrderItemInput {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export async function POST(req: Request) {
  let body: {
    customer: CustomerInput;
    items: OrderItemInput[];
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    !body?.customer?.name ||
    !body?.customer?.email ||
    !body?.items?.length
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const orderNumber = "VK-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const inserted = await db
    .insert(orders)
    .values({
      orderNumber,
      status: "confirmed",
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone ?? null,
      addressLine1: body.customer.addressLine1,
      addressLine2: body.customer.addressLine2 ?? null,
      city: body.customer.city,
      state: body.customer.state,
      postalCode: body.customer.postalCode,
      paymentMethod: body.paymentMethod,
      subtotal: String(body.subtotal),
      shipping: String(body.shipping),
      tax: String(body.tax),
      total: String(body.total),
      items: body.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
    })
    .returning();

  return NextResponse.json({
    success: true,
    order: {
      id: inserted[0].id,
      orderNumber: inserted[0].orderNumber,
      total: inserted[0].total,
      status: inserted[0].status,
    },
  });
}
