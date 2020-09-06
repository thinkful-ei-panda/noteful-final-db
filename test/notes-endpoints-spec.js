const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray, makeNotesArray } = require('./noteful-fixtures');
const { expect } = require('chai');

describe(`Notes Endpoints`, () => {
    let db;

    before(`Make a connection`, () => {
        db = knex({
            client: "pg",
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db);
    });

    before(`Clear table`, () => db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE'));
    afterEach(`Clear table`, () => db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE'));
    after(`Destroy the connection`, () => db.destroy());

    describe(`GET /api/notes`, () => {
        context(`Given there are no notes`, () => {
            it(`GET /api/notes responds with 200 and an empty array`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, []);
            });

            it(`GET /api/notes/:note_id responds with 404`, () => {
                const note_id = 1;
                return supertest(app)
                    .get(`/api/notes/${note_id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)        
                    .expect(404, {error: {message: 'Note not found/does not exist'}});
            });
        });

        context(`Given there are folders`, () => {
            const testFoldersArray = makeFoldersArray();
            const testNotesArray = makeNotesArray();
            beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));
            beforeEach(`Insert notes`, () => db('note').insert(testNotesArray));

            it(`GET /api/notes responds with 200 and an array of all notes`, () => {
                return supertest(app)
                    .get('/api/notes')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, testNotesArray);
            });

            it(`GET /api/notes/:note_id responds with 200 and matched note object`, () => {
                const note_id = 1;
                return supertest(app)
                    .get(`/api/notes/${note_id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)        
                    .expect(200, testNotesArray[0]);
            });

            //Test for no notes found?
        });
    });

    describe(`POST /api/notes`, () => {
        const testFoldersArray = makeFoldersArray();
        beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));

        context(`Given there are no notes`, () => {
            it(`POST /api/notes responds with 201 and new note location`, () => {
                const newNote = {
                    note_name: 'Sheep',
                    folder_name: 3
                };

                return supertest(app)
                    .post(`/api/notes`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(newNote)
                    .expect(201)
                    .expect(res => {
                        // Test location 2 ways
                        expect(res.headers.location).to.equal(`/api/notes/1`)
                        expect('location', `/api/notes/1`)
                    });
            });
        });
    });

    describe(`PATCH /api/notes/:note_id`, () => {
        context(`Given there are notes`, () => {
            const testFoldersArray = makeFoldersArray();
            const testNotesArray = makeNotesArray();
            beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));
            beforeEach(`Insert notes`, () => db('note').insert(testNotesArray));

            it(`PATCH /api/notes/:note_id responds with 204`, () => {
                const note_id = 1;
                const noteContentUpdate = {
                    note_name: 'Sheep',
                    note_content: 'Four legs good, two legs baaaaad',
                    folder_name: 3
                };
    
                return supertest(app)
                    .patch(`/api/notes/${note_id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .send(noteContentUpdate)
                    .expect(204)
                    .then(res => {
                        supertest(app)
                            .get(`/api/notes/${note_id}`)
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(200)
                            .then(res => {
                                expect(noteContentUpdate.note_name).to.eql(res.body.note_name);
                                expect(noteContentUpdate.note_name).to.eql(res.body.note_name);
                                expect(noteContentUpdate.note_name).to.eql(res.body.note_name);
                                expect(res.body.id).to.exist;
                            });
                    });
            });
        });
    });

    describe(`DELETE /api/notes/:note_id`, () => {
        context(`Given there are notes`, () => {
            const testFoldersArray = makeFoldersArray();
            const testNotesArray = makeNotesArray();
            beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));
            beforeEach(`Insert notes`, () => db('note').insert(testNotesArray));

            it(`DELETE /api/notes/:note_id responds with 200`, () => {
                const note_id = 1;
                const expectedNotesArray = testNotesArray.filter(note => note.id !== note_id);
    
                return supertest(app)
                    .delete(`/api/notes/${note_id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(204)
                    .then(res => {
                        return supertest(app)
                            .get('/api/notes')
                            .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                            .expect(200, expectedNotesArray)
                    });
            });
        });
    });
});