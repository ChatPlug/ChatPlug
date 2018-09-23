import {MigrationInterface, QueryRunner} from "typeorm";

export class Logger1537709471984 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer, CONSTRAINT "FK_097ef7276e2fce18529bf3e708e" FOREIGN KEY ("serviceId") REFERENCES "service" ("id"))`);
        await queryRunner.query(`INSERT INTO "temporary_log"("id", "logLevel", "message", "systemLog", "createdAt", "serviceId") SELECT "id", "logLevel", "message", "systemLog", "createdAt", "serviceId" FROM "log"`);
        await queryRunner.query(`DROP TABLE "log"`);
        await queryRunner.query(`ALTER TABLE "temporary_log" RENAME TO "log"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "log" RENAME TO "temporary_log"`);
        await queryRunner.query(`CREATE TABLE "log" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "logLevel" varchar NOT NULL, "message" varchar NOT NULL, "systemLog" boolean NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "serviceId" integer)`);
        await queryRunner.query(`INSERT INTO "log"("id", "logLevel", "message", "systemLog", "createdAt", "serviceId") SELECT "id", "logLevel", "message", "systemLog", "createdAt", "serviceId" FROM "temporary_log"`);
        await queryRunner.query(`DROP TABLE "temporary_log"`);
        await queryRunner.query(`DROP TABLE "log"`);
    }

}
