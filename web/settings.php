<?php
function isLocalEnvironment() : bool 
{
    return isset($_SERVER['HTTP_X_LANDO']);
}

function getHost() : string
{
    $host = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'];
    return substr_count($host, ':')
        ? preg_replace('/:[0-9]+$/', '', $host)
        : $host;
}

function getPort() : ?string
{
    $port = $_SERVER['HTTP_X_FORWARDED_PORT'] ?? $_SERVER['SERVER_PORT'];
    return is_numeric($port) 
        ? (string) $port 
        : null;
}

function baseHref(string $protocol, string $host, string $path, string $port) : string
{
    $baseUrl = $protocol . '://' . $host;

    if ($port != '80') {
        $baseUrl .= ':' . $port;
    }

    $baseUrl .= $path;

    return $baseUrl;
}

function ping(string $url) : bool
{
    $port = preg_match('/:([\d]+)/', $url, $matches)
        ? $matches[1]
        : 80;

    $url = preg_replace('/:\d+/', '', $url);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_PORT, $port);
    curl_exec($ch);
    $retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $retcode == 200 || $retcode == 0;
}

function cycleBackEndPort() : string
{
    if (!isset($_SESSION['backEndPorts']) || empty($_SESSION['backEndPorts'])) {
        $_SESSION['backEndPorts'] = ['8080', '8000', '80'];
    }

    $first = array_shift($_SESSION['backEndPorts']);

    return $first;
}

//------------------------------------------------------------------------

if (isLocalEnvironment()) {

    $selfProtocol    = 'http';
    $selfHost        = getHost() ?? 'player-frontend.lndo.site';
    $selfPath        = '/';
    $selfPort        = getPort();

    $backendProtocol = 'http';
    $backendHost     = 'player-backend.lndo.site';
    $backendPath     = '/';
    $backendPort     = !empty($_SESSION['sucessfullyContactedBackEnd'])
                            ? $_SESSION['sucessfullyContactedBackEnd']
                            : cycleBackEndPort();

} else {

    $selfProtocol    = 'https';
    $selfHost        = 'adinancenci.com.br';
    $selfPath        = '/player/';
    $selfPort        = '80';

    $backendProtocol = 'https';
    $backendHost     = 'adinancenci.com.br';
    $backendPath     = '/player/backend/web/';
    $backendPort     = '80';

}

$selfBaseHref        = baseHref($selfProtocol, $selfHost, $selfPath, $selfPort);
$backendBaseHref     = baseHref($backendProtocol, $backendHost, $backendPath, $backendPort);

if (isLocalEnvironment() && empty($_SESSION['sucessfullyContactedBackEnd'])) {
    if (ping($backendBaseHref)) {
        $_SESSION['sucessfullyContactedBackEnd'] = $backendPort;
    } else {
        header('Location: ' . $selfBaseHref);
    }
}
