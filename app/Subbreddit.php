<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subbreddit extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'description',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer'
    ];

    /**
     * Get the user who created a subbreddit.
     */
    public function user()
    {
        return $this->belongsTo('App\User');
    }

	/**
	* Get the posts for a subbreddit.
	*/
    public function posts() 
    {
    	return $this->hasMany('App\Post');
    }

    /**
    * Get the users subscribed to a subbreddit.
    */
    public function subscribedUsers() 
    {
        return $this->belongsToMany('App\User')->withTimestamps();
    }
}
