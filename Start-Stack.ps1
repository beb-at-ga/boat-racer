


& docker build -t apache .
& docker run -dit --name boat-racer -p 8080:80 --mount src="$(pwd)/public",target=/usr/local/apache2/htdocs,type=bind apache 

