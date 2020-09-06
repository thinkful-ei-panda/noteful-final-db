const makeFoldersArray = () => {
    return [
        {
            id: 1,
            folder_name: 'Important'
        },
        {
            id: 2,
            folder_name: 'Super'
        },
        {
            id: 3,
            folder_name: 'Spangley'
        },
    ];
};

const makeNotesArray = () => {
    return [
        {
            id: 1,
            note_name: 'Dogs',
            note_content: 'Ruff or arf?',
            modified: '2019-01-03T00:00:00.000Z',
            folder_name: 1,
        },
        {
            id: 2,
            note_name: 'Cats',
            note_content: 'Meow or Me-ow?',
            modified: '2018-08-15T23:00:00.000Z',
            folder_name: 2,
        },
        {
            id: 3,
            note_name: 'Pigs',
            note_content: 'Four legs good, two legs better!',
            modified: '2018-03-01T00:00:00.000Z',
            folder_name: 3,
        },
    ];
};

module.exports = {
    makeFoldersArray,
    makeNotesArray,
}