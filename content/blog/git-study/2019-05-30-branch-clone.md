---
layout: post
published: true
title: 특정 branch만 clone하는 방법
tags:
    - git
---
# git에서 특정 브랜치만 clone 하는 방법

```bash
$ git clone -b {branch_name} --single-branch {repo-url}
// ex) git clone -b develop --single-branch https://github.com/Semaj2010/test.git
```
