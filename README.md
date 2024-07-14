# Inventory IQ

Open "Fair-Code" Source Inventory System made with PHP Laravel and React JS Framework


```
🚀 Give a star ⭐ & fork this project... Happy Coding! 😁
```

## License
Inventory IQ is a Free Open Source [fair-code](http://faircode.io) distribution

## Features
This project is currently on development and enhancements but some of the features includes are:

```
● Product Management 🍔
● Warehouse Management 🏨
● CRM 🧑‍🤝‍🧑
● HR Management 🧑‍🤝‍🧑
```

Some more features will be added, stay tuned...


## Deployment of the Project on the Local
To deploy this project, make sure you've installed:

```
● Docker
● docker compose
```

---

#### Steps to install
Run the following in the terminal inside the root folder of the project.

```
docker compose up -d --build
```

This will build the folder and run your application. To setup the database of your application in the docker, run the command:

```
● docker exec -it [[**container_id_here**]] bash
● ./BackendSetup.sh
```

to stop the running application, just run:

```
docker compose down
```