TRUNCATE folder, note RESTART IDENTITY CASCADE;

INSERT INTO folder
    (folder_name)
VALUES
    ('Important'),
    ('Super'),
    ('Spangley')
;

INSERT INTO note
    (note_name, note_content, modified, folder_name)
VALUES
    ('Dogs', 'Ruff or arf?', '2019-01-03T00:00:00.000Z', 1),
    ('Cats', 'Meow or me-ow?', '2018-08-15T23:00:00.000Z', 2),
    ('Pigs', 'Four legs good, two legs better!', '2018-03-01T00:00:00.000Z', 3)
;