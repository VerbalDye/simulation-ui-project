# Server Setup and Operation Instructions

## Required Software

To start the server you will need to have the following softwares installed:
* Node.JS
* Microsoft SQL Server Developer (If you are attempting to run your SQL server locally)

You will need to setup a database for the project to use in MSSQL.

## Credential Management for SQL Connection

Once the database is setup you will need share connection details with the project using a  ".env" file. Create a file named ".env" in the "server" folder. The file must contain the following variables in this format for the server to connect to your MySQL instance: <br>
`DB_SERVER='SERVER_IP_HERE'`<br>
`DB_NAME='DATABASE_NAME_HERE'`<br>
`DB_USER='USERNAME_HERE'`<br>
`DB_PW='PASSWORD_HERE'`<br>
Replace the areas in quotes depending on your particular server details.

## Server Commands

Once this is set up open a GitBash window in this folder and run the following command to initialize the project (This will only need to be done once after install):
```
npm i
```

To start an instance of the server running on your machine, run the following command:
```
npm start
```

To stop the server, from the commandline, press "CTRL+C" (As if you were trying to copy text). This will stop the server.

If the frontend files have already been build, then this will start the server. Navigate to [127.0.0.1:3001](127.0.0.1:3001) to view the result!


## Troubleshooting

### SQL Connection Issues

If you are having trouble connecting to your SQL server. There are a number of things to check. As of right now the server uses a custom SQL login that you will need to create. Microsoft Sequel Server Management Studio (SMSS) is a great tool for troubleshooting.

* You can create a SQL login by right clicking on the "Logins" folder under "Security" and clicking "New Login"
* After the login is created, make sure the login has permissions to affect your database in the properties menu of the new SQL user (This should generally reflect the permissions of your auto-created Windows Auth SQL account).
  - Under "General" disable "Enforce password expiration", if this is for a service, not a user.
  - Under "Server Roles" grant "sysadmin" permission.
  - Under "User Mapping" make sure the database you want to reference is checked.
* Make sure that the server is configure to accept SQL logins. That's under "Server Properies > Security > Server authentication"
* If, at this point, you are able to login to the account though SMSS and make changes, but the server is still throwing errors.
  - Open SQL Server Configuration Manager located at `C:\Windows\SysWOW64\SQLServerManager16.msc` for SQL Server 2022. Locations for other version available [here](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-configuration-manager?view=sql-server-ver16).
  - Once open, look under "SQL Server Network Configuration > Protocols for > TCP/IP" and make sure it is enabled.