import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameToFileName1711706432586 implements MigrationInterface {
    name = 'RenameToFileName1711706432586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`imageURl\` \`fileName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`fileName\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`fileName\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`fileName\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`fileName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` CHANGE \`fileName\` \`imageURl\` varchar(255) NULL`);
    }

}
