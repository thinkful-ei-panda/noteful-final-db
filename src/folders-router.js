const express = require('express');
const path = require('path');
const xss = require('xss');
// const validUrl = require('valid-url');

const foldersRouter = express.Router();
const jsonParser = express.json();

const FoldersService = require('./folders-service');
const app = require('./app');

// Serialize content

foldersRouter.use(jsonParser);

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        FoldersService.getAllFolders(knexInstance)
            .then(folders => {
                // Returns an array of folders
                res.json(folders);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        const knexInstance = req.app.get('db');
        const { folder_name } = req.body;

        if(folder_name.length === 0) {
            return res.status(400).send('Please enter a valid folder name');
        };

        FoldersService.insertNewFolder(knexInstance, folder_name)
            .then(folder => {
                // Returns folder array with ID object
                // Deconstruct array
                const { id: folder_id } = folder[0];
                res
                    .status(201)
                    .location(`/api/folders/${folder_id}`)
                    .json(folder);
            })
            .catch(next);
    })

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        // Syntax!!!!!
        const knexInstance = req.app.get('db');
        const folder_id = req.params.folder_id;
        FoldersService.getFolderByID(knexInstance, folder_id)
            .then(folder => {
                if(!folder) {
                    return res.status(404).json({error: {message: 'Folder not found/does not exist'}});
                }
                res.folder = folder;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        // Returns an object
        res.json(res.folder);
    })
    .patch((req, res, next) => {
        const knexInstance = req.app.get('db');
        const folder_id = req.params.folder_id;
        const { folder_name } = req.body;

        if(folder_name.length === 0) {
            return res.status(400).send('Please enter a valid folder name');
        };

        FoldersService.updateFolder(knexInstance, folder_id, folder_name)
            .then(folder => {
                if(!folder) {
                    return res.status(404).json({error: {message: 'Folder not found/does not exist'}});
                };
                res.status(204).end();
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const folder_id = req.params.folder_id;

        FoldersService.deleteFolder(knexInstance, folder_id)
            .then(folder => {
                if(!folder) {
                    return res.status(404).json({error: {message: 'Folder not found/does not exist'}});
                };
                res.status(204).end();
            })
            .catch(next);
    })

module.exports = foldersRouter;