const express = require('express');
const router = express.Router();
const projectDB = require('../data/helpers/projectModel');
const actionRouters = require('./actionsRoute');
const { route } = require('./actionsRoute');

router.use('/:id/actions', actionRouters);

//get route handler for array of projects
router.get('/', async (req, res, next) => {
    try {
        const projects = await projectDB.get();
        if(projects) res.status(200).json(projects);
    }
    catch(err) {
        next(err);
    }
})

//add get route handler for projects by Id
router.get('/:id', validateProjectID, (req, res, next) => {
    try {
        res.status(200).json(req.project);
    } 
    catch(err) {
        next(err);
    }
})

//add get route handler for project with actions? yes.. actions
route.get('/:id/actions', validateProjectID, async (req, res, next) => {
    try {
        const projectWithActions = await projectDB.getProjectActions(req.params.id);
        if(projectWithActions.id) res.status(200).json(projectWithActions);
    }
    catch(err) {
        next(err);
    }
})