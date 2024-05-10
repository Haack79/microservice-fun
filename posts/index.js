const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const app = express();
const axios = require('axios');

app.use(cors());
app.use(bodyParser.json());

const port = 4000;
const posts = {};
app.get('/posts', (req, res) => {
    res.send(posts);
});
app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, title
    };
    // emit event to event-bus
    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {
            id, title
        }
    });
    res.status(201).send(posts[id]);
});
app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});