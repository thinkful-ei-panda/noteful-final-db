const knex = require('knex');
const app = require('../src/app');
const { makeFoldersArray } = require('./noteful-fixtures');

// To do list
// 1. Delete
// 2. ON DELETE CASCADE?
// 3. More thorough testing needed
// 4. Address date

describe(`Folders Endpoints`, () => {
  let db;

  before(`Make a connection`, () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  before(`Clear table`, () =>
    db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE')
  );
  afterEach(`Clear table`, () =>
    db.raw('TRUNCATE folder, note RESTART IDENTITY CASCADE')
  );
  after(`Destroy the connection`, () => db.destroy());

  describe(`GET /api/folders`, () => {
    context(`Given there are no folders`, () => {
      it(`GET /api/folders responds with 200 and an empty array`, () => {
        return supertest(app)
          .get('/api/folders')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });

      it(`GET /api/folders/:folder_id responds with 404`, () => {
        const folder_id = 1;
        return supertest(app)
          .get(`/api/folders/${folder_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: 'Folder not found/does not exist' },
          });
      });
    });

    context(`Given there are folders`, () => {
      const testFoldersArray = makeFoldersArray();
      beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));

      it(`GET /api/folders responds with 200 and an array of all folders`, () => {
        return supertest(app)
          .get('/api/folders')
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testFoldersArray);
      });

      it(`GET /api/folders/:folder_id responds with 200 and matched folder object`, () => {
        const folder_id = 1;
        return supertest(app)
          .get(`/api/folders/${folder_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testFoldersArray[0]);
      });

      //Test for no folder found?
    });
  });

  describe(`POST /api/folders`, () => {
    context(`Given there are no folders`, () => {
      it(`POST /api/folders responds with 201 and new folder location`, () => {
        const newFolder = {
          folder_name: 'Blimey',
        };

        return supertest(app)
          .post(`/api/folders`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(newFolder)
          .expect(201)
          .expect((res) => {
            // Test location 2 ways
            expect(res.headers.location).to.equal(`/api/folders/1`);
            expect('location', `/api/folders/1`);
          });
      });
    });
  });

  describe(`PATCH /api/folders/:folder_id`, () => {
    context(`Given there are folders`, () => {
      const testFoldersArray = makeFoldersArray();
      beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));

      it(`PATCH /api/folders/:folder_id responds with 204`, () => {
        const folder_id = 1;
        const folderNameUpdate = {
          folder_name: 'Pertinent',
        };

        return supertest(app)
          .patch(`/api/folders/${folder_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .send(folderNameUpdate)
          .expect(204)
          .then((res) => {
            supertest(app)
              .get(`/api/folders/${folder_id}`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(200)
              .then((res) => {
                expect(folderNameUpdate.folder_name).to.eql(
                  res.body.folder_name
                );
              });
          });
      });
    });
  });

  describe(`DELETE /api/folders/:folder_id`, () => {
    context(`Given there are folders`, () => {
      const testFoldersArray = makeFoldersArray();
      beforeEach(`Insert folders`, () => db('folder').insert(testFoldersArray));

      it(`DELETE /api/folders/:folder_id responds with 200`, () => {
        const folder_id = 1;
        const expectedFoldersArray = testFoldersArray.filter(
          (folder) => folder.id !== folder_id
        );

        return supertest(app)
          .delete(`/api/folders/${folder_id}`)
          .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) => {
            return supertest(app)
              .get('/api/folders')
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .expect(200, expectedFoldersArray);
          });
      });
    });
  });
});
