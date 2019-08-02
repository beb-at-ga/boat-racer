

& docker rmi -f $(docker images apache -aq)
& docker rmi -f $(docker images httpd -aq)


& docker rm $(docker container ps --filter "name=boat-racer" -aq) -f

