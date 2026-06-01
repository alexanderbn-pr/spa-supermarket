import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSupabase = {
  from: vi.fn(),
};

vi.mock('@/lib/supabaseClient', () => ({
  supabase: mockSupabase,
}));

const {
  fetchAcompanantes,
  addAcompanante,
  removeAcompanante,
  clearAcompanantesForMoment,
} = await import('./acompanantes');

function createMockChain(returnValue: unknown) {
  // A thenable promise that resolves to the returnValue
  const thenable = Promise.resolve(returnValue);

  const select = vi.fn();
  const insert = vi.fn();
  const del = vi.fn();
  const eq = vi.fn();
  const match = vi.fn();
  const returns = vi.fn();
  const order = vi.fn();

  const chain = {
    select,
    insert,
    delete: del,
    eq,
    match,
    returns,
    order,
  };

  select.mockReturnValue(chain);
  insert.mockReturnValue(thenable);
  del.mockReturnValue(chain);
  eq.mockReturnValue(thenable);
  match.mockReturnValue(thenable);
  returns.mockReturnValue(thenable);
  order.mockReturnValue(chain);

  return chain;
}

describe('acompanantes API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAcompanantes', () => {
    it('should fetch all acompañante rows', async () => {
      const mockData = [
        { id: 1, day_id: 1, moment_id: 1, recipe_id: 10 },
        { id: 2, day_id: 1, moment_id: 2, recipe_id: 20 },
      ];

      const chain = createMockChain({ data: mockData, error: null });
      mockSupabase.from.mockReturnValue(chain);

      const result = await fetchAcompanantes();

      expect(mockSupabase.from).toHaveBeenCalledWith('menu_acompanantes');
      expect(chain.select).toHaveBeenCalledWith('*');
      expect(result.data).toEqual(mockData);
      expect(result.error).toBeNull();
    });

    it('should return empty array on error', async () => {
      const chain = createMockChain({
        data: null,
        error: { message: 'DB error' },
      });
      mockSupabase.from.mockReturnValue(chain);

      const result = await fetchAcompanantes();

      expect(result.data).toEqual([]);
      expect(result.error).toBe('DB error');
    });

    it('should handle exceptions gracefully', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Network error');
      });

      const result = await fetchAcompanantes();

      expect(result.data).toEqual([]);
      expect(result.error).toBe('Network error');
    });
  });

  describe('addAcompanante', () => {
    it('should insert a new acompañante row', async () => {
      const chain = createMockChain({ error: null });
      mockSupabase.from.mockReturnValue(chain);

      const result = await addAcompanante(1, 1, 10);

      expect(mockSupabase.from).toHaveBeenCalledWith('menu_acompanantes');
      expect(chain.insert).toHaveBeenCalledWith({
        day_id: 1,
        moment_id: 1,
        recipe_id: 10,
      });
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return error on failure', async () => {
      const chain = createMockChain({
        error: { message: 'Insert failed' },
      });
      mockSupabase.from.mockReturnValue(chain);

      const result = await addAcompanante(1, 1, 10);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Insert failed');
    });
  });

  describe('removeAcompanante', () => {
    it('should delete a row by id', async () => {
      const chain = createMockChain({ error: null });
      mockSupabase.from.mockReturnValue(chain);

      const result = await removeAcompanante(5);

      expect(mockSupabase.from).toHaveBeenCalledWith('menu_acompanantes');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.eq).toHaveBeenCalledWith('id', 5);
      expect(result.success).toBe(true);
    });

    it('should return error on failure', async () => {
      const chain = createMockChain({
        error: { message: 'Delete failed' },
      });
      mockSupabase.from.mockReturnValue(chain);

      const result = await removeAcompanante(5);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Delete failed');
    });
  });

  describe('clearAcompanantesForMoment', () => {
    it('should delete all rows for a day+moment', async () => {
      const chain = createMockChain({ error: null });
      mockSupabase.from.mockReturnValue(chain);

      const result = await clearAcompanantesForMoment(1, 1);

      expect(mockSupabase.from).toHaveBeenCalledWith('menu_acompanantes');
      expect(chain.delete).toHaveBeenCalled();
      expect(chain.match).toHaveBeenCalledWith({
        day_id: 1,
        moment_id: 1,
      });
      expect(result.success).toBe(true);
    });

    it('should return error on failure', async () => {
      const chain = createMockChain({
        error: { message: 'Delete failed' },
      });
      mockSupabase.from.mockReturnValue(chain);

      const result = await clearAcompanantesForMoment(1, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Delete failed');
    });
  });
});
