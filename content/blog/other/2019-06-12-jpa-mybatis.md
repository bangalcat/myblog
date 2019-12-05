---
layout: post
published: false
title:JPA와 Mybatis
---
## 영속성 (Persistence)

- 데이터를 생성한 프로그램이 종료되더라도 사라지지 않는 데이터의 특성

- #### Persistence Layer

  - 프로그램의 아키텍처에서, 데이터에 영속성을 부여해주는 계층
  
  - JDBC를 이용하여 직접 구현할 수 있지만 Persistence framework를 이용한 개발이 많이 이루어진다.
  
- #### Persistence Framework

  - JDBC 프로그래밍의 복잡함이나 번거로움 없이 간단한 작업만으로 데이터베이스와 연동되는 시스템을 빠르게 개발 가능하며 안정적인 구동을 보장
  
  - Persistence Framework는 SQL Mapper와 ORM으로 나눌 수 있다.
  
  

## SQL Mapper와 ORM

  - ORM은 데이터베이스 객체를 자바 객체로 매핑함으로써 객체 간의 관계를 바탕으로 SQL을 자동으로 생성. SQL Mapper는 SQL을 명시해줘야 한다.
  
  - ORM은 데이터베이스의 '관계'를 Object에 반영하자는 것이 목적이라면, SQL Mapper는 단순히 필드를 매핑시키는것이 목적.

### SQL Mapper
  - SQL ~ Object 필드
  - Mybatis

### ORM
  - 데이터베이스 데이터 ~ Object 필드
  - JPA






> 출처 [JDBC, JPA/Hibernate, Mybatis의 차이](https://gmlwjd9405.github.io/2018/12/25/difference-jdbc-jpa-mybatis.html)