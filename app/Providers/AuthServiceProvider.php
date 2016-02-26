<?php

namespace App\Providers;

use Illuminate\Contracts\Auth\Access\Gate as GateContract;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        'App\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any application authentication / authorization services.
     *
     * @param  \Illuminate\Contracts\Auth\Access\Gate  $gate
     * @return void
     */
    public function boot(GateContract $gate)
    {
        $this->registerPolicies($gate);

        $gate->define('update-destroy-subbreddit', function ($user, $subbreddit) {
            return $user->id === $subbreddit->user_id;
        });

        $gate->define('update-destroy-post', function ($user, $post) {
            return $user->id === $post->user_id;
        });

        $gate->define('update-destroy-comment', function ($user, $comment) {
            return $user->id === $comment->user_id;
        });
    }
}
