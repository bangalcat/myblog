---
layout: post
title : ORM과 JPA 그리고 Hibernate
tags : [spring]
comments: true
---
# ORM과 JPA 그리고 Hibernate

## JPA (Java Persistent API)와 ORM(Obect Relational Mapping)

> JPA란 자바 ORM 기술에 대한 API 표준 명세를 의미

JPA를 사용하기 위해서는 Hibernate같은 ORM 프레임워크를 사용해야함.

> ORM은 객체와 DB의 테이블이 매핑을 이루는 것( 객체가 테이블이 되도록 매핑시켜주는 것)

ORM을 사용하면 SQL 쿼리가 아닌 메소드로 데이터를 조작 가능

query를 직접 작성하지 않아 생산성이 매우 높아짐. **그러나 query가 복잡해지면 ORM으로 표현하는데 한계가 있고, 성능이 raw query에 비해 느리다는 단점이 있음**

## Mybatis vs JPA

Mybatis에서는 테이블마다 비슷한 CRUD SQL을 계속 반복적으로 사용. DAO 개발은 매우 반복되는 작업이며, 매우 귀찮은 작업. 다음은 Mybatis의 단점

1. 테이블에 컬럼이 하나 추가된다면 이와 관련된 모든 DAO의 SQL을 수정해야 합니다. 즉 DAO와 테이블은 강한 의존성을 갖고 있습니다.

2. 객체 모델링보다 데이터 중심 모델링(테이블 설계)을 우선시 했으며, 객체지향의 장점을 사용하지 않고 객체를 단순히 데이터 전달 목적에만 사용함.

#### Hibernate 장단점

##### 장점

생산성, 유지보수, 특정 벤더에 종속적이지 않음

##### 단점

성능이 SQL직접 작성보다는 떨어짐.

통계 처리처럼 복잡한 SQL을 수행하기 힘들다. 이것을 보완하기 위해 SQL과 유사한 기술인 JPQL을 지원. SQL자체 쿼리를 작성할 수 있도록 지원.

## 정리

우리나라는 대부분 Mybatis를 사용하고 있는데, 이유는 우리나라 시장 대부분이 SI, 금융 시장이기 때문. 비즈니스가 매우 복잡하고, 안정성을 중요시하는 서비스일 경우 JPA보다 SQL작성이 좋을 것이라는 의도. 이미 SQL을 사용하여 개발된 애플리케이션은 JPA로 바꾸는 일도 쉽지 않음
