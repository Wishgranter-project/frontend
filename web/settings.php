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

//------------------------------------------------------------------------

if (isLocalEnvironment()) {

    $selfProtocol    = 'http';
    $selfHost        = getHost() ?? 'player-frontend.lndo.site';
    $selfPath        = '/';
    $selfPort        = getPort();

    $backendProtocol = 'http';
    $backendHost     = 'player-backend.lndo.site';
    $backendPath     = '/';
    $backendPort     = '80';

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

