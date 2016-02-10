<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subbreddit extends Model
{
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
        return $this->belongsToMany('App\User');
    }
}
