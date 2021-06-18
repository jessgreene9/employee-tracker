const inquirer = require('inquirer');
const mysql = require('mysql');
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
    connection.query('SELECT * FROM employees',
    
    (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
    
};




const empDepartments = () => {
    inquirer
    .prompt({
        name: "department",
        type: "list",
        message: "Select which department you would like to view.",
        choices: ["Engineering",
        "Sales",
        "Legal",
        "Finance"],

}).then((answer) => {;
    connection.query('SELECT title, first_name, last_name, department_name FROM role INNER JOIN employees ON employees.role_id = role.id INNER JOIN department ON role.department_id = department.id',
    
    (err, results) => {
        if (err) throw err;
        console.table(results);
        init();
    });
})}



const empRoles = () => {};






const empManager = () => {};
const addEmployee = () => {};
const removeEmployee = () => {};





const init = () => {
   
        inquirer
            .prompt({
                name: 'response',
                type: 'list',
                message: 'What would you like to do?',
                choices: [
                'View all employees',
                'View employees by departments',
                'View employees by roles',
                'View employees by manager',
                'Add employee',
                "Remove employee",
                'Exit'
            ],      
        })
        .then((answer) => {
            switch (answer.response) {
                case 'View all employees':
                    employees();
                    break;
                
                case 'View employees by departments':
                    empDepartments();
                    break;
    
                case 'View employees by roles':
                    empRoles();
                    break;
                
                case 'View employees by manager':
                    empManager();
                    break;

                case 'Add employee':
                        addEmployee();
                        break;    

                 case 'Remove employee':
                        removeEmployee();
                        break;           
    
                case 'Exit':
                    
                    connection.end();
                    break;
            }
        });
     };









connection.connect((err) => {
    if (err) throw err;
    init();
})
