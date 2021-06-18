const inquirer = require("inquirer");
const mysql = require("mysql");
// const console = require('console.table');

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employeeDB",
});

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

const viewRoles = () => {
  console.log("Viewing all roles");
  connection.query(
    "SELECT * FROM role",

    (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
};

const viewDepartments = () => {
  console.log("Viewing all departments");
  connection.query(
    "SELECT * FROM department",

    (err, results) => {
      if (err) throw err;
      console.table(results);
      init();
    }
  );
};

const empDepartments = () => {
  connection.query(
    "SELECT * FROM department",

    (err, results) => {
      if (err) throw err;
      //   console.log(results);

      const departments = results.map((department) => {
        return department.department_name;
      });
      // console.log(departments);

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
            `
        SELECT title, first_name, last_name, department_name 
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

const empRoles = () => {
  inquirer
    .prompt({
      name: "role",
      type: "list",
      message: "Select which role you would like to view.",
      choices: [
        "Software Engineer",
        "Lead Engineer",
        "Sales Lead",
        "Salesperson",
        "Lawyer",
        "Accountant",
      ],
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
};

const addEmployee = () => {
  connection.query(`SELECT * FROM employees`, (err, empResults) => {
    if (err) throw err;
    console.log(empResults);

    const employees = empResults.map((employee) => {
        return {name: employee.first_name + ' ' + employee.last_name, value:employee.id}
    })
    employees.push({name: "No Manager", value: null });
    
    connection.query(
      `SELECT * FROM role`,

      (err, results) => {
        if (err) throw err;
        console.log(results);

        const roles = results.map((role) => {
          return { name: role.title, value: role.id };
        });
        console.log(roles);
        inquirer
          .prompt([
            {
              name: "newFirst",
              type: "input",
              message: "Enter employee's first name.",
            },
            {
              name: "newLast",
              type: "input",
              message: "Enter employee's last name.",
            },
            {
              name: "newRole",
              type: "list",
              message: "What is their Role ID? (Please enter a number)",
              choices: roles,
            },
            {
                name: "newMan",
                type: "list",
                message: "Who is their manager?",
                choices: employees,
              },
          ])
          .then((answer) => {
            connection.query(
              `INSERT INTO employees SET ?`,
              {
                first_name: answer.newFirst,
                last_name: answer.newLast,
                role_id: answer.newRole,
                manager_id: answer.newMan,
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

const removeEmployee = () => {
  const names = connection.query("SELECT first_name, last_name FROM employees");
  inquirer
    .prompt([
      {
        name: "employee",
        type: "list",
        message: "Select an employee to remove: ",
        choices: [
          //what do I do here
          names,
        ],
      },
    ])
    .then((answer) => {
      connection.query("DELETE FROM employee WHERE ?", {
        first_name: answer.employee,
      });
    });
};

const addRole = () => {
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
        type: "number",
        message: "What is their Department ID?(Please enter a number)",
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
};

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
  inquirer
    .prompt([
      {
        name: "update",
        type: "list",
        message: "which employee would you like to update?",
        choices: [],
      },
      {
        name: "role",
        type: "list",
        message: "Select the employee's new role",
        choices: [],
      },
    ])
    .then((answer) => {
      connection.query(`UPDATE employees SET WHERE ?`, {
        role_id: answer.role,
      });
    });
};
const empManager = () => {

};

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
        "View employees by manager",
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

        case "View employees by manager":
          empManager();
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

connection.connect((err) => {
  if (err) throw err;
  init();
});
