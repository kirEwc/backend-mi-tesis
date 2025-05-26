import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1748258566987 implements MigrationInterface {
    name = 'Initial1748258566987'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Message" ("Message_id" BIGSERIAL NOT NULL, "content" text NOT NULL, "response" text NOT NULL, "create_At" TIMESTAMP NOT NULL, "chatChatId" bigint, CONSTRAINT "PK_20288988ee1dfb622d10a30d2c6" PRIMARY KEY ("Message_id"))`);
        await queryRunner.query(`CREATE TABLE "Chat" ("Chat_id" BIGSERIAL NOT NULL, "Create_At" TIMESTAMP NOT NULL, "userUserid" bigint, CONSTRAINT "PK_4011d745709f8ad8923d71b166a" PRIMARY KEY ("Chat_id"))`);
        await queryRunner.query(`CREATE TABLE "User" ("Userid" BIGSERIAL NOT NULL, "Email" character varying NOT NULL, "Name" character varying NOT NULL, "created_At" TIMESTAMP NOT NULL, CONSTRAINT "PK_08a192a2b1d7059fb22a2b9e087" PRIMARY KEY ("Userid"))`);
        await queryRunner.query(`ALTER TABLE "Message" ADD CONSTRAINT "FK_fe2a416a01ccfd6fc6eb4381a99" FOREIGN KEY ("chatChatId") REFERENCES "Chat"("Chat_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Chat" ADD CONSTRAINT "FK_430dca63ab1dfb2e6ef63743e03" FOREIGN KEY ("userUserid") REFERENCES "User"("Userid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Chat" DROP CONSTRAINT "FK_430dca63ab1dfb2e6ef63743e03"`);
        await queryRunner.query(`ALTER TABLE "Message" DROP CONSTRAINT "FK_fe2a416a01ccfd6fc6eb4381a99"`);
        await queryRunner.query(`DROP TABLE "User"`);
        await queryRunner.query(`DROP TABLE "Chat"`);
        await queryRunner.query(`DROP TABLE "Message"`);
    }

}
