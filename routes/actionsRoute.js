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