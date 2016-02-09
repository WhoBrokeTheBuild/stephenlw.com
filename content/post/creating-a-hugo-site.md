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

## Installing Go

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

    export GOPATH=~/go # Or whatever you want to use
    export PATH=$PATH:$GOPATH/bin

Once that's done, simply open a new bash prompt and you're ready to start using Go!

## Building Hugo from Source

If you can't use any of the builds from the Hugo download page, or just want to
run the latest and greatest, it's pretty easy to build go from source. You can
either download the source code for a given release from the download page, or
pull the repository directly. If you wish to pull the repository, you can find it
at https://github.com/spf13/hugo/, and get it using Go's "go get" command like so.

    go get -v github.com/spf13/hugo

If you did not follow the earlier steps for installing go and have a version lower
than 1.4, you will not be able to build hugo in this way.

## Using Hugo

The first step in using hugo is setting up your site, this should be setup like
so.

    .
    ├── config.toml
    ├── archetypes
    |   └── default.md
    ├── content
    |   ├── post
    |   |   ├── firstpost.md
    |   ├── page
    |   |   ├── about.md
    ├── data
    ├── layouts
    ├── themes
    |   └── your-theme-here
    └── static
        ├── css
        └── js

### TOML

In this guide I will be using TOML (Tom's Obvious Minimal Language) for it's
simplicity, and it being the default used by Hugo. Before starting Hugo development
I had never heard of TOML before, so here's a quick introduction for anyone else
seeing it for the first time.

    # This is a Comment

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

### Markdown

All content used by Hugo is written in Markdown. I won't give an example justice,
so if you don't know what Markdown is you can check it out here http://commonmark.org/.

### Hugo Config

The config file is the heart of your site, without this hugo won't even run. All
config and metadata in Hugo can be expressed in either TOML, YAML, or JSON. Hugo
will look for data in the order, meaning that if you had a config.toml and a
config.yaml, the config.toml would be used.

There are a few options that are necessary in order to get Hugo running, as well
as any number of theme-specific params. Here is an example config.toml file.

    baseurl = "http://example.com/"
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
