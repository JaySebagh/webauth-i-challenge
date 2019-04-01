const router = require('express').Router();
const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.db3',
    },
};

const db = knex(knexConfig)

router.post('/register', async (req, res) => {
    try {
        let user = req.body;

        const hash = bcrypt.hashSync(user.pass, 8);

        user.pass = hash;

        const [id] = await db("users").insert(req.body);

        const users = await db("users")
            .where({ id })
            .first()

        res.status(201).json(users);
        
    } catch (error) {
        res.status(500).json(error);
    }
})

router.post('/login', async (req, res) => {
    try {
        let { name, pass } = req.body;

        const user = await db("users").where({ name }).first();

        if (user && bcrypt.compareSync(pass, user.pass)) {
          res.status(200).json({ message: `Welcome ${user.name}!`});
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/users', restricted, async (req, res) => {
    try {
        const users = await db("users");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error })
    }
})

async function restricted(req, res, next) {
    try {
        let { name, pass } = req.headers;

        if(name && pass) {
        const user = await db("users").where({ name }).first();

        if (user && bcrypt.compareSync(pass, user.pass)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }

    } else {
        res.status(500).json({ message: 'Please provide credentials' })
    }} catch (error) {
        res.status(500).json(error)
    }
}

module.exports = router;