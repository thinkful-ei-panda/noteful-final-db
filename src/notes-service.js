const NotesService = {
    getAllNotes(db) {
        return db('note')
            .select('*');
    },

    getNoteByID(db, id) {
        return db('note')
            .select('*')
            .where({id})
            .first();
    },

    insertNewNote(db, newNote) {
        return db('note')
            .insert(newNote, ['*']);
    },

    updateNote(db, id, noteUpdate) {
        return db('note')
            .where({id})
            .update(noteUpdate);
    },

    deleteNote(db, id) {
        return db('note')
            .where({id})
            .del();
    },
};

module.exports = NotesService;