import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateFineDto {
  @IsString()
  date: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

export class UpdateFineDto {
  @IsString()
  date?: string;

  @IsString()
  description?: string;

  @IsNumber()
  amount?: number;
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
