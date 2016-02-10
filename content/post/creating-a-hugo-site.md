+++
title = "Creating a Hugo Site"
date = "2016-02-09T17:56:56-05:00"
+++

As the first blog post of my new site, I thought it would be appropriate to
detail how I got it up and running. For those that don't know, Hugo is a static
site generator written in Go. I highly recommend checking it out, https://gohugo.io/.

When creating my site I decided to make my own theme as well, to get the full
experience of developing a site with Hugo. I used a minimal bootstrap-based theme
named [hugo-bootswatch](https://github.com/nilproductions/hugo-bootswatch) as the
base for my theme, with modifications to allow it to support sass and
compiled/minified css/js.

I'll walk you through the steps I took to get my site up and running, with the
hope that this guide may help someone else who ran into the same issues.

# Installing Go

Hugo requires Go 1.4 or higher, which can be tricky to install on some systems.
Fedora ships with Go 1.5.3, where Ubuntu ships with a much lower version. To get
around this, I used a tool called [GVM](https://github.com/moovweb/gvm) (Go
Version Manager) which proved to be hugely helpful. Once you have GVM installed
you can run

    gvm install go1.4
    gvm use go1.4

GVM will automatically set your GOPATH, which is an environment variable pointing
to what is essentially your Go workspace. You may want to change it to something
that's a little easier to remember, and also add any applications built using Go
onto your path. To do this, append this to the end of your ~/.bashrc file.

<pre><code class="highlight bash">export GOPATH=~/go # Or whatever you want to use
export PATH=$PATH:$GOPATH/bin
</code></pre>

Once that's done, simply open a new bash prompt and you're ready to start using Go!

# Building Hugo from Source

If you can't use any of the builds from the Hugo download page, or just want to
run the latest and greatest, it's pretty easy to build go from source. You can
either download the source code for a given release from the download page, or
pull the repository directly. If you wish to pull the repository, you can find it
at https://github.com/spf13/hugo/, and get it using Go's "go get" command like so.

    go get -v github.com/spf13/hugo

If you did not follow the earlier steps for installing go and have a version lower
than 1.4, you will not be able to build hugo in this way.

# Using Hugo

**Note:** At the time of this writing, Hugo is version 1.6

The first step in using hugo is setting up your site, this should be setup like
so. Below I will explain what all of these files are and how to make them.

    .
    ├── config.toml
    ├── archetypes/
    |   └── default.md
    ├── content/
    |   ├── post/
    |   |   ├── firstpost.md
    |   ├── page/
    |   |   ├── about.md
    ├── data/
    ├── layouts/
    ├── themes/
    └── static/
        ├── css
        └── js

## TOML

In this guide I will be using [TOML](https://github.com/toml-lang/toml) (Tom's
Obvious Minimal Language) for it's simplicity, and it being the default used by
Hugo. Before starting Hugo development I had never heard of TOML before, so
here's a quick introduction for anyone else seeing it for the first time.

<pre><code class="highlight language-toml ini"># This is a Comment

title = "TOML Example"
showsomething = false
count = 4
date = 1979-05-27T07:32:00-08:00 # First class dates

[author]
    name = "Stephen Lane-Walsh"

[params]
    items = [ "item1", "item2", "item3" ]
    subitems = [
        ["item1.1", "item1.2"],
        ["item2"]
    ]
</code></pre>

## Markdown

All content used by Hugo is written in Markdown. I won't do an example justice,
so if you don't know what Markdown is you can check it out here http://commonmark.org/.

## Hugo Config

The config file is the heart of your site, without this hugo won't even run. All
config and metadata in Hugo can be expressed in either TOML, YAML, or JSON. Hugo
will look for data in the order, meaning that if you had a config.toml and a
config.yaml, the config.toml would be used.

There are a few options that are necessary in order to get Hugo running, as well
as any number of theme-specific params. Here is an example config.toml file.

<pre><code class="highlight language-toml ini">baseurl = "http://example.com/"
theme = "theme-name"
title = "Site Name Here"

contentdir = "content"
layoutdir = "layouts"
publishdir = "public"

builddrafts = false
canonifyurls = true
paginate = 3
PaginatePath = "/"

[author]
    name = "Your Name Here"

[permalinks]
    page = "/:title/"
    post = "/article/:title/"

[params]
    description = "Site Description"

    # Theme specific parameters go here
</code></pre>

## Installing Themes

If you plan on using an existing theme, take a look here http://themes.gohugo.io/.
Most themes come with installation instructions, but the general way to install
a theme is to find the repository URL, and clone it inside your themes/ directory like so.

<pre><code class="highlight bash">cd $SITE_DIR/themes
git clone https://github.com/nilproductions/hugo-bootswatch.git
</code></pre>

After you've installed a theme, don't forget to update your config file and set
"theme" to the directory name of your new theme. For Bootswatch that would be
hugo-bootswatch.

## Content

The content/ folder holds all of your site's markdown content, including your
pages, posts, and other types. The subfolders are organized as {type}/{file}.md
(e.g. post/blog-post.md).

All content is able to store metadata in the form of
front matter. Front matter is TOML, YAML, or JSON at the beginning of a content
document that specifies things such as Title, Tags, or any other front matter used
in your layouts.

For example, a post might look like the following.

<pre><code>+++
title = "First Post"
author = "Somebody"
tags = [ "new", "cool" ]
+++

# First Post

Lorem ipsum dolor sit amet...

</code></pre>

## Archetypes

Archetypes are ways of organizing content and setting default front matter. This
is useful if you're adding a type of content such as "projects" or "animals" and
want to have a default set of front matter applied to all new entries that are
created using the ```hugo new``` command (See Commands).

An archetype document simply contains the front matter and it's default values,
for example, to create an archetype file for a type called "thing" you would
make the file "archetypes/thing.md" and fill it with the following.

<pre><code class="highlight language-toml ini">+++
tags = [ "new" ]
image = ""
something = false
+++
</code></pre>

## Layouts

Layouts are ways of defining the HTML generated by your content. Layouts live
first in your theme, and can be overridden by your top-level layouts/ directory.
Determining the layout to use for a piece of content is done using a hierarchy.

### Single Content

Single content is any piece of content being rendered on its own, be that a page
or a blog post or whatever. The layout file is determined by the following
hierarchy.

 - /layouts/`TYPE`-or-`SECTION`/`LAYOUT`.html
 - /layouts/`TYPE`-or-`SECTION`/single.html
 - /layouts/\_default/single.html
 - /themes/`THEME`/layouts/`TYPE`-or-`SECTION`/`LAYOUT`.html
 - /themes/`THEME`/layouts/`TYPE`-or-`SECTION`/single.html
 - /themes/`THEME`/layouts/\_default/single.html

### List Content

List content is any page that is comprised of multiple pieces of content, such
as a blog page listing all of the recent posts. List layout files are determined
much like the single layout files, but using the following hierarchy.

 - /layouts/section/`SECTION`.html
 - /layouts/\_default/section.html
 - /layouts/\_default/list.html
 - /themes/`THEME`/layouts/section/`SECTION`.html
 - /themes/`THEME`/layouts/\_default/section.html
 - /themes/`THEME`/layouts/\_default/list.html

## Static

The static/ folder is exactly what it sounds like, a place to put static assets.
Both the theme and the site have static/ folders, and when the site is built
Hugo merges them together, with the site taking priority over the theme.

This is where you should put all CSS, JS, and Image files, along with any other
static content or files. Everything in this folder will be copied to the output
directory verbatim, so if you had a folder containing the following.

    └── static/
        ├── css/
        |    └── site.css
        └── js/
             └── site.js

They would end up in the output directory as

    └── output_dir/
        ├── css/
        |    └── site.css
        └── js/
             └── site.js


## Commands

### Creating Content

If you want to add new content, you can run the following command to generate a
blank document with the default front matter filled in.

    hugo new post/blog-post.md

This can be used for any archetype you have by replacing "post" with the name of
the archetype.

### Compiling Site

If you want to built this fine site you've made and get it ready for deployment
to a webserver like Apache or Nginx, then you simply run the following command from the directory your config.toml/yaml/json is.

    hugo

Assuming hugo is installed correctly, it should give you an output like the following.

    0 draft content
    0 future content
    5 pages created
    0 non-page files copied
    0 paginator pages created
    5 tags created
    0 categories created
    in 20 ms

If you check your public/ directory (or wherever your config says to place the
compiled files) you should now find a fully built site. You may also run hugo
and tell it to copy the files directly to your web root with a command like the
following.

    hugo -d /var/www/

#### Developing Locally

If you're working on your site locally and want to see your changes as you make
them, you can run the following.

    hugo server

Which will output something similar to

    ...
    Serving pages from memory
    Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
    Press Ctrl+C to stop

Which means your site is now visible from http://localhost:1313/. Once you're on
that page, it will auto reload when any changes are made to the files in your
site.
