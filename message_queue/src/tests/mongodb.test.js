const mongoose = require('mongoose');
const connectString = "mongodb://admin:password123@localhost:27017/shopDEV"

const testSchema = new mongoose.Schema({
    name: String,
});

const Test = mongoose.model('Test', testSchema);

describe('MongoDB Connection', () => {
    let connection;
    beforeAll(async () => {
        connection = await mongoose.connect(connectString, {
            authSource: 'admin'
        });
    });

    afterAll(async () => {
        await connection.disconnect();
    });

    it('should connect to MongoDB', async () => {
        expect(mongoose.connection.readyState).toBe(1)
    });

    it('should save a document', async () => {
        const test = new Test({ name: 'test' });
        await test.save();
        expect(test.isNew).toBe(false);
    });

    it('should find a document', async () => {
        const test = await Test.findOne({ name: 'test' });
        expect(test.name).toBe('test');
    });
});