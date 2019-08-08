

if ($(docker container ps --filter "name=boat-racer" -aq)) {
    Start-Process -FilePath "docker" -ArgumentList "rm $(docker container ps --filter 'name=boat-racer' -aq) -f" -Wait
    Start-Process -FilePath "docker" -ArgumentList "rmi -f $(docker images apache -aq)" -Wait
}

Start-Process -FilePath "docker" -ArgumentList "build -t apache ." -Wait
Start-Process -FilePath "docker" -ArgumentList "run -dit --name boat-racer -p 8080:80 --mount src=$(Get-Location)/public,target=/usr/local/apache2/htdocs,type=bind apache" -Wait
Start-Process  '/Applications/Google Chrome.app'

