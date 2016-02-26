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
        // pagination returns errors on the AJAX requests, can use all() tmp instead
        // need to find a fix in the multi-layered JSON selector
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
        $subbreddit->user_id = auth()->user()->id;
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
        $this->authorize('update-destroy-subbreddit', $subbreddit);
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
        $this->authorize('update-destroy-subbreddit', $subbreddit);
        $subbreddit->delete();
        return $subbreddit;
    }
}
