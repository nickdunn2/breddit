<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'url', 'title', 'content',
    ];

    /**
     * Get the user a post belongs to.
     */
    public function user() {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the subbreddit a post belongs to.
     */
    public function subbreddit() {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the comments for a post.
     */
    public function comments()
    {
        return $this->hasMany('App\Comment');
    }
}
