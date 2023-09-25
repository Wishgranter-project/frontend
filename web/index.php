<?php 
session_start();
require 'settings.php';
?><!DOCTYPE html>
<html lang="en">
    <head>
        <base href="<?php echo $selfBaseHref;?>" />
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script>
            window.playerSettings = {
                backEndBaseUrl: '<?php echo $backendBaseHref; ?>'
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