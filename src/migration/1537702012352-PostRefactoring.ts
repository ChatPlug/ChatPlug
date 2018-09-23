import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1537702012352 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer)`);
        await queryRunner.query(`CREATE TABLE "service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "configured" boolean NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer)`);
        await queryRunner.query(`CREATE TABLE "thread_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "connectionName" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer)`);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer)`);
        await queryRunner.query(`CREATE TABLE "core_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer, CONSTRAINT "FK_4c9b9b7a77b01d39fbe8238b774" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "externalServiceId", "avatarUrl", "username", "serviceId") SELECT "id", "externalServiceId", "avatarUrl", "username", "serviceId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE TABLE "temporary_thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer, CONSTRAINT "FK_70634a6e78dcae068a485233dc9" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"), CONSTRAINT "FK_78259b6e3c1ea6338f0fd499b4a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_thread"("id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId") SELECT "id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId" FROM "thread"`);
        await queryRunner.query(`DROP TABLE "thread"`);
        await queryRunner.query(`ALTER TABLE "temporary_thread" RENAME TO "thread"`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id"), CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
        await queryRunner.query(`CREATE TABLE "temporary_attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer, CONSTRAINT "FK_5f4a6c0677b1f2b417e95c717f8" FOREIGN KEY ("messageId") REFERENCES "message" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_attachment"("id", "url", "name", "messageId") SELECT "id", "url", "name", "messageId" FROM "attachment"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`ALTER TABLE "temporary_attachment" RENAME TO "attachment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "attachment" RENAME TO "temporary_attachment"`);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer)`);
        await queryRunner.query(`INSERT INTO "attachment"("id", "url", "name", "messageId") SELECT "id", "url", "name", "messageId" FROM "temporary_attachment"`);
        await queryRunner.query(`DROP TABLE "temporary_attachment"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer)`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`ALTER TABLE "thread" RENAME TO "temporary_thread"`);
        await queryRunner.query(`CREATE TABLE "thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer)`);
        await queryRunner.query(`INSERT INTO "thread"("id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId") SELECT "id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId" FROM "temporary_thread"`);
        await queryRunner.query(`DROP TABLE "temporary_thread"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer)`);
        await queryRunner.query(`INSERT INTO "user"("id", "externalServiceId", "avatarUrl", "username", "serviceId") SELECT "id", "externalServiceId", "avatarUrl", "username", "serviceId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`DROP TABLE "core_settings"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "thread_connection"`);
        await queryRunner.query(`DROP TABLE "thread"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
