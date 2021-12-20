INSERT INTO department (name)
VALUES ("Information Technology"),
       ("Sanitation"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 500.99, 1),
       ("Software Engineer", 223400.83, 1),
       ("Head Custodian", 100100.99, 2),
       ("Window Washer", 10, 2),
       ("Sales Lead", 123450.99, 3),
       ("Salesperson", 1000.99, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Alex', 'Trebek', 1, NULL),
       ('Sean', 'Connery', 2, NULL),
       ('Professor', 'Utonium', 3, NULL),
       ('Blossom', 'Utonium', 4, 3),
       ('Bubbles', 'Utonium', 4, 3),
       ('Buttercup', 'Utonium', 4, 3),
       ('Thor', 'Odinson', 5, NULL),
       ('Loki', 'Odinson', 6, 7);
