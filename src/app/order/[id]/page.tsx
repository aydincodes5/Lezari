import { redirect } from "next/navigation";

export default async function SingleOrderRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/orders/${encodeURIComponent(id)}`);
}
