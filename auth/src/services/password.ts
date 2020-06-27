export class Password {
  static async toHash(password: string) {
    return password;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    return suppliedPassword === storedPassword;
  }
}
