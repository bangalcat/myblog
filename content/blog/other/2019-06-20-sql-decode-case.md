---
layout : post
title : [Oracle SQL] DECODE, CASE WHEN
date: 2019-06-20
tags : [sql,oracle]
---



# Oracle SQL - Decode

DECODE는 조건에 따라 특정 값을 다른 값으로 변경할 수 있는 문장. IF THEN ELSE같은 느낌.

```sql
SELECT 	P1.NAME
		, P1.AGE
		, DECODE(P1.GRADE, 'S', '****', 'A', '***', 'B' '**', '*')
FROM	PROFILE P;
```

PROFILE의 GRADE가 'S'이면 별 4개, 'A'이면 별 3개, 'B' 이면 별 두개, 나머지는 별 한개.

마지막에 '*'을 쓰지 않으면 'S', 'A', 'B'를 제외한 나머지는 NULL값으로 출력됨



## ORDERY BY 절의 DECODE

ORDER BY절에  DECODE를 사용하여 사용자가 원하는 다양한 정렬 순서 제공 가능. 하지만 결과가 많을수록 DECODE를 수행하는 비용이 크므로 되도록 사용하지 않는 설계가 좋다

## 중첩된 DECODE문

```plsql
SELECT
	DECODE(T1.CALCU_TP,'CASH',
      	DECODE(SUBSTR(T1.STROE_ID,1,3),'L.A','L.A-Money','N.Y','N.Y-Money','ETC-Money')
      , DECODE(...))
FROM SQL_TEST.HI_ORDER T1
```

중첩된 DECODE문을 사용해 좀더 복잡한 조건 표현 가능



# CASE  ~ WHEN ~ THEN ~ ELSE ~ END

```plsql
CASE [] | 
	WHEN	조건식1 THEN	결과1
	WHEN	조건식2 THEN	결과2
	WHEN	조건식3 THEN	결과3
END
```

조건문과 조건문 사이에는 콤마를 사용하지 않는다.

CASE문은 반드시 END로 끝내야한다.

결과 부분은  NULL을 사용해서는 안된다.