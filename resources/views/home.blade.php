<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Breddit - A better reddit</title>

    <!-- Fonts -->


    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">

    <style>
        
    </style>

</head>
<body>
    <div id="nav"></div>
    <div id="content"></div>
    <div id="modal" class="reveal-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog"></div>
    <div data-user-id="{{ $userId }}"></div>
    <!-- JavaScripts -->
    <script type="text/javascript" src="{{ asset('js/bundle.js') }}"></script>
</body>
</html>
