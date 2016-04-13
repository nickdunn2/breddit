<?php

use App\User;
use App\Post;
use App\Comment;
use App\Subbreddit;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /* Probably needs to be updated to NOT truncate User, so contributors pulling down and going through the ReadMe can first create a user, and then seed (allowing the seed to randomly generate posts, comments and subscriptions for the created user first) */
        User::truncate();
        Post::truncate();
        Comment::truncate();
        Subbreddit::truncate();
        DB::table('subbreddit_user')->truncate();

        $users = factory(User::class, 25)->create();
        $users->each(function($user) {
            $user->subbreddits()->save(factory(App\Subbreddit::class)->make());
            $user->posts()->save(factory(App\Post::class)->make([
                'subbreddit_id' => rand(1,App\Subbreddit::all()->count())
            ]));

            $user->comments()->save(factory(App\Comment::class)->make([
                'post_id' => rand(1,App\Post::all()->count())
            ]));

            $user->comments()->save(factory(App\Comment::class)->make([
                'comment_id' => rand(1,App\Comment::all()->count())
            ]));

            $user->subscribedSubbreddits()->attach(rand(1,App\Subbreddit::all()->count()));
        });
    }
}
