-- Add unique constraint to prevent duplicate favorites and add FK to products
-- Create unique index for (user_id, product_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_favorites_user_product
ON public.product_favorites (user_id, product_id);

-- Add foreign key constraint to products.id if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.constraint_name = 'product_favorites_product_id_fkey'
      AND tc.table_name = 'product_favorites'
  ) THEN
    ALTER TABLE public.product_favorites
    ADD CONSTRAINT product_favorites_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END $$;
