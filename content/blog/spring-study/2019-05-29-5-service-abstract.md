---
layout: post
title: '[Spring] 토비 스프링 - 5장 서비스 추상화'
tags:
  - spring
  - tobi
comments: true
published: true
---
# 5장 서비스 추상화

UserDao를 다수의 회원이 가입할 수 있는 인터넷 서비스의 사용자 관리 모듈에 적용

##### Enum 활용 필드추가

```java
public enum Level{
    BASIC(1), SILVER(2), GOLD(3);
    private final int value;
    ...
        public int intValue(){
        return value;
    }
    public static Level valueOf(int value){
        ...
    }
}
```

##### UserService class bean 등록

userDao 빈을 DI 받도록 프로퍼티 추가

```xml
<bean id="userService" class="springbook.user.service.UserService">
	<property name="userDao" ref="userDao" />
</bean>
```

##### UserService 테스트

```java
@RunWithSpringJUnit4ClassRunner.class)
@ContextConfigurationi(locations="/applicationContext.xml")
public class UserServiceTest{
    @AutoWired
    UserService userSerivce
    @Test
    public void bean(){
        assertThat(this.userService, is(notNullValue()));
    }
    @Test
    public void upgradeLevels(){
        userDao.deleteAll();
        ...
        checkLevel(,);
    }
    private void checkLevel(){
        assertThat();
    }
}
```

##### 사용자 레벨 업그레이드 메소드

```java
public void upgradeLevels() {
    ...
}
```

 User 클래스에 upgrade 추가하고, UserService의 upgrade 작업을 최소화

#### UserService.add()



------

## 트랜잭션 서비스 추상화

프로세스 진행 중 네트워크가 끊기거나 서버에 장애가 생겨서 작업을 완료할 수 없다면?

#### 테스트용 UserService 대역

강제로 예외를 발생시킬 UserService를 상속한 테스트용 클래스 생성. upgradeLevel 메소드를 override해서 특정 id에서 강제로 예외를 발생시킨다. TestUserService 클래스는 따로 bean에 등록하지 않고 test method에서 바로 생성한다. UserDao만 DI로 받아서 setUserDao로 넣어준다.

> 이것이 컨테이너에 종속적이지 않은 평범한 자바 코드로 만들어지는 스프링 DI 스타일의 장점이다.

예외가 발생하지 않으면 fail 하도록

```java
try{
    testUserService.upgradeLevels();
    fail("TestUserSerivceException expected");
} catch(TestUserServiceException e){
}
checkLevelUpgraded(users.get(1),false);
```

테스트 실패 : upgradeLevels()에는 트랜잭션이 적용되지 않았다.

##### 트랜잭션의 경계설정

`setAutoCommit(false)`로 트랜잭션 시작을 선언하고 `commit()` 또는 `rollback()`으로 트랜잭션을 종료하는 작업. 하나의 Connection이 만들어지고 닫히는 범위 안에 존재한다. 

하나의 DB 커넥션 안에서 만들어지는 트랜잭션을 로컬 트랜잭션<sup>local transaction</sup>이라고도 한다.

UserDao가 아닌 UserService의 트랜잭션 경계설정 시 Connection을 Service단에서 생성해줘야 한다. 즉 JdbcTemplate의 깔끔한 처리를 활용할 수 없다. Connection을 파라미터로 넘겨서 지저분한 코드가 된다. 또한 UserDao는 데이터 액세스 기술에 독립적일 수가 없다.

##### 트랜잭션 동기화

Connection을 UserService에서 생성하고, 트랜잭션 동기화 저장소에 저장해둔다. Connection의 `setAutoCommit(false)`를 호출해 트랜잭션을 시작시킨 후 DAO의 기능을 이용 시작.

JdbcTemplate 메소드에서는 트랜잭션 동기화 저장소에 현재 시작된 트랜잭션을 가진 Connection 오브젝트가 존재하는지 확인. JdbcTemplate은 Connection을 닫지 않은 채로 작업을 마친다.

