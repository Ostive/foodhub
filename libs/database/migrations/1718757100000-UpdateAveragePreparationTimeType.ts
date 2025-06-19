import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAveragePreparationTimeType1718757100000 implements MigrationInterface {
  name = 'UpdateAveragePreparationTimeType1718757100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "averagePreparationTime" TYPE VARCHAR(20) USING 
        CASE 
          WHEN "averagePreparationTime" IS NOT NULL THEN 
            FLOOR("averagePreparationTime" / 60)::TEXT || '-' || 
            (FLOOR("averagePreparationTime" / 60) + 15)::TEXT || ' min'
          ELSE NULL
        END
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Note: This is a one-way migration as we can't reliably convert back to minutes
    await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "averagePreparationTime" TYPE INTEGER USING 
        CASE 
          WHEN "averagePreparationTime" ~ '^\\d+-\\d+ min$' THEN 
            (SPLIT_PART(SPLIT_PART("averagePreparationTime", '-', 1), ' ', 1)::INTEGER) * 60
          ELSE NULL
        END
    `);
  }
}
