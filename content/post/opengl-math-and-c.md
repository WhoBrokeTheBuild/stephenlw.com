+++
title = "Writing an OpenGL Game Engine"
+++

Before we start, you're probably asking "Why?" Well, to that I say "Why not?" and leave it at that.

Now, before we get to actually rendering anything we need to make some math. More specifically, we need to make some functions to help us handle the vectors, matrices and quaternions used to render things in 3D space. For this purpose, I have created a library named GLMM (or GLM--). This is a C-port of the widely used OpenGL Math Library (or GLM), which is a header-only C++ library.

Below is the link to the library, and this post will be walking through the different data structures and approaches I took to replicate GLM's functionality in C.

[http://github.com/WhoBrokeTheBuild/glmm.git](http://github.com/WhoBrokeTheBuild/glmm.git)

## Macros

Before the world of templates, there were only Macros.

No but actually, they're really useful. GLMM makes extensive use of them to prevent duplicate code in thinks like the different Vector structures and debug logging. For those of you who know how macros work already, you can skip this section. For everyone else, keep reading.

A macro is a define that can take "parameters". These parameters get pasted into the resulting code as if they were typed in the code directly. For building complex statements where it becomes hard for the preprocessor to differentiate between macro parameters and actual code, you can use #'s to help delimitate them. Here is a simple macro that converts Degrees to Radians:

```
#define GLMM_RAD(DEG) ((DEG) * (3.14159 / 180.0))

// Example
float rad = GLMM_RAD(90);
// will produce the following code
float rad = ((90) * (3.14159 / 180.0))
```

One thing to note, is that I wrap the parameters in an extra set of parenthesis. This is due to the nature of macros. Since whatever is passed into DEG is pasted verbatim in the generated code, if you did something like the following, it could cause a problem:

```
// BAD
#define GLMM_RAD(DEG) (DEG * (3.14159 / 180.0))

float rad = GLMM_RAD(90 / 2);
float rad = (90 / 2 * (3.14159 / 180.0))
```

Where a function would evaluate the "90 / 2" and run the code against "45", the macro processes the equation as a whole. This would probably work out in this scenario, but as we make more complex macros this could easily lead to errors.

Now here is a snippit from my debugging macros section, it's used to print errors throughout my code and where they're coming from.

```
#define DEBUG_ERROR(M, ...) fprintf(stderr, "[ERROR](%s:%d) " M "\n", __FILE__, __LINE__, ##__VA_ARGS__)
```

Well that's a mouth full. Let's go through all the new stuff, from left to right.

The `...` allow for what's called Variable Arguments, meaning you can pass as many parameters as you want in and it will pass them along. This is used in functions like printf() and fprintf().

The next small thing to note is the `M` floating in the middle of the string. This can be confusing to new C developers, but you're allowed to place multiple string literals next to each other and they will be interpreted as one string. For example:

```
const char* msg = "Hello " "World";
const char* bio = "Lorem ipsum dolor " \
                  "sit amet, constructieir" \
                  "blah blah";
```

Next on the list of interesting things are the `__FILE__` and `__LINE__` defines, which are magic constants updated by the compiler for every file and line they parse. These are replaced when the code is pre-processed with the filename as a string and the line number as an integer.

Finally is the kind of hard to look at `##__VA_ARGS__`. This is macro-speak for "Put the variable arguments from the `...` here". Which will result in whatever extra parameters you pass to the macro getting passed along to the fprintf() function in the above example.

When passing parameters to macros, it sometimes becomes necessary to put them into typenames, or other situations that the preprocessor can't figure out. The following example is from my vector code, which I'll be going over in depth later in this post.

```
#define GLMM_VEC2(ID, TYPE) \
    typedef TYPE glmm_vec2##ID##_t[2];

GLMM_VEC(f, float);
GLMM_VEC(i, int);

// will evaluate to

typedef float glmm_vec2f_t[2];
typedef int glmm_vec2i_t[2];
```

The `ID` is the short way to represent the type, like 'f' for float or 'i' for int. The typename is generated taking the ID and dropping it straight into it, creating the `vec2f` and `vec2i` types.

## Vectors

Alright, now that the macro preface is over (such interesting stuff, I know) we can get going with _Vectors_. Vectors in the math world are more-or-less groups of numbers. The ones important to graphics programming are sets of 2, 3, and 4. In GLM and GLSL these are referred to as vec2, vec3, and vec4 respectively. In the C world we can't really overload types, so we need to have explicit names for each type and number count. These can be shown using a letter to represent the type; 'f' for float, 'i' for int, and 'u' for unsigned int. Generating all of these types in C would create a lot of duplicated code however, so to avoid that we use a macro.

```
#define GLMM_VEC(N, ID, TYPE) \
    typedef TYPE glmm_vec##N##ID##_t[N];

GLMM_VEC(2, f, float);
GLMM_VEC(2, i, int);
GLMM_VEC(2, u, unsigned int);
GLMM_VEC(3, f, float);
GLMM_VEC(3, i, int);
GLMM_VEC(3, u, unsigned int);
GLMM_VEC(4, f, float);
GLMM_VEC(4, i, int);
GLMM_VEC(4, u, unsigned int);

```

And there you have it. You may however be thinking that we didn't save a lot of code on this, in fact we generated an extra line. This would be wasteful except for the fact that we can also put functions in macros, you can actually put any code inside a macro. Let's go back and expand our macro:

```
#define GLMM_VEC(N, ID, TYPE) \
    typedef TYPE glmm_vec##N##ID##_t[N]; \
    \
    void glmm_vec##N##ID##_init(glmm_vec##N##ID##_t vec) \
    { \
        int i; \
        for (i = 0; i < N; ++i) \
        { \
            vec[i] = 0; \
        } \
    }

GLMM_VEC(2, f, float);

glmm_vec2f_t v;
glmm_vec2f_init(v);
```

And now the type and the function are generated uniquely for each call to `GLMM_VEC`. Doing this creates some hard to read code, but it does greatly reduce the amount of duplicated code, making your code that much more maintainable. Plus, with a good formatter like clang-format, it can put the \'s off to the side and make it much easier to read.
