$services = @("rest-api", "scheduler", "worker")

for ($i = 0; $i -lt $services.length; $i++){
    $service = $services[$i]

    Invoke-Expression -Command "docker-compose --env-file $PSScriptRoot\..\.env.development exec -T $service bash -c 'echo $$RANDOM > /poeticmetric/random.txt'"
}

