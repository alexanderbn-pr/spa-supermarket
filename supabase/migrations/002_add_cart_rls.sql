-- Enable RLS on cart_list and ingredients (idempotent)
ALTER TABLE cart_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

-- cart_list: anon needs full CRUD
CREATE POLICY "anon_select" ON cart_list FOR SELECT USING (true);
CREATE POLICY "anon_insert" ON cart_list FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_update" ON cart_list FOR UPDATE USING (true);
CREATE POLICY "anon_delete" ON cart_list FOR DELETE USING (true);

-- ingredients: anon needs SELECT and INSERT
CREATE POLICY "anon_select" ON ingredients FOR SELECT USING (true);
CREATE POLICY "anon_insert" ON ingredients FOR INSERT WITH CHECK (true);
