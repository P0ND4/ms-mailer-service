export abstract class ICodeUseCase {
  abstract generateCode(length: number): string;
  abstract validateCode(code: string, hash: string): boolean;
}
