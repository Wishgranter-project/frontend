<?php
$port = $_SERVER['HTTP_X_FORWARDED_PORT'] ?? $_SERVER['SERVER_PORT'];
$baseHref = 'http://player-frontend.lndo.site' . ($port != '80' ? ':' . $port : '') . '/';
$backEndPort = '80';
if ($port != '80') {
    $backEndPort = $port == '8000' ? '8080' : '8000';
}
$backEndPort = '8080';
?><!DOCTYPE html>
<html lang="en">
    <head>
        <base href="<?php echo $baseHref;?>" />
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script>
            window.playerSettings = {
                backEndBaseUrl: '<?php echo 'http://player-backend.lndo.site' . ($backEndPort != '80' ? ':' . $backEndPort : '') . '/'; ?>'
            }
        </script>
        <script src="dist/main.js"></script>
        <link href="dist/master.css" rel="stylesheet" />
        <link href="dist/layout.css" rel="stylesheet" />
        <link href="dist/styles.css" rel="stylesheet" />
        <link rel="icon" type="image/x-icon" href="dist/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossorigin="anonymous" />
        <title>Document</title>
    </head>
    <body class="simple">

    </body>
</html>