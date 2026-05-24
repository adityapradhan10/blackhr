import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SalaryJobTitleQueryDto {
  @ApiProperty({ example: 'India', type: String })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({ example: 'Software Engineer', type: String })
  @IsNotEmpty()
  @IsString()
  jobTitle!: string;
}
