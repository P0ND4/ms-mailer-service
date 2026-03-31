export abstract class ICodeUseCase {
  abstract generateCode(
    length: number,
    hash: string,
    ttlSeconds?: number,
  ): Promise<string>;
  abstract validateCode(code: string, hash: string): Promise<boolean>;
}
