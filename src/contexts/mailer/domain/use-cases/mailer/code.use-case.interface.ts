export abstract class ICodeUseCase {
  abstract generateCode(
    tenantId: string,
    length: number,
    hash: string,
    ttlSeconds?: number,
  ): Promise<string>;
  abstract validateCode(
    tenantId: string,
    code: string,
    hash: string,
  ): Promise<boolean>;
}
