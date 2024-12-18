import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionEntity } from '../entities/question.entity';

@Injectable()
export class QuestionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getQuestion(userId: number): Promise<QuestionEntity> {
        const result = await this.prisma.$queryRaw`
      SELECT q.*
      FROM "Question" q
      WHERE q."questionId" NOT IN (
        SELECT a."questionId"
        FROM "Calendar" a
        WHERE a."userId" = ${userId}
      )
      ORDER BY RANDOM()
      LIMIT 1;
    `;
        return result[0]; // 하나의 질문만 반환
    }

    async getQuestionById(questionId: number): Promise<QuestionEntity> {
        return this.prisma.question.findUnique({ where: { questionId } });
    }
}
