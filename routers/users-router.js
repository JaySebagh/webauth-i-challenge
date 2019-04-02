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
            // req.session is added by express-session
            req.session.user = user;
            console.log(req.session)
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

router.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(500).json({ error });
            } else {
                res.status(200).json({ message: 'bye' });
            }
        });
    } else {
        res.status(200).json({ message: 'bye' });
    }
})

function restricted(req, res, next) {
    try {
        if(req && req.session && req.session.user) {
            next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: "you broke it" })
    }
}

module.exports = router;