
<p align="center">

  <h2 align="center">Budget Builder</h2>

  <p align="center">
    A web app for making budgets and tracking spending
    </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About Budget Builder](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

Budget Builder is a web application I made as a personal project in the summer of 2020. Having completeing a course on Relational Databases & SQL, I challenged myself to implement what I had learned about SQL into a dynamic web application.

Budget Builder uses HTML, CSS, and JavaScript as the bases to create a simple and clean, resonsive user interface where users can register for and login to an account. Once logged in, users can create, update, or delete budgets, which are stored on a MySQL database.

Having worked a summer job for most of the summer, Budget Builder was built in only one weeks time. A feature I would like to add in the future is a way for users to track spending.

### Built With

* [Node.js](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Handlebars](https://handlebarsjs.com/)



<!-- GETTING STARTED -->
## Getting Started

To get budget builder running locally, follow these few steps.

### Prerequisites

* npm
```sh
npm install npm@latest -g
```
* Access to a MySQL database
    * I used XAAMP for development [XAAMP Donwload Link](https://www.apachefriends.org/index.html)

### Installation

1. Clone the repo
```sh
git clone https://github.com/sshannon237/budget-builder.git
```
2. Install NPM packages
```sh
npm install
```
3. Setup MySQL Database by running the following script
```sql
CREATE DATABASE budgetbuilder;

CREATE TABLE `budgetbuilder`.`users` ( `users_id` INT(11) NOT NULL AUTO_INCREMENT , `users_name` VARCHAR(100) NOT NULL , `users_email` VARCHAR(100) NOT NULL , `users_password` VARCHAR(255) NOT NULL , PRIMARY KEY (`users_id`));

CREATE TABLE `budgetbuilder`.`budgets` ( `budgets_id` INT(11) NOT NULL AUTO_INCREMENT , `users_id` INT(11) NOT NULL , `budgets_name` VARCHAR(255) NOT NULL , `budgets_income` INT(11) NOT NULL , `budgets_transportation` INT(11) NOT NULL , `budgets_groceries` INT(11) NOT NULL , `budgets_eating_out` INT(11) NOT NULL , `budgets_savings` INT(11) NOT NULL , `budgets_other` INT(11) NOT NULL , `budgets_housing` INT(11) NOT NULL , `budgets_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`budgets_id`));
```

4. Update .env file with your database's host, username, and password

<!-- CONTACT -->
## Contact

Samuel Shannon - sshannon237@gmail.com

Project Link: [https://github.com/sshannon237/budget-builder](https://github.com/sshannon237/budget-builder)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Telmo Acadamy](https://telmosampaio.com/) | Login authentication system is based on his Node.js MySQL tutorial
