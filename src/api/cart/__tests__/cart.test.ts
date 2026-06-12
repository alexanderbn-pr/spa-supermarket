import { describe, it, expect, vi, beforeEach } from 'vitest';

// Build a chainable mock for Supabase queries (hoisted so vi.mock can access it)
const { mockChain } = vi.hoisted(() => {
  function buildChain() {
    const chain: Record<string, ReturnType<typeof vi.fn>> = {};

    const methods = ['select', 'eq', 'maybeSingle', 'update', 'insert', 'single'];

    for (const method of methods) {
      chain[method] = vi.fn(() => chain);
    }

    return chain as {
      select: ReturnType<typeof vi.fn>;
      eq: ReturnType<typeof vi.fn>;
      maybeSingle: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
      insert: ReturnType<typeof vi.fn>;
      single: ReturnType<typeof vi.fn>;
      [key: string]: ReturnType<typeof vi.fn>;
    };
  }

  return { mockChain: buildChain() };
});

vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => mockChain),
  },
}));

import { addToCart } from '../cart';

describe('addToCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restores a soft-deleted item (deleted=true) by setting deleted=false and quantity=1', async () => {
    // Arrange: simulate finding an existing item with deleted=true
    mockChain.maybeSingle.mockResolvedValueOnce({
      data: { id: 42, quantity: 3, deleted: true },
      error: null,
    });

    // Act
    const result = await addToCart(1);

    // Assert
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();

    // Verify we searched for ingredient_id (without deleted filter)
    expect(mockChain.eq).toHaveBeenCalledWith('ingredient_id', 1);

    // Verify we restored the item (deleted=false, quantity=1)
    expect(mockChain.update).toHaveBeenCalledWith({
      deleted: false,
      quantity: 1,
    });
    expect(mockChain.update).toHaveBeenCalledTimes(1);
    expect(mockChain.insert).not.toHaveBeenCalled();
  });

  it('increments quantity for an active item (deleted=false)', async () => {
    // Arrange: simulate finding an existing active item
    mockChain.maybeSingle.mockResolvedValueOnce({
      data: { id: 7, quantity: 2, deleted: false },
      error: null,
    });

    // Act
    const result = await addToCart(5);

    // Assert
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();

    // Verify we incremented the quantity (2 + 1 = 3)
    expect(mockChain.update).toHaveBeenCalledWith({ quantity: 3 });
    expect(mockChain.update).toHaveBeenCalledTimes(1);
    expect(mockChain.insert).not.toHaveBeenCalled();
  });

  it('inserts a new row when no existing item is found', async () => {
    // Arrange: simulate no existing item
    mockChain.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: null,
    });

    mockChain.insert.mockReturnValueOnce({
      error: null,
    });

    // Act
    const result = await addToCart(10);

    // Assert
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();

    // Verify we inserted a new row
    expect(mockChain.insert).toHaveBeenCalledWith({
      ingredient_id: 10,
      quantity: 1,
      deleted: false,
    });
    expect(mockChain.update).not.toHaveBeenCalled();
  });

  it('returns error when the lookup query fails', async () => {
    // Arrange: simulate a fetch error
    mockChain.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'Network error' },
    });

    // Act
    const result = await addToCart(1);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Network error');
  });

  it('returns error when the update query fails', async () => {
    // Arrange: simulate finding an item, then update fails
    mockChain.maybeSingle.mockResolvedValueOnce({
      data: { id: 99, quantity: 1, deleted: false },
      error: null,
    });

    // The code does: .update(...).eq('id', id)
    // eq is called twice: first as filter (before maybeSingle), second after update.
    // Override the second eq call to return the error promise.
    mockChain.eq
      .mockReturnValueOnce(mockChain) // 1st eq: filter (return chain for chaining)
      .mockReturnValueOnce(
        // 2nd eq: terminal after update
        Promise.resolve({ error: { message: 'Update failed' } })
      );

    // Act
    const result = await addToCart(3);

    // Assert
    expect(result.success).toBe(false);
    expect(result.error).toBe('Update failed');
  });
});
