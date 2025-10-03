export type CreateFineDto = {
  date: string;
  amount: number;
  description: string;
  status?: 'UNPAID' | 'PAID';
};
