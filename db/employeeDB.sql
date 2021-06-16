DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL  
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT  
);

CREATE TABLE employees (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT NOT NULL,
    manager_id INT 
);

INSERT INTO department (department_name) 
VALUES
    ("Engineering"),
    ("Sales"),
    ("Legal"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Software Engineer", 130000, 1),
    ("Lead Engineer", 120000, 1),
    ("Sales Lead", 80000, 2),
    ("Salesperson", 60000, 2),
    ("Lawyer", 160000, 3),
    ("Accountant", 110000, 4);
    


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("Seth", "Parham", 2, 1),
    ("Shannon", "Clark", 6, 2),
    ("Britt", "Rogers", 5, null),
    ("Stephanie", "Snead", 3, 3),
    ("Josh", "Burris", 4, null),
    ("Bethanne", "Winzeler", 1, null);


SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employees;