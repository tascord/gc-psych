const { join } = require('path');
const { existsSync } = require('fs');

const express = require('express');
const app = express();

// Static
app.use(express.static('public'));

// Start the server
app.listen(process.env.PORT || 3000, () => console.log(`Running!`));

// Serve
app.get('*', (req, res) => {

    let path = req.path.slice(1) || 'index.html';

    if (existsSync(join(__dirname, 'public', path))) {
        res.sendFile(join(__dirname, 'public', path));
    }

    else {
        res.status(404).send('Not found');
    }

    // :D

});