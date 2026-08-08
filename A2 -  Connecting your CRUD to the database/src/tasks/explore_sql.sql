SELECT * FROM tasks;
SELECT * FROM tasks WHERE done = 1;
SELECT * FROM tasks WHERE done = 0;
SELECT COUNT(*) FROM tasks;
UPDATE tasks SET done = 1;
UPDATE tasks SET done = 0;
UPDATE tasks SET done = 1 WHERE id = 2;
DELETE FROM tasks WHERE done = 1;