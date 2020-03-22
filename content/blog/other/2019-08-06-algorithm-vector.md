---
title: '[algorithm] 기하 벡터'
createdDate: '2019-08-06'
---



기하와 벡터

```cpp
#include <iostream>
#include <cmath>
#include <limits>

using namespace std;

const double PI = 2.0 * acos(0.0);

/*
    rhs는 right hand side로 보통 인자 두개는 lhs, rhs쓰고 인자 한개는 rhs 씀
    operator 함수에 많이씀
 */

struct vector2{
    double x, y;
    explicit vector2(double x_ = 0, double y_ = 0) : x(x_), y(y_){}

    bool operator==(const vector2& rhs)const{
        return x == rhs.x && y == rhs.y;
    }
    bool operator < (const vector2& rhs) {
        return x != rhs.x ? x < rhs.x : y < rhs.y;
    }
    vector2 operator + (const vector2& rhs) const {
        return vector2(x + rhs.x, y + rhs.y);
    }
    vector2 operator - (const vector2& rhs) const {
        return vector2(x - rhs.x, y - rhs.y);
    }
    vector2 operator * (double rhs) const {
        return vector2(x * rhs, y * rhs);
    }
    //벡터의 길이 반환
    double norm() const {
        return hypot(x, y);
    }
    //방향이 같은 단위 벡터를 반환
    vector2 normalize() const {
        return vector2(x / norm(), y / norm());
    }
    //x축의 양의 방향으로부터 이 벡터까지 반시계 방향으로 잰 각도
    double polar() const {
        return fmod(atan2(y, x) + 2* PI, 2 * PI);
    }
    //벡터의 내적
    double dot(const vector2& rhs) const ㅓ{
        return x * rhs.x + y * rhs.y;
    }
    //외적
    double cross(const vector2& rhs) const {
        return x * rhs.y - rhs.x * y;
    }
    //이 벡터를 rhs에 사영한 결과
    vector2 project(const vector2& rhs) const {
        vector2 r = rhs.normalize(); //b의 단위벡터
        return r * r.dot(*this); // 내적이 길이. b 방향으로 내적길이만큼 곱함
    }
};


int main()
{
    return 0;
}

```

### 벡터의 내적과 외적

#### 벡터의 사이각 구하기

내적의 가장 기초적인 용도는 두 벡터의 사이각을 구하는 것. 

세타 = acos(ab내적 / (a길이 * b길이))

#### 벡터의 직각 여부 확인하기

a와 b의 내적이 0이라면 두 벡터는 항상 직각이다.

#### 벡터의 사영

### 

#### 면적 계산하기

외적의 절대값은 a, b를 두 변으로 하는 평행 사변형의 넓이. 원점과 a, b를 꼭지점으로 하는 삼각형 넓이의 정확히 두배이므로, 절반 나누면 해당 삼각형의 넓이 구할수 있음.

#### 두 벡터의 방향 판별

(aXb) = -(bXa)

```cpp
//벡터의 방향성을 판단하는 ccw() 함수의 구현
//원점에서 벡터 b가 벡터 a의 반시계 방향이면 양수, 시계 방향이면 음수, 평해이면 0 반환
double ccw(vector2 a, vector2 b) {
    return a.cross(b);
}
//점 p를 기준으로 벡터 b가 벡터 a의 반시계 방향이면 양수, 시계 방향이면 음수, 평행이면 0
double ccw(vector2 p, vector2 a, vector2 b) {
    return ccw(a-p, b-p);
}
```

### 교차와 거리, 면적

#### 직선과 직선의 교차

```cpp

// (a, b)를 포함하는 선과 (c,d)를 포함하는 선의 교점을 x에 반환한다
// 두 선이 평행이면(겹치는경우 포함) 거짓을, 아니면 참을 반환한다.)
bool lineIntersection(vector2 a, vector2 b, vector2 c, vector2 d, vector2& x){
    double det = (b - a).cross(d - c);
    //두 선이 평행인 경우
    if(fabs(det) < numeric_limits<double>::epsilon()) return false;
    x = a + (b - a) * ((c - a).cross(d - c) / det);
    return true;
}

```

#### 선분과 선분의 교차

1. 두 선분이 서로 겹치지 않음
2. 두 선분이 한 점에서 닿음
3. 두 선분이 겹쳐짐
4. 한 선분이 다른 선분 안에 포함됨

```cpp

//(a, b)와 (c, d)가 평행한 두 선분일 때 이들이 한 점에서 겹치는지 확인한다.
bool parallelSegments(vector2 a, vector2 b, vector2 c, vector2 d, vector2& p){
    if(b < a) swap(a, b);
    if(d < c) swap(c, d);
    //한 직선 위에 없거나 두 선분이 겹치지 않는 경우를 우선 걸러낸다
    if(ccw(a, b, c) != 0 || b < c || d < a) return false;
    //두 선분은 확실히 겹친다. 교차점을 하나 찾자
    if(a < c) p = c; 
    else p = a;
    return true;
}
// p가 (a, b)를 감싸면서 각 변이 x, y축에 평행한 최소 사각형 내부에 있는지 확인한다.
// a, b, p는 일직선 상에 있다고 가정한다.
bool inBoundingRectangle(vector2 p, vector2 a, vector2 b) {
    if(a < b) swap(a, b);
    return p == a || p == b || (a < p && p < b);
}

// (a, b) 선분과 (c, d)선분의 교점을 p에 반환한다.
// 교점이 여러 개일 경우 아무 점이나 반환한다.
// 두 선분이 교차하지 않을 경우 false를 반환한다.
bool segmentIntersection(vector2 a, vector2 b, vector2 c, vector2 d, vector2& p) {
    // 두 직선이 평행인 경우를 우선 예외로 처리한다.
    if( !lineIntersection(a, b, c, d, p))
        return parallelSegments(a, b, c, d, p);
    //p가 두 선분에 포함되어 있는 경우에만 참을 반환한다.
    return inBoundingRectangle(p, a, b) && inBoundingRectangle(p, c, d);
}

```

