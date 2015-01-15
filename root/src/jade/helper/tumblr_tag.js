module.exports = {
    data: {
        available: false,
        isPermalinkPage: false,
        blog: {},
        posts: [],
        custom: {
            image: {}
        }
    },
    title: function (post) {
        if (this.data.available) {
            if (post) {
                return post.title;
            } else {
                return this.data.blog.title;
            }
        } else {
            return '{Title}';
        }
    },
    description: function () {
        if (this.data.available) {
            return this.data.blog.description;
        } else {
            return '{Description}';
        }
    },
    blogURL: function () {
        if (this.data.available) {
            return this.data.blog.url;
        } else {
            return '{BlogURL}';
        }
    },
    urlEncodedBlogURL: function () {
        if (this.data.available) {
            return escape(this.blogURL());
        } else {
            return '{URLEncodedBlogURL}';
        }
    },
    permalink: function (post) {
        if (this.data.available) {
            if (post) {
                return post.post_url;
            } else {
                return '';
            }
        } else {
            return '{Permalink}';
        }
    },
    photoURL500: function (photo) {
        if (this.data.available) {
            if (photo) {
                return photo.alt_sizes[1].url;
            } else {
                return '';
            }
        } else {
            return '{PhotoURL-500}';
        }
    },
    photoURLHighRes: function (photo) {
        if (this.data.available) {
            if (photo) {
                return photo.original_size.url;
            } else {
                return '';
            }
        } else {
            return '{PhotoURL-HighRes}';
        }
    },
    customDeclearMeta: function () {
        if (this.data.available) {
            return '';
        }
        var custom = this.data.custom;
        var image = custom.image;
        var buf = [];
        for (var name in image) {
            buf.push('<meta name="image:' + name + '" content="' + image[name] + '" />');
        }
        return buf.join('');
    },
    customImage: function (name) {
        if (this.data.available) {
            return this.data.custom.image[name] || '';
        } else {
            return '{image:' + name + '}';
        }
    }
};