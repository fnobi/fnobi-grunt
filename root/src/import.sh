data_dir=data
blog=fnobi.com
api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4
api="http://api.tumblr.com/v2/blog/$blog/posts"

# # filter text posts
# api=$api"/text"

# set api key
api=$api"?api_key=$api_key"

# # with note info
# api=$api"&notes_info=true"

# # filter pickup tagged
# api=$api"&tag=pickup"

if [ ! -e $data_dir ] ; then
    mkdir -p $data_dir
fi

curl "$api" > $data_dir/api.json
cat $data_dir/api.json | jq .response.blog > $data_dir/blog.json
cat $data_dir/api.json | jq .response.posts > $data_dir/posts.json
