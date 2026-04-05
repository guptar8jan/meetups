declare module "better-sqlite3" {
  export default class Database {
    constructor(filename: string);
    exec(sql: string): void;
    prepare(sql: string): any;
  }
}
