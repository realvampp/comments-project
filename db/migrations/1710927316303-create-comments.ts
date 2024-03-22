import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComments1710927316303 implements MigrationInterface {
    name = 'CreateComments1710927316303'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`homepage\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`imageURl\` varchar(255) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`refererOnId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_b1fb8ce9d98840f3a658e64cd52\` FOREIGN KEY (\`refererOnId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_b1fb8ce9d98840f3a658e64cd52\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
    }

}