#### 선분과 선분의 교차 : 교차점이 필요 없을 때

교차점을 구할 필요 없이 두 선분의 교차 여부를 확인하기만 할 거라면 보다 단순한 방법 사용. `ccw()`를 사용하는 것

ccw(a, b, c)와 ccw(a, b, d)중 하나는 양수, 하나는 음수가 되어야만 함.

```cpp
//두 선분이 서로 접촉하는지 여부를 판단한다.
bool segmentIntersects(vector2 a, vector2 b, vector2 c, vector2 d) {
    double ab = ccw(a, b, c) * ccw(a, b, d);
    double cd = ccw(c, d, a) * ccw(c, d, b);
    //두 선분이 한 직선 위에 있거나 끝점이 겹치는 경우
    if(ab == 0 && cd == 0) {
        if(b < a) swap(a, b);
        if(d < c) swap(c, d);
        return !(b < c || d < a);
    }
    return ab <= 0 && cd <= 0;
}
```



#### 점과 선 사이의 거리

두 점의 벡터 a, b가 주어졌을 때 이 직선과 다른 점 p 사이의 거리 계산

#### p가 직선에 내리는 수선의 발을 계산한뒤 p와의 거리 구하기

```cpp
vector2 perpendicularFoot(vector2 p, vector2 a, vector2 b) {
    return a + (p - a).project(b - a);
}
double pointToLine(vector2 p, vector2 a, vector2 b) {
    return (p - perpendicularFoot(p, a, b)).norm();
}
```

점과 선 사이의 거리를 계산하는 것은 점과 선분 사이의 거리, 선분과 선분 사이의 거리를 계산하는데 유용하게 쓰입니다.

점과 선분 사이의 거리 - 선분을 포함하는 직선에 내린 수선이 선분 위에 떨어진다면 발과 점 사이의 거리가 점-선분 간의 거리가 됩니다. 만약 이 외의 경우라면 선분의 양끝점 중 더 가까운 거리가 점-선분 간의 거리가 되지요. 점-선분간의 거리를 알고있으면 선분-선분 거리도 쉽게 알 수 있습니다. 두 선분을 잇는 가장 가까운 선분은 최소한 두 선분 중 하나의 끝점에서 시작함을 증명할 수 있기 때문입니다.

[벡터로 원 표현](https://hyner.tistory.com/133)



## 다각형

### 면적 구하기

```cpp
//주어진 단순 다각형 p의 넓이를 구한다.
//p는 각 꼭지점의 위치 벡터의 집합
double area(const vector<vector2>& p) {
    double ret = 0;
    for(int i=0; i < p.size(); ++i) {
        int j = (i + 1) % p.size();
        ret += p[i].x * p[j].y - p[j].x * p[i].y;
    }
    return fabs(ret) / 2.0;
}
```

#### 내부/외부 판별

단순 다각형과 이 다각형의 경계 위에 있지 않은 점 q가 주어질 때 q가 다각형의 내부에 있는지 외부에 있는지.
이런 함수를 만드는 유명한 방법은 q에서 시작해 오른쪽으로 쭉 뻗어나가는 반직선을 상상하고 이 반직선이 다각형과 몇 번이나 교차하는지를 확인하는 것.

까다로운 두가지 경우를 처리해줘야함.

반직선을 세로로 가로지르는 각 변을 찾은 뒤, 교차점의 위치가 q보다 오른쪽에 있는지 확인. 이 때 반직선을 세로로 가로지르는지 확인하는 코드가 아주 중요. 어떤 변이 반직선과 끝점이 겹칠 경우, 다른 한 점이 위에 있느냐 아래에 있느냐에 따라 결과가 달라져야 하기 때문. 이 코드에서는 반직선과 수평인 다각형의 변들은 완전히 무시된다는 점

```c++
bool isInside(vector2 q, const vector<vector2>& p) {
    int crosses = 0;
    for(int i=0; i < p.size(); ++i) {
        int j = (i + 1) % p.size();
        // p[i], p[j] 가 반직선을 세로로 가로지르는가?
        if((p[i].y > q.y) != (p[j].y > q.y)) {
            //가로지르는 x 좌표 계산
            double atX = (p[j].x - p[i].x) * (q.ㅓy - p[i].y) / (p[j].y - p[i].y) + p[i].x;
            if(q.x < atX)
                crosses++;
        }
    }
    return crosses % 2 > 0;
}
```

