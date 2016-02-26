<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'post_id' => 'integer',
        'comment_id' => 'integer'
    ];

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

    /**
     * Get the parent comment a comment belongs to.
     */
    public function childComments() {
        return $this->hasMany('App\Comment');
    }


}
