import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder()
      .where("title ILIKE :title", { title: `%${param}%` })
      .getMany();
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
    SELECT COUNT(id) FROM games
    `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = this.repository
      .createQueryBuilder()
      .relation(Game, "users")
      .of(id)
      .loadMany();
    return users;
  }
}