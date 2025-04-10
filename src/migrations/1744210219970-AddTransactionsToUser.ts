import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionsToUser1744210219970 implements MigrationInterface {
    name = 'AddTransactionsToUser1744210219970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`transactions\` \`transactions\` text NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`transactions\` \`transactions\` text NOT NULL`);
    }

}
