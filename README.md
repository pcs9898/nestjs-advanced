다 끝나면 cqrs패턴도입 비디오에~~
config applying,
db migration, seeding,
datasoure,
custom decorator,
custom provider,
custom intercepter,
sentry+notion(err notification),
brutal force(rate limit),
healthCheck,
error sentry+slack notification,
===========여기까지 완료==============

여기서 부터 시작하면 됨
cqrs,
db index,
scheduling,

이거 전부다 적용하기

//video api 작성하기, 끝나면 custom provider, custom interceptor 하나씩 적용해보기

api 작성후 swagger가서 test할게 아니라 testcode로 단위테스트하기!! 시간 훨씬 절약!!

api마다 예외처리 경우의수, ai로 전부다 묻고 전부다 커버하고 이걸 테스트코드로 테스트하기

# Auth Module

- [x] feature1/signup
- [x] feature2/signin
- [x] feature3/verifyEmail
- [x] feature4/resendAuthCode
- [x] feature5/restoreRefreshToken
- [x] feature6/signout
- [x] feature7/resendAuthCode
- [x] testCode

# Health Module

- [x] feature8/signup
- [x] testCode

# Mail Module

- [x] MailService-send
- [x] testCode

# Schedule-batch Module

- [x] ScheduledBatchService-unVerifiedUserOver30DaysCleanUp
- [x] testCode

# User Module

- [] feature10/findAll
- [] feature11/findOne
- [] testCode

# Video Module

- [] feature12/upload
- [] feature13/findAll
- [] feature14/findOne
- [] feature15/download
- [] testCode