```java
public void upgradeLevels() throws Exception{
 	TransactionSynchronizationManager.initSynchronization();
    Connection c = DataSourceUtils.getConnection(dataSource);
    c.setAutoCommit(false);
    try{
        List<User> users = userDao.getAll();
        for(User user : users){
            if(canUpgradeLevel(user)){
                upgradeLevel(user);
            }
        }
        c.commit();
    } catch(Exception e){
        c.rollback();
        throw e;
    } finally{
        DataSourceUtils.releaseConnection(c, dataSource); // 스프링 유틸리티 메소드를 이용해 디비 커넥션을 안전하게 닫는다.
        //동기화 작업 종료 및 정리
        TransactionSynchronizationManager.unbindResource(this.dataSource);
        TransactionSynchronizationManager.clearSynchronization();
    }
}
```

##### 계층과 책임의 분리

![1555895523040](D:\Downloads\feature1.png)



### 메일 발송 기능 추상화

```java
public interface MailSender {
    void send(SimpleMailMesage simpleMessage) throws MailException;
    void send(SimpleMailMessage[] simpleMessages) throws MailException;
}
public class UserService{
    ...
    private MailSender mailSender;
    public void setMailSender(MailSender mailSender){...}
    private void sendUpgradeEMail(User User){
        SimpleMailMessage maiMessage = new SimpleMailMessage();
        ...
        this.mailSender.send(mailMessage);
    }
}
public DummyMailSender implements MailSender{
    ...
}
```

> 어떤 경우에도 UserService와 같은 애플리케이션 계층의 코드는 아래 계층에서는 어떤 일이 일어나는지 상관없이 메일 발송을 요청한다는 기본 기능에 충실하게 작성하면 된다. 메일 서버가 바뀌고 메일 발송 방식이 바뀌는 등의 변화가 있어도 메일을 발송한다는 비즈니스 로직이 바뀌지 않는 한 UserService는 수정할 필요가 없다.

###### Transaction 추상화

메일을 모아뒀다가 업그레이드 완료후 한꺼번에 전송 or MailSender 확장하여 기술적으로 분리



### 테스트 대역<sub>test double</sub>

DummyMailSender같은 MailSender의 인터페이스를 구현한 대체 클래스

테스트할 대상이 의존하고 있는 오브젝트를 DI를 통해 바꿔치기하기.

> UserDao와 UserService에서 보듯이, 테스트 대상이 되는 오브젝트가 또 다른 오브젝트에 의존하는 일은 매우 흔하다. 

대표적인 테스트 대역인 테스트 스텁<sup>test stup</sup>

테스트 대상 오브젝트의 의존객체로서 존재하면서 테스트 동안에 코드가 정상적으로 수행할 수 있도록 돕는 것

### 목 오브젝트를 이용한 테스트

```java
static class MockMailSender implements MailSender{
    private List<String> requests = new ArrayList<String>();
    public List<String> getRequests(){
        return requests;
    }
    public void send(SimpleMailMessage mailMessage) throws MailException{
        requests.add(mailMessage.getTo()[0]);
    }
    public void send(SimpleMailMessagep[] mailMEssage) throws MailException{
        
    }
}
```

`DummyMailSender`와 비슷하게 실제로 메일을 전송하는 기능은 없고, 대신 UserService가 send() 메소드를 통해 자신을 불러서 메일 전송 요청을 보냈을 때 관련 정보를 저장해두는 기능이 존재. 저장된 정보를 불러와서 보낸 정보와 맞는지 검증하는식으로 테스트한다.

```java
public void upgradeLevels() throws Exception {
    userDao.deleteAll();
    for(User user : users) userDao.add(user);
    
    MockMailSender mockMailSender = new MockMailSender();
    userService.setMAilSender(mockMailSender);
    
    userService.upgradeLevels();
    
    checkLevelUpgraded(users.get(0), false);
    //...
    
    List<String> request = mockMailSender.getRequests();
    assertThat(request.size(), is(2));
    assertThat(request.get(0), is(users.get(1).getEmail()));
    //...
}
```
