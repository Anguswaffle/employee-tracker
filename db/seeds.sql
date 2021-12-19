INSERT INTO department (name)
VALUES ("Information Technology"),
       ("Sanitation"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 50000.99, 1),
       ("Software Engineer", 200000.83, 1),
       ("Head Custodian", 100000.99, 2),
       ("Window Washer", 10, 2),
       ("Sales Lead", 100000.99, 3),
       ("Salesperson", 100000.99, 3);
       


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alex', 'Trebek', 1, 1),
       ('Sean', 'Connery', 2, NULL),
       ('Professor', 'Utonium', 3, NULL),
       ('Blossom', 'Utonium', 4, 3),
       ('Bubbles', 'Utonium', 4, 3),
       ('Buttercup', 'Utonium', 4, 3);
