export interface Review {
  id: number;
  quote: string;
  author: string;
  verified: boolean;
  product: string;
  rating: number;
}

const globalKey = "__lezari_reviews__";

declare global {
  // eslint-disable-next-line no-var
  var __lezari_reviews__: Review[] | undefined;
}

const defaultReviews: Review[] = [
  {
    id: 1,
    quote: "I've been wearing the Tulip necklace daily for 3 months and it still looks great. Really happy with the quality for the price!",
    author: "Pooja Mehta",
    verified: true,
    product: "Tulip Salene Necklace",
    rating: 5,
  },
  {
    id: 2,
    quote: "Finally jewellery that doesn't irritate my sensitive ears. The Nale Huggies are featherlight and so pretty. Highly recommended!",
    author: "Rhea Sharma",
    verified: true,
    product: "Nale White Stone Huggies",
    rating: 5,
  },
  {
    id: 3,
    quote: "The packaging, the finish, everything feels premium without breaking the bank. Great value for money.",
    author: "Sneha Nair",
    verified: true,
    product: "Heart Tale Charm Band",
    rating: 5,
  },
];

function getStore(): Review[] {
  if (!global[globalKey]) {
    global[globalKey] = [...defaultReviews];
  }
  return global[globalKey]!;
}

export function getReviews(): Review[] {
  return [...getStore()];
}

export function updateReview(id: number, patch: Partial<Review>): Review | null {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store[idx] = { ...store[idx], ...patch };
  return { ...store[idx] };
}

export function addReview(review: Omit<Review, "id">): Review {
  const store = getStore();
  const newId = Math.max(0, ...store.map((r) => r.id)) + 1;
  const newReview: Review = { ...review, id: newId };
  store.push(newReview);
  return newReview;
}

export function deleteReview(id: number): boolean {
  const store = getStore();
  const idx = store.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  store.splice(idx, 1);
  return true;
}
