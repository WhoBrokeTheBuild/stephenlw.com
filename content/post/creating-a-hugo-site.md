+++
title = "Creating a Hugo Site"
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

Once that's done, simply open a new bash prompt and you're ready to start using
Go!

## Building Hugo from Source

You can either download the source code for a given release from the download page,
or pull the repository directly. If you wish to pull the repository, you can find
it at https://github.com/spf13/hugo/.
