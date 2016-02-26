<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Http\Requests;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Comment::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $comment = new Comment;
        $comment->user_id = auth()->user()->id;

        if($request->post_id) {
            $comment->post_id = $request->post_id;
            $comment->comment_id = null;
        } else {
            $comment->post_id = null;
            $comment->comment_id = $request->comment_id;
        }

        $comment->content = $request->comment_content;
        $comment->save();

        return $comment;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Comment::with('parentComment', 'childComments')->findOrFail($id);
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
        $comment = Comment::findOrFail($id);
        $this->authorize('update-destroy-comment', $comment);
        $comment->content = $request->comment_content;
        $comment->save();

        return $comment;

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $this->authorize('update-destroy-comment', $comment);
        $comment->delete();
        return $comment;
    }
}
