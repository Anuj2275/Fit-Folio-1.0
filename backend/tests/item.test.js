import app from '../src/app.js';
import request from 'supertest';
import User from '../src/models/user.model.js';
import Item from '../src/models/item.model.js';
import jwt from 'jsonwebtoken';

describe('Item API', () => {
    let token;
    let userId;

    beforeEach(async () => {
        await User.deleteMany({});
        await Item.deleteMany({});
        const user = await User.create({
            name: 'Test User',
            email: 'test@item.com',
            password: 'password123',
        });
        userId = user._id;
        token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should create a new item for the authenticated user', async () => {
        const itemData = {
            title: 'My First Task',
            description: 'This is a test task.',
            type: 'task',
            dueDate: new Date(),
        };

        const res = await request(app)
            .post('/api/items')
            .set('Authorization', `Bearer ${token}`)
            .send(itemData);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('title', itemData.title);
        expect(res.body).toHaveProperty('user', userId.toString());
    });

    it('should get all items for the authenticated user', async () => {
        await Item.create({
            title: 'My First Task',
            description: 'This is a test task.',
            type: 'task',
            dueDate: new Date(),
            user: userId,
        });

        const res = await request(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0]).toHaveProperty('title', 'My First Task');
    });

    it('should get a single item by ID', async () => {
        const item = await Item.create({
            title: 'My First Task',
            description: 'This is a test task.',
            type: 'task',
            dueDate: new Date(),
            user: userId,
        });

        const res = await request(app)
            .get(`/api/items/${item._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'My First Task');
    });

    it('should update an item', async () => {
        const item = await Item.create({
            title: 'My First Task',
            description: 'This is a test task.',
            type: 'task',
            dueDate: new Date(),
            user: userId,
        });

        const updatedData = {
            title: 'Updated Task',
            completed: true,
        };

        const res = await request(app)
            .put(`/api/items/${item._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('title', 'Updated Task');
        expect(res.body).toHaveProperty('completed', true);
    });

    it('should delete an item', async () => {
        const item = await Item.create({
            title: 'My First Task',
            description: 'This is a test task.',
            type: 'task',
            dueDate: new Date(),
            user: userId,
        });

        const res = await request(app)
            .delete(`/api/items/${item._id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('msg', 'Item successfully deleted');

        const getRes = await request(app)
            .get('/api/items')
            .set('Authorization', `Bearer ${token}`);

        expect(getRes.body.data.length).toBe(0);
    });
});