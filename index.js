const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');


//creates connection to database and port
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB",
});


//function to view all employees
const employees = () => {
  console.log("Viewing all employees");
  connection.query(
    `SELECT employees.first_name , employees.last_name, title, salary, managers.first_name AS manager_name
    FROM employees
    LEFT JOIN employees managers ON employees.manager_id = managers.id
    INNER JOIN role ON employees.role_id = role.id`,

    (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
};

//function to view all roles
const viewRoles = () => {
  console.log("Viewing all roles");
  connection.query(
    `SELECT title, salary, department_name
    FROM role
    INNER JOIN department ON role.department_id = department.id`,

    (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
};


//function to view all departments
const viewDepartments = () => {
  console.log("Viewing all departments");
  connection.query(
    `SELECT department_name, title, salary 
    FROM department
    INNER JOIN role ON role.department_id = department.id`,

    (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
};

//function to view employees by departments
const empDepartments = () => {
  connection.query(
    "SELECT * FROM department",

    (err, results) => {
      if (err) throw err;

      const departments = results.map((department) => {
        return department.department_name;
      });

      inquirer
        .prompt({
          name: "department",
          type: "list",
          message: "Select which department you would like to view.",
          choices: departments,
        })
        .then((answer) => {
          console.log("Viewing employees by department");
          connection.query(
    `SELECT title, first_name, last_name, department_name 
    FROM department 
    INNER JOIN role ON role.department_id = department.id 
    INNER JOIN employees ON employees.role_id = role.id 
    WHERE ?`,
            {
              department_name: answer.department,
            },

            (err, results) => {
              if (err) throw err;
              console.table(results);
              init();
            }
          );
        });
    }
  );
};

//function to view employees by roles
const empRoles = () => {
  connection.query(
    "SELECT * FROM role",

    (err, results) => {
      if (err) throw err;

      const roles = results.map((role) => {
        return role.title;
      });
      inquirer
        .prompt({
          name: "role",
          type: "list",
          message: "Select which role you would like to view.",
          choices: roles,
        })
        .then((answer) => {
          console.log("Viewing employees by role");
          connection.query(
            `
    SELECT title, first_name, last_name 
    FROM role 
    INNER JOIN employees ON employees.role_id = role.id
    WHERE ?`,
            {
              title: answer.role,
            },

            (err, results) => {
              if (err) throw err;
              console.table(results);
              init();
            }
          );
        });
    }
  );
};

//function to add employee
const addEmployee = () => {
  connection.query(`SELECT * FROM employees`, (err, empResults) => {
    if (err) throw err;

    const employees = empResults.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    employees.push({ name: "No Manager", value: null });

    connection.query(
      `SELECT * FROM role`,

      (err, results) => {
        if (err) throw err;

        const roles = results.map((role) => {
          return { name: role.title, value: role.id };
        });

        inquirer
          .prompt([
            {
              name: "first_name",
              type: "input",
              message: "Enter employee's first name.",
            },
            {
              name: "last_name",
              type: "input",
              message: "Enter employee's last name.",
            },
            {
              name: "role_id",
              type: "list",
              message: "What is their Role ID? (Please enter a number)",
              choices: roles,
            },
            {
              name: "manager_id",
              type: "list",
              message: "Who is their manager?",
              choices: employees,
            },
          ])
          .then((answer) => {
            connection.query(
              `INSERT INTO employees SET ?`,
              {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
                manager_id: answer.manager_id,
              },
              (err, res) => {
                if (err) throw err;
                console.log("New employee Added!");
                init();
              }
            );
          });
      }
    );
  });
};

//function to add a role
const addRole = () => {
  connection.query(
    `SELECT * FROM department`,

    (err, results) => {
      if (err) throw err;
      const departments = results.map((department) => {
        return { name: department.department_name, value: department.id };
      });

      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "Enter the name of the new role",
          },
          {
            name: "salary",
            type: "number",
            message:
              "Enter the salary of the new role.(Please enter a numeric value only)",
          },
          {
            name: "department_id",
            type: "list",
            message: "What is their Department?",
            choices: departments,
          },
        ])
        .then((answer) => {
          connection.query(
            `INSERT INTO role SET ?`,
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department_id,
            },
            (err, res) => {
              if (err) throw err;
              console.log("New role Added!");
              init();
            }
          );
        });
    }
  );
};

//function to remove an employee
const removeEmployee = () => {
  connection.query(`SELECT * FROM employees`, (err, empResults) => {
    if (err) throw err;

    const employees = empResults.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          name: "employee",
          type: "list",
          message: "Select an employee to remove: ",
          choices: employees,
        },
      ])
      .then((answer) => {
        connection.query(
          `DELETE FROM employees WHERE ?`,
          {
            id: answer.employee,
          },
          (err, res) => {
            if (err) throw err;
            console.log("This employee has been removed.");
            init();
          }
        );
      });
  });
};

//function to add department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter the name of the new department",
      },
    ])
    .then((answer) => {
      connection.query(
        `INSERT INTO department SET ?`,
        {
          department_name: answer.department,
        },
        (err, res) => {
          if (err) throw err;
          console.log("New department added!");
          init();
        }
      );
    });
};
const updateEmployee = () => {
  connection.query(`SELECT * FROM employees`, (err, empResults) => {
    if (err) throw err;

    const employees = empResults.map((employee) => {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id,
      };
    });
    connection.query(
      `SELECT * FROM role`,

      (err, results) => {
        if (err) throw err;

        const roles = results.map((role) => {
          return { name: role.title, value: role.id };
        });

        inquirer
          .prompt([
            {
              name: "update",
              type: "list",
              message: "which employee would you like to update?",
              choices: employees,
            },
            {
              name: "role",
              type: "list",
              message: "Select the employee's new role",
              choices: roles,
            },
          ])
          .then((answer) => {
            connection.query(
              `UPDATE employees SET ? WHERE ?`,
              [
                {
                  role_id: answer.role,
                },
                {
                  id: answer.update,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log("Employee role has been updated!");
                init();
              }
            );
          });
      }
    );
  });
};

//function to initiate the application
const init = () => {
  inquirer
    .prompt({
      name: "response",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "View employees by departments",
        "View employees by roles",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Add department",
        "Add role",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.response) {
        case "View all employees":
          employees();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all departments":
          viewDepartments();
          break;

        case "View employees by departments":
          empDepartments();
          break;

        case "View employees by roles":
          empRoles();
          break;

        case "Add employee":
          addEmployee();
          break;

        case "Remove employee":
          removeEmployee();
          break;

        case "Update employee role":
          updateEmployee();
          break;

        case "Add department":
          addDepartment();
          break;

        case "Add role":
          addRole();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
};

//ends the connection and exits the application
connection.connect((err) => {
  if (err) throw err;
  init();
});
