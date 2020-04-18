const express = require('express');
const router = express.Router({mergeParams:true});
const actionDB = require('../data/helpers/actionModel')

// get array of actions
router.get('/', async (req, res, next) => {
    try {
        const actions = await actionDB.get();
        if(actions) {
            res.status(200).json(actions);
        }
    }
    catch(err) {
        next(err);
    }
})

//get specific action by id
router.get('/:actionId', validateActionID, async (req, res, next) => {
    try {
        res.status(200).json(req.action)
    }
    catch(err) {
        next(err);
    }
})

//handle posts
router.post('/', validateActions, async (req, res, next) => {
    try {
        const action = await actionDB.insert(req.action);
        if(action.id) res.status(201).json(action)
    }
    catch(err) {
        next(err);
    }
})


//handle updates
router.patch('/:actionId', validateActionID, validateActions, async (req, res, next) => {
    try {
        payload = {
            project_id: req.params.id,
            notes: req.body.notes,
            description: req.body.description,
            completed: req.body.completed,
        }
        const results = await actionDB.update(req.params.actionId, payload);
        if(results.id) res.status(200).json(results)
    }
    catch (err) {
        next(err);
    }
})

//handle deleting
router.delete('/:actionId', validateActionID, async (req, res, next) => {
    try {
        const results = await actionDB.remove(req.params.actionId);
        if(results) res.status(204).end();
    }
    catch(err) {
        next(err)
    }

})

//custom middleware
function validateActionID(req, res, next) {
    const id = req.params.actionId;
    actionDB.get(id)
    .then( (action) => {
        if(action) {
            req.action = action;
            next();
        } else {
            res.status(404).json({message: `There are no actions with the ID ${id}`})
        }
    })
    .catch( err => {
        next(err);
    })
}

function validateActions(req, res, next) {
    const {notes, description, completed} = req.body;
    if(!req.body) {
        res.status(400).json({message: "missing project data"});
    }

    if(!notes) {
        res.status(400).json({messge: "missing project notes"});
    }

    if(!description) {
        res.status(400).json({message: "missing project description"});
    }

    req.action = { project_id: req.params.id, description, notes, completed}
    next();
}

//dont forget to export
module.exports = router;