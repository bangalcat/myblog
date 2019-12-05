---
title: '[Git] git 작업의 취소'
---
## Git 작업의 취소

### 개별파일 복원

```console
$ git checkout --<file> // working tree의 수정된 file을 index에 있는 것으로 복원
$ git checkout HEAD --<file> // working tree의 수정된 file을 HEAD에 있는것으로 복원 '--'는 생략가능
```


### Index 추가 취소
```console
$ git reset --<file> // 해당 file을 index에 추가한 것을 취소(unstage)
$ git reset HEAD --<file> // 위와 동일
```

### commit 취소
```console
$ git reset HEAD^ // 최종 커밋을 취소. working tree는 보존
$ git reset --mixed HEAD~2 // 마지막 2개 커밋 취소, mixed는 default 옵션
$ git reset --head HEAD~2 // 마지막 2개 커밋 취소 후 변경 내역 삭제. index 및 working tree 모두 복원
$ git revert HEAD // HEAD에서 변경한 내역을 취소하는 새로운 커밋 발행(undo commit) (커밋을 이미 push 해버린경우)
```

### Working Tree 전체 복원
```
$ git reset --hard HEAD
$ git checkout HEAD
$ git checkout -f
```

### reset 옵션
- `soft` 
- `mixed`
- `hard`

## Git Reset 명확히 알고 가기

Reset 명확히 알고 가기

#### 세개의 트리

> 여기서 '트리'란 실제로는 '파일의 묶음'이다. 자료구조의 트리가 아니다

Git은 일반적으로 세 가지 트리를 관리하는 시스템이다

| 트리 | 역할 | 
| ---- | ---- |
| HEAD | 마지막 커밋 스냅샷, 다음 커밋의 부모 커밋 |
| Index | 다음에 커밋할 스냅샷|
| 워킹 디렉토리| 샌드박스|

#### HEAD

HEAD는 현재 브랜치를 가리키는 포인터이며, 브랜치에 담긴 컴짓 중 가장 마지막 커밋을 가리킨다. 
지금의 HEAD가 가리키는 커밋은 바로 다음 커밋의 부모가 된다. 단순하게 생각하면 HEAD는 *현재 브랜치 마지막 커밋의 스냅샷*이다.

HEAD가 가리키는 스냅샷을 살펴보기는 쉽다. 아래는 HEAD 스냅샷의 디렉토리 리스팅과 각 파일의 SHA-1 체크섬을 보여주는 예제다

```bash
$ git cat-file -p HEAD
tree cfda3bf379e4f8dba8717dee55aab78aef7f4daf
author Scott Chacon  1301511835 -0700
committer Scott Chacon  1301511835 -0700

initial commit

$ git ls-tree -r HEAD
100644 blob a906cb2a4a904a152...   README
100644 blob 8f94139338f9404f2...   Rakefile
040000 tree 99f1a6d12cb4b6f19...   lib
```
> cat-file과 ls-tree는 일상적으로 잘 사용않는 저수준 plumbing 명령. git이 실제로 무슨일 하는지 볼때 유용

#### Index

바로 *다음에 커밋*할 것들이다. "Staging Area" 개념. 사용자가 `git commit` 명령을 실행했을때 Git이 처리할 것들이 있는 곳

먼저 Index는 워킹 디렉토리에서 마지막으로 Checkout한 브랜치의 파일 목록과 파일 내용으로 채워진다. 이후 파일 변경작업을 하고
변경한 내용으로 Index를 업데이트 할 수 있다. 이렇게 업데이트 하고 `git commit` 명령을 실행하면 Index는 새 커밋으로 변환된다.

Index는 엄밀히 말해 트리구조는 아니다.

#### 워킹 디렉토리

위의 두 트리는 파일과 그 내용을 효율적인 형태로 .git 디렉토리에 저장한다. 하지만 사람이 알아보기 어렵다. 워킹 디렉토리는 실제로 파일이 존재한다.
바로 눈에 보이기 때문에 사용자가 편집하기 수월하다. 워킹 디렉토리는 *샌드 박스*로 생각하자. 커밋하기 전에는
Index(Staging Area)에 올려놓고 얼마든지 변경할 수 있다.
```console
$ tree
.
├── README
├── Rakefile
└── lib
    └── simplegit.rb

1 directory, 3 files
```

---
> 중간 reset 내용
---
#### 합치기 Squash

여러 커밋을 하나로 합치는 재밌는 도구를 알아보자

이런 프로젝트가 있다고 생각해보자. 첫 커밋은 파일 하나를 추가, 두번째 커밋은 기존파일 수정하고 새 파일 추가, 세번째 커밋은
첫번째 파일을 다시 수정했다. 두번째 커밋은 아직 작업중인 커밋으로, 이 커밋을 세번째 커밋과 합치고 싶은 상황이다


![img](https://git-scm.com/book/en/v2/images/reset-squash-r1.png)
git reset --soft HEAD~2 명령을 실행하여 HEAD 포인터를 이전 커밋으로 되돌릴 수 있다.
![img](https://git-scm.com/book/en/v2/images/reset-squash-r2.png)
이 상황에서 git commit 명령을 실행한다
![img](https://git-scm.com/book/en/v2/images/reset-squash-r3.png)

## 요약
reset 명령이 좀 더 쉬워졌을 거라고 생각한다. 아직 checkout 명령과 정확하게 무엇이 다른지 혼란스럽거나 정확한 사용법을 다 익히지 못했을 수도 있지만 괜찮다.

아래에 어떤 명령이 어떤 트리에 영향을 주는지에 대한 요약표를 준비했다. 명령이 HEAD가 가리키는 브랜치를 움직인다면 “HEAD” 열에 “REF” 라고 적혀 있고 HEAD 자체가 움직인다면 “HEAD” 라고 적혀 있다. WD Safe? 열을 꼭 보자. 여기에 *NO*라고 적혀 있다면 워킹 디렉토리에 저장하지 않은 내용이 안전하지 않기 때문에 해당 명령을 실행하기 전에 한 번쯤 더 생각해보아야 한다.

| |HEAD | Index | Workdir | WD Safe?|
|----|----|----|----|----|
|Commit Level|||||
|reset --soft [commit]| REF| NO| NO| YES|
|reset [commit] |REF| YES| NO| YES| 
|reset --hard [commit] |REF| YES| YES| NO|
|checkout \<commit>| HEAD| YES| YES| YES|
|File Level||||| 
|reset [commit] \<paths> | NO| YES| NO| YES| 
|checkout [commit] \<paths> | NO| YES| YES| NO|



>자세한 내용은 [git 도구-reset 명확히 알고 가기](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-Reset-%EB%AA%85%ED%99%95%ED%9E%88-%EC%95%8C%EA%B3%A0-%EA%B0%80%EA%B8%B0) 에서 확인하자
