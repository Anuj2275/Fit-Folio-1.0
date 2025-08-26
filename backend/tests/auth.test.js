import app from '../src/app.js';
import request from 'supertest';
import User from '../src/models/user.model.js';
import bcrypt from 'bcryptjs';

describe('Auth API', () => {
    const userData = {
        name: 'John Doe',
        email: 'john.doe@test.com',
        password: 'password123',
    };
    
    beforeEach(async () => {
        await User.deleteMany({});
    });
    
    it('should allow a user to sign up', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                name: 'Jane Doe',
                email: 'jane.doe@test.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('userId');
    });

    it('should not allow a user to sign up with an existing email', async () => {
        await User.create(userData);
        const res = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('message', 'User with this email already exists.');
    });

    it('should allow a user to log in', async () => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({ ...userData, password: hashedPassword });
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: userData.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not allow a user to log in with wrong password', async () => {
        await User.create(userData);
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: userData.email,
                password: 'wrongpassword',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('message', 'Invalid credentials.');
    });
});