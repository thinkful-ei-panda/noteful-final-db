const FoldersService = {
    getAllFolders(db) {
        return db('folder')
            .select('*');
    },

    getFolderByID(db, id) {
        return db('folder')
            .select('*')
            .where({id})
            .first();
    },

    insertNewFolder(db, folder_name) {
        return db('folder')
            .insert({folder_name}, ['*']);
    },

    updateFolder(db, id, folder_name) {
        return db('folder')
            .where({id})
            .update({folder_name});
    },

    deleteFolder(db, id) {
        return db('folder')
            .where({id})
            .del()
    },
};

module.exports = FoldersService;