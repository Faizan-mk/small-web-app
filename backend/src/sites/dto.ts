import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class PublishSiteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  address: string

  @IsString()
  @IsNotEmpty({ message: 'Give the page a title.' })
  @MaxLength(120, { message: 'Keep the title under 120 characters.' })
  title: string

  @IsString()
  @IsNotEmpty({ message: 'The page is empty.' })
  @MaxLength(100_000, { message: 'Pages are limited to 100 KB of HTML.' })
  html: string

  @IsString()
  @IsNotEmpty({ message: 'Pick who is publishing.' })
  authorId: string
}
