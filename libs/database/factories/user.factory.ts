import { faker } from "@faker-js/faker";
import { User } from '../entities/user.entity';

export const createUser = (): User => {
    const user = new User();
    user.name = faker.person.fullName();
    user.email = faker.internet.email();
    user.password = "password123"; // Default password for testing
    user.role = faker.helpers.arrayElement(['customer', 'admin']);
    return user;
};
