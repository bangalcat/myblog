---
title: '[Java] Easy way to Create Date'
createdDate: '2019-08-06'
---
## Easy way to Create Date

### way 1
```java
Calendar c = Calendar.getInstance();
c.set(year, month, day, hours, mins);
long time = c.getTimeInMillis();
```

### way 2
> Since Java 8 you can use the Calendar.Builder class:

```java
Date date = new Calendar.Builder()
    .setDate(2012, 2, 21)
    .setTimeOfDay(14, 0, 0)
    .build().getTime();
```
