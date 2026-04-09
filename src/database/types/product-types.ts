export type ProductRow = {
  id: number;
  name: string;
  price: number;
  created_at: Date;
  updated_at: Date;
};

// Omite os campos que são gerados automaticamente pelo banco de dados
export type ProductInsert = Omit<
  ProductRow,
  'id' | 'created_at' | 'updated_at'
>;
