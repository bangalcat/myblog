---
title : 'JSP와 서블릿'
tags :  
    - spring
---
# JSP와 서블릿

JSP와 서블릿의 차이점은 결과적으로 하는일은 동일하지만 JSP는 HTML 내부에 Java 소스코드가 들어감으로 인해 HTML 코드를 작성하기 간편하다는 장점이 있으며 서블릿은 자바 코드내에 HTML 코드가 있어서 읽고 쓰기가 굉장히 불편하기 때문에 작업의 효율성이 떨어진다.

JSP로 작성된 프로그램은 서버로 요청시 서블릿 파일(.java)로 변환되어 JSP 태그를 분해하고 추출하여 다시 순수한 HTML로 변환한다.

![img](https://t1.daumcdn.net/cfile/tistory/99BD65335A01B26025)

