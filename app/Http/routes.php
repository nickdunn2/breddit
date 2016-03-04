<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::get('/', function() {
    return view('welcome');
});

// Route to view logs. ONLY for use in development
if(env('APP_DEBUG')) {
    Route::get('logs', '\Rap2hpoutre\LaravelLogViewer\LogViewerController@index');
}

Route::group(['middleware' => 'web'], function () {
    Route::auth();

    Route::get('/home', 'HomeController@index');

    Route::group(['prefix' => 'api'], function () {
        Route::resource('subbreddits', 'SubbredditsController', [
            'only' => ['index', 'show']
        ]);

        Route::resource('comments', 'CommentsController', ['except' => [
            'create', 'edit'
        ]]);

        Route::resource('posts', 'PostsController', ['except' => [
            'create', 'edit'
        ]]);

        Route::resource('users', 'UsersController', ['except' => [
            'create', 'edit', 'store'
        ]]);

        Route::group(['middleware' => 'auth'], function() {
            Route::resource('subbreddits', 'SubbredditsController', [
                'only' => ['store', 'update', 'destroy']
            ]);

            Route::resource('posts', 'PostsController', [
                'only' => ['store', 'update', 'destroy']
            ]);

            Route::resource('comments', 'CommentsController', [
                'only' => ['store', 'update', 'destroy']
            ]);
        });
    });


});
