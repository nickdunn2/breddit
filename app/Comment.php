<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * Get the user a comment belongs to.
     */
    public function user() {
        return $this->belongsTo('App\User');
    }

    /**
     * Get the post a comment belongs to.
     */
    public function post() {
        return $this->belongsTo('App\Post');
    }

    /**
     * Get the parent comment a comment belongs to.
     */
    public function parentComment() {
        return $this->belongsTo('App\Comment');
    }
}
