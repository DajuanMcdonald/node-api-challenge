const express = require('express');
const router = express.Router();
const projectDB = require('../data/helpers/projectModel');
const actionRouters = require('./actionsRoute')

router.use('/:id/actions', actionRouters);

//get array of projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await projectDB.get();
        if(projects) res.status(200).json(projects);
    }
    catch(err) {
        next(err);
    }
})