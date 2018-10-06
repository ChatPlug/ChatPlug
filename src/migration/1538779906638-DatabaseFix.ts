import { MigrationInterface, QueryRunner } from "typeorm";

export class DatabaseFix1538779906638 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer)`);
    await queryRunner.query(`CREATE TABLE "log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer)`);
    await queryRunner.query(`CREATE TABLE "service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "primaryMode" boolean NOT NULL, "configured" boolean NOT NULL)`);
    await queryRunner.query(`CREATE TABLE "thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer)`);
    await queryRunner.query(`CREATE TABLE "thread_connection" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "connectionName" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
    await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer)`);
    await queryRunner.query(`CREATE TABLE "attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer)`);
    await queryRunner.query(`CREATE TABLE "core_settings" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
    await queryRunner.query(`CREATE TABLE "service_primary_ignored_services_service" ("serviceId_1" integer NOT NULL, "serviceId_2" integer NOT NULL, PRIMARY KEY ("serviceId_1", "serviceId_2"))`);
    await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer, CONSTRAINT "FK_4c9b9b7a77b01d39fbe8238b774" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
    await queryRunner.query(`INSERT INTO "temporary_user"("id", "externalServiceId", "avatarUrl", "username", "serviceId") SELECT "id", "externalServiceId", "avatarUrl", "username", "serviceId" FROM "user"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    await queryRunner.query(`CREATE TABLE "temporary_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, CONSTRAINT "FK_097ef7276e2fce18529bf3e708e" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
    await queryRunner.query(`INSERT INTO "temporary_log"("id", "logLevel", "message", "systemLog", "createdAt", "serviceId") SELECT "id", "logLevel", "message", "systemLog", "createdAt", "serviceId" FROM "log"`);
    await queryRunner.query(`DROP TABLE "log"`);
    await queryRunner.query(`ALTER TABLE "temporary_log" RENAME TO "log"`);
    await queryRunner.query(`CREATE TABLE "temporary_thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer, CONSTRAINT "FK_70634a6e78dcae068a485233dc9" FOREIGN KEY ("serviceId") REFERENCES "service" ("id") ON DELETE CASCADE, CONSTRAINT "FK_78259b6e3c1ea6338f0fd499b4a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id") ON DELETE CASCADE)`);
    await queryRunner.query(`INSERT INTO "temporary_thread"("id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId") SELECT "id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId" FROM "thread"`);
    await queryRunner.query(`DROP TABLE "thread"`);
    await queryRunner.query(`ALTER TABLE "temporary_thread" RENAME TO "thread"`);
    await queryRunner.query(`CREATE TABLE "temporary_message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer, CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3" FOREIGN KEY ("authorId") REFERENCES "user" ("id"), CONSTRAINT "FK_139554a2f2b3459965c25e5415a" FOREIGN KEY ("threadConnectionId") REFERENCES "thread_connection" ("id"), CONSTRAINT "FK_4fcee0a7ef75539e22f85599c10" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
    await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId" FROM "message"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
    await queryRunner.query(`CREATE TABLE "temporary_attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer, CONSTRAINT "FK_5f4a6c0677b1f2b417e95c717f8" FOREIGN KEY ("messageId") REFERENCES "message" ("id"))`);
    await queryRunner.query(`INSERT INTO "temporary_attachment"("id", "url", "name", "messageId") SELECT "id", "url", "name", "messageId" FROM "attachment"`);
    await queryRunner.query(`DROP TABLE "attachment"`);
    await queryRunner.query(`ALTER TABLE "temporary_attachment" RENAME TO "attachment"`);
    await queryRunner.query(`CREATE TABLE "temporary_service_primary_ignored_services_service" ("serviceId_1" integer NOT NULL, "serviceId_2" integer NOT NULL, CONSTRAINT "FK_635e9e59132bfd52bd954b264b0" FOREIGN KEY ("serviceId_1") REFERENCES "service" ("id") ON DELETE CASCADE, CONSTRAINT "FK_78b696315ceff3ca2fb275e5806" FOREIGN KEY ("serviceId_2") REFERENCES "service" ("id") ON DELETE CASCADE, PRIMARY KEY ("serviceId_1", "serviceId_2"))`);
    await queryRunner.query(`INSERT INTO "temporary_service_primary_ignored_services_service"("serviceId_1", "serviceId_2") SELECT "serviceId_1", "serviceId_2" FROM "service_primary_ignored_services_service"`);
    await queryRunner.query(`DROP TABLE "service_primary_ignored_services_service"`);
    await queryRunner.query(`ALTER TABLE "temporary_service_primary_ignored_services_service" RENAME TO "service_primary_ignored_services_service"`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`ALTER TABLE "service_primary_ignored_services_service" RENAME TO "temporary_service_primary_ignored_services_service"`);
    await queryRunner.query(`CREATE TABLE "service_primary_ignored_services_service" ("serviceId_1" integer NOT NULL, "serviceId_2" integer NOT NULL, PRIMARY KEY ("serviceId_1", "serviceId_2"))`);
    await queryRunner.query(`INSERT INTO "service_primary_ignored_services_service"("serviceId_1", "serviceId_2") SELECT "serviceId_1", "serviceId_2" FROM "temporary_service_primary_ignored_services_service"`);
    await queryRunner.query(`DROP TABLE "temporary_service_primary_ignored_services_service"`);
    await queryRunner.query(`ALTER TABLE "attachment" RENAME TO "temporary_attachment"`);
    await queryRunner.query(`CREATE TABLE "attachment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" varchar NOT NULL, "name" varchar NOT NULL, "messageId" integer)`);
    await queryRunner.query(`INSERT INTO "attachment"("id", "url", "name", "messageId") SELECT "id", "url", "name", "messageId" FROM "temporary_attachment"`);
    await queryRunner.query(`DROP TABLE "temporary_attachment"`);
    await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
    await queryRunner.query(`CREATE TABLE "message" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "originExternalThreadId" varchar NOT NULL, "authorId" integer, "threadConnectionId" integer, "serviceId" integer)`);
    await queryRunner.query(`INSERT INTO "message"("id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId") SELECT "id", "content", "createdAt", "originExternalThreadId", "authorId", "threadConnectionId", "serviceId" FROM "temporary_message"`);
    await queryRunner.query(`DROP TABLE "temporary_message"`);
    await queryRunner.query(`ALTER TABLE "thread" RENAME TO "temporary_thread"`);
    await queryRunner.query(`CREATE TABLE "thread" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "subtitle" varchar, "externalServiceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, "threadConnectionId" integer)`);
    await queryRunner.query(`INSERT INTO "thread"("id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId") SELECT "id", "title", "avatarUrl", "subtitle", "externalServiceId", "createdAt", "serviceId", "threadConnectionId" FROM "temporary_thread"`);
    await queryRunner.query(`DROP TABLE "temporary_thread"`);
    await queryRunner.query(`ALTER TABLE "log" RENAME TO "temporary_log"`);
    await queryRunner.query(`CREATE TABLE "log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer)`);
    await queryRunner.query(`INSERT INTO "log"("id", "logLevel", "message", "systemLog", "createdAt", "serviceId") SELECT "id", "logLevel", "message", "systemLog", "createdAt", "serviceId" FROM "temporary_log"`);
    await queryRunner.query(`DROP TABLE "temporary_log"`);
    await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
    await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "externalServiceId" varchar NOT NULL, "avatarUrl" varchar NOT NULL, "username" varchar NOT NULL, "serviceId" integer)`);
    await queryRunner.query(`INSERT INTO "user"("id", "externalServiceId", "avatarUrl", "username", "serviceId") SELECT "id", "externalServiceId", "avatarUrl", "username", "serviceId" FROM "temporary_user"`);
    await queryRunner.query(`DROP TABLE "temporary_user"`);
    await queryRunner.query(`DROP TABLE "service_primary_ignored_services_service"`);
    await queryRunner.query(`DROP TABLE "core_settings"`);
    await queryRunner.query(`DROP TABLE "attachment"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "thread_connection"`);
    await queryRunner.query(`DROP TABLE "thread"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TABLE "log"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }

}
