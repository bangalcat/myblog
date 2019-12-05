---
title: '[Java] Effective java - stream'
date: 2019-06-05
tags:
    - java
    - stream
---

# Effective java 3rd - 일부 번역

## Item 45 : Use streams judiciously

streams API는 performing bulk operation 작업 들을 직렬적으로나 병렬적으로  쉽게 하기 위해 java 8부터 추가 되었다. This API provides two key abstractions : the stream, 유한하거나 무한한 데이터 요소의 시퀀스를 나타낸다. the stream pipeline, 그 요소들에 multistage computation을 나타낸다.

The elements in a stream can come from anywhere. Common sources include collections, arrays, files, regular expression pattern matchers, pseudorandom number generators, and other streams. The data elements in a stream can be object references or primitive vlues. Three primitive types are supported: int, long, and double.

하나의 stream pipeline은 source stream으로부터 0개 이상의 intermediate operations가 붙는다. 각 intermediate operation은 각 element를 그 element의 function으로 mapping 하거나 혹은 filtering 하는 등의 몇가지 방법으로 변형된다.

