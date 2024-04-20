// user.factory.ts
import { setSeederFactory } from 'typeorm-extension';

import { UserRole } from '../../common/enum/global-enum'; // UserRole 경로를 적절히 수정하세요.
import { User } from 'src/apis/user/entity/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.password = faker.internet.password(); // 비밀번호는 해싱 처리가 필요합니다.
  user.role = UserRole.Normal; // UserRole을 사용하여 기본 역할을 할당합니다.
  // 필요한 경우 추가 필드를 설정하세요.

  return user;
});
