INSERT INTO department (name)
VALUES ("Human Resources"),
       ("Information Technology"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000.99, 1),
       ("Worker", 100000.99, 3),
       ("Janitor", 100000.99, 2),
       ("Window Washer", 10, 2),
       ("Code Monkey", 1.99, 2),
       ("Intern", 200000.83, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sam', 'Page', 1, 1),
       ('John', 'Hur', 2, NULL),
       ('Aidan', 'Bachtell', 3, NULL),
       ('Kendall', 'Swanson', 4, 2);
