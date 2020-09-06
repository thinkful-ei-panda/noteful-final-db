const express = require('express');
const path = require('path');
const xss = require('xss');
// const validUrl = require('valid-url');

const notesRouter = express.Router();
const jsonParser = express.json();

const NotesService = require('./notes-service');
const app = require('./app');

// Serialize content

notesRouter.use(jsonParser);

notesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        NotesService.getAllNotes(knexInstance)
            .then(notes => {
                // Returns an array of notes
                res.json(notes);
            })
            .catch(next);
    })
    .post((req, res, next) => {
        const knexInstance = req.app.get('db');
        const { note_name, note_content, folder_name } = req.body;
        const newNote = { note_name, note_content, folder_name };

        // On client side, folder_name has a default value
        // note_content not required

        if (!note_name.length) {
            return res.status(400).send('Please enter a valid note name');
        }

        NotesService.insertNewNote(knexInstance, newNote)
            .then(note => {
                // Returns folder array with ID object
                // Deconstruct array
                const { id: note_id } = note[0];
                res
                    .status(201)
                    .location(`/api/notes/${note_id}`)
                    .json(note);
            })
            .catch(next);
    });

notesRouter
    .route('/:note_id')
    .all((req, res, next) => {
        // Syntax!!!!!
        const knexInstance = req.app.get('db');
        const note_id = req.params.note_id;
        NotesService.getNoteByID(knexInstance, note_id)
            .then(note => {
                if(!note) {
                    return res.status(404).json({error: {message: 'Note not found/does not exist'}});
                }
                res.note = note;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        // Returns an object
        res.json(res.note);
    })
    .patch((req, res, next) => {
        const knexInstance = req.app.get('db');
        const note_id = req.params.note_id;
        const { note_name, note_content, folder_name } = req.body;
        const noteUpdate = { note_name, note_content, folder_name };

        // From the checkpoint
        const numberOfValues = Object.values(noteUpdate).filter(Boolean).length;
        if(numberOfValues === 0) {
            return res.status(400).json({error: {message: `Request body must contain either 'name', 'content', 'folder'`}});
        };
        
        NotesService.updateNote(knexInstance, note_id, noteUpdate)
            .then(note => {
                if(!note) {
                    return res.status(404).json({error: {message: 'Note not found/does not exist'}});
                };
                res.status(204).end();
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const knexInstance = req.app.get('db');
        const note_id = req.params.note_id;

        NotesService.deleteNote(knexInstance, note_id)
            .then(note => {
                if(!note) {
                    return res.status(404).json({error: {message: 'Note not found/does not exist'}});
                };
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = notesRouter;