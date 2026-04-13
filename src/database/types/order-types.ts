export type OrderRow = {
  id: number;
  table_session_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  created_at: Date;
  updated_at: Date;
};

export type OrderInsert = Omit<OrderRow, 'id' | 'created_at' | 'updated_at'>;
