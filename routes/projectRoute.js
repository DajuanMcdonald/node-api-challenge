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

//handle posting of projects
router.post('/', validateProject, async (req, res, next) => {
    try {
        const results = await projectDB.insert(req.project);
        if(results.id && results.description) res.status(201).json(results)

    }
    catch(err) {
        next(err);
    }
})

//handle updating projects
router.patch('/:id', validateProjectID, validateProject, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateProject = {...req.project}
        const results = await projectDB.update(id, updateProject);
        if(results.id) res.status(200).json(results);
    }
    catch(err) {
        next(err);
    }
})

//handle deleting a project
router.delete('/:id', validateProject, async (req, res, next) => {
    try {
        const results = await projectDB.remove(req.params.id);
        if(results) res.status(204).end();
    }
    catch(err) {
        next(err);
    }
})

//custom middleware
function validateProjectID(req, res, next) {
    const id = req.params.id;
    projectDB.get(id)
    .then( project => {
        if(project) { 
            req.project = project;
            next();
        } else {
            res.status(404).json({message: `There are no projects that match the ID ${id}`})
        }
    })
    .catch(err => next(err))
}

function validateProject(req, res, next) {
    const {name, description, completed} = req.body;
    if(!req.body) {
        
        res.status(400).json({message: "missing project body"})
    } 

    if(!name) {
        res.status(400).json({message: "missing project name"})
    }

    if(!res.description) {
        res.status(400).json({message: "missing project description"})
    }

    req.project = {
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed
    }

    next();
}

//dont forget to export
module.exports = router;