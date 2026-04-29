# Firebase Security Specification - Arsh Aqua

## 1. Data Invariants
- **Products**: Publicly readable, but only admins (if we had them, right now none) can write. For this app, they are read-only for users.
- **Orders**: Anyone can create an order. No one can read all orders (except admins). Customers can't even read their own without auth, but this app doesn't have customer accounts yet. So we'll limit it to create-only for public.
- **Contact Messages**: Create-only for public.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. Creating a product with a negative price.
2. Creating an order with a total amount that doesn't match the items (hard to check in rules without server-side logic, but we can check basic types).
3. Injecting `isAdmin: true` into a profile (not applicable yet).
4. Creating an order with a massive 1MB string in the address.
5. Updating a product's price from the client.
6. Deleting products from the client.
7. Reading all orders from the client.
8. Creating a message with missing required fields (name, message).
9. Using an invalid ID format for a doc.
10. Spoofing timestamps (overriding server timestamps).
11. Bypassing size limits on strings.
12. Attempting to update a "pending" order to "delivered" from the client.

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would be used to verify:
- `get` / `list` on `orders` returns `PERMISSION_DENIED`.
- `create` on `orders` with valid schema returns `SUCCESS`.
- `update` on `products` returns `PERMISSION_DENIED`.
