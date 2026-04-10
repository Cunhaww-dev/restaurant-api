export type TableRow = {
  id: number;
  table_number: number;
  capacity: number;
  created_at: Date;
  updated_at: Date;
};

export type TableInsert = Omit<TableRow, 'id' | 'created_at' | 'updated_at'>;
