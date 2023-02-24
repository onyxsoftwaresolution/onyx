export abstract class EntityOutDTO {
  constructor(partial: Partial<EntityOutDTO>) {
    for (const key in partial) {
      this[key] = partial[key];
    }
  }
}
