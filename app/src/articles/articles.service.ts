import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    const data: Prisma.ArticleCreateInput = createArticleDto;
    return this.prisma.article.create({ data });
  }

  findAll() {
    const where: Prisma.ArticleWhereInput = { published: true };
    return this.prisma.article.findMany({ where });
  }

  findDrafts() {
    const where: Prisma.ArticleWhereInput = { published: false };
    return this.prisma.article.findMany({ where });
  }

  async findOne(id: number) {
    const args: Prisma.ArticleFindUniqueArgs = {
      where: { id },
      include: { author: true },
    };
    const article: ArticleEntity = await this.prisma.article.findUnique(args);
    return article;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    const args: Prisma.ArticleUpdateArgs = {
      where: { id },
      data: updateArticleDto,
    };
    return this.prisma.article.update(args);
  }

  remove(id: number) {
    const where: Prisma.ArticleWhereUniqueInput = { id };
    return this.prisma.article.delete({ where });
  }
}
