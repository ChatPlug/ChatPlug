import {MigrationInterface, QueryRunner} from "typeorm";

export class PrimaryMode1538149616225 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "configured" boolean NOT NULL, "primaryMode" boolean DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "temporary_service"("id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode") SELECT "id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode" FROM "service"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`ALTER TABLE "temporary_service" RENAME TO "service"`);
        await queryRunner.query(`CREATE TABLE "temporary_service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "configured" boolean NOT NULL, "primaryMode" boolean NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_service"("id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode") SELECT "id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode" FROM "service"`);
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`ALTER TABLE "temporary_service" RENAME TO "service"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "service" RENAME TO "temporary_service"`);
        await queryRunner.query(`CREATE TABLE "service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "configured" boolean NOT NULL, "primaryMode" boolean DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "service"("id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode") SELECT "id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode" FROM "temporary_service"`);
        await queryRunner.query(`DROP TABLE "temporary_service"`);
        await queryRunner.query(`ALTER TABLE "service" RENAME TO "temporary_service"`);
        await queryRunner.query(`CREATE TABLE "service" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "instanceName" varchar NOT NULL, "moduleName" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('shutdown'), "enabled" boolean NOT NULL, "configured" boolean NOT NULL, "primaryMode" boolean DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "service"("id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode") SELECT "id", "instanceName", "moduleName", "status", "enabled", "configured", "primaryMode" FROM "temporary_service"`);
        await queryRunner.query(`DROP TABLE "temporary_service"`);
    }

}
