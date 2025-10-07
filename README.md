## Vehicle-microservice:
### Для запуску на локалці:
На локалці можна запустити без редагування .env за допомогою команд:
````
git clone https://github.com/SonyaJAVASCRIPT/ts-vehicle-service-platform
cd ts-vehicle-service-platform
docker-compose build --no-cache
docker-compuse up
````
 - `http://localhost:3000` - публічний фронтенд
 - `http://localhost:3001` -  публічний user-service
 - `http://localhost:3002` - публічний vehicle-service
 - `http://localhost:15672` - публічний dashboard RMQ

### На сервері:
Майже все ідентично, проте не забудьте змінити файл .env.
````
git clone https://github.com/SonyaJAVASCRIPT/ts-vehicle-service-platform
cd ts-vehicle-service-platform
docker-compose build --no-cache
docker-compuse up
````
