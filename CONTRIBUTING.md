# Contributing to fast-docker
[contributing-to-fast-docker]: #contributing-to-fast-docker

Thank you for your interest in contributing to fast-docker! There are many ways to
contribute, and we appreciate all of them. This document is broken up into the
follow major sections, based on contribution type:

* [Feature Requests](#feature-requests)
* [Bug Reports](#bug-reports)
* [Pull Requests](#pull-requests)
* [Writing Documentation](#writing-documentation)

If you have questions, please ask them in Github Issues.

As a reminder, all contributors are expected to follow our [Code of Conduct][coc].

[CloudDocs][cloud-docs] is your friend! It describes how the template engine works and how
to create templates in more detail.

If you haven't written any templates before, the [Template Authoring][template-authoring] section of
[CloudDocs][cloud-docs] can get you started working with templates.

[cloud-docs]: https://clouddocs.f5.com/products/extensions/f5-appsvcs-templates/latest/#
[temlate-authoring]: https://clouddocs.f5.com/products/extensions/f5-appsvcs-templates/latest/userguide/template-authoring.html
[coc]: https://github.com/zinkem5/fast-docker/blob/master/CODE_OF_CONDUCT.md

## Feature Requests
[feature-requests]: #feature-requests

To request a change to the way the fast-core works, please head over to the
[f5-fast-core][fast-core] repository, and file an issue there.

[fast-docker][fast-docker] is a wrapper around [f5-fast-core][fast-core] to
provide a simple, minimum viable horiztonally scalable templating service. PRs
and MRs that meet these goals will be considered.

[fast-core]: https://github.com/f5devcentral/f5-fast-core
[fast-docker]: https://github.com/zinkem5/fast-docker

## Bug Reports
[bug-reports]: #bug-reports

While bugs are unfortunate, they're a reality in software. We can't fix what we
don't know about, so please report liberally. If you're not sure if something
is a bug or not, feel free to file a bug anyway.

**If you believe reporting your bug publicly represents a security risk to
fast-docker users, please contact the maintainers of the project**.

Please check if the bug exists in the latest released version before filing your
bug. It might be fixed already.

If you have the chance, before reporting a bug, please [search existing
issues](https://github.com/zinkem5/fast-docker/search?q=&type=Issues&utf8=%E2%9C%93),
as it's possible that someone else has already reported your error. This doesn't
always work, and sometimes it's hard to know what to search for, so consider this
extra credit. We won't mind if you accidentally file a duplicate report.

Similarly, to help others who encountered the bug find your issue, consider
filing an issue with a descriptive title, which contains information that might
be unique to it. This can be the language or compiler feature used, the
conditions that trigger the bug, or part of the error message if there is any.
An example could be: **JSON Schema syntax does not work with section variables
to present Arrays in generated schema**.

Opening an issue is as easy as following [this
link](https://github.com/zinkem5/fast-docker/issues/new) and filling out the fields.
Here's a template that you can use to file a bug, though it's not necessary to
use it exactly:
```
Summary: 
  
  {{summary_of_bug}}

I tried thie following action on {{fast_version}}:

  {{action_taken}}

{{#templates_used}}
  {{template_text}}
  
  {{template_short_description}}
{{/templates_used}}

I expected to see this happen:

  {{desired_result}}

Instead, this happened:

  {{actual_result}}

{{#stack_trace_exists}}
Stack Trace:

  {{stacktrace}}
{{/stack_trace_exists}}
```    

All three components are important: what you did, what you expected, what
happened instead. If a JavaScript error was presented as part of the unexpected
behavior, please include the entire error message including the stack trace.

If you don't know what part the stack trace is, paste any cryptic output that
occured along with the error.

## Pull Requests
[pull-requests]: #pull-requests

Pull requests are the primary mechanism we use to change fast-docker. GitHub itself
has some [great documentation][about-pull-requests] on using the Pull Request feature.
We use the "fork and pull" model [described here][development-models], where
contributors push changes to their personal fork and create pull requests to
bring those changes into the source repository.

[about-pull-requests]: https://help.github.com/articles/about-pull-requests/
[development-models]: https://help.github.com/articles/about-collaborative-development-models/

Please make pull requests against the `master` branch.

fast-docker follows a no merge policy, meaning, when you encounter merge
conflicts you are expected to always rebase instead of merge.
E.g. always use rebase when bringing the latest changes from
the master branch to your feature branch.
Also, please make sure that fixup commits are squashed into other related
commits with meaningful commit messages.

GitHub allows [closing issues using keywords][closing-keywords]. This feature
should be used to keep the issue tracker tidy. However, it is generally preferred
to put the "closes #123" text in the PR description rather than the issue commit;
particularly during rebasing, citing the issue number in the commit can "spam"
the issue in question.

[closing-keywords]: https://help.github.com/en/articles/closing-issues-using-keywords

Please make sure your pull request is in compliance with fast-docker's style
guidelines by running

    $ npm test

Make this check before every pull request (and every new commit in a pull
request); you can add [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
before every push to make sure you never forget to make this check.

All pull requests are reviewed by another person.

Speaking of tests, fast-docker has a comprehensive test suite. It will lint the
code, attempt to build the project, and run unit tests against the code. It can
be run with `npm test` from the project root.

## Writing Documentation

Documentation improvements are very welcome. 

We are still working on documentation guidelines, stay tuned!

## Helpful Links and Information

For people new to fast-docker, and just starting to contribute, or even for
more seasoned developers, some useful places to look for information
are:

[CloudDocs][clouddocs]

[clouddocs]: https://clouddocs.f5.com/products/extensions/f5-appsvcs-templates/latest/#
