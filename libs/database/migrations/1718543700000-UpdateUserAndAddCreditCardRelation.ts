import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAndAddCreditCardRelation1718543700000 implements MigrationInterface {
    name = 'UpdateUserAndAddCreditCardRelation1718543700000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update user entity - change userId type from string to number
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "userId" TYPE integer USING "userId"::integer
        `);

        // Update referralCode column to have length 255
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "referralCode" TYPE varchar(255)
        `);

        // Create credit_card table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "credit_card" (
                "creditCardId" SERIAL PRIMARY KEY,
                "userId" integer NOT NULL,
                "creditCardNumber" varchar(16) NOT NULL,
                "expiryDate" varchar(5) NOT NULL,
                "name" varchar(50) NOT NULL,
                CONSTRAINT "fk_user_credit_card" FOREIGN KEY ("userId") 
                REFERENCES "user"("userId") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "credit_card" DROP CONSTRAINT "fk_user_credit_card"
        `);

        // Drop the credit_card table
        await queryRunner.query(`
            DROP TABLE "credit_card"
        `);

        // Revert userId type back to varchar
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "userId" TYPE varchar
        `);

        // Revert referralCode column
        await queryRunner.query(`
            ALTER TABLE "user" 
            ALTER COLUMN "referralCode" DROP NOT NULL
        `);
    }
}
