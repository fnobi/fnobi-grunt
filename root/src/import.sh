data_dir=data
blog=fnobi.com
api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4
api="http://api.tumblr.com/v2/blog/$blog/posts"

# # filter text posts
# api=$api"/text"

if [ ! -e $data_dir ] ; then
    mkdir -p $data_dir
fi

curl "$api?api_key=$api_key&notes_info=true" > $data_dir/api.json
cat $data_dir/api.json | jq .response.blog > $data_dir/blog.json
cat $data_dir/api.json | jq .response.posts > $data_dir/posts.json
