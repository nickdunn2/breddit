<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App;
use App\Subbreddit;
use App\Http\Requests;
use App\Http\Controllers\Controller;

class SubbredditsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Subbreddit::paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $subbreddit = new Subbreddit;
        $subbreddit->user_id = \Auth::user()->id;
        $subbreddit->name = $request->name;
        $subbreddit->description = $request->description;
        $subbreddit->save();

        return $subbreddit;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Subbreddit::with([
            'user', 
            'posts.comments.childComments'
            ])
        ->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $subbreddit = Subbreddit::findOrFail($id);
        $subbreddit->name = $request->name;
        $subbreddit->description = $request->description;
        $subbreddit->save();

        return $subbreddit;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $subbreddit = Subbreddit::findOrFail($id);
        $subbreddit->delete();
        return $subbreddit;
    }
}
