import {MigrationInterface, QueryRunner} from "typeorm";

export class ServiceInMessages1538415356073 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer, CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer, CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4fcee0a7ef75539e22f85599c10" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer, CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
    }

}
