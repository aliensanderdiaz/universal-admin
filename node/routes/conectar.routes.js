const express = require('express');

let app = express();

app.get('/api-conectada', (req, res) => {
    res.json({
        ok: true
    });
});

module.exports = app;