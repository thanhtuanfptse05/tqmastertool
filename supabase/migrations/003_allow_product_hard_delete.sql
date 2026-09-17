-- ==========================================================
-- CODEVAULT STUDIO: ALLOW PRODUCT HARD DELETE MIGRATION
-- Cho phép xóa vĩnh viễn sản phẩm: nới lỏng khóa ngoại order_items
-- ==========================================================

-- 1. Nếu order_items có ràng buộc khóa ngoại tới products, cho phép SET NULL để lưu giữ lịch sử đơn hàng
DO $$
BEGIN
  -- Kiểm tra xem ràng buộc order_items_product_id_fkey có tồn tại không
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'order_items_product_id_fkey'
  ) THEN
    ALTER TABLE public.order_items DROP CONSTRAINT order_items_product_id_fkey;
  END IF;

  -- Nới lỏng cột product_id cho phép NULL (để khi xóa sản phẩm gốc, bản ghi chi tiết đơn hàng vẫn giữ nguyên title, price)
  ALTER TABLE public.order_items ALTER COLUMN product_id DROP NOT NULL;

  -- Thiết lập lại ràng buộc với ON DELETE SET NULL
  ALTER TABLE public.order_items 
    ADD CONSTRAINT order_items_product_id_fkey 
    FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
END $$;
