INSERT INTO department (name)
VALUES ("Human Resources"),
       ("Information Technology"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000.99, 1),
       ("Manager", 100000.99, 3),
       ("Manager", 100000.99, 2),
       ("Intern", 200000.83, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sam', 'Page', 1, 1),
       ('John', 'Hur', 2, NULL),
       ('Aidan', 'Bachtell', 3, NULL),
       ('Kendall', 'Swanson', 1, 2);
