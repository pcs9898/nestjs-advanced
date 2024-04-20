// user.seeder.ts
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from 'src/apis/user/entity/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userFactory = await factoryManager.get(User);
    await userFactory.saveMany(10); // 10개의 유저 엔티티를 생성하고 저장합니다.
  }
}
