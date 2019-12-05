---
layout: post
published: true
title: '[Spring] 15장 테스트 컨텍스트 프레임워크'
tags:
  - spring
  - tobi
---

# 15장 테스트 컨텍스트 프레임워크

매 테스트마다 스프링 컨텍스트, 즉 컨테이너를 새로 만드는건 매우 비효율적인 방법. 스프링 컨텍스트는 매우 가벼운 오브젝트이며 설정을 읽고 분석하는 등의 작업은 매우 빠르게 진행된다. 그런데 컨텍스트 안에서 만들어지는 빈 오브젝트 중에 제법 많은 초기화 작업을 필요로 하는 것들이 존재.

> 하이버네이트와 같은 ORM은 초기에 엔티티에 대한 정보를 가져와 세션을 지원할 준비 작업을 하고 스레드를 생성하는 등의 많은 부가 작업을 필요로 한다.

그래서 스프링은 테스트가 사용하는 컨텍스트를 캐싱해서 여러 테스트에서 하나의 컨텍스트를 공유할 수 있는 방법을 제공.

테스트 컨텍스트의 공유는 테스트 클래스 내의 메소드 사이에서만 가능한 게 아니라, 여러 테스트 클래스 사이에서도 가능하다.

두 가지 애노테이션 @Runwith와 @ContextConfiguration

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/test-applicationContext")
public class Test1{
    @Test public void testMethod1() {/*...*/}
}
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/test-applicationContext")
public class Test2{}
// 새로운 테스트 클래스 추가하더라도 test-applicationContext 설정파일이 동일하다면 테스트용 컨텍스트를 공유한다.
```

#### 컨텍스트 설정의 상속과 컨텍스트 로더

슈퍼클래스와 서브클래스에서 모두 @ContextConfiguration을 이용해 컨텍스트 파일 지정했다면 ? 컨텍스트 파일 정보는 상속된다. 따라서 서브클래스의 컨텍스트 파일 정보는 슈퍼클래스 정의된 것 포함

#### 테스트 컨텍스트로부터 DI 받기

마치 @Configurable이 적용된 도메인 오브젝트처럼, 테스트 클래스도 그 자체로는 빈은 아니지만 @Autowired, @Resource 등을 사용해 애플리케이션 컨텍스트의 빈을 DI 받을 수 있다.



#### 공유 컨텍스트 사용시 주의점

어쩔 수 없이 컨텍스트의 빈 오브젝트를 조작하고 수정하는 작업이 꼭 필요한 테스트에는 클래스 레벨 혹은 메소드에 @DirtiesContext를 붙인다.

## 트랜잭션 지원 테스트

### 테스트 트랜잭션 지원 필요성

DB 테스트

##### 정리

테스트엔 AOP 적용이 안되지만, TransactionManager를 이용하거나 @Transactional 애노테이션을 메소드에 부여해서 테스트. 트랜잭션 AOP에서 썼던 것과 동일한 애노테이션.

```java
@Test
@Transactional
public void txTest(){
    dao.deleteAll();
    dao.add(new Member(10, "Spring", 7.8));
    assertThat(dao.count(), is(1));
}
```

테스트의 @Transactional은 서비스 계층의 코드에 적용된 것과 중요한 다른 점이 있다. **강제 롤백** 옵션이 설정된 트랜잭션으로 만들어진다는 점이다.

commit하고 싶을 땐 `@Rollback(false)` 하면 된다.
