import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPost } from '../../actions/post';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import PostItem from '../posts/PostItem';
import Spinner from '../layout/Spinner';

const Post = ({ getPost, post: { post, loading }, match }) => {

    useEffect(() => {
        getPost(match.params.id);
    }, [getPost, match.params.id]);

    return loading || post === null ? <Spinner /> : <Fragment>
        <div className='container'>
            <Link to='/posts' className='btn'>Back To Posts</Link> 
            <PostItem post={post} showActions={false} />
            <CommentForm postId={post._id} />
            <div className='comments'>
                {post.comments.map(comment => (
                    <CommentItem key={comment._id} comment={comment} postId={post._id} />
                ))}
            </div>
        </div>
    </Fragment>
};

Post.defaultProps = {
    showActions: false
};

Post.propTypes = {
    getPost: PropTypes.func.isRequired,

};

const mapStateToProps = state => ({
    post: state.post
});

export default connect(mapStateToProps, { getPost })(Post)
