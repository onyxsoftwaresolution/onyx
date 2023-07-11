export class QueryParams extends String {
  private paths: string[] = [];

  constructor(str: string) {
    super(str);
    try {
      this.paths = JSON.parse(str);
    }
    catch { }
  }

  has(path: string) {
    return this.paths.some((v, i, a) => {
      return v.startsWith(path);
    });
  }
}
