export type TableSessionRow = {
  id: number;
  table_id: number;
  opened_at: string;
  closed_at: string | null;
};

export type TableInsert = Omit<
  TableSessionRow,
  'id' | 'opened_at' | 'closed_at'
>;
